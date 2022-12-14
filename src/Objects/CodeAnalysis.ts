import { VariableStatementAnalysis } from "./VariableStatementAnalysis";
import { ErrorCollector } from "./ErrorCollector";
import { BlockAnalysis } from "./BlockAnalysis";

export interface CodeAnalysis {
    blockAnalysis: BlockAnalysis[];
    variableStatementAnalysis: VariableStatementAnalysis[];
    errorCollector: ErrorCollector[];
}
