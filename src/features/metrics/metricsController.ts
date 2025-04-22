import { Request, Response, NextFunction } from "express";
import asyncHandler from "../../middleware/asyncHandler";
import metrics from "../../utils/Metrics";
import SuccessResponse from "../../utils/SuccessResponse";

const getMetrics = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const metricsData = await metrics.getMetrics();

    return res.status(200).json(
        new SuccessResponse(200, "Success", metricsData)
    );
});

export default { getMetrics }