import * as vscode from "vscode";
import { getDecorations } from "./getDecorations";
// this method is called when vs code is activated
export function activate(context: vscode.ExtensionContext) {
    console.log("decorator sample is activated");

    let timeout: NodeJS.Timer | undefined = undefined;

    const variableDecorationType = vscode.window.createTextEditorDecorationType(
        {
            borderWidth: "1px",
            borderStyle: "solid",
            overviewRulerColor: "blue",
            overviewRulerLane: vscode.OverviewRulerLane.Right,
            light: {
                // this color will be used in light color themes
                borderColor: "pink",
            },
            dark: {
                // this color will be used in dark color themes
                borderColor: "lightblue",
            },
        }
    );

    let activeEditor = vscode.window.activeTextEditor;

    function updateDecorations() {
        if (!activeEditor) {
            return;
        }
        
        const text = activeEditor.document.getText();

        const filename = activeEditor.document.fileName;
        const isTsFile = filename.endsWith(".ts");

        if (isTsFile) {
            const decorations = getDecorations(text);
            activeEditor.setDecorations(variableDecorationType, decorations);
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
}
