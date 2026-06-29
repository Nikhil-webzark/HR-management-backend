import { getAdminDashboardStatsService } from "../services/admin.service.js";
import { successResponse } from "../utils/responseFormatter.js";

export const getAdminDashboardStats = async (req, res, next) => {
  try {
    const stats = await getAdminDashboardStatsService();
    return successResponse(res, "Dashboard stats fetched successfully", stats);
  } catch (error) {
    next(error);
  }
};