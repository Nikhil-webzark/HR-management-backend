import EODModel from "../models/Eod.js";
import UserModel from "../models/User.js";
import AppError from "../utils/AppError.js";

const isWithinEODWindow = () => {
  const now = new Date();
  const hours = now.getHours();
  return hours >= 18 && hours < 21;
};

const getTodayRange = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return { today, tomorrow };
};

export const submitEODService = async (userId, employeeName, message) => {
  if (!isWithinEODWindow()) {
    throw new AppError(
      "EOD submission is available only between 6:00 PM and 9:00 PM",
      403
    );
  }

  if (!message || message.trim() === "") {
    throw new AppError("EOD message cannot be empty", 400);
  }

  const { today, tomorrow } = getTodayRange();

  const existingEOD = await EODModel.findOne({
    userId,
    createdAt: { $gte: today, $lt: tomorrow },
  });

  if (existingEOD) {
    throw new AppError("You have already submitted your EOD for today", 400);
  }

  const eod = await EODModel.create({ userId, employeeName, message: message.trim() });
  return eod;
};

export const getEODTimelineService = async () => {
  const eods = await EODModel.find()
    .sort({ createdAt: -1 })
    .populate("userId", "fullName email department");
  return eods;
};

export const getEODStatsService = async () => {
  const { today, tomorrow } = getTodayRange();

  const totalEmployees = await UserModel.countDocuments({
    role: "employee",
    isActive: true,
  });

  const submittedToday = await EODModel.countDocuments({
    createdAt: { $gte: today, $lt: tomorrow },
  });

  return {
    totalEmployees,
    submittedToday,
    pendingToday: totalEmployees - submittedToday,
  };
};