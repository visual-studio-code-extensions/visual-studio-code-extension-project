import { CodeLocation } from "./Objects/CodeLocation";

export interface ErrorCollector {
    errorMessage: string;
    expressionLocation: CodeLocation;
    identifierLocation: CodeLocation;
}
