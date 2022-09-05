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

test("single boolean expression", () => {
    const code = "const x : boolean = true;";

    const actual = analyzeCode(code).variableStatementAnalysis;

    const expected = [
        {
            name: "x",
            text: "const x : boolean = true;",
            variableType: "const",
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
            variableType: "const",
            value: true,
        },
        {
            name: "y",
            text: "const y : boolean = 4 > 3;",
            variableType: "const",
            value: true,
        },
        {
            name: "z",
            text: "const z : boolean = 5 === 8;",
            variableType: "const",
            value: false,
        },
    ];
    expectSubset(actual, expected);
});

test("Edit boolean variable", () => {
    const code = `let y : boolean = 5 > 9;
                y = 5 < 9;`;

    const actual = analyzeCode(code).variableStatementAnalysis;

    const expected = [
        {
            name: "y",
            text: "let y : boolean = 5 > 9;",
            variableType: "let",
            value: false,
        },
        {
            name: "y",
            text: "y = 5 < 9;",
            variableType: "let",
            value: true,
        },
    ];
    expectSubset(actual, expected);
});

test("Edit variable", () => {
    const code = `let y = 2 + 5;
                y = 2;
                y = 5;`;

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
        {
            name: "y",
            text: "y = 5;",
            variableType: "let",
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
            value: -7,
        },
        {
            name: "w",
            text: "w++;",
            variableType: "let",
            value: +8,
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

// test("multi assignment", () => {
//     const code = `{
//         let y = 5;
//         {
//         let shadow = 1;
//             if (true) {
//                 shadow = y;
//                 a = shadow;
//             }
//         }
//     }`;

//     const expected = [
//         {
//             localVariables: [
//                 {
//                     name: "y",
//                     shadows: false,
//                 },
//             ],
//             referencedVariables: [],
//         },
//         {
//             localVariables: [
//                 {
//                     name: "shadow",
//                     shadows: false,
//                 },
//             ],
//             referencedVariables: [],
//         },
//         {
//             localVariables: [
//                 {
//                     name: "shadow",
//                     shadows: true,
//                 },
//                 {
//                     name: "a",
//                     shadows: false,
//                 },
//             ],
//             referencedVariables: [
//                 {
//                     block: 1,
//                     name: "y",
//                 },
//                 {
//                     block: 2,
//                     name: "shadow",
//                 },
//             ],
//         },
//     ];

//     const actual = analyzeCode(code).blockAnalysis;
//     expect(actual).toStrictEqual(expected);
//     //expectSubset(actual, expected);
// });

// test("nested if statements", () => {
//     const code = `
//     {
//         const a = 1;
//         const b = 2;
//         const c = 3
//         if(true){
//             d = 2;
//             e = a;
//         } else if(false) {
//             f = a;
//             if(true) {
//                 g = b;
//             }
//         } else {
//             if(true) {
//                 h = c;
//             }
//         }
//     }`;

//     const expected = [
//         {
//             localVariables: [
//                 {
//                     name: "a",
//                     shadows: false,
//                 },
//                 {
//                     name: "b",
//                     shadows: false,
//                 },
//                 {
//                     name: "c",
//                     shadows: false,
//                 },
//             ],
//             referencedVariables: [],
//         },
//         {
//             localVariables: [
//                 {
//                     name: "d",
//                     shadows: false,
//                 },
//                 {
//                     name: "e",
//                     shadows: false,
//                 },
//             ],
//             referencedVariables: [
//                 {
//                     block: 1,
//                     name: "a",
//                 },
//             ],
//         },
//         {
//             localVariables: [
//                 {
//                     name: "f",
//                     shadows: false,
//                 },
//             ],
//             referencedVariables: [
//                 {
//                     block: 1,
//                     name: "a",
//                 },
//             ],
//         },
//         {
//             localVariables: [
//                 {
//                     name: "g",
//                     shadows: false,
//                 },
//             ],
//             referencedVariables: [
//                 {
//                     block: 1,
//                     name: "b",
//                 },
//             ],
//         },
//         {
//             localVariables: [
//                 {
//                     name: "h",
//                     shadows: false,
//                 },
//             ],
//             referencedVariables: [
//                 {
//                     block: 1,
//                     name: "c",
//                 },
//             ],
//         },
//     ];

//     const actual = analyzeCode(code).blockAnalysis;
//     expect(actual).toStrictEqual(expected);
// });

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
            variableType: "let",
            value: 4,
        },
        {
            name: "a",
            text: "a = 9;",
            variableType: "let",
            value: 9,
        },
        {
            name: "b",
            text: "const b = 2;",
            variableType: "const",
            value: 2,
        },
        {
            name: "c",
            text: "const c = a + b;",
            variableType: "const",
            value: 11,
        },
    ];
    //expect(actual).toStrictEqual(expected);
    expectSubset(actual, expected);
});
