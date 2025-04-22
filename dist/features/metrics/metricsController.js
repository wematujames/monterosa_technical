"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler_1 = __importDefault(require("../../middleware/asyncHandler"));
const SuccessResponse_1 = __importDefault(require("../../utils/SuccessResponse"));
const metricsService_1 = __importDefault(require("./metricsService"));
const getMetrics = (0, asyncHandler_1.default)(async (req, res, next) => {
    const metrics = await metricsService_1.default.getMetrics();
    return res.status(200).json(new SuccessResponse_1.default(200, "Success", metrics));
});
exports.default = { getMetrics };
