import { CodeLocation } from "./CodeLocation";
import { VariableTypes, VariableValues } from "../AST/mapStack";

export interface VariableStatementAnalysis {
    name: string; //name of the variable
    value: VariableValues | undefined; //value of the variable
    variableType: VariableTypes; //variable type, undefined when running into an error
    text: string; //Statement .getText()
    expressionLocation: CodeLocation;
    identifierLocation: CodeLocation;
}
