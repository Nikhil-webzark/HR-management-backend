import {
  getAllStatusService,
  updateMyStatusService,
  toggleTemporaryAvailabilityService,
} from "../services/status.service.js";
import { successResponse } from "../utils/responseFormatter.js";

export const getAllStatus = async (req, res, next) => {
  try {
    const statuses = await getAllStatusService();
    return successResponse(res, "Status board fetched successfully", statuses);
  } catch (error) {
    next(error);
  }
};

export const updateMyStatus = async (req, res, next) => {
  try {
    const employee = await updateMyStatusService(req.user._id, req.body.status);
    return successResponse(res, "Status updated successfully", employee);
  } catch (error) {
    next(error);
  }
};

export const toggleTemporaryAvailability = async (req, res, next) => {
  try {
    const employee = await toggleTemporaryAvailabilityService(req.user._id);
    const message = employee.temporaryAvailability
      ? "You are now temporarily unavailable"
      : "You are now available again";
    return successResponse(res, message, employee);
  } catch (error) {
    next(error);
  }
};