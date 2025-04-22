"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(require("../utils/Logger"));
const requestLogger = (req, res, next) => {
    const startTime = Date.now();
    res.on("finish", () => {
        Logger_1.default.log({
            type: "http_req",
            request: {
                url: req.originalUrl,
                headers: req.headers,
                method: req.method,
                body: req.body,
                ip: req.ip,
            },
            response: {
                responseTime: Date.now() - startTime,
                statusCode: res.statusCode
            }
        });
    });
    next();
};
exports.default = requestLogger;
