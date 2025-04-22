import { Router } from "express";
import webhooksRouter from "../features/webhooks/webhooksRouter";
import metricsRouter from "../features/metrics/metricsRouter";
import errorHandler from "../middleware/errorHandler";
import recordRequests from "../middleware/recordRequests";
import requestLogger from "../middleware/requestLogger";

const router = Router();

// Log incomming request info
router.use(requestLogger);

router.use("/webhook", recordRequests, webhooksRouter);
router.use("/metrics", metricsRouter);

// Catch http request errors
router.use(errorHandler);

export default router;