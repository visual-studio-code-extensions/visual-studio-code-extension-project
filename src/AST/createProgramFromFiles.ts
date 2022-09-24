import * as ts from "typescript";

/**
 * Creates a program from files. Option for intellisense.
 * @param files
 * @param options
 * @returns Program created from files and intellisense.
 */
export function createProgramFromFiles(
    files: { name: string; data: string }[],
    options: {
        intellisense?: string[];
        compilerOptions?: ts.CompilerOptions;
    }
): ts.Program {
    const { intellisense } = options;

    const fileNames = files.map((f) => f.name);
    const fileMap = new Map<string, string>(
        files.map(({ name, data }) => [name, data])
    );

    const defaultScriptTarget = ts.ScriptTarget.ES2020;
    const defaultLibFileName = "lib.d.ts";
    const defaultLibData = "";

    const defaultOptions: ts.CompilerOptions = {
        target: defaultScriptTarget,
        strict: true,
    };

    // overwrite default options with supplied options
    const compilerOptions: ts.CompilerOptions = {
        ...defaultOptions,
        ...(options.compilerOptions || {}),
    };

    // script target selected via compiler options
    const scriptTarget = compilerOptions.target || defaultScriptTarget;

    const libData = (intellisense || [defaultLibData]).join("\n\n\n");
    // Since the default compiler host depends on an actual file system (ie. Windows Script Host, NodeJS),
    // we need to create a custom compiler host that will work in a web browser
    const compilerHost: ts.CompilerHost = {
        fileExists: () => true,
        getCanonicalFileName: (filename: string) => filename,
        getCurrentDirectory: () => "/",
        getDefaultLibFileName: () => defaultLibFileName,
        getNewLine: () => "\n",
        getSourceFile: (filename: string) => {
            const data = fileMap.get(filename);
            if (data !== undefined) {
                return ts.createSourceFile(filename, data, scriptTarget, true);
            }
            if (filename === defaultLibFileName) {
                return ts.createSourceFile(
                    filename,
                    libData,
                    scriptTarget,
                    true
                );
            }

            return undefined;
        },
        readFile: () => undefined,
        useCaseSensitiveFileNames: () => false,
        writeFile: () => {
            // Do nothing
        },
    };

    const program = ts.createProgram(fileNames, compilerOptions, compilerHost);

    return program;
}
