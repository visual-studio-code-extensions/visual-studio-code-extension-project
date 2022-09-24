import { analyzeCode } from "../AST/analyzeCode";
import * as vscode from "vscode";

export function getDecorations(text: string): vscode.DecorationOptions[] {
    const { variableStatementAnalysis } = analyzeCode(text);

    const decorations = variableStatementAnalysis.map((statement) => {
        const { startLine, startCharacter, endCharacter, endLine } =
            statement.identifierLocation;

        const range = new vscode.Range(
            startLine,
            startCharacter + 1,
            endLine,
            endCharacter
        );

        const value = {
            range,
            hoverMessage: `${statement.name} (${typeof statement.value}) = ${
                statement.value
            }`,
        };

        return value;
    });

    // TODO: show for blocks

    return decorations;
}
