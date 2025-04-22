import { Request, Response, NextFunction } from "express";
import asyncHandler from "../../middleware/asyncHandler";
import SuccessResponse from "../../utils/SuccessResponse";
import metricsService from "./metricsService";

const getMetrics = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const metrics = await metricsService.getMetrics();

    return res.status(200).json(
        new SuccessResponse(200, "Success", metrics)
    );
});

export default { getMetrics }