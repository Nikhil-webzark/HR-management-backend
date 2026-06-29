import jwt from "jsonwebtoken";
import userModel from "../models/User.js";
import AppError from "../utils/AppError.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return next(new AppError("Not authorized, no token", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return next(new AppError("User no longer exists", 401));
    }

    if (!user.isActive) {
      return next(new AppError("Account is disabled, contact admin", 403));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new AppError("Not authorized, invalid token", 401));
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};