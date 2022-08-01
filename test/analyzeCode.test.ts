import { analyzeCode, } from "../src/analyzeCode";


test("Arithmetic expression", () => {
    const code = "const x = 2 + 5 + 2;";

    const statements = analyzeCode(code);

    expect(statements).toStrictEqual([
        {
            variableName: "x",
            variableText: "const x = 2 + 5 + 2",
            variableType: "const",
            variableValue: 9,
            variableLineNumber: 0,
            variableStartingCharacter: 0,
        },
    ]);
});

test("Edit variable", () => {
    const code = `var y = 2 + 5 ;
                y = 2;`;

    const statements = analyzeCode(code);

    expect(statements).toStrictEqual([
        {
            variableName: "y",
            variableText: "var y = 2 + 5",
            variableType: "var",
            variableValue: 7,
            variableLineNumber: 0,
            variableStartingCharacter: 0,
        },
        {
            variableName: "y",
            variableText: "y = 2",
            variableType: "var",
            variableValue: 2,
            variableLineNumber: 0,
            variableStartingCharacter: 15,
        },
    ]);
});

test("PrefixUnaryExpression and PrefixUnaryExpression", () => {
    const code = `const f = -5;
                const w = +6;
                 --f;
                 ++w;
                 f--;
                 w++;`;

    const statement = analyzeCode(code);
    expect(statement).toStrictEqual([
        {
            variableName: "f",
            variableText: "const f = -5",
            variableType: "const",
            variableValue: -5,
            variableLineNumber: 0,
            variableStartingCharacter: 0,
        },
        {
            variableName: "w",
            variableText: "const w = +6",
            variableType: "const",
            variableValue: +6,
            variableLineNumber: 0,
            variableStartingCharacter: 13,
        },
        {
            variableName: "f",
            variableText: "--f",
            variableType: "const",
            variableValue: -6,
            variableLineNumber: 1,
            variableStartingCharacter: 29,
        },
        {
            variableName: "w",
            variableText: "++w",
            variableType: "const",
            variableValue: +7,
            variableLineNumber: 2,
            variableStartingCharacter: 21,
        },
        {
            variableName: "f",
            variableText: "f--",
            variableType: "const",
            variableValue: -6,
            variableLineNumber: 3,
            variableStartingCharacter: 21,
        },
        {
            variableName: "w",
            variableText: "w++",
            variableType: "const",
            variableValue: +7,
            variableLineNumber: 4,
            variableStartingCharacter: 21,
        },
    ]);
});

test("Expression with multiple predefined variables", () => {
    const code = `const a = 2 + 5 ;
                const b = 6 + 1;
                const c = a + b;
                const d = 3;
                var e = d + 2;
                const f = 2 + c;
                const g = 6 + (5 + 2);`;

    const statements = analyzeCode(code);

    expect(statements).toStrictEqual([
        {
            variableName: "a",
            variableText: "const a = 2 + 5",
            variableType: "const",
            variableValue: 7,
            variableLineNumber: 0,
            variableStartingCharacter: 0,
        },
        {
            variableName: "b",
            variableText: "const b = 6 + 1",
            variableType: "const",
            variableValue: 7,
            variableLineNumber: 0,
            variableStartingCharacter: 17,
        },
        {
            variableName: "c",
            variableText: "const c = a + b",
            variableType: "const",
            variableValue: 14,
            variableLineNumber: 1,
            variableStartingCharacter: 32,
        },
        {
            variableName: "d",
            variableText: "const d = 3",
            variableType: "const",
            variableValue: 3,
            variableLineNumber: 2,
            variableStartingCharacter: 32,
        },
        {
            variableName: "e",
            variableText: "var e = d + 2",
            variableType: "var",
            variableValue: 5,
            variableLineNumber: 3,
            variableStartingCharacter: 28,
        },
        {
            variableName: "f",
            variableText: "const f = 2 + c",
            variableType: "const",
            variableValue: 16,
            variableLineNumber: 4,
            variableStartingCharacter: 30,
        },
        {
            variableName: "g",
            variableText: "const g = 6 + (5 + 2)",
            variableType: "const",
            variableValue: 13,
            variableLineNumber: 5,
            variableStartingCharacter: 32,
        },
    ]);
});

test("simple assignment", () => {
    const code = "const x = 1 + 2;";

    const statements = analyzeCode(code);

    expect(statements).toStrictEqual([
        {
            variableName: "x",
            variableText: "const x = 1 + 2",
            variableType: "const",
            variableValue: 3,
            variableLineNumber: 0,
            variableStartingCharacter: 0,
        },
    ]);
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
//             variableName: "x",
//             variableText: "let x = 2",
//             variableType: "let",
//             variableValue: 2,
//             variableLineNumber: 0,
//             variableStartingCharacter: 0,
//         },
//         {
//             variableName: "a",
//             variableText: "let a = x",
//             variableType: "let",
//             variableValue: 2,
//             variableLineNumber: 0,
//             variableStartingCharacter: 0,
//         },
//     ]);
// });
