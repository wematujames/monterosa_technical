import { Router } from "express";
import webhooksController from "./webhooksController";
const router = Router();

router.post("/", webhooksController.queueItem)

export default router; 