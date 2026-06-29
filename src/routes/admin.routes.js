import { Router } from "express";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";
import { getAdminDashboardStats } from "../controllers/admin.controller.js";

const adminRouter = Router();

adminRouter.use(protect, restrictTo("admin"));

adminRouter.get("/dashboard", getAdminDashboardStats);

export default adminRouter;