import { CodeLocation } from "./CodeLocation";
import { VariableTypes, VariableValues } from "../AST/mapStack";

export interface VariableStatementAnalysis {
    name: string;
    value: VariableValues;
    variableType: VariableTypes;
    text: string;
    expressionLocation: CodeLocation;
    identifierLocation: CodeLocation;
}
