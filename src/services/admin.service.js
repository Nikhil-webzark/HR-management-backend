import UserModel from "../models/User.js";
import EODModel from "../models/EOD.js";

export const getAdminDashboardStatsService = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [
    totalEmployees,
    available,
    onLeave,
    halfDay,
    temporarilyUnavailable,
    submittedToday,
  ] = await Promise.all([
    UserModel.countDocuments({ role: "employee", isActive: true }),
    UserModel.countDocuments({ role: "employee", isActive: true, status: "available" }),
    UserModel.countDocuments({ role: "employee", isActive: true, status: "on-leave" }),
    UserModel.countDocuments({ role: "employee", isActive: true, status: "half-day-leave" }),
    UserModel.countDocuments({ role: "employee", isActive: true, temporaryAvailability: true }),
    EODModel.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } }),
  ]);

  return {
    totalEmployees,
    available,
    onLeave,
    halfDay,
    temporarilyUnavailable,
    submittedToday,
    pendingEOD: totalEmployees - submittedToday,
  };
};