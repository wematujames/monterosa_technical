import { Request, Response, NextFunction } from "express";
import asyncHandler from "../../middleware/asyncHandler";

const queueItem = asyncHandler((req: Request, res: Response, next: NextFunction) => {
    res.send("Hello world");
}); 

export default { queueItem }