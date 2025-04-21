import { Request, Response, NextFunction } from "express";
import asyncHandler from "../../middleware/asyncHandler";
import itemsQueue, { dispatchToItemsQueue } from "../../queues/itemsQueue";
import SuccessResponse from "../../utils/SuccessResponse";
import ErrorResponse from "../../utils/ErrorResponse";
import metrics from "../../data/metrics";

const queueItem = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (await itemsQueue.isFull()) {
        metrics.http_responses_429_total++;
        throw new ErrorResponse(
            429,
            "queueFull",
            "Queue is full.Cannot enqueue more tasks"
        );
    }

    await dispatchToItemsQueue(req.body);
    metrics.queue_current_length = await itemsQueue.getLength();

    res.status(202).json(new SuccessResponse(
        202,
        "Queued succesfully"
    ));
}); 

export default { queueItem };