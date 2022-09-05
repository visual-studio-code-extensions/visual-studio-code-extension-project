import ts from "typescript";
import { VariableStatementAnalysis } from "./VariableStatementAnalysis";
import { getNodePosition } from "./getNodePosition";
import { MapStack } from "./mapStack";
import { processExpression } from "./coreAnalyzer";
import { editVariables } from "./editVariable";

export function detectAndProcess(
    node: ts.Node,
    detectedVariableStatements: VariableStatementAnalysis[],
    detectedVariableMap: MapStack,
    sourceFile: ts.SourceFile
) {
    if (ts.isVariableStatement(node)) {
        const variableType = node.declarationList.getChildAt(0).getText();
        //calculate the value of that variable and add it to the variables array
        const declarationsList = node.declarationList.declarations;
        declarationsList.forEach(function (expression) {
            const variableValue = processExpression(
                //get the expression of the variable declaration
                expression.initializer,
                detectedVariableMap
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

            detectedVariableMap.set(expression.name.getText(), [
                variableValue,
                variableType,
            ]);

            //Create new object that shows information of the variable and push it to the array
            detectedVariableStatements.push({
                name: expression.name.getText(),

                value: variableValue,
                //TODO: add you cant change constants and so
                variableType: variableType,
                text: node.getText(),

                expressionLocation,
                identifierLocation,
            });
        });
    } else if (ts.isExpressionStatement(node)) {
        const expressionVariable = editVariables(
            node,
            sourceFile as ts.SourceFile,
            detectedVariableMap
        );

        if (expressionVariable !== undefined) {
            detectedVariableStatements.push(expressionVariable);
            detectedVariableMap.set(expressionVariable.name, [
                expressionVariable.value,
                expressionVariable.variableType,
            ]);
        }
    } else if (ts.isBlock(node)) {
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
