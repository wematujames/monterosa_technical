import { Router } from "express";
import webhooksRouter from "../features/webhooks/webhooksRouter";
import metricsRouter from "../features/metrics/metricsRouter";

const router = Router();

router.use("/webhook", webhooksRouter)
router.use("/metrics", metricsRouter)

export default router; 