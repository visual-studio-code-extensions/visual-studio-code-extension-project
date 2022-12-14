import { analyzeCode } from "../src/AST/analyzeCode";

import { expectSubset } from "./expectSubset";

describe("Advanced expressions", () => {
    test("multi assignment", () => {
        const code = `
        {
                let y = 5;
    
                {
                let shadow = 1;
                    if (true) {
                        shadow = y;
                        const a = shadow;
                    }
                }
            }`;

        const expected = [
            {
                name: "y",
                text: "let y = 5;",
                variableType: "let" as const,
                value: 5,
            },
            {
                name: "shadow",
                text: "let shadow = 1;",
                variableType: "let" as const,
                value: 1,
            },
            {
                name: "shadow",
                text: "shadow = y;",
                variableType: "let" as const,
                value: 5,
            },
            {
                name: "a",
                text: "const a = shadow;",
                variableType: "const" as const,
                value: 5,
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
                    let e = d + 2;
                    const f = 2 + c;
                    const g = 6 + (5 + 2);`;

        const expected = [
            {
                name: "a",
                text: "const a = 2 + 5;",
                variableType: "const" as const,
                value: 7,
            },
            {
                name: "b",
                text: "const b = 6 + 1;",
                variableType: "const" as const,
                value: 7,
            },
            {
                name: "c",
                text: "const c = a + b;",
                variableType: "const" as const,
                value: 14,
            },
            {
                name: "d",
                text: "const d = 3;",
                variableType: "const" as const,
                value: 3,
            },
            {
                name: "e",
                text: "let e = d + 2;",
                variableType: "let" as const,
                value: 5,
            },
            {
                name: "f",
                text: "const f = 2 + c;",
                variableType: "const" as const,
                value: 16,
            },
            {
                name: "g",
                text: "const g = 6 + (5 + 2);",
                variableType: "const" as const,
                value: 13,
            },
        ];

        const actual = analyzeCode(code).variableStatementAnalysis;

        expectSubset(actual, expected);
    });
    test("multiple string expressions", () => {
        const code = `const a : string = "I love ";
                        const b : string = "Typescript";
                        const c : string = "I love " + "Typescript";
                        const d : string = a + b;
                        const e : boolean = (c === d);`;

        const actual = analyzeCode(code).variableStatementAnalysis;

        const expected = [
            {
                name: "a",
                text: `const a : string = "I love ";`,
                variableType: "const" as const,
                value: "I love ",
            },
            {
                name: "b",
                text: `const b : string = "Typescript";`,
                variableType: "const" as const,
                value: "Typescript",
            },
            {
                name: "c",
                text: `const c : string = "I love " + "Typescript";`,
                variableType: "const" as const,
                value: "I love Typescript",
            },
            {
                name: "d",
                text: `const d : string = a + b;`,
                variableType: "const" as const,
                value: "I love Typescript",
            },
            {
                name: "e",
                text: `const e : boolean = (c === d);`,
                variableType: "const" as const,
                value: true,
            },
        ];
        expectSubset(actual, expected);
    });

    test("multiple boolean expression", () => {
        const code = `const x : boolean = true;
                    const y : boolean = 4 > 3;
                    const z : boolean = 5 === 8; `;

        const actual = analyzeCode(code).variableStatementAnalysis;

        const expected = [
            {
                name: "x",
                text: "const x : boolean = true;",
                variableType: "const" as const,
                value: true,
            },
            {
                name: "y",
                text: "const y : boolean = 4 > 3;",
                variableType: "const" as const,
                value: true,
            },
            {
                name: "z",
                text: "const z : boolean = 5 === 8;",
                variableType: "const" as const,
                value: false,
            },
        ];
        expectSubset(actual, expected);
    });
});
