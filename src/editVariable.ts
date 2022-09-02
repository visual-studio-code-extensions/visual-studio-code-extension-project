import ts from "typescript";
import { VariableStatementAnalysis } from "./VariableStatementAnalysis";
import { getNodePosition } from "./getNodePosition";
import { postFixUnaryExpression } from "./operations";

import { processExpression } from "./coreAnalyzer";

export function editVariables(
    node: ts.ExpressionStatement,
    sourceFile: ts.SourceFile,
    detectedVariableStatements: VariableStatementAnalysis[]
): VariableStatementAnalysis[] | undefined {
    const nodeExpression = node.expression;
    //calculate binary expression and update its value
    if (ts.isBinaryExpression(nodeExpression)) {
        const elementIndex = detectedVariableStatements.findIndex(
            (variables) => {
                return variables.name === nodeExpression.left.getText();
            }
        );
        //variable not found in the array
        if (elementIndex === -1) {
            throw new Error(
                "Variable not defined, variable name: " +
                    nodeExpression.left.getText()
            );
        }

        if (detectedVariableStatements[elementIndex].variableType === "const") {
            throw new Error("Can't redefine a constant");
        }

        //Get the new variable value
        const newVariableValue = processExpression(
            nodeExpression.right,
            detectedVariableStatements
        );

        const expressionLocation = getNodePosition(sourceFile, nodeExpression);

        const identifierLocation = getNodePosition(
            sourceFile,
            nodeExpression.left
        );

        //Check if undefined and throw an error if so
        if (newVariableValue === undefined) {
            throw Error("Value is undefined");
        }

        //since right would always be binary expression we want to process that, and update the variable value

        detectedVariableStatements.push({
            name: detectedVariableStatements[elementIndex].name,
            value: newVariableValue,
            variableType: detectedVariableStatements[elementIndex].variableType,
            text: node.getText(),
            expressionLocation,
            identifierLocation,
        });

        return detectedVariableStatements;
    } else if (
        //else if we encounter a i++ or --i case
        ts.isPostfixUnaryExpression(nodeExpression) ||
        ts.isPrefixUnaryExpression(nodeExpression)
    ) {
        if (ts.isIdentifier(nodeExpression.operand)) {
            const elementIndex = detectedVariableStatements.findIndex(
                (variables) => {
                    return variables.name === nodeExpression.operand.getText();
                }
            );

            //variable not found
            if (elementIndex === -1) {
                throw new Error("Variable not defined");
            }

            if (
                detectedVariableStatements[elementIndex].variableType ===
                "const"
            ) {
                throw new Error("Can't redefine a constant");
            }

            const operation = postFixUnaryExpression.get(
                nodeExpression.operator
            );

            const value = detectedVariableStatements[elementIndex].value;

            const expressionLocation = getNodePosition(
                sourceFile,
                nodeExpression
            );

            const identifierLocation = getNodePosition(
                sourceFile,
                nodeExpression.operand
            );

            //value has to be a number because you can't do True++
            if (operation !== undefined && typeof value === "number") {
                detectedVariableStatements.push({
                    name: detectedVariableStatements[elementIndex].name,

                    value: operation(value),

                    text: node.getText(),

                    variableType:
                        detectedVariableStatements[elementIndex].variableType,

                    expressionLocation,
                    identifierLocation,
                });
                return detectedVariableStatements;
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
