"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const metricsController_1 = __importDefault(require("./metricsController"));
const router = (0, express_1.Router)();
router.get("/", metricsController_1.default.getMetrics);
exports.default = router;
