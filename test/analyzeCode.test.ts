import { analyzeCode } from "../src/analyzeCode";

import { expectSubset } from "./expectSubset";

//
// expect(testActual).toStrictEqual(expected);
describe("basic", () => {
    test("Arithmetic expression", () => {
        const code = "const x = 2 + 5 + 2;";

        const actual = analyzeCode(code);

        const expected = [
            {
                name: "x",
                text: "const x = 2 + 5 + 2",
                variableType: "const",
                value: 9,
            },
        ];
        expectSubset(actual, expected);
    });
});

describe("advanced", () => {
    test("Edit variable", () => {
        const code = `var y = 2 + 5 ;
                y = 2;`;

        const actual = analyzeCode(code);

        const expected = [
            {
                name: "y",
                text: "var y = 2 + 5",
                variableType: "var",
                value: 7,
            },
            {
                name: "y",
                text: "y = 2",
                variableType: "var",
                value: 2,
            },
        ];

        expectSubset(actual, expected);
    });

    test("PrefixUnaryExpression and PrefixUnaryExpression", () => {
        const code = `const f = -5;
                const w = +6;
                 --f;
                 ++w;
                 f--;
                 w++;`;

        const expected = [
            {
                name: "f",
                text: "const f = -5",
                variableType: "const",
                value: -5,
            },
            {
                name: "w",
                text: "const w = +6",
                variableType: "const",
                value: +6,
            },
            {
                name: "f",
                text: "--f",
                variableType: "const",
                value: -6,
            },
            {
                name: "w",
                text: "++w",
                variableType: "const",
                value: +7,
            },
            {
                name: "f",
                text: "f--",
                variableType: "const",
                value: -6,
            },
            {
                name: "w",
                text: "w++",
                variableType: "const",
                value: +7,
            },
        ];

        const actual = analyzeCode(code);

        expectSubset(actual, expected);
    });

    test("Expression with multiple predefined variables", () => {
        const code = `const a = 2 + 5 ;
                const b = 6 + 1;
                const c = a + b;
                const d = 3;
                var e = d + 2;
                const f = 2 + c;
                const g = 6 + (5 + 2);`;

        const expected = [
            {
                name: "a",
                text: "const a = 2 + 5",
                variableType: "const",
                value: 7,
            },
            {
                name: "b",
                text: "const b = 6 + 1",
                variableType: "const",
                value: 7,
            },
            {
                name: "c",
                text: "const c = a + b",
                variableType: "const",
                value: 14,
            },
            {
                name: "d",
                text: "const d = 3",
                variableType: "const",
                value: 3,
            },
            {
                name: "e",
                text: "var e = d + 2",
                variableType: "var",
                value: 5,
            },
            {
                name: "f",
                text: "const f = 2 + c",
                variableType: "const",
                value: 16,
            },
            {
                name: "g",
                text: "const g = 6 + (5 + 2)",
                variableType: "const",
                value: 13,
            },
        ];

        const actual = analyzeCode(code);

        expectSubset(actual, expected);
    });

    test("simple assignment", () => {
        const code = "const x = 1 + 2;";

        const expected = [
            {
                name: "x",
                text: "const x = 1 + 2",
                variableType: "const",
                value: 3,
            },
        ];

        const actual = analyzeCode(code);

        expectSubset(actual, expected);
    });

    // test("multi assignment", () => {
    //     const code = `let x = 1;
    //     if (true) {
    //         let x = 2;
    //         let a = x;
    //     }`;

    //     const statements = analyzeCode(code);

    //     expect(statements).toStrictEqual([
    //         {
    //             name: "x",
    //             text: "let x = 2",
    //             variableType: "let",
    //             value: 2,
    //             startLine: 0,
    //             startCharacter: 0,
    //         },
    //         {
    //             name: "a",
    //             text: "let a = x",
    //             variableType: "let",
    //             value: 2,
    //             startLine: 0,
    //             startCharacter: 0,
    //         },
    //     ]);
    // });
});
