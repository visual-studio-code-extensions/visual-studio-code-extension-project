import { analyzeCode } from "../src/AST/analyzeCode";

import { expectSubset } from "./expectSubset";

describe("Function calls", () => {
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

    test("padEnd/padStart", () => {
        const code = `const x : string = "I love Typescript";
                        const a = x.padEnd(20);
                        const b = x.padStart(20);
                        const c = x.padEnd(20, "*");
                        const d = x.padStart(20, "*");`;

        const actual = analyzeCode(code).variableStatementAnalysis;

        const expected = [
            {
                name: "x",
                text: `const x : string = "I love Typescript";`,
                value: "I love Typescript",
            },
            {
                name: "a",
                text: `const a = x.padEnd(20);`,
                value: "I love Typescript   ",
            },
            {
                name: "b",
                text: `const b = x.padStart(20);`,
                value: "   I love Typescript",
            },
            {
                name: "c",
                text: `const c = x.padEnd(20, "*");`,
                value: "I love Typescript***",
            },
            {
                name: "d",
                text: `const d = x.padStart(20, "*");`,
                value: "***I love Typescript",
            },
        ];
        expectSubset(actual, expected);
    });

    test("Multiple call expressions", () => {
        const code = `const a : string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                    const aa = '   Hello world!   ';
                    const index = -4;
                    const b = a.toLowerCase();
                    const c = a.toLowerCase().toUpperCase();
                    const d = a.substring(2);
                    const e = aa.trim();
                    const f = aa.trimStart();
                    const g = aa.trimEnd();
                    const h = a.slice(-2);
                    const i = a.slice();
                    const j = a.at(index);
                    const k = a.charAt(7);
                    //const l = a.padEnd(30, ',');
                    const m = a.repeat(2);
                    const n = a.charCodeAt(4);
                    const o = aa.includes('world');
                    const p = a.startsWith("AC");
                    const q = a.endsWith("XYZ");
                    const r = a.indexOf("L");
                    const s = a.concat("|", aa);
                    //const t = a.padStart(10, "*");
                    const u = a.substring(5, 10);
                    `;

        const actual = analyzeCode(code).variableStatementAnalysis;

        const expected = [
            {
                name: "a",
                text: `const a : string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";`,
                value: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            },
            {
                name: "aa",
                text: `const aa = '   Hello world!   ';`,
                value: "   Hello world!   ",
            },
            {
                name: "index",
                text: `const index = -4;`,
                value: -4,
            },
            {
                name: "b",
                text: `const b = a.toLowerCase();`,
                value: "abcdefghijklmnopqrstuvwxyz",
            },
            {
                name: "c",
                text: `const c = a.toLowerCase().toUpperCase();`,
                value: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            },
            {
                name: "d",
                text: `const d = a.substring(2);`,
                value: "CDEFGHIJKLMNOPQRSTUVWXYZ",
            },
            {
                name: "e",
                text: `const e = aa.trim();`,
                value: "Hello world!",
            },
            {
                name: "f",
                text: `const f = aa.trimStart();`,
                value: "Hello world!   ",
            },
            {
                name: "g",
                text: `const g = aa.trimEnd();`,
                value: "   Hello world!",
            },
            {
                name: "h",
                text: `const h = a.slice(-2);`,
                value: "YZ",
            },
            {
                name: "i",
                text: `const i = a.slice();`,
                value: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            },
            {
                name: "j",
                text: `const j = a.at(index);`,
                value: "W",
            },
            {
                name: "k",
                text: `const k = a.charAt(7);`,
                value: "H",
            },
            {
                name: "m",
                text: `const m = a.repeat(2);`,
                value: "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ",
            },
            {
                name: "n",
                text: `const n = a.charCodeAt(4);`,
                value: 69,
            },
            {
                name: "o",
                text: `const o = aa.includes('world');`,
                value: true,
            },
            {
                name: "p",
                text: `const p = a.startsWith("AC");`,
                value: false,
            },
            {
                name: "q",
                text: `const q = a.endsWith("XYZ");`,
                value: true,
            },
            {
                name: "r",
                text: `const r = a.indexOf("L");`,
                value: 11,
            },
            {
                name: "s",
                text: `const s = a.concat("|", aa);`,
                value: "ABCDEFGHIJKLMNOPQRSTUVWXYZ|   Hello world!   ",
            },
            {
                name: "u",
                text: `const u = a.substring(5, 10);`,
                value: "FGHIJ",
            },
        ];
        expectSubset(actual, expected);
    });
});
