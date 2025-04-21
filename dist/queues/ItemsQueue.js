"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dispatchToItemsQueue = exports.default = void 0;
const Queue_1 = __importDefault(require("../utils/Queue"));
// Job processor 
const processJob = (job) => __awaiter(void 0, void 0, void 0, function* () {
    // throw new Error("Queue job process failed")
    console.log(job);
    yield Promise.resolve(job);
});
// Instantiate item queue
const itemsQueue = new Queue_1.default("items-queue", 2, processJob);
exports.default = itemsQueue;
// Queue new job wrapper
const dispatchToItemsQueue = (data) => __awaiter(void 0, void 0, void 0, function* () {
    yield itemsQueue.enqueue(data);
});
exports.dispatchToItemsQueue = dispatchToItemsQueue;
