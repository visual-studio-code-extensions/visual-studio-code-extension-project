import { CodeLocation } from "./CodeLocation";

export interface VariableStatementAnalysis {
    name: string;
    value: number;
    variableType: string;
    text: string;
    expressionLocation: CodeLocation;
    identifierLocation: CodeLocation;
}
