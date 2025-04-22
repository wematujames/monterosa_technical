"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const itemsQueue_1 = __importDefault(require("./queues/itemsQueue"));
const Logger_1 = __importDefault(require("./utils/Logger"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(routes_1.default);
process.on("SIGINT", async () => {
    Logger_1.default.log({ type: "processExiting" });
    itemsQueue_1.default.shutdown = true;
    // check if all items processed 
    const checkQueue = setInterval(async () => {
        const queueEmpty = await itemsQueue_1.default.isQueueEmpty();
        if (queueEmpty) {
            clearInterval(checkQueue);
            process.exit(0);
        }
    }, 600);
});
app.listen(5555, () => console.log("Server running"));
