import { Request, Response, NextFunction } from "express";
import asyncHandler from "../../middleware/asyncHandler";
import { dispatchToItemsQueue } from "../../queues/itemsQueue";
import SuccessResponse from "../../utils/SuccessResponse";

const queueItem = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await dispatchToItemsQueue(req.body);
    
    res.status(202).json(new SuccessResponse(
        202,
        "Queued succesfully"
    ));
}); 

export default { queueItem };