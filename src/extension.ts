import * as vscode from "vscode";
import { getDecorations } from "./getDecorations";
// this method is called when vs code is activated
export function activate(context: vscode.ExtensionContext) {
  console.log("decorator sample is activated");

  let timeout: NodeJS.Timer | undefined = undefined;

  const variableDecorationType = vscode.window.createTextEditorDecorationType({
    borderWidth: "1.5px",
    borderStyle: "dotted",
    overviewRulerColor: "yellow",
    overviewRulerLane: vscode.OverviewRulerLane.Right,
    light: {
      // this color will be used in light color themes
      borderColor: "purple",
    },
    dark: {
      // this color will be used in dark color themes
      borderColor: "green",
    },
  });

  // create a decorator type that we use to decorate small numbers
  const smallNumberDecorationType =
    vscode.window.createTextEditorDecorationType({
      borderWidth: "1.5px",
      borderStyle: "dotted",
      overviewRulerColor: "green",
      overviewRulerLane: vscode.OverviewRulerLane.Right,
      light: {
        // this color will be used in light color themes
        borderColor: "orange",
      },
      dark: {
        // this color will be used in dark color themes
        borderColor: "bluelight",
      },
    });

  // create a decorator type that we use to decorate large numbers
  const largeNumberDecorationType =
    vscode.window.createTextEditorDecorationType({
      cursor: "crosshair",
      // use a themable color. See package.json for the declaration and default values.
      backgroundColor: { id: "myextension.largeNumberBackground" },
    });

  let activeEditor = vscode.window.activeTextEditor;

  function updateDecorations() {
    if (!activeEditor) {
      return;
    }
    const regEx = /\d+/g;
    const text = activeEditor.document.getText();
    const smallNumbers: vscode.DecorationOptions[] = [];
    const largeNumbers: vscode.DecorationOptions[] = [];
    let match;
    while ((match = regEx.exec(text))) {
      const startPos = activeEditor.document.positionAt(match.index);
      const endPos = activeEditor.document.positionAt(
        match.index + match[0].length
      );
      const decoration = {
        range: new vscode.Range(startPos, endPos),
        hoverMessage: "Number **" + match[0] + "**",
      };
      if (match[0].length < 3) {
        smallNumbers.push(decoration);
      } else {
        largeNumbers.push(decoration);
      }
    }
    activeEditor.setDecorations(smallNumberDecorationType, smallNumbers);
    activeEditor.setDecorations(largeNumberDecorationType, largeNumbers);

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
