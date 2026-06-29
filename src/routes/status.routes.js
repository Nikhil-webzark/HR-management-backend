import { Router } from "express";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";
import {
  getAllStatus,
  updateMyStatus,
  toggleTemporaryAvailability,
} from "../controllers/status.controller.js";

const statusRouter = Router();

// All authenticated users can see the status board
statusRouter.get("/", protect, getAllStatus);

// Only employees can update their own status
statusRouter.patch("/me", protect, restrictTo("employee"), updateMyStatus);
statusRouter.patch("/me/toggle", protect, restrictTo("employee"), toggleTemporaryAvailability);

export default statusRouter;