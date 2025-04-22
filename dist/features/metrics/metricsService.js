"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Metrics_1 = __importDefault(require("../../utils/Metrics"));
const getMetrics = async function () {
    return Metrics_1.default.getMetrics();
};
exports.default = { getMetrics };
