import { CodeLocation } from "./CodeLocation";

export interface errorCollector {
    errorMessage: string;
    expressionLocation: CodeLocation;
    identifierLocation: CodeLocation;
}
