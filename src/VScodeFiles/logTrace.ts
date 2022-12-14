import vscode from "vscode";

/**
 * Output Console for tracing program actions
 */
let channelTrace: vscode.OutputChannel;

export function createTrace() {
    channelTrace = vscode.window.createOutputChannel("TypeScript Static Analysis Trace");
}

export function logTrace(line: string) {
    channelTrace.appendLine(line);
}
