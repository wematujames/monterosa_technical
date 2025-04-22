import { Request, Response, NextFunction } from "express";
import asyncHandler from "../../middleware/asyncHandler";
import SuccessResponse from "../../utils/SuccessResponse";
import webhookService from "./webhooksSerivce";

const queueItem = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await webhookService.sendItemToQueue(req.body);

    res.status(202).json(new SuccessResponse(
        202,
        "Queued succesfully"
    ));
}); 

export default { queueItem };