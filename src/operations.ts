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
    ["toLowerCase", (a: string) => a.toLowerCase()],
    ["toUpperCase", (a: string) => a.toUpperCase()],
    ["trim", (a: string) => a.trim()],
    ["trimStart", (a: string) => a.trimStart()],
    ["trimEnd", (a: string) => a.trimEnd()],
    ["valueOf", (a: string) => a.valueOf()],
    ["toString", (a: string) => a.toString()],
    ["valueOf", (a: string) => a.valueOf()],
]);

export const callExpressionStringReturnsNumberOperations1StringArg = new Map<
    string,
    (a: string, b: string) => number
>([
    ["indexOf", (a: string, b: string) => a.indexOf(b)],
    ["lastIndexOf", (a: string, b: string) => a.lastIndexOf(b)],
]);

//TODO: split
export const callExpressionStringReturnsStringOperations1NumberArg = new Map<
    string,
    (a: string, b: number) => string | undefined
>([
    ["substring", (a: string, b: number) => a.substring(b)],
    ["slice", (a: string, b: number) => a.slice(b)],
    ["at", (a: string, b: number) => a.at(b)],
    ["charAt", (a: string, b: number) => a.charAt(b)],
    ["padEnd", (a: string, b: number) => a.padEnd(b)],
    ["padStart", (a: string, b: number) => a.padStart(b)],
    ["repeat", (a: string, b: number) => a.repeat(b)],
]);

export const callExpressionStringReturnsBooleanOperations1StringArg = new Map<
    string,
    (a: string, b: string) => boolean
>([
    ["includes", (a: string, b: string) => a.includes(b)],
    ["startsWith", (a: string, b: string) => a.startsWith(b)],
    ["endsWith", (a: string, b: string) => a.endsWith(b)],
]);

export const callExpressionStringReturnsBooleanOperations1String1NumberArg =
    new Map<string, (a: string, b: string, c: number) => boolean>([
        ["endsWith", (a: string, b: string, c: number) => a.endsWith(b, c)],
        ["startsWith", (a: string, b: string, c: number) => a.startsWith(b, c)],
        ["includes", (a: string, b: string, c: number) => a.includes(b, c)],
    ]);

export const callExpressionStringReturnsNumberOperations1NumberArg = new Map<
    string,
    (a: string, b: number) => number | undefined
>([
    ["charCodeAt", (a: string, b: number) => a.charCodeAt(b)],
    ["codePointAt", (a: string, b: number) => a.codePointAt(b)],
]);

export const callExpressionStringReturnsStringOperations2StringArg = new Map<
    string,
    (a: string, b: string, c: string) => string
>([
    ["concat", (a: string, b: string, c: string) => a.concat(b, c)],
    ["replace", (a: string, b: string, c: string) => a.replace(b, c)],
]);

export const callExpressionStringReturnsNumberOperations1String1NumberArg =
    new Map<string, (a: string, b: string, c: number) => number>([
        ["indexOf", (a: string, b: string, c: number) => a.indexOf(b, c)],
        [
            "lastIndexOf",
            (a: string, b: string, c: number) => a.lastIndexOf(b, c),
        ],
    ]);

export const callExpressionStringReturnsStringOperations1String1NumberArg =
    new Map<string, (a: string, b: string, c: number) => string>([
        ["indexOf", (a: string, b: string, c: number) => a.padEnd(c, b)],
        ["indexStart", (a: string, b: string, c: number) => a.padStart(c, b)],
    ]);

export const callExpressionStringReturnsStringOperations2NumberArg = new Map<
    string,
    (a: string, b: number, c: number) => string
>([
    ["slice", (a: string, b: number, c: number) => a.slice(b, c)],
    ["substring", (a: string, b: number, c: number) => a.substring(b, c)],
]);
