import { body } from "express-validator";

const loginValidator = [
  body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("should be a valid email"),
  body("password")
    .notEmpty().withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password should be minimum 8 characters"),
];

export default loginValidator;