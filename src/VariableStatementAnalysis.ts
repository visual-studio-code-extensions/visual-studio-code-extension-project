import { CodeLocation } from "./CodeLocation";
import { variableTypes, variableValues } from "./mapStack";

export interface VariableStatementAnalysis {
    name: string;
    value: variableValues;
    variableType: variableTypes;
    text: string;
    expressionLocation: CodeLocation;
    identifierLocation: CodeLocation;
}
