import ts from "typescript";
import { VariableStatementAnalysis } from "../Objects/VariableStatementAnalysis";
import { getNodePosition } from "../VScodeFiles/getNodePosition";
import { MapStack } from "./mapStack";
import { processExpression } from "./processExpression";
import { expressionStatement } from './expressionStatement';
import { ErrorCollector } from "../Objects/ErrorCollector";
import { CodeLocation } from '../Objects/CodeLocation';

export function detectAndProcess(
    node: ts.Node,
    detectedVariableStatements: VariableStatementAnalysis[],
    detectedVariableMap: MapStack,
    errorCollector: ErrorCollector[],
    sourceFile: ts.SourceFile
) {
    //Variable statment as in like defining a new variable and so.
    if (ts.isVariableStatement(node)) {
        const variableType = node.declarationList.getChildAt(0).getText();
        //No need to check if source file is undefined, because we already did that earlier in the program.
        //Get position information
        const expressionLocation = getNodePosition(
            sourceFile as ts.SourceFile,
            node
        );
        //calculate the value of that variable and add it to the variables array
        const declarationsList = node.declarationList.declarations;

        //Always the last variable contains the expression to calculate.
        let expressionToProcess = declarationsList[declarationsList.length - 1];
            const variablesLocation = declarationsList.map((variable) => {
                const identifierLocation = getNodePosition(
                    sourceFile as ts.SourceFile,
                    expressionToProcess.name
                );
                return identifierLocation;
            })
            
            if (variableType !== "const" && variableType !== "let") {
                variablesLocation.forEach((variableLocation) => {
                    errorCollector.push({
                        expressionLocation,
                        identifierLocation : variableLocation,
                        errorMessage: "Can only process const and let statements ",
                    });
                });
                
            } else {
                //variablesListLocation is the location of a, b in the following example: let a, b = 2;
                const identifierListLocation :CodeLocation  = {
                    startLine : variablesLocation[0].startLine,
                    endLine : variablesLocation[0].endLine,
                    startCharacter: variablesLocation[0].startCharacter,
                    endCharacter: variablesLocation[variablesLocation.length - 1].endCharacter
                };
                const variableValue = processExpression(
                    //get the expression of the variable declaration
                    expressionToProcess.initializer,
                    detectedVariableMap,
                    errorCollector,
                    identifierListLocation,
                    expressionLocation
                );

                if (variableValue !== undefined) {
                    //Update the most recent stack scope to include these/this variable(s).
                    declarationsList.forEach((variable) => {
                        detectedVariableMap.set(variable.name.getText(), {
                            variableValue: variableValue,
                            variableType: variableType,
                        });
                        
                        //Create new object that shows information of the variable and push it to the array
                        detectedVariableStatements.push({
                            name: expressionToProcess.name.getText(),

                            value: variableValue,
                            variableType: variableType,
                            text: node.getText(),

                            expressionLocation,
                            identifierLocation,
                        });
                    });
                    
                    
                } else {
                    errorCollector.push({
                        errorMessage: "Can't process this value",
                        expressionLocation,
                        identifierLocation,
                    });
                }
            }
        //Expression statment as in like editing an existing variable
    } else if (ts.isExpressionStatement(node)) {
        const expressionVariable = expressionStatement(
            node,
            sourceFile as ts.SourceFile,
            detectedVariableMap,
            errorCollector
        );
        if (
            expressionVariable !== undefined &&
            expressionVariable.variableType !== undefined &&
            expressionVariable.value !== undefined
        ) {
            detectedVariableStatements.push(expressionVariable);
            detectedVariableMap.set(expressionVariable.name, {
                variableType: expressionVariable.variableType,
                variableValue: expressionVariable.value,
            });
        }
    } else if (ts.isBlock(node)) {
        //recursively make empty Maps and add them to the top of the stack
        detectedVariableMap.addNew();

        //Recurse over every statment in the block and process it
        node.statements.forEach((child: ts.Statement) =>
            detectAndProcess(
                child,
                detectedVariableStatements,
                detectedVariableMap,
                errorCollector,
                sourceFile as ts.SourceFile
            )
        );
        //pop at the end of the scope
        detectedVariableMap.pop();
    } else if (ts.isIfStatement(node)) {
        //if statment
        detectAndProcess(
            node.thenStatement,
            detectedVariableStatements,
            detectedVariableMap,
            errorCollector,
            sourceFile as ts.SourceFile
        );

        //the else statment
        if (node.elseStatement) {
            detectAndProcess(
                node.elseStatement,
                detectedVariableStatements,
                detectedVariableMap,
                errorCollector,
                sourceFile as ts.SourceFile
            );
        }
    }
}
