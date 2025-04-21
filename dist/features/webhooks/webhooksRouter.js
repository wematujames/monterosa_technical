"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const webhooksController_1 = __importDefault(require("./webhooksController"));
const router = (0, express_1.Router)();
router.post("/", webhooksController_1.default.queueItem);
exports.default = router;
