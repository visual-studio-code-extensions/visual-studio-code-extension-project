import { analyzeCode } from "../AST/analyzeCode";
import * as vscode from "vscode";

export function getDecorations(text: string): vscode.DecorationOptions[][] {
    const { variableStatementAnalysis } = analyzeCode(text);

    const decorationsSuccess = variableStatementAnalysis.map((statement) => {
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

    // const { errorCollector } = analyzeCode(text);

    // const decorationsError = errorCollector.map((statement) => {
    //     const { startLine, startCharacter, endCharacter, endLine } =
    //         statement.identifierLocation;

    //     const range = new vscode.Range(
    //         startLine,
    //         startCharacter + 1,
    //         endLine,
    //         endCharacter
    //     );

    //     const value = {
    //         range,
    //         hoverMessage: `Static analysis ran into an error processing this: ${statement.errorMessage}`,
    //     };

    //     return value;
    // });

    return [decorationsSuccess];
}
