import { analyzeCode } from "../src/AST/analyzeCode";

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
                variableType: "const" as const,
                value: 9,
            },
        ];
        expectSubset(actual, expected);
    });
});

// test("Multiple assignment at the same time expression", () => {
//     const code = "const x :number, y : number= 2 + 5 + 2;";

//     const actual = analyzeCode(code).variableStatementAnalysis;

//     const expected = [
//         {
//             name: "x",
//             text: "const x :number, y : number= 2 + 5 + 2;",
//             variableType: "const" as const,
//             value: 9,
//         },
//         {
//             name: "y",
//             text: "const x :number, y : number= 2 + 5 + 2;",
//             variableType: "const" as const,
//             value: 9,
//         },
//     ];
//     expectSubset(actual, expected);
// });

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

test("Property Access without a call expression", () => {
    const code = `const x : string = "I love Typescript";
                    const y : number = x.toLowerCase().length;`;

    const actual = analyzeCode(code).variableStatementAnalysis;

    const expected = [
        {
            name: "x",
            text: `const x : string = "I love Typescript";`,
            variableType: "const" as const,
            value: "I love Typescript",
        },
        {
            name: "y",
            text: `const y : number = x.toLowerCase().length;`,
            variableType: "const" as const,
            value: 17,
        },
    ];
    expectSubset(actual, expected);
});

test("Multiple call expressions", () => {
    const code = `const a : string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                const b = a.toLowerCase();
                const c = a.toLowerCase().toUpperCase();
                `;

    const actual = analyzeCode(code).variableStatementAnalysis;

    const expected = [
        {
            name: "a",
            text: `const a : string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";`,
            variableType: "const" as const,
            value: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        },
        {
            name: "b",
            text: `const b = a.toLowerCase();`,
            variableType: "const" as const,
            value: "abcdefghijklmnopqrstuvwxyz",
        },
        {
            name: "c",
            text: `const c = a.toLowerCase().toUpperCase();`,
            variableType: "const" as const,
            value: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
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

    const actual = analyzeCode(code).variableStatementAnalysis;

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
    //expect(actual).toStrictEqual(expected);
    expectSubset(actual, expected);
});

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
    //expect(actual).toStrictEqual(expected);
    expectSubset(actual, expected);
});
