import express from "express";
import router from "./routes";
import itemsQueue from "./queues/itemsQueue";
import logger from "./utils/Logger";

const app = express();

app.use(express.json());

app.use(router);

process.on("SIGINT", async () => {
    logger.log({ type: "processExiting" });

    itemsQueue.shutdown = true;

    // check if all items processed 
    const checkQueue = setInterval(async () => {
        const queueEmpty = await itemsQueue.isQueueEmpty();

        if (queueEmpty){
            clearInterval(checkQueue);
            process.exit(0);
        }
    }, 600);
});

app.listen(5555, () => console.log("Server running"));
