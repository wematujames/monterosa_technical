import { Request, Response, NextFunction } from "express";
import asyncHandler from "../../middleware/asyncHandler";
import SuccessResponse from "../../utils/SuccessResponse";
import metrics from "../../data/metrics";

const getMetrics = asyncHandler((req: Request, res: Response, next: NextFunction) => {

    const avgJobDuration = metrics.processing_times.reduce(
        (c, n) => c + n, 0
    ) / 1000;

    return res.status(200).json(new SuccessResponse(
        200, 
        "Success", 
        {
            ...metrics, 
            avg_processing_time: parseFloat(avgJobDuration + "").toFixed(2) + "s", 
            processing_times: undefined,
        },
    ));
});

export default { getMetrics }