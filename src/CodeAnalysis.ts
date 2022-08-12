import {VariableStatementAnalysis} from "./VariableStatementAnalysis"

import {BlockAnalysis} from "./BlockAnalysis"


export interface CodeAnalysis {
    blockAnalysis: BlockAnalysis[];
    variableStatementAnalysis: VariableStatementAnalysis[];
}