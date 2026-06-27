import { errorResponse } from "../utils/responseFormatter.js";

export const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Something went wrong";
  return errorResponse(res, message, statusCode);
};