"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dispatchToItemsQueue = exports.default = void 0;
const Queue_1 = __importDefault(require("../utils/Queue"));
// Job processor 
const processJob = async (job) => {
    throw new Error("not processed");
    await Promise.resolve(job);
};
// Instantiate item queue
const itemsQueue = new Queue_1.default("items-queue", 2, processJob);
exports.default = itemsQueue;
// Queue new job wrapper
const dispatchToItemsQueue = async (data) => {
    return await itemsQueue.enqueue(data);
};
exports.dispatchToItemsQueue = dispatchToItemsQueue;
