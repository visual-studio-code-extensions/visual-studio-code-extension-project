import ts from "typescript";

export const regularOperations = new Map<
    ts.SyntaxKind,
    (a: number, b: number) => number
        >([
            [ts.SyntaxKind.PlusToken, (a: number, b: number) => a + b],
            [ts.SyntaxKind.MinusToken, (a: number, b: number) => a - b],
            [ts.SyntaxKind.AsteriskToken, (a: number, b: number) => a * b],
            [ts.SyntaxKind.AsteriskAsteriskToken, (a: number, b: number) => a ** b],
            [ts.SyntaxKind.SlashToken, (a: number, b: number) => a / b],
            [ts.SyntaxKind.PercentToken, (a: number, b: number) => a % b],
        ]);

export const numberBooleanOperations = new Map<
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

export const postFixUnaryExpression = new Map<
    ts.SyntaxKind,
    (a: number) => number
        >([
            [ts.SyntaxKind.PlusPlusToken, (a: number) => a + 1],
            [ts.SyntaxKind.MinusMinusToken, (a: number) => a - 1],
        ]);

export const preFixUnaryExpression = new Map<
    ts.SyntaxKind,
    (a: number) => number
        >([
            [ts.SyntaxKind.PlusPlusToken, (a: number) => a + 1],
            [ts.SyntaxKind.MinusMinusToken, (a: number) => a - 1],
            [ts.SyntaxKind.PlusToken, (a: number) => +a],
            [ts.SyntaxKind.MinusToken, (a: number) => -a],
        ]);

export const booleanOperations = new Map<
    ts.SyntaxKind,
    (a: boolean, b: boolean) => boolean
        >([
            [
                ts.SyntaxKind.EqualsEqualsEqualsToken,
                (a: boolean, b: boolean) => a === b,
            ],
            [
                ts.SyntaxKind.ExclamationEqualsEqualsToken,
                (a: boolean, b: boolean) => a !== b,
            ],
        ]);
