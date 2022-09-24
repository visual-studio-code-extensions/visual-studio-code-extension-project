import ts from "typescript";
import {
    regularOperations,
    numberBooleanOperations,
    booleanOperations,
    preFixUnaryExpression,
    stringOperations,
    stringBooleanOperations,
    lengthOperation,
    callExpressionStringOperations0Args,
} from "./operations";
import { VariableValues, MapStack } from "./mapStack";

//Check types of expression and choose operation accordingly
function applyBinaryOperation(
    opToken: ts.BinaryExpression["operatorToken"],
    left: number | boolean | string,
    right: number | boolean | string
) {
    const regularOperation = regularOperations.get(opToken.kind);
    const numberBooleanOperation = numberBooleanOperations.get(opToken.kind);
    const booleanOperation = booleanOperations.get(opToken.kind);

    const stringOperation = stringOperations.get(opToken.kind);
    const stringBooleanOperation = stringBooleanOperations.get(opToken.kind);

    //Check if its a number expression
    if (typeof left === "number" && typeof right === "number") {
        //Regular opertion as in 2 + 3...
        if (regularOperation) {
            return regularOperation(left, right);
            //number Boolean operation as in 2 > 3...
        } else if (numberBooleanOperation) {
            return numberBooleanOperation(left, right);
        } else {
            throw new Error("Can't process this Binary Expression");
        }
        //else if its booleans
    } else if (typeof left === "boolean" && typeof right === "boolean") {
        if (booleanOperation) {
            return booleanOperation(left, right);
        } else {
            throw new Error("Can't process this Binary Expression");
        }
    } else if (typeof left === "string" && typeof right === "string") {
        if (stringOperation) {
            return stringOperation(left, right);
        } else if (stringBooleanOperation) {
            return stringBooleanOperation(left, right);
        } else {
            throw new Error("Can't process this Binary Expression");
        }
    } else {
        return undefined;
    }
}

export function processExpression(
    node: ts.Expression | ts.NumericLiteral | ts.Identifier | undefined,
    mapStack: MapStack
): VariableValues | undefined {
    if (!node) {
        throw new Error("Expression is undefined");
    }

    if (ts.isBinaryExpression(node)) {
        //get left and right value
        const left = processExpression(node.left, mapStack);
        const right = processExpression(node.right, mapStack);

        if (left && right)
            return applyBinaryOperation(node.operatorToken, left, right);

        return undefined;
    } else if (ts.isCallExpression(node)) {
        const expression = processExpression(node.expression, mapStack);
        //const args = node.arguments;
        if (expression && ts.isPropertyAccessExpression(node.expression))
            return applyCallExpression(
                node.expression.name.getText(),
                expression
            );

        return undefined;

        //return applyCallExpression(node.expression = new type(arguments);, identifierValue);
    } else if (ts.isPropertyAccessExpression(node)) {
        const identifierValue = processExpression(node.expression, mapStack);
        if (!identifierValue) {
            throw new Error(
                "Identifier" +
                    node.getText() +
                    " cannot be found or undefined, please define a variable before using it"
            );
        }
        if (typeof identifierValue !== "string")
            throw new Error("Can only process string call expression");

        if (!ts.isCallExpression(node.parent)) {
            return applyCallExpression(node.name.getText(), identifierValue);
        }

        return identifierValue;
    } else if (ts.isIdentifier(node)) {
        const identifierValue = mapStack.get(node.getText());

        if (!identifierValue) {
            throw new Error(
                "Identifier" +
                    node.getText() +
                    " cannot be found or undefined, please define a variable before using it"
            );
        }

        return identifierValue;
    } else if (ts.isParenthesizedExpression(node)) {
        //in case we encounter a (...) situation, for example const a = 2 + (2 + 4)
        return processExpression(node.expression, mapStack);
    } else if (ts.isPrefixUnaryExpression(node)) {
        if (ts.isIdentifier(node.operand)) {
            //Case where we are doing ++i or --i
            const identifierValue = mapStack.get(node.operand.getText());

            //variable not found
            if (!identifierValue) {
                throw new Error(
                    "Variable: " + node.operand.getText + " not defined"
                );
            }

            //Get operation from the map and apply it
            const operation = preFixUnaryExpression.get(node.operator);

            //Apply the correct operation
            if (operation && typeof identifierValue === "number")
                return operation(identifierValue);

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
            const value = processExpression(node.operand, mapStack);

            //Get operation from the map and apply it
            const operation = preFixUnaryExpression.get(node.operator);
            if (typeof value === "number" && operation) {
                return operation(value);
            } else {
                return undefined;
            }
        }
    } else if (ts.isNumericLiteral(node)) {
        //in case variables were defined just with one numeric literal for example: const x = 2;
        return parseFloat(node.getText());
    } else if (node.kind === ts.SyntaxKind.TrueKeyword) {
        return true;
    } else if (node.kind === ts.SyntaxKind.FalseKeyword) {
        return false;
    } else if (ts.isStringLiteral(node)) {
        // Using .getText() wraps it in another string, node.text is the correct value.
        return node.text;
    } else {
        throw new Error("Cannot process this expression: " + node.getText());
    }
}

function applyCallExpression(
    functionName: string,
    objectValue: VariableValues
): VariableValues | undefined {
    if (typeof objectValue === "string") {
        const lengthOp = lengthOperation.get(functionName);
        const stringOp0arg =
            callExpressionStringOperations0Args.get(functionName);
        if (lengthOp) {
            return lengthOp(objectValue);
        } else if (stringOp0arg) {
            return stringOp0arg(objectValue);
        }
    }

    return undefined;
}
