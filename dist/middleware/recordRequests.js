"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const metrics_1 = __importDefault(require("../data/metrics"));
const recordNoOfRequests = (req, res, next) => {
    metrics_1.default.http_requests_total++;
    next();
};
exports.default = recordNoOfRequests;
