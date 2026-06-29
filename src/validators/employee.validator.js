import { body } from "express-validator";

export const createEmployeeValidator = [
  body("fullName")
    .notEmpty().withMessage("Full name is required")
    .isString().withMessage("Full name must be a string"),

  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email"),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),

  body("phone")
    .optional()
    .isMobilePhone().withMessage("Please provide a valid phone number"),

  body("department")
    .optional()
    .notEmpty().withMessage("Department cannot be empty"),

  body("designation")
    .optional()
    .notEmpty().withMessage("Designation cannot be empty"),
];

export const updateEmployeeValidator = [
  body("fullName")
    .optional()
    .notEmpty().withMessage("Full name cannot be empty")
    .isString().withMessage("Full name must be a string"),

  body("email")
    .optional()
    .isEmail().withMessage("Please provide a valid email"),

  body("phone")
    .optional()
    .isMobilePhone().withMessage("Please provide a valid phone number"),

  body("department")
    .optional()
    .notEmpty().withMessage("Department cannot be empty"),

  body("designation")
    .optional()
    .notEmpty().withMessage("Designation cannot be empty"),
];

export const resetPasswordValidator = [
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
];