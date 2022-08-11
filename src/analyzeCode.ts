import ts, { BinaryOperatorToken } from "typescript";
import { createProgramFromFiles } from "./createProgramFromFiles";
import { VariableStatementAnalysis } from "./VariableStatementAnalysis";
import { getNodePosition } from "./getNodePosition";
import { Stack } from "./stack";

/**
 * visit top level nodes and retrieve all VariableStatements.
 * @param code
 */
export function analyzeCode(code: string): VariableStatementAnalysis[] {
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
            let declarationsList = node.declarationList.declarations;
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
        } else if (ts.isIfStatement(node)) {
            if(processExpression(node.expression, detectedVariableStatements))
            {
                //get into the if statments
            }
            else
            {
                //get into the else block statemenet 
            }
        }
    }
    // iterate through source file searching for variable statements
    visitNodeRecursive(sourceFile, visitVariableStatement);

    return detectedVariableStatements;
}

const operations = new Map<ts.SyntaxKind, (a: number, b: number) => number>([
    [ts.SyntaxKind.PlusToken, (a: number, b: number) => a + b],
    [ts.SyntaxKind.MinusToken, (a: number, b: number) => a - b],
    [ts.SyntaxKind.AsteriskToken, (a: number, b: number) => a * b],
    [ts.SyntaxKind.AsteriskAsteriskToken, (a: number, b: number) => a ** b],
    [ts.SyntaxKind.SlashToken, (a: number, b: number) => a / b],
    [ts.SyntaxKind.PercentToken, (a: number, b: number) => a % b],
]);

//Not used yet, keep commented for future uses and boolean expression processing
const numberBoolOperations = new Map<
    ts.SyntaxKind,
    (a: number, b: number) => boolean
>([
    [ts.SyntaxKind.EqualsEqualsEqualsToken, (a: number, b: number) => a === b],
    [
        ts.SyntaxKind.ExclamationEqualsEqualsToken,
        (a: number, b: number) => a !== b,
    ],
    [ts.SyntaxKind.LessThanToken, (a: number, b: number) => a < b],
    [ts.SyntaxKind.LessThanEqualsToken, (a: number, b: number) => a <= b],
    [ts.SyntaxKind.GreaterThanToken, (a: number, b: number) => a > b],
    [ts.SyntaxKind.GreaterThanEqualsToken, (a: number, b: number) => a >= b],
]);

const postFixUnaryExpression = new Map<ts.SyntaxKind, (a: number) => number>([
    [ts.SyntaxKind.PlusPlusToken, (a: number) => a + 1],
    [ts.SyntaxKind.MinusMinusToken, (a: number) => a - 1],
]);

const preFixUnaryExpression = new Map<ts.SyntaxKind, (a: number) => number>([
    [ts.SyntaxKind.PlusPlusToken, (a: number) => a + 1],
    [ts.SyntaxKind.MinusMinusToken, (a: number) => a - 1],
    [ts.SyntaxKind.PlusToken, (a: number) => +a],
    [ts.SyntaxKind.MinusToken, (a: number) => -a],
]);

function ApplyBinaryOperation(
    opToken: ts.BinaryExpression["operatorToken"],
    left: number | boolean,
    right: number | boolean
) {
    const regularOperation = operations.get(opToken.kind);
    const numberBoolOperation = numberBoolOperations.get(opToken.kind);

    if (typeof left === "number" && typeof right === "number") {
        if (regularOperation !== undefined) {
            return regularOperation(left, right);
        } else if (numberBoolOperation !== undefined) {
            return numberBoolOperation(left, right);
        }
        else
        {
            throw new Error("Can't process this Binary Expression")
        }
    } else {
        return undefined;
    }
}
function editVariables(
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
            throw new Error("Variable not defined");
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
            //TODO: add you cant change constants and so
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

function processExpression(
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
            return ApplyBinaryOperation(node.operatorToken, left, right);
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
    } else {
        throw new Error("Cannot process this expression: " + node.getText());
    }
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
