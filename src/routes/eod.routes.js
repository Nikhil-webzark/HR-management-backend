import { Router } from "express";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";
import {
  submitEOD,
  getEODTimeline,
  getEODStats,
} from "../controllers/eod.controller.js";

const eodRouter = Router();

// All authenticated users can view EOD timeline
eodRouter.get("/", protect, getEODTimeline);

// Admin only — stats for dashboard
eodRouter.get("/stats", protect, restrictTo("admin"), getEODStats);

// Employee only — submit EOD
eodRouter.post("/", protect, restrictTo("employee"), submitEOD);

export default eodRouter;