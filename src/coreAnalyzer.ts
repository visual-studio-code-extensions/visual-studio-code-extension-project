import ts from "typescript";
import { VariableStatementAnalysis } from "./VariableStatementAnalysis";
import {
    regularOperations,
    numberBooleanOperations,
    booleanOperations,
    preFixUnaryExpression,
} from "./operations";

function applyBinaryOperation(
    opToken: ts.BinaryExpression["operatorToken"],
    left: number | boolean,
    right: number | boolean
) {
    const regularOperation = regularOperations.get(opToken.kind);
    const numberBooleanOperation = numberBooleanOperations.get(opToken.kind);
    const booleanOperation = booleanOperations.get(opToken.kind);

    if (typeof left === "number" && typeof right === "number") {
        if (regularOperation !== undefined) {
            return regularOperation(left, right);
        } else if (numberBooleanOperation !== undefined) {
            return numberBooleanOperation(left, right);
        } else {
            throw new Error("Can't process this Binary Expression");
        }
    } else if (typeof left === "boolean" && typeof right === "boolean") {
        if (booleanOperation !== undefined) {
            return booleanOperation(left, right);
        } else {
            throw new Error("Can't process this Binary Expression");
        }
    } else {
        return undefined;
    }
}

export function processExpression(
    node:
        | ts.Expression
        | ts.NumericLiteral
        | ts.Identifier
        | ts.ParenthesizedExpression
        | ts.PrefixUnaryExpression
        | undefined,
    detectedVariableStatements: VariableStatementAnalysis[]
): number | boolean | undefined {
    if (node === undefined) {
        throw new Error("Expression is undefined");
    }

    if (ts.isBinaryExpression(node)) {
        const left = processExpression(node.left, detectedVariableStatements);
        const right = processExpression(node.right, detectedVariableStatements);

        if (left !== undefined && right !== undefined) {
            return applyBinaryOperation(node.operatorToken, left, right);
        }
        return undefined;
    } else if (ts.isNumericLiteral(node)) {
        //in case variables were defined just with one numeric literal for example: const x = 2;
        return parseFloat(node.getText());
    } else if (ts.isIdentifier(node)) {
        const identifierValue = detectedVariableStatements.find((variables) => {
            return variables.name === node.getText();
        });
        if (identifierValue === undefined) {
            throw new Error(
                "Identifier" +
                    node.getText() +
                    " cannot be found or undefined, please define a variable before using it"
            );
        }

        return identifierValue.value;
    } else if (ts.isParenthesizedExpression(node)) {
        //in case we encounter a (...) situation, for example const a = 2 + (2 + 4)
        return processExpression(node.expression, detectedVariableStatements);
    } else if (ts.isPrefixUnaryExpression(node)) {
        if (ts.isIdentifier(node.operand)) {
            //Case where we are doing ++i or --i
            const elementIndex = detectedVariableStatements.findIndex(
                (variables) => {
                    return variables.name === node.operand.getText();
                }
            );
            //variable not found
            if (elementIndex === -1) {
                throw new Error(
                    "Variable: " + node.operand.getText + " not defined"
                );
            }

            //Get operation from the map and apply it
            const operation = preFixUnaryExpression.get(node.operator);
            const value = detectedVariableStatements[elementIndex].value;

            //Apply the correct operation
            if (operation !== undefined && typeof value === "number") {
                return operation(value);
            }
            return undefined;
        } else {
            if (
                node.operator === ts.SyntaxKind.PlusPlusToken ||
                node.operator === ts.SyntaxKind.MinusMinusToken
            ) {
                //Can't do --4 or ++3 when defining a variable
                throw new Error(
                    "The operand of an increment or decrement operator must be a variable or a property"
                );
            }

            //Cases where its -2 or +4 which is okay.
            const value = processExpression(
                node.operand,
                detectedVariableStatements
            );

            //Get operation from the map and apply it
            const operation = preFixUnaryExpression.get(node.operator);
            if (typeof value === "number" && operation !== undefined) {
                return operation(value);
            } else {
                return undefined;
            }
        }
    } else if (node.kind === ts.SyntaxKind.TrueKeyword) {
        return true;
    } else if (node.kind === ts.SyntaxKind.FalseKeyword) {
        return false;
    } else {
        throw new Error("Cannot process this expression: " + node.getText());
    }
}
