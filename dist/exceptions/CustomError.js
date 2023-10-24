"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    constructor(name, originalMessage, info) {
        super(originalMessage || name);
        this.name = name;
        this.info = info || undefined; // Set 'info' explicitly as undefined if not provided
    }
}
exports.CustomError = CustomError;
//# sourceMappingURL=CustomError.js.map