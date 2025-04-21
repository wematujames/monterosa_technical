import { Request, Response, NextFunction } from "express";
import asyncHandler from "../../middleware/asyncHandler";
import itemsQueue, { dispatchToItemsQueue } from "../../queues/itemsQueue";

const queueItem = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const currJobsLength = await itemsQueue.getLenOfQueuedJobs();

    // Check no. of waiting and active jobs
    if (currJobsLength >= 5) {
        return res.status(429).json({
            message: "Too many requests. Please try again later"
        });
    }

    res.status(202).json({
        message: "Queued succesfully"
    });

    // Queue item
    await dispatchToItemsQueue(req.body);
}); 

export default { queueItem };