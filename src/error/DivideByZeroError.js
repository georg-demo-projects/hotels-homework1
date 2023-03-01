import { InvalidOperationError } from "./InvalidOperationError.js";

export class DivideByZeroError extends InvalidOperationError {
    constructor() {
        super("Division by zero.");
    }
}
