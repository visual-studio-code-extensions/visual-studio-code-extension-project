import { analyzeCode } from "../src/analyzeCode";

import { expectSubset } from "./expectSubset";

//
// expect(testActual).toStrictEqual(expected);
describe("basic", () => {
    test("Arithmetic expression", () => {
        const code = "const x = 2 + 5 + 2;";

        const actual = analyzeCode(code).variableStatementAnalysis;

        const expected = [
            {
                name: "x",
                text: "const x = 2 + 5 + 2;",
                variableType: "const",
                value: 9,
            },
        ];
        expectSubset(actual, expected);
    });
});

test("Edit variable", () => {
    const code = `let y = 2 + 5;
                y = 2;`;

    const actual = analyzeCode(code).variableStatementAnalysis;

    const expected = [
        {
            name: "y",
            text: "let y = 2 + 5;",
            variableType: "let",
            value: 7,
        },
        {
            name: "y",
            text: "y = 2;",
            variableType: "let",
            value: 2,
        },
    ];
    expectSubset(actual, expected);
});

test("PrefixUnaryExpression and PrefixUnaryExpression", () => {
    const code = `let f = -5;
                let w = +6;
                 --f;
                 ++w;
                 f--;
                 w++;`;

    const expected = [
        {
            name: "f",
            text: "let f = -5;",
            variableType: "let",
            value: -5,
        },
        {
            name: "w",
            text: "let w = +6;",
            variableType: "let",
            value: +6,
        },
        {
            name: "f",
            text: "--f;",
            variableType: "let",
            value: -6,
        },
        {
            name: "w",
            text: "++w;",
            variableType: "let",
            value: +7,
        },
        {
            name: "f",
            text: "f--;",
            variableType: "let",
            value: -6,
        },
        {
            name: "w",
            text: "w++;",
            variableType: "let",
            value: +7,
        },
    ];

    const actual = analyzeCode(code).variableStatementAnalysis;

    expectSubset(actual, expected);
});

test("Expression with multiple predefined variables", () => {
    const code = `const a = 2 + 5;
                const b = 6 + 1;
                const c = a + b;
                const d = 3;
                var e = d + 2;
                const f = 2 + c;
                const g = 6 + (5 + 2);`;

    const expected = [
        {
            name: "a",
            text: "const a = 2 + 5;",
            variableType: "const",
            value: 7,
        },
        {
            name: "b",
            text: "const b = 6 + 1;",
            variableType: "const",
            value: 7,
        },
        {
            name: "c",
            text: "const c = a + b;",
            variableType: "const",
            value: 14,
        },
        {
            name: "d",
            text: "const d = 3;",
            variableType: "const",
            value: 3,
        },
        {
            name: "e",
            text: "var e = d + 2;",
            variableType: "var",
            value: 5,
        },
        {
            name: "f",
            text: "const f = 2 + c;",
            variableType: "const",
            value: 16,
        },
        {
            name: "g",
            text: "const g = 6 + (5 + 2);",
            variableType: "const",
            value: 13,
        },
    ];

    const actual = analyzeCode(code).variableStatementAnalysis;

    expectSubset(actual, expected);
});

test("simple assignment", () => {
    const code = "const x = 1 + 2;";

    const expected = [
        {
            name: "x",
            text: "const x = 1 + 2;",
            variableType: "const",
            value: 3,
        },
    ];

    const actual = analyzeCode(code).variableStatementAnalysis;

    expectSubset(actual, expected);
});

//Work in progress
test("multi assignment", () => {
    const code = `{
        let y = 5;
        {
        let shadow = 1;
            if (true) {
                shadow = y;
                a = shadow;
            }
        }
    }`;

    const expected = [
        {
            localVariables: [
                {
                    name: "y",
                    shadows: false,
                },
            ],
            referencedVariables: [],
        },
        {
            localVariables: [
                {
                    name: "shadow",
                    shadows: false,
                },
            ],
            referencedVariables: [],
        },
        {
            localVariables: [
                {
                    name: "shadow",
                    shadows: true,
                },
                {
                    name: "a",
                    shadows: false,
                },
            ],
            referencedVariables: [
                {
                    block: 0,
                    name: "y",
                },
                {
                    block: 1,
                    name: "shadow",
                },
            ],
        },
    ];

    const actual = analyzeCode(code).blockAnalysis;
    expect(actual).toStrictEqual(expected);
    //expectSubset(actual, expected);
});

test("nested if statements", () => {
    const code = `
    {
        const a = 1;
        const b = 2;
        const c = 3
        if(true){
            d = 2;
            e = a;
        } else if(false) {
            f = a;
            if(true) {
                g = b;
            }
        } else {
            if(true) {
                h = c;
            }
        }
    }`;

    const expected = [
        {
            localVariables: [
                {
                    name: "a",
                    shadows: false,
                },
                {
                    name: "b",
                    shadows: false,
                },
                {
                    name: "c",
                    shadows: false,
                },
            ],
            referencedVariables: [],
        },
        {
            localVariables: [
                {
                    name: "d",
                    shadows: false,
                },
                {
                    name: "e",
                    shadows: false,
                },
            ],
            referencedVariables: [
                {
                    block: 0,
                    name: "a",
                },
            ],
        },
        {
            localVariables: [
                {
                    name: "f",
                    shadows: false,
                },
            ],
            referencedVariables: [
                {
                    block: 0,
                    name: "a",
                },
            ],
        },
        {
            localVariables: [
                {
                    name: "g",
                    shadows: false,
                },
            ],
            referencedVariables: [
                {
                    block: 0,
                    name: "b",
                },
            ],
        },
        {
            localVariables: [],
            referencedVariables: [],
        },
        {
            localVariables: [
                {
                    name: "h",
                    shadows: false,
                },
            ],
            referencedVariables: [
                {
                    block: 0,
                    name: "c",
                },
            ],
        },
    ];

    const actual = analyzeCode(code).blockAnalysis;
    expect(actual).toStrictEqual(expected);
});
