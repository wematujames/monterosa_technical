"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    res.status(err.code || 500).json({
        code: err.code || 500,
        success: false,
        message: err.message || "Server error",
    });
};
exports.default = errorHandler;
