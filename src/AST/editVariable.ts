import ts from "typescript";
import { VariableStatementAnalysis } from "../Objects/VariableStatementAnalysis";
import { getNodePosition } from "../VScodeFiles/getNodePosition";
import { postFixUnaryExpression } from "./operations";
import { processExpression } from "./processExpression";
import { MapStack } from "./mapStack";
import { errorCollector } from "../Objects/errorCollector";

export function editVariables(
    node: ts.ExpressionStatement,
    sourceFile: ts.SourceFile,
    mapStack: MapStack,
    errorCollector: errorCollector[]
): VariableStatementAnalysis | undefined {
    const nodeExpression = node.expression;
    //calculate binary expression and update its value
    if (ts.isBinaryExpression(nodeExpression)) {
        const identifierValue = mapStack.getInformation(
            nodeExpression.left.getText()
        );

        const expressionLocation = getNodePosition(sourceFile, nodeExpression);

        const identifierLocation = getNodePosition(
            sourceFile,
            nodeExpression.left
        );

        //variable not found in the array
        if (identifierValue === undefined) {
            errorCollector.push({
                errorMessage:
                    "Can't process variable or its not defined, variable name: " +
                    nodeExpression.left.getText() +
                    " for expression: " +
                    nodeExpression.getFullText(),
                expressionLocation,
                identifierLocation,
            });
        } else if (identifierValue.variableType === "const") {
            errorCollector.push({
                errorMessage: "Can't redefine a constant",
                expressionLocation,
                identifierLocation,
            });
        } else {
            //Get the new variable value
            const newVariableValue = processExpression(
                nodeExpression.right,
                mapStack,
                errorCollector,
                identifierLocation,
                expressionLocation
            );

            if (newVariableValue !== undefined) {
                return {
                    name: nodeExpression.left.getText(),
                    value: newVariableValue,
                    variableType: identifierValue.variableType,
                    text: node.getText(),
                    expressionLocation,
                    identifierLocation,
                };
            }
        }
    } else if (
        //else if we encounter a i++ or --i case
        ts.isPostfixUnaryExpression(nodeExpression) ||
        ts.isPrefixUnaryExpression(nodeExpression)
    ) {
        const expressionLocation = getNodePosition(sourceFile, nodeExpression);

        const identifierLocation = getNodePosition(
            sourceFile,
            nodeExpression.operand
        );
        if (ts.isIdentifier(nodeExpression.operand)) {
            const identifierValue = mapStack.getInformation(
                nodeExpression.operand.getText()
            );

            //variable not found
            if (identifierValue === undefined) {
                errorCollector.push({
                    errorMessage: "Variable not defined or can't be processed",
                    expressionLocation,
                    identifierLocation,
                });
                return;
            } else if (identifierValue.variableType === "const") {
                errorCollector.push({
                    errorMessage: "Can't redefine a constant",
                    expressionLocation,
                    identifierLocation,
                });
                return;
            } else {
                const operation = postFixUnaryExpression.get(
                    nodeExpression.operator
                );

                const newVariableValue = identifierValue.variableValue;

                //value has to be a number because you can't do True++
                if (operation && typeof newVariableValue === "number") {
                    return {
                        name: nodeExpression.operand.getText(),
                        value: operation(newVariableValue),
                        variableType: identifierValue.variableType,
                        text: node.getText(),
                        expressionLocation,
                        identifierLocation,
                    };
                } else {
                    errorCollector.push({
                        errorMessage: "Operation is Undefined",
                        expressionLocation,
                        identifierLocation,
                    });
                    return;
                }
            }
        } else {
            //Case where --5/5-- or ++7/7++ which can't be calculated
            errorCollector.push({
                errorMessage:
                    "The operand of an increment or decrement operator must be a variable or a property",
                expressionLocation,
                identifierLocation,
            });
        }
    }
    return;
}
