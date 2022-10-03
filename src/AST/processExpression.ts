import ts from "typescript";
import {
    regularOperations,
    numberBooleanOperations,
    booleanOperations,
    preFixUnaryExpression,
    stringOperations,
    stringBooleanOperations,
    lengthOperation,
    StringOperations0Args,
    StringOperations1StringArg,
    StringOperations2StringArg,
    StringOperations1String1NumberArg,
    StringOperations2NumberArg,
    StringOperations1NumberArg,
} from "./operations";
import { VariableValues, MapStack } from "./mapStack";
import { errorCollector } from "../Objects/errorCollector";
import { CodeLocation } from "../Objects/CodeLocation";

//Check types of expression and choose operation accordingly
export function applyBinaryOperation(
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
        }
        //else if its booleans
    } else if (typeof left === "boolean" && typeof right === "boolean") {
        if (booleanOperation) {
            return booleanOperation(left, right);
        }
    } else if (typeof left === "string" && typeof right === "string") {
        if (stringOperation) {
            return stringOperation(left, right);
        } else if (stringBooleanOperation) {
            return stringBooleanOperation(left, right);
        }
    }
    return;
}

export function processExpression(
    node: ts.Expression | ts.NumericLiteral | ts.Identifier | undefined,
    mapStack: MapStack,
    errorCollector: errorCollector[],
    identifierLocation: CodeLocation,
    expressionLocation: CodeLocation
): VariableValues | undefined {
    if (node !== undefined) {
        if (ts.isBinaryExpression(node)) {
            //Cases where const b = 2 + c += 4;
            //get left and right value
            const left = processExpression(
                node.left,
                mapStack,
                errorCollector,
                identifierLocation,
                expressionLocation
            );
            const right = processExpression(
                node.right,
                mapStack,
                errorCollector,
                identifierLocation,
                expressionLocation
            );

            if (left && right) {
                const value = applyBinaryOperation(
                    node.operatorToken,
                    left,
                    right
                );
                if (value === undefined) {
                    errorCollector.push({
                        errorMessage:
                            "Variable not defined or can't be processed",
                        expressionLocation,
                        identifierLocation,
                    });
                    return;
                }
                return value;
            }
        } else if (ts.isCallExpression(node)) {
            const expression = processExpression(
                node.expression,
                mapStack,
                errorCollector,
                identifierLocation,
                expressionLocation
            );

            if (expression && ts.isPropertyAccessExpression(node.expression)) {
                const argsCollector: VariableValues[] = [];

                for (const argExpression of node.arguments) {
                    const result = processExpression(
                        argExpression,
                        mapStack,
                        errorCollector,
                        identifierLocation,
                        expressionLocation
                    );

                    if (result === undefined) {
                        return;
                    } else {
                        argsCollector.push(result);
                    }
                }

                const returnValue = applyCallExpression(
                    node.expression.name.getText(),
                    expression,
                    argsCollector
                );
                return returnValue;
            }
        } else if (ts.isPropertyAccessExpression(node)) {
            const identifierValue = processExpression(
                node.expression,
                mapStack,
                errorCollector,
                identifierLocation,
                expressionLocation
            );

            if (typeof identifierValue === "string") {
                if (!ts.isCallExpression(node.parent)) {
                    const returnValue = applyCallExpression(
                        node.name.getText(),
                        identifierValue
                    );

                    if (returnValue !== undefined) {
                        return returnValue;
                    }
                }
            }
            return identifierValue;
        } else if (ts.isIdentifier(node)) {
            const identifierValue = mapStack.get(node.getText());

            if (identifierValue !== undefined) return identifierValue;
        } else if (ts.isParenthesizedExpression(node)) {
            //in case we encounter a (...) situation, for example const a = 2 + (2 + 4)
            return processExpression(
                node.expression,
                mapStack,
                errorCollector,
                identifierLocation,
                expressionLocation
            );
        } else if (ts.isPrefixUnaryExpression(node)) {
            if (ts.isIdentifier(node.operand)) {
                //Case where we are doing ++i or --i
                const identifierValue = mapStack.get(node.operand.getText());

                //variable not found
                if (identifierValue === undefined) {
                    errorCollector.push({
                        errorMessage:
                            "Can't read this variable: " + node.operand.getText,
                        expressionLocation,
                        identifierLocation,
                    });
                    return;
                }

                //Get operation from the map and apply it
                const operation = preFixUnaryExpression.get(node.operator);

                //Apply the correct operation
                if (operation && typeof identifierValue === "number")
                    return operation(identifierValue);
            } else {
                if (
                    node.operator === ts.SyntaxKind.PlusPlusToken ||
                    node.operator === ts.SyntaxKind.MinusMinusToken
                ) {
                    //Can't do --4 or ++3 when defining a variable
                    errorCollector.push({
                        errorMessage:
                            "Can't read this variable: " + node.operand.getText,
                        expressionLocation,
                        identifierLocation,
                    });
                    return;
                }

                //Cases where its -2 or +4 which is okay.
                const value = processExpression(
                    node.operand,
                    mapStack,
                    errorCollector,
                    identifierLocation,
                    expressionLocation
                );

                //Get operation from the map and apply it
                const operation = preFixUnaryExpression.get(node.operator);
                if (operation && typeof value === "number") {
                    return operation(value);
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
        }
    }
    return;
}
const applyCallExpression = (
    functionName: string,
    objectValue: VariableValues,
    args: VariableValues[] = []
): VariableValues | undefined => {
    if (typeof objectValue === "string") {
        const lengthOp = lengthOperation.get(functionName);
        const stringOp0arg = StringOperations0Args.get(functionName);
        const boolean1string = StringOperations1StringArg.get(functionName);
        const String2String = StringOperations2StringArg.get(functionName);
        const number1String1Number =
            StringOperations1String1NumberArg.get(functionName);
        const string2Number = StringOperations2NumberArg.get(functionName);
        const string1Number = StringOperations1NumberArg.get(functionName);
        const argsCount = args.length;
        if (lengthOp) {
            return lengthOp(objectValue);
        } else if (stringOp0arg && argsCount === 0) {
            return stringOp0arg(objectValue);
        } else if (
            boolean1string &&
            argsCount === 1 &&
            typeof args[0] === "string"
        ) {
            return boolean1string(objectValue, args[0]);
        } else if (
            string1Number &&
            argsCount === 1 &&
            typeof args[0] === "number"
        ) {
            return string1Number(objectValue, args[0]);
        } else if (argsCount === 2) {
            if (
                String2String &&
                typeof args[0] === "string" &&
                typeof args[1] === "string"
            ) {
                return String2String(objectValue, args[0], args[1]);
            } else if (number1String1Number) {
                if (
                    typeof args[0] === "number" &&
                    typeof args[1] === "string"
                ) {
                    return number1String1Number(objectValue, args[1], args[0]);
                } else if (
                    typeof args[0] === "string" &&
                    typeof args[1] === "number"
                ) {
                    return number1String1Number(objectValue, args[0], args[1]);
                }
            } else if (
                string2Number &&
                typeof args[0] === "number" &&
                typeof args[1] === "number"
            ) {
                return string2Number(objectValue, args[0], args[1]);
            }
        }
    }

    return undefined;
};
