import { errorResponse } from "../utils/responseFormatter.js";
import logger from "../config/logger.js";

export const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // Log non-operational (unexpected) errors
  if (!err.isOperational) {
    logger.error(`Unexpected error: ${err.message}\n${err.stack}`);
  }

  const message = err.isOperational ? err.message : "Something went wrong";
  return errorResponse(res, message, statusCode);
};