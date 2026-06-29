import userModel from "../models/User.js";
import AppError from "../utils/AppError.js";

export const getAllStatusService = async () => {
  const employees = await userModel
    .find({ role: "employee" })
    .select("fullName status temporaryAvailability statusUpdatedAt");
  return employees;
};

export const updateMyStatusService = async (id, status) => {
  const validStatuses = ["available", "on-leave", "half-day-leave"];
  if (!validStatuses.includes(status)) {
    throw new AppError("Invalid status value", 400);
  }

  const employee = await userModel.findByIdAndUpdate(
    id,
    { status, statusUpdatedAt: Date.now() },
    { new: true }
  ).select("-password");

  if (!employee) throw new AppError("Employee not found", 404);
  return employee;
};

export const toggleTemporaryAvailabilityService = async (id) => {
  const employee = await userModel.findById(id);
  if (!employee) throw new AppError("Employee not found", 404);

  employee.temporaryAvailability = !employee.temporaryAvailability;
  await employee.save({ validateBeforeSave: false });

  return employee;
};