import ts from "typescript";
import { createProgramFromFiles } from "./createProgramFromFiles";
import { VariableStatementAnalysis } from "./VariableStatementAnalysis";
import { MapStack } from "./mapStack";
import { CodeAnalysis } from "./CodeAnalysis";
import { BlockAnalysis } from "./BlockAnalysis";
import { detectAndProcess } from "./detectAndProcess";
/**
 * visit top level nodes and retrieve all VariableStatements.
 * @param code
 */
export function analyzeCode(code: string): CodeAnalysis {
    const sourceFileName = "code.ts";

    const program = createProgramFromFiles(
        [
            {
                name: sourceFileName,
                data: code,
            },
        ],
        {}
    );

    const sourceFile = program.getSourceFile(sourceFileName);

    if (sourceFile === undefined) {
        throw new Error("sourceFile is undefined");
    }

    //Create array and stack that will hold the variables that we want to work with.
    const detectedVariableStatements: VariableStatementAnalysis[] = [];
    const detectedVariableMap: MapStack = new MapStack();

    //Add main scope
    detectedVariableMap.addNew();

    //Block analysis to test code.
    const blockAnalysis: BlockAnalysis[] = [];

    //Collect text(or other information) from every node and add it to the array
    function visitVariableStatement(node: ts.Node) {
        //check if the parent is a block, blocks are already processed through detectAndProcess so we don't want to process it twice.
        if (
            node.parent === undefined ||
            (node.parent.kind !== ts.SyntaxKind.Block &&
                node.parent.kind !== ts.SyntaxKind.IfStatement)
        ) {
            detectAndProcess(
                node,
                detectedVariableStatements,
                detectedVariableMap,
                sourceFile as ts.SourceFile
            );
        }
    }

    // iterate through source file searchShadowing for variable statements
    visitNodeRecursive(sourceFile, visitVariableStatement);

    return {
        variableStatementAnalysis: detectedVariableStatements,
        blockAnalysis: blockAnalysis,
        //Block is only concerned about declaration of variables in blocks
    };
}

/**
 * recursively visits nodes and children
 * @param node
 * @param visit - visit is called for every node.
 */
function visitNodeRecursive(node: ts.Node, visit: (node: ts.Node) => void) {
    //Call method on every node
    visit(node);
    node.getChildren().forEach((child: ts.Node) =>
        visitNodeRecursive(child, visit)
    );
}

//For future parse and reparse whenever file changes
