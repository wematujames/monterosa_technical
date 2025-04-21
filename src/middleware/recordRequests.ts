import { Request, Response, NextFunction } from "express";
import metrics from "../data/metrics";

const recordNoOfRequests = (req: Request, res: Response, next: NextFunction) => {
    metrics.http_requests_total++;
    next();
}

export default recordNoOfRequests;