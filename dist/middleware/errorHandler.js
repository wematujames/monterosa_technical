"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = (err, req, res, next) => {
    console.log(err.stack);
    // Send error response //err.statusCode ||
    res.status(500).json({
        // statusCode: err.statusCode || 500,
        success: false,
        message: err.message || "Server error",
    });
};
