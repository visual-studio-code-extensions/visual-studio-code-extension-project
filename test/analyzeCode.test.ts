import { analyzeCode } from "../src/analyzeCode";
import { VariableStatementAnalysis } from "../src/VariableStatementAnalysis";

function getSubset(actual: VariableStatementAnalysis, expected: Partial<VariableStatementAnalysis> ) {

    const testActual = JSON.parse(JSON.stringify(actual));

    // crosses out pieces to not test
    if (expected.expressionLocation === undefined) {
        testActual.expressionLocation = undefined;
    }

    
}

function getSubsetArray(actual: VariableStatementAnalysis[], expected: Partial<VariableStatementAnalysis>) {
    
    //return actual.map(getSubset)
}

function expectSubset(actual: VariableStatementAnalysis[], expected: Partial<VariableStatementAnalysis>) {
    const actualSubset = getSubsetArray(actual, expected);
    expect(actualSubset).toStrictEqual(expected);
}


// 
// expect(testActual).toStrictEqual(expected);

test("Arithmetic expression", () => {
    const code = "const x = 2 + 5 + 2;";

    const statements = analyzeCode(code);

    // expectSubset(statements, [{
    //     name: "x",
    //     text: "const x = 2 + 5 + 2",
    //     variableType: "const",
    //     value: 9,
    // }]);
    
    expect(statements).toStrictEqual([
        {
            name: "x",
            text: "const x = 2 + 5 + 2",
            variableType: "const",
            value: 9,
            startLine: 0,
            startCharacter: 0,
        },
    ]);
});

test("Edit variable", () => {
    const code = `var y = 2 + 5 ;
                y = 2;`;

    const statements = analyzeCode(code);

    expect(statements).toStrictEqual([
        {
            name: "y",
            text: "var y = 2 + 5",
            variableType: "var",
            value: 7,
            startLine: 0,
            startCharacter: 0,
        },
        {
            name: "y",
            text: "y = 2",
            variableType: "var",
            value: 2,
            startLine: 0,
            startCharacter: 15,
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
            name: "f",
            text: "const f = -5",
            variableType: "const",
            value: -5,
            startLine: 0,
            startCharacter: 0,
        },
        {
            name: "w",
            text: "const w = +6",
            variableType: "const",
            value: +6,
            startLine: 0,
            startCharacter: 13,
        },
        {
            name: "f",
            text: "--f",
            variableType: "const",
            value: -6,
            startLine: 1,
            startCharacter: 29,
        },
        {
            name: "w",
            text: "++w",
            variableType: "const",
            value: +7,
            startLine: 2,
            startCharacter: 21,
        },
        {
            name: "f",
            text: "f--",
            variableType: "const",
            value: -6,
            startLine: 3,
            startCharacter: 21,
        },
        {
            name: "w",
            text: "w++",
            variableType: "const",
            value: +7,
            startLine: 4,
            startCharacter: 21,
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
            name: "a",
            text: "const a = 2 + 5",
            variableType: "const",
            value: 7,
            startLine: 0,
            startCharacter: 0,
        },
        {
            name: "b",
            text: "const b = 6 + 1",
            variableType: "const",
            value: 7,
            startLine: 0,
            startCharacter: 17,
        },
        {
            name: "c",
            text: "const c = a + b",
            variableType: "const",
            value: 14,
            startLine: 1,
            startCharacter: 32,
        },
        {
            name: "d",
            text: "const d = 3",
            variableType: "const",
            value: 3,
            startLine: 2,
            startCharacter: 32,
        },
        {
            name: "e",
            text: "var e = d + 2",
            variableType: "var",
            value: 5,
            startLine: 3,
            startCharacter: 28,
        },
        {
            name: "f",
            text: "const f = 2 + c",
            variableType: "const",
            value: 16,
            startLine: 4,
            startCharacter: 30,
        },
        {
            name: "g",
            text: "const g = 6 + (5 + 2)",
            variableType: "const",
            value: 13,
            startLine: 5,
            startCharacter: 32,
        },
    ]);
});

test("simple assignment", () => {
    const code = "const x = 1 + 2;";

    const statements = analyzeCode(code);

    expect(statements).toStrictEqual([
        {
            name: "x",
            text: "const x = 1 + 2",
            variableType: "const",
            value: 3,
            startLine: 0,
            startCharacter: 0,
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
