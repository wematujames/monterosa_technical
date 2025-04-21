"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler_1 = __importDefault(require("../../middleware/asyncHandler"));
const getMetrics = (0, asyncHandler_1.default)((req, res, next) => {
    res.send("Hello world");
});
exports.default = { getMetrics };
