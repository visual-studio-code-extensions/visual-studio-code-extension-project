import { analyzeCode } from "../src/AST/analyzeCode";

import { expectSubset } from "./expectSubset";

describe("Booleans", () => {
    test("Edit boolean variable", () => {
        const code = `let y : boolean = 5 > 9;
                    y = 5 < 9;`;

        const actual = analyzeCode(code).variableStatementAnalysis;

        const expected = [
            {
                name: "y",
                text: "let y : boolean = 5 > 9;",
                variableType: "let" as const,
                value: false,
            },
            {
                name: "y",
                text: "y = 5 < 9;",
                variableType: "let" as const,
                value: true,
            },
        ];
        expectSubset(actual, expected);
    });

    test("Boolean and numbers reassingment/expressions", () => {
        const code = `const x = 5;
    
        let y = x + 2;
        
        const a = 1 + 2 + 3 + 4 + 5;
        
        y++;
        
        const b = y < a;
        
        let t = true;
        
        t = false;`;

        const main = analyzeCode(code);
        const actual = main.variableStatementAnalysis;
        const expected = [
            {
                name: "x",
                text: "const x = 5;",
                variableType: "const" as const,
                value: 5,
            },
            {
                name: "y",
                text: "let y = x + 2;",
                variableType: "let" as const,
                value: 7,
            },
            {
                name: "a",
                text: "const a = 1 + 2 + 3 + 4 + 5;",
                variableType: "const" as const,
                value: 15,
            },
            {
                name: "y",
                text: "y++;",
                variableType: "let" as const,
                value: 8,
            },
            {
                name: "b",
                text: "const b = y < a;",
                variableType: "const" as const,
                value: true,
            },
            {
                name: "t",
                text: "let t = true;",
                variableType: "let" as const,
                value: true,
            },
            {
                name: "t",
                text: "t = false;",
                variableType: "let" as const,
                value: false,
            },
        ];
        expectSubset(actual, expected);
    });
});
