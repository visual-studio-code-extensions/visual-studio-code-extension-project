import { VariableStatementAnalysis } from "./VariableStatementAnalysis";
import { errorCollector } from "./errorCollector";
import { BlockAnalysis } from "./BlockAnalysis";

export interface CodeAnalysis {
    blockAnalysis: BlockAnalysis[];
    variableStatementAnalysis: VariableStatementAnalysis[];
    errorCollector: errorCollector[];
}
