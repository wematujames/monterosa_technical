"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const itemsQueue_1 = require("../../queues/itemsQueue");
const sendItemToQueue = async function (item) {
    return await (0, itemsQueue_1.dispatchToItemsQueue)(item);
};
exports.default = { sendItemToQueue };
