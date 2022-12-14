import { CodeLocation } from "./CodeLocation";

export interface ErrorCollector {
    errorMessage: string;
    expressionLocation: CodeLocation;
    identifierLocation: CodeLocation;
}
