import { NoSubstitutionTemplateLiteral } from "typescript";

export interface VariableStatementAnalysis {
    name: string;

    expressionLocation: {
        startLine: number;
        endLine: number;
        startCharacter: number;
        endCharacter: number;
    };

    value: number;
    text: string;
    variableType: string;
}
