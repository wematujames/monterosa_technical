import { Request, Response, NextFunction } from "express";
import asyncHandler from "../../middleware/asyncHandler";

const getMetrics = asyncHandler((req: Request, res: Response, next: NextFunction) => {
    res.send("Hello world");
}); 

export default { getMetrics }