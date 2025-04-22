"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler_1 = __importDefault(require("../../middleware/asyncHandler"));
const itemsQueue_1 = require("../../queues/itemsQueue");
const SuccessResponse_1 = __importDefault(require("../../utils/SuccessResponse"));
const queueItem = (0, asyncHandler_1.default)(async (req, res, next) => {
    await (0, itemsQueue_1.dispatchToItemsQueue)(req.body);
    res.status(202).json(new SuccessResponse_1.default(202, "Queued succesfully"));
});
exports.default = { queueItem };
