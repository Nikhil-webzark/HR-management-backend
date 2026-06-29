import {
  submitEODService,
  getEODTimelineService,
  getEODStatsService,
} from "../services/eod.service.js";
import { successResponse } from "../utils/responseFormatter.js";

export const submitEOD = async (req, res, next) => {
  try {
    const { message } = req.body;
    const eod = await submitEODService(
      req.user._id,
      req.user.fullName,
      message
    );
    return successResponse(res, "EOD submitted successfully", eod, 201);
  } catch (error) {
    next(error);
  }
};

export const getEODTimeline = async (req, res, next) => {
  try {
    const eods = await getEODTimelineService();
    return successResponse(res, "EOD timeline fetched successfully", eods);
  } catch (error) {
    next(error);
  }
};

export const getEODStats = async (req, res, next) => {
  try {
    const stats = await getEODStatsService();
    return successResponse(res, "EOD stats fetched successfully", stats);
  } catch (error) {
    next(error);
  }
};