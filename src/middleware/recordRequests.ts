import { Request, Response, NextFunction } from "express";
import metrics from "../utils/Metrics";

const recordNoOfRequests = async (req: Request, res: Response, next: NextFunction) => {
    await metrics.increaseMetric("httpRequestsTotal");
    
    next();
}

export default recordNoOfRequests;