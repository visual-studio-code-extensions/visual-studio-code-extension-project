import ts from "typescript";
import { VariableStatementAnalysis } from "./VariableStatementAnalysis";
import { getNodePosition } from "./getNodePosition";
import { MapStack } from "./mapStack";
import { processExpression } from "./processExpression";
import { editVariables } from "./editVariable";

export function detectAndProcess(
    node: ts.Node,
    detectedVariableStatements: VariableStatementAnalysis[],
    detectedVariableMap: MapStack,
    sourceFile: ts.SourceFile
) {
    //Variable statment as in like defining a new variable and so.
    if (ts.isVariableStatement(node)) {
        const variableType = node.declarationList.getChildAt(0).getText();
        if (variableType !== "const" && variableType !== "let") {
            throw new Error(
                "Can only process const and let statements, please change following statment: " +
                    node.getText()
            );
        }
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

            //Update the most recent stack scope to include this variable.
            detectedVariableMap.set(expression.name.getText(), {
                variableValue: variableValue,
                variableType: variableType,
            });

            //Create new object that shows information of the variable and push it to the array
            detectedVariableStatements.push({
                name: expression.name.getText(),

                value: variableValue,
                variableType: variableType,
                text: node.getText(),

                expressionLocation,
                identifierLocation,
            });
        });
        //Expression statment as in like editing an existing variable
    } else if (ts.isExpressionStatement(node)) {
        const expressionVariable = editVariables(
            node,
            sourceFile as ts.SourceFile,
            detectedVariableMap
        );

        if (expressionVariable !== undefined) {
            detectedVariableStatements.push(expressionVariable);
            detectedVariableMap.set(expressionVariable.name, {
                variableType: expressionVariable.variableType,
                variableValue: expressionVariable.value,
            });
        }
    } else if (ts.isBlock(node)) {
        //recursively make empty Maps and add them to the top of the stack
        detectedVariableMap.addNew();

        //Recurse over every statment in the block and process it
        node.statements.forEach((child: ts.Statement) =>
            detectAndProcess(
                child,
                detectedVariableStatements,
                detectedVariableMap,
                sourceFile as ts.SourceFile
            )
        );
        //pop at the end of the scope
        detectedVariableMap.pop();
    } else if (ts.isIfStatement(node)) {
        //if statment
        detectAndProcess(
            node.thenStatement,
            detectedVariableStatements,
            detectedVariableMap,
            sourceFile as ts.SourceFile
        );

        //the else statment
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
