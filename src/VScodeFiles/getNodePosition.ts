import * as ts from "typescript";
import { CodeLocation } from "../Objects/CodeLocation";

export function getNodePosition(
    sourceFile: ts.SourceFile,
    node: ts.Node
): CodeLocation {
    const start = ts.getLineAndCharacterOfPosition(sourceFile, node.pos);

    const end = ts.getLineAndCharacterOfPosition(sourceFile, node.end);

    const startLine = start.line;
    const endLine = end.line;
    const startCharacter = start.character;
    const endCharacter = end.character;

    return { startLine, endLine, startCharacter, endCharacter };
}
