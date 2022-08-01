import ts from "typescript";
import { createProgramFromFiles } from "./createProgramFromFiles";
import { VariableStatementAnalysis } from "./VariableStatementAnalysis";

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

    //Collect text(or other information) from every node and add it to the array
    function visitVariableStatement(node: ts.Node) {
        //check if node is a variable declaration
        if (ts.isVariableDeclarationList(node)) {
            const variableType = node.getChildAt(0);
            //calculate the value of that variable and add it to the variables array
            //TODO: edge case: defining two variables same time
            const expression = node.declarations[0];
            const variableValue = processExpression(
                //get the expression of the variable declaration
                expression.initializer,
                detectedVariableStatements
            );

            if (variableValue === undefined) {
                throw Error("Value is undefined");
            }

            if (sourceFile === undefined) {
                throw new Error("Source File is undefined");
            }

            const { startLine, endLine, startCharacter, endCharacter } =
                getNodePosition(sourceFile, node);

            detectedVariableStatements.push({
                name: expression.name.getText(),

                value: variableValue,

                text: node.getText(),

                //TODO: add you cant change constants and so
                variableType: variableType.getText(),

                expressionLocation: {
                    startLine,
                    endLine,
                    startCharacter,
                    endCharacter,
                },
            });
            //else if its an expression statement for example defining a variable and changing its value later
            //TODO: should check if its a const or a var
        } else if (ts.isExpressionStatement(node)) {
            const nodeExpression = node.expression;
            const updatedVariablesArray = editVariables(
                nodeExpression,
                sourceFile as ts.SourceFile,
                detectedVariableStatements
            );
            if (updatedVariablesArray !== undefined) {
                detectedVariableStatements = updatedVariablesArray;
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
// const boolOperations = new Map<ts.SyntaxKind, (a: number, b:number) => boolean>([
//     [ts.SyntaxKind.EqualsEqualsEqualsToken, (a: number, b: number) => a === b],
//     [ts.SyntaxKind.ExclamationEqualsEqualsToken, (a: number, b: number) => a !== b],
// ]);

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

function editVariables(
    nodeExpression: ts.Expression,
    sourceFile: ts.SourceFile,
    detectedVariableStatements: VariableStatementAnalysis[]
): VariableStatementAnalysis[] | undefined {
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

        //Get the new variable value
        const newVariableValue = processExpression(
            nodeExpression.right,
            detectedVariableStatements
        );

        const { startLine, endLine, startCharacter, endCharacter } =
            getNodePosition(sourceFile, nodeExpression);

        //Check if undefined and throw an error if so
        if (newVariableValue === undefined) {
            throw Error("Value is undefined");
        }

        //since right would always be binary expression we want to process that, and update the variable value

        detectedVariableStatements.push({
            name: detectedVariableStatements[elementIndex].name,

            value: newVariableValue,
            expressionLocation: {
                startLine,
                endLine,
                startCharacter,
                endCharacter,
            },

            text: nodeExpression.getText(),

            //TODO: add you cant change constants and so
            variableType: detectedVariableStatements[elementIndex].variableType,
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

            const operation = postFixUnaryExpression.get(
                nodeExpression.operator
            );

            const { startLine, endLine, startCharacter, endCharacter } =
                getNodePosition(sourceFile, nodeExpression);

            if (operation !== undefined) {
                detectedVariableStatements.push({
                    name: detectedVariableStatements[elementIndex].name,

                    value: operation(
                        detectedVariableStatements[elementIndex].value
                    ),

                    text: nodeExpression.getText(),

                    //TODO: add you cant change constants and so
                    variableType:
                        detectedVariableStatements[elementIndex].variableType,

                    expressionLocation: {
                        startLine,
                        endLine,
                        startCharacter,
                        endCharacter,
                    },
                });
                return detectedVariableStatements;
            } else {
                throw new Error("Operation is Undefined");
            }
        } else {
            //Case where --5/5-- or ++7/7++ which can't be calculated
            throw new Error(
                "The operand of an increment or decrement operator must be a variable or a propert"
            );
        }
    }
    return undefined;
}

function getNodePosition(sourceFile: ts.SourceFile, node: ts.Node) {
    const start = ts.getLineAndCharacterOfPosition(sourceFile, node.pos);

    const end = ts.getLineAndCharacterOfPosition(sourceFile, node.end);

    const startLine = start.line;
    const endLine = end.line;
    const startCharacter = start.character;
    const endCharacter = end.character;
    return { startLine, endLine, startCharacter, endCharacter };
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
): number | undefined {
    if (node === undefined) {
        throw new Error("Expression is undefined");
    }

    if (ts.isBinaryExpression(node)) {
        const left = processExpression(node.left, detectedVariableStatements);
        const right = processExpression(node.right, detectedVariableStatements);
        const operation = operations.get(node.operatorToken.kind);

        if (
            operation !== undefined &&
            left !== undefined &&
            right !== undefined
        ) {
            return operation(left, right);
        }
        return undefined;
    } else if (ts.isNumericLiteral(node)) {
        //in case variables were defined just with one numeric literal for example: const x = 2;
        return parseFloat(node.getText());
    } else if (ts.isIdentifier(node)) {
        const identifiervalue = detectedVariableStatements.find((variables) => {
            return variables.name === node.getText();
        });
        if (identifiervalue === undefined) {
            throw new Error(
                "Identifier" +
                    node.getText +
                    " cannot be found or undefined, please define a variable before using it"
            );
        }

        return identifiervalue.value;
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
            const operation = preFixUnaryExpression.get(node.operator);
            //Apply the correct operation
            if (operation !== undefined) {
                return operation(
                    detectedVariableStatements[elementIndex].value
                );
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
            const value = processExpression(
                node.operand,
                detectedVariableStatements
            );
            const operation = preFixUnaryExpression.get(node.operator);
            if (value !== undefined && operation !== undefined) {
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
