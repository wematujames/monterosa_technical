import { Router } from "express";
import webhooksRouter from "../features/webhooks/webhooksRouter";
import metricsRouter from "../features/metrics/metricsRouter";
import errorHandler from "../middleware/errorHandler";

const router = Router();

router.use("/webhook", webhooksRouter);
router.use("/metrics", metricsRouter);

// Catch http request errors
router.use(errorHandler);

export default router; 