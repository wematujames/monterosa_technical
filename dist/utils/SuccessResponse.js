"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SuccessResponse {
    constructor(code, msg, data) {
        this.code = 200;
        this.success = true;
        this.message = "Success";
        this.data = undefined;
        this.code = code;
        this.message = msg;
        this.data = data;
    }
}
exports.default = SuccessResponse;
