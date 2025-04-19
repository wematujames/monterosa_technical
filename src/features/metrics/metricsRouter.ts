import { Router } from "express";
import metricController from "./metricsController";

const router = Router();

router.get("/", metricController.getMetrics)

export default router; 