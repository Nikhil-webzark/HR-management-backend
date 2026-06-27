import { validationResult } from "express-validator";
import { errorResponse } from "../utils/responseFormatter.js";

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return errorResponse(res, "Validation failed", 400, errors.array());
  }

  return next();
};