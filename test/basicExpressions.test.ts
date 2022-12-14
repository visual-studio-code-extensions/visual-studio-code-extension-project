import { analyzeCode } from "../src/AST/analyzeCode";

import { expectSubset } from "./expectSubset";

// expect(testActual).toStrictEqual(expected);
describe("Basic expressions", () => {
    test("Arithmetic expression", () => {
        const code = "const x = 2 + 5 + 2;";

        const actual = analyzeCode(code).variableStatementAnalysis;

        const expected = [
            {
                name: "x",
                text: "const x = 2 + 5 + 2;",
                variableType: "const" as const,
                value: 9,
            },
        ];
        expectSubset(actual, expected);
    });

    test("Multiple assignment at the same time expression", () => {
        const code = "const inigio : number, montoya : number = 2 + 5 + 2;";

        const actual = analyzeCode(code).variableStatementAnalysis;

        const expected = [
            {
                name: "inigio",
                text: "const inigio : number, montoya : number = 2 + 5 + 2;",
                variableType: "const" as const,
                value: 9,
            },
            {
                name: "montoya",
                text: "const inigio : number, montoya : number = 2 + 5 + 2;",
                variableType: "const" as const,
                value: 9,
            },
        ];
        expectSubset(actual, expected);
    });

    test("single boolean expression", () => {
        const code = "const x : boolean = true;";

        const actual = analyzeCode(code).variableStatementAnalysis;

        const expected = [
            {
                name: "x",
                text: "const x : boolean = true;",
                variableType: "const" as const,
                value: true,
            },
        ];
        expectSubset(actual, expected);
    });

    test("single string expression", () => {
        const code = 'const x : string = "Hello";';

        const actual = analyzeCode(code).variableStatementAnalysis;

        const expected = [
            {
                name: "x",
                text: `const x : string = "Hello";`,
                variableType: "const" as const,
                value: "Hello",
            },
        ];
        expectSubset(actual, expected);
    });
    test("simple assignment", () => {
        const code = "const x = 1 + 2;";

        const expected = [
            {
                name: "x",
                text: "const x = 1 + 2;",
                variableType: "const" as const,
                value: 3,
            },
        ];

        const actual = analyzeCode(code).variableStatementAnalysis;

        expectSubset(actual, expected);
    });
    test("Assignment operations", () => {
        const code = `
        let a = 2;
        let b = 15;
        b+=a;
        b-=1;
        b*=3;
        b/=2;
        b%=a;`;

        const actual = analyzeCode(code).variableStatementAnalysis;

        const expected = [
            {
                name: "a",
                text: "let a = 2;",
                value: 2,
            },
            {
                name: "b",
                text: "let b = 15;",
                value: 15,
            },
            {
                name: "b",
                text: "b+=a;",
                value: 17,
            },
            {
                name: "b",
                text: "b-=1;",
                value: 16,
            },
            {
                name: "b",
                text: "b*=3;",
                value: 48,
            },
            {
                name: "b",
                text: "b/=2;",
                value: 24,
            },
            {
                name: "b",
                text: "b%=a;",
                value: 0,
            },
        ];

        expectSubset(actual, expected);
    });
});

test("detectedVariable Scoping", () => {
    const code = `
    let a = 4;
    {
        a = 9;
        const b = 2;
        const c = a + b;
    }`;

    const actual = analyzeCode(code).variableStatementAnalysis;

    const expected = [
        {
            name: "a",
            text: "let a = 4;",
            variableType: "let" as const,
            value: 4,
        },
        {
            name: "a",
            text: "a = 9;",
            variableType: "let" as const,
            value: 9,
        },
        {
            name: "b",
            text: "const b = 2;",
            variableType: "const" as const,
            value: 2,
        },
        {
            name: "c",
            text: "const c = a + b;",
            variableType: "const" as const,
            value: 11,
        },
    ];

    expectSubset(actual, expected);
});
