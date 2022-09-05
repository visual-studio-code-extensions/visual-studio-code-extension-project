import ts from "typescript";
import { createProgramFromFiles } from "./createProgramFromFiles";
import { VariableStatementAnalysis } from "./VariableStatementAnalysis";
import { MapStack } from "./mapStack";
import { CodeAnalysis } from "./CodeAnalysis";
import { BlockAnalysis } from "./BlockAnalysis";
import { detectAndProcess } from "./detector";
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
    const detectedVariableMap: MapStack = new MapStack();

    //Add main scope
    detectedVariableMap.addNew();

    const blockAnalysis: BlockAnalysis[] = [];

    //Collect text(or other information) from every node and add it to the array
    function visitVariableStatement(node: ts.Node) {
        //check if node is a variable declaration
        if (
            node.parent === undefined ||
            node.parent.kind !== ts.SyntaxKind.Block
        ) {
            detectAndProcess(
                node,
                detectedVariableStatements,
                detectedVariableMap,
                sourceFile as ts.SourceFile
            );
        } else if (ts.isBlock(node) || ts.isIfStatement(node)) {
            processBlock(
                node,
                detectedVariableStatements,
                detectedVariableMap,
                sourceFile as ts.SourceFile
            );
        }
    }

    // iterate through source file searchShadowing for variable statements
    visitNodeRecursive(sourceFile, visitVariableStatement);

    // TODO: actually do block analysis
    return {
        variableStatementAnalysis: detectedVariableStatements,
        blockAnalysis: blockAnalysis,
        //Block is only concerned about declaration of variables in blocks
    };
}

function processBlock(
    node: ts.Node,
    detectedVariableStatements: VariableStatementAnalysis[],
    detectedVariableMap: MapStack,
    sourceFile: ts.SourceFile
) {
    if (ts.isBlock(node)) {
        if (
            !(
                node.statements.length === 1 &&
                ts.isIfStatement(node.statements[0])
            )
        ) {
            //recursively make empty arrays and add them to the stack if theres another scope
            detectedVariableMap.addNew();
        }

        node.statements.forEach((child: ts.Statement) =>
            detectAndProcess(
                child,
                detectedVariableStatements,
                detectedVariableMap,
                sourceFile as ts.SourceFile
            )
        );
        detectedVariableMap.pop();
    } else if (ts.isIfStatement(node)) {
        detectAndProcess(
            node.thenStatement,
            detectedVariableStatements,
            detectedVariableMap,
            sourceFile as ts.SourceFile
        );

        if (node.elseStatement !== undefined) {
            detectAndProcess(
                node.elseStatement,
                detectedVariableStatements,
                detectedVariableMap,
                sourceFile as ts.SourceFile
            );
        }
    }
}
// function processBlock(
//     stack: MapStack,
//     node: ts.Statement,
//     blockAnalysis: BlockAnalysis[]
// ): void {
//     if (ts.isBlock(node)) {
//         if (
//             !(
//                 node.statements.length === 1 &&
//                 ts.isIfStatement(node.statements[0])
//             )
//         ) {
//             //recursively make empty arrays and add them to the stack if theres another scope
//             const empty: BlockAnalysis = {
//                 referencedVariables: [],
//                 localVariables: [],
//             };

//             stack.addNew();

//             blockAnalysis.push(empty);
//         }

//         node.statements.forEach((child: ts.Statement) =>
//             processBlock(stack, child, blockAnalysis)
//         );
//         stack.pop();
//     } else if (ts.isVariableStatement(node)) {
//         const list = node.declarationList.declarations[0];
//         //In case its = identifier
//         if (list.initializer !== undefined) {
//             stack.set(list.name.getText(), [0, ""]);
//             blockAnalysis[blockAnalysis.length - 1].localVariables.push({
//                 name: list.name.getText(),
//                 shadows: stack.searchShadow(list.initializer.getText()),
//             });
//         } else {
//             stack.set(list.name.getText(), [0, ""]);
//             blockAnalysis[blockAnalysis.length - 1].localVariables.push({
//                 name: list.name.getText(),
//                 shadows: stack.searchShadow(list.name.getText()),
//             });
//         }
//     } else if (
//         ts.isExpressionStatement(node) &&
//         ts.isBinaryExpression(node.expression)
//     ) {
//         const identifier = node.expression.left;

//         if (ts.isIdentifier(node.expression.right)) {
//             stack.set(identifier.getText(), [0, ""]);
//             blockAnalysis[blockAnalysis.length - 1].localVariables.push({
//                 name: identifier.getText(),
//                 shadows: stack.searchShadow(node.expression.left.getText()),
//             });

//             const variable = node.expression.right;
//             blockAnalysis[blockAnalysis.length - 1].referencedVariables.push({
//                 name: variable.getText(),
//                 block: stack.getScopeNumber(variable.getText()),
//             });
//         } else if (ts.isNumericLiteral(node.expression.right)) {
//             stack.set(identifier.getText(), [0, ""]);
//             blockAnalysis[blockAnalysis.length - 1].localVariables.push({
//                 name: identifier.getText(),
//                 shadows: stack.searchShadow(node.expression.left.getText()),
//             });
//         }
//     }
//     //TODO: Cases where if statements aren't made with blocks
//     else if (ts.isIfStatement(node)) {
//         processBlock(stack, node.thenStatement, blockAnalysis);

//         if (node.elseStatement !== undefined) {
//             processBlock(stack, node.elseStatement, blockAnalysis);
//         }
//     }
// }

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
