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
    [ts.SyntaxKind.AmpersandAmpersandToken, (a: boolean, b: boolean) => a && b],
    [ts.SyntaxKind.BarBarToken, (a: boolean, b: boolean) => a || b],
]);

export const stringOperations = new Map<
    ts.SyntaxKind,
    (a: string, b: string) => string
>([[ts.SyntaxKind.PlusToken, (a: string, b: string) => a + b]]);

export const stringBooleanOperations = new Map<
    ts.SyntaxKind,
    (a: string, b: string) => boolean
>([
    [ts.SyntaxKind.EqualsEqualsEqualsToken, (a: string, b: string) => a === b],
    [
        ts.SyntaxKind.ExclamationEqualsEqualsToken,
        (a: string, b: string) => a !== b,
    ],
]);

export const lengthOperation = new Map<string, (a: string) => number>([
    ["length", (a: string) => a.length],
]);

export const callExpressionStringOperations0Args = new Map<
    string,
    (a: string) => string
>([
    ["toLocaleLowerCase", (a: string) => a.toLocaleLowerCase()],
    ["toLocaleUpperCase", (a: string) => a.toLocaleUpperCase()],
    ["trim", (a: string) => a.trim()],
    ["trimStart", (a: string) => a.trimStart()],
    ["trimEnd", (a: string) => a.trimEnd()],
    ["valueOf", (a: string) => a.valueOf()],
    ["toString", (a: string) => a.toString()],
]);

export const callExpressionStringReturnsNumberOperations1stringArg = new Map<
    string,
    (a: string, b: string) => number
>([
    [
        //indexOf(substr, [start]):
        "indexOf",
        (a: string, b: string) => a.indexOf(b),
    ],
    [
        //lastIndexOf(substr, [start]):
        "lastIndexOf",
        (a: string, b: string) => a.lastIndexOf(b),
    ],
]);

export const callExpressionStringReturnsStringOperations1numberArg = new Map<
    string,
    (a: string, b: number) => string | undefined
>([
    [
        //substring(start, [end]):
        "substring",
        (a: string, b: number) => a.substring(b),
    ],
    [
        //slice(start, [end]):
        "slice",
        (a: string, b: number) => a.slice(b),
    ],
    [
        //substring(start, [end]):
        "at",
        (a: string, b: number) => a.at(b),
    ],
]);

export const callExpressionStringReturnsBooleanOperations1stringArg = new Map<
    string,
    (a: string, b: string) => boolean
>([
    ["includes", (a: string, b: string) => a.includes(b)],
    ["startsWith", (a: string, b: string) => a.startsWith(b)],
    ["endsWith", (a: string, b: string) => a.endsWith(b)],
]);
