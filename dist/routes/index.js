"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const webhooksRouter_1 = __importDefault(require("../features/webhooks/webhooksRouter"));
const metricsRouter_1 = __importDefault(require("../features/metrics/metricsRouter"));
const errorHandler_1 = __importDefault(require("../middleware/errorHandler"));
const recordRequests_1 = __importDefault(require("../middleware/recordRequests"));
const requestLogger_1 = __importDefault(require("../middleware/requestLogger"));
const router = (0, express_1.Router)();
// Log incomming request info
router.use(requestLogger_1.default);
router.use("/webhook", recordRequests_1.default, webhooksRouter_1.default);
router.use("/metrics", metricsRouter_1.default);
// Catch http request errors
router.use(errorHandler_1.default);
exports.default = router;
