"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Metrics_1 = __importDefault(require("../utils/Metrics"));
const recordNoOfRequests = async (req, res, next) => {
    await Metrics_1.default.increaseMetric("httpRequestsTotal");
    next();
};
exports.default = recordNoOfRequests;
