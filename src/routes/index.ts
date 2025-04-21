import { Router } from "express";
import webhooksRouter from "../features/webhooks/webhooksRouter";
import metricsRouter from "../features/metrics/metricsRouter";
import errorHandler from "../middleware/errorHandler";
import recordRequests from "../middleware/recordRequests";

const router = Router();

router.use("/webhook", recordRequests, webhooksRouter);
router.use("/metrics", metricsRouter);

// Catch http request errors
router.use(errorHandler);

export default router; 