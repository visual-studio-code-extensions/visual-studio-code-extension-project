import { analyzeCode } from "../src/AST/analyzeCode";

import { expectSubset } from "./expectSubset";

describe("Expression statement / editing", () => {
    test("Edit variable", () => {
        const code = `let y = 2 + 5;
                    y = 2;
                    y = 5;`;

        const actual = analyzeCode(code).variableStatementAnalysis;

        const expected = [
            {
                name: "y",
                text: "let y = 2 + 5;",
                variableType: "let" as const,
                value: 7,
            },
            {
                name: "y",
                text: "y = 2;",
                variableType: "let" as const,
                value: 2,
            },
            {
                name: "y",
                text: "y = 5;",
                variableType: "let" as const,
                value: 5,
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
                variableType: "let" as const,
                value: -5,
            },
            {
                name: "w",
                text: "let w = +6;",
                variableType: "let" as const,
                value: +6,
            },
            {
                name: "f",
                text: "--f;",
                variableType: "let" as const,
                value: -6,
            },
            {
                name: "w",
                text: "++w;",
                variableType: "let" as const,
                value: +7,
            },
            {
                name: "f",
                text: "f--;",
                variableType: "let" as const,
                value: -7,
            },
            {
                name: "w",
                text: "w++;",
                variableType: "let" as const,
                value: +8,
            },
        ];

        const actual = analyzeCode(code).variableStatementAnalysis;

        expectSubset(actual, expected);
    });
});
