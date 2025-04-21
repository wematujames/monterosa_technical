"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorResponse extends Error {
    constructor(code = 500, name = "serverError", msg = "Server Error") {
        super(msg);
        this.name = name;
        this.code = code;
    }
}
exports.default = ErrorResponse;
