import ts from "typescript";
import { createProgramFromFiles } from "./createProgramFromFiles";
import { VariableStatementAnalysis } from "./VariableStatementAnalysis";
import { getNodePosition } from "./getNodePosition";
import { MapStack } from "./mapStack";
import { CodeAnalysis } from "./CodeAnalysis";
import { processExpression } from "./coreAnalyzer";
import { editVariables } from "./editVariable";
import { BlockAnalysis } from "./BlockAnalysis";

/**
 * visit top level nodes and retrieve all VariableStatements.
 * @param code
 */
export function analyzeCode(code: string): CodeAnalysis {
    //TODO: What would the return type be?
    const sourceFileName = "code.ts";

    const program = createProgramFromFiles(
        [
            {
                name: sourceFileName,
                data: code,
            },
        ],
        {}
    );

    const sourceFile = program.getSourceFile(sourceFileName);

    if (sourceFile === undefined) {
        throw new Error("sourceFile is undefined");
    }

    //Create array that will hold the variables that we want to work with.
    let detectedVariableStatements: VariableStatementAnalysis[] = [];
    const blockAnalysis: BlockAnalysis[] = [];
    const stack = new MapStack();
    const emptyMap = new Map<string, number>();

    //Collect text(or other information) from every node and add it to the array
    function visitVariableStatement(node: ts.Node) {
        //check if node is a variable declaration
        if (ts.isVariableStatement(node)) {
            const variableType = node.declarationList.getChildAt(0);
            //calculate the value of that variable and add it to the variables array
            const declarationsList = node.declarationList.declarations;
            declarationsList.forEach(function (expression) {
                const variableValue = processExpression(
                    //get the expression of the variable declaration
                    expression.initializer,
                    detectedVariableStatements
                );

                if (variableValue === undefined) {
                    throw Error("Value is undefined");
                }

                //No need to check if source file is undefined, because we already did that earlier in the program.
                //Get position information
                const expressionLocation = getNodePosition(
                    sourceFile as ts.SourceFile,
                    node
                );

                const identifierLocation = getNodePosition(
                    sourceFile as ts.SourceFile,
                    expression.name
                );

                //Create new object that shows information of the variable and push it to the array
                detectedVariableStatements.push({
                    name: expression.name.getText(),

                    value: variableValue,
                    //TODO: add you cant change constants and so
                    variableType: variableType.getText(),
                    text: node.getText(),

                    expressionLocation,
                    identifierLocation,
                });
            });
        // } else if (ts.isExpressionStatement(node)) {
        //     const updatedVariablesArray = editVariables(
        //         node,
        //         sourceFile as ts.SourceFile,
        //         detectedVariableStatements
        //     );
        //     if (updatedVariablesArray !== undefined) {
        //         detectedVariableStatements = updatedVariablesArray;
        //     }
        } else if (ts.isBlock(node)) {
            //Create an empty array to recurse with on block number 1

            processBlock(stack, node, blockAnalysis);
        }
    }
    // iterate through source file searching for variable statements
    visitNodeRecursive(sourceFile, visitVariableStatement);

    // TODO: actually do block analysis
    return {
        variableStatementAnalysis: detectedVariableStatements,
        blockAnalysis: blockAnalysis,
        //Block is only concerned about declaration of variables in blocks
    };
}

function processBlock(
    stack: MapStack,
    node: ts.Statement,
    blockAnalysis: BlockAnalysis[]): MapStack {
    if (ts.isBlock(node)) {
        //recursively make empty arrays and add them to the stack if theres another scope
        const empty: BlockAnalysis = {
            referencedVariables: [],
            localVariables: [],
        };

        stack.addNew();
        blockAnalysis.push(empty);
        node.statements.forEach((child: ts.Statement) =>
            processBlock(stack, child, blockAnalysis)
        );
        stack.pop();
    } else if (ts.isVariableStatement(node)) {
        const list = node.declarationList.declarations[0];
        //In case its = identifier
        if (list.initializer !== undefined) {
            stack.set(list.name.getText(), 0);
            blockAnalysis[blockAnalysis.length - 1].localVariables.push({
                name: list.name.getText(),
                shadows: stack.search(list.initializer.getText()),
            });
        } else {
            stack.set(list.name.getText(), 0);
            blockAnalysis[blockAnalysis.length - 1].localVariables.push({
                name: list.name.getText(),
                shadows: stack.search(list.name.getText()),
            });
        }
    } else if (
        ts.isExpressionStatement(node) &&
        ts.isBinaryExpression(node.expression)
    ) {
        const identifier = node.expression.left;

        if (ts.isIdentifier(node.expression.right)) {
            stack.set(identifier.getText(), 0);
            blockAnalysis[blockAnalysis.length - 1].localVariables.push({
                name: identifier.getText(),
                shadows: stack.search(node.expression.right.getText()),
            });

            const variable = node.expression.right;
            blockAnalysis[blockAnalysis.length - 1].referencedVariables.push({
                name: variable.getText(),
                block: stack.getScopeNumber(variable.getText()),
            });
        }
    }
    //TODO: Cases where if statements aren't made with blocks
    else if(ts.isIfStatement(node))
    {
        processBlock(stack, node.thenStatement, blockAnalysis);

        if(node.elseStatement !== undefined)
        {
            processBlock(stack, node.elseStatement, blockAnalysis);
        }
    }

    return stack;
}

/**
 * recursively visits nodes and children
 * @param node
 * @param visit - visit is called for every node.
 */
function visitNodeRecursive(node: ts.Node, visit: (node: ts.Node) => void) {
    //Call method on every node
    visit(node);
    node.getChildren().forEach((child: ts.Node) =>
        visitNodeRecursive(child, visit)
    );
}

//For future parse and reparse whenever file changes
