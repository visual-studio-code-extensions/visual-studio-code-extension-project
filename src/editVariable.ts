import ts from "typescript";
import { VariableStatementAnalysis } from "./VariableStatementAnalysis";
import { getNodePosition } from "./getNodePosition";
import { postFixUnaryExpression } from "./operations";
import { processExpression } from "./processExpression";
import { MapStack } from "./mapStack";

export function editVariables(
    node: ts.ExpressionStatement,
    sourceFile: ts.SourceFile,
    mapStack: MapStack
): VariableStatementAnalysis | undefined {
    const nodeExpression = node.expression;
    //calculate binary expression and update its value
    if (ts.isBinaryExpression(nodeExpression)) {
        const identifierValue = mapStack.getInformation(
            nodeExpression.left.getText()
        );

        //variable not found in the array
        if (identifierValue === undefined) {
            throw new Error(
                "Variable not defined, variable name: " +
                    nodeExpression.left.getText() +
                    " for expression: " +
                    nodeExpression.getFullText()
            );
        }

        if (identifierValue.variableType === "const") {
            throw new Error("Can't redefine a constant");
        }

        //Get the new variable value
        const newVariableValue = processExpression(
            nodeExpression.right,
            mapStack
        );

        //Check if undefined and throw an error if so
        if (newVariableValue === undefined) {
            throw Error("Value is undefined");
        }

        const expressionLocation = getNodePosition(sourceFile, nodeExpression);

        const identifierLocation = getNodePosition(
            sourceFile,
            nodeExpression.left
        );

        return {
            name: nodeExpression.left.getText(),
            value: newVariableValue,
            variableType: identifierValue.variableType,
            text: node.getText(),
            expressionLocation,
            identifierLocation,
        };
    } else if (
        //else if we encounter a i++ or --i case
        ts.isPostfixUnaryExpression(nodeExpression) ||
        ts.isPrefixUnaryExpression(nodeExpression)
    ) {
        if (ts.isIdentifier(nodeExpression.operand)) {
            const identifierValue = mapStack.getInformation(
                nodeExpression.operand.getText()
            );

            //variable not found
            if (identifierValue === undefined) {
                throw new Error("Variable not defined");
            }

            if (identifierValue.variableType === "const") {
                throw new Error("Can't redefine a constant");
            }

            const operation = postFixUnaryExpression.get(
                nodeExpression.operator
            );

            const newVariableValue = identifierValue.variableValue;

            const expressionLocation = getNodePosition(
                sourceFile,
                nodeExpression
            );

            const identifierLocation = getNodePosition(
                sourceFile,
                nodeExpression.operand
            );

            //value has to be a number because you can't do True++
            if (
                operation !== undefined &&
                typeof newVariableValue === "number"
            ) {
                return {
                    name: nodeExpression.operand.getText(),
                    value: operation(newVariableValue),
                    variableType: identifierValue.variableType,
                    text: node.getText(),
                    expressionLocation,
                    identifierLocation,
                };
            } else {
                throw new Error("Operation is Undefined");
            }
        } else {
            //Case where --5/5-- or ++7/7++ which can't be calculated
            throw new Error(
                "The operand of an increment or decrement operator must be a variable or a property"
            );
        }
    }
    return undefined;
}
