import ts from "typescript";
import { createProgramFromFiles } from "./createProgramFromFiles";
import { VariableStatementAnalysis } from "./VariableStatementAnalysis";
import { getNodePosition } from "./getNodePosition";
import { Stack } from "./stack";
import { CodeAnalysis } from "./CodeAnalysis";
import { processExpression } from "./coreAnalyzer";
import { editVariables } from "./editVariable";

/**
 * visit top level nodes and retrieve all VariableStatements.
 * @param code
 */
export function analyzeCode(code: string): CodeAnalysis {
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

    const stack = new Stack<VariableStatementAnalysis[]>();

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
        } else if (ts.isExpressionStatement(node)) {
            const updatedVariablesArray = editVariables(
                node,
                sourceFile as ts.SourceFile,
                detectedVariableStatements
            );
            if (updatedVariablesArray !== undefined) {
                detectedVariableStatements = updatedVariablesArray;
            }
        } else if (ts.isBlock(node)) {
            node.statements.forEach((child: ts.Node) =>
                visitVariableStatement(child)
            );
        }
        //  else if (ts.isIfStatement(node)) {
        //     if (
        //         processExpression(node.expression, detectedVariableStatements)
        //     ) {
        //         visitVariableStatement(node.thenStatement);
        //     } else if (node.elseStatement !== undefined) {
        //         visitVariableStatement(node.elseStatement);
        //     }
        // }
    }
    // iterate through source file searching for variable statements
    visitNodeRecursive(sourceFile, visitVariableStatement);

    // TODO: actually do block analysis
    return {
        variableStatementAnalysis: detectedVariableStatements,
        blockAnalysis: [],
    };
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
