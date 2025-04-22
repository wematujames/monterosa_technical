"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler_1 = __importDefault(require("../../middleware/asyncHandler"));
const SuccessResponse_1 = __importDefault(require("../../utils/SuccessResponse"));
const metrics_1 = __importDefault(require("../../data/metrics"));
const getMetrics = (0, asyncHandler_1.default)((req, res, next) => {
    const avgJobDuration = metrics_1.default.processing_times.reduce((c, n) => c + n, 0) / 1000;
    return res.status(200).json(new SuccessResponse_1.default(200, "Success", {
        ...metrics_1.default,
        avg_processing_time: parseFloat(avgJobDuration + "").toFixed(2) + "s",
        processing_times: undefined,
    }));
});
exports.default = { getMetrics };
