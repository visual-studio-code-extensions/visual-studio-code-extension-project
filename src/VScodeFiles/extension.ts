import { createTrace, logTrace } from "./logTrace";
import * as vscode from "vscode";
import { getDecorations } from "./getDecorations";
// this method is called when vs code is activated
export function activate(context: vscode.ExtensionContext) {
    console.log("TypeScript Static Analysis activated");
    createTrace();
    logTrace("activated");

    let timeout: NodeJS.Timer | undefined = undefined;

    let activeEditor = vscode.window.activeTextEditor;

    const variableDecorationOnSuccess = getVariableDecorationOnSuccess();

    function updateDecorations() {
        logTrace("updateDecorations");
        if (!activeEditor) {
            return;
        }

        const text = activeEditor.document.getText();

        const filename = activeEditor.document.fileName;
        const isTsFile = filename.endsWith(".ts");

        if (isTsFile) {
            const decorations = getDecorations(text);
            activeEditor.setDecorations(variableDecorationOnSuccess, decorations[0]);
            logTrace("wrote Decorations");
        }
    }

    function triggerUpdateDecorations(throttle = false) {
        if (timeout) {
            clearTimeout(timeout);
            timeout = undefined;
        }
        if (throttle) {
            timeout = setTimeout(updateDecorations, 500);
        } else {
            updateDecorations();
        }
    }

    if (activeEditor) {
        triggerUpdateDecorations();
    }

    vscode.window.onDidChangeActiveTextEditor(
        (editor) => {
            activeEditor = editor;
            if (editor) {
                triggerUpdateDecorations();
            }
        },
        null,
        context.subscriptions
    );

    vscode.workspace.onDidChangeTextDocument(
        (event) => {
            if (activeEditor && event.document === activeEditor.document) {
                triggerUpdateDecorations(true);
            }
        },
        null,
        context.subscriptions
    );

    context.subscriptions.push(
        vscode.commands.registerCommand("typescriptStaticAnalysis.run", () => {
            logTrace("manual run");
            triggerUpdateDecorations(true);
        })
    );
}

function getVariableDecorationOnSuccess() {
    const color = new vscode.ThemeColor("typescriptStaticAnalysis.variableBackground");

    const variableDecorationType = vscode.window.createTextEditorDecorationType({
        //borderWidth: "0.1px",
        //borderStyle: "solid",
        //overviewRulerColor: "blue",
        color,
        //overviewRulerLane: vscode.OverviewRulerLane.Right,
        // light: {
        //     // this color will be used in light color themes
        //     borderColor: "pink",
        // },
        // dark: {
        //     // this color will be used in dark color themes
        //     borderColor: "lightblue",
        // },
    });

    return variableDecorationType;
}
