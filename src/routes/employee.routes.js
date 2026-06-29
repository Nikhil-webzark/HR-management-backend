import { Router } from "express";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";
import { handleValidationErrors } from "../middlewares/validate.middleware.js";
import {
  createEmployeeValidator,
  updateEmployeeValidator,
  resetPasswordValidator,
} from "../validators/employee.validator.js";
import {
  getAllEmployees,
  createEmployee,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  toggleAccountStatus,
  resetPassword,
} from "../controllers/employee.controller.js";

const employeeRouter = Router();

// All employee routes are admin only
employeeRouter.use(protect, restrictTo("admin"));

employeeRouter.get("/", getAllEmployees);
employeeRouter.post("/", [...createEmployeeValidator, handleValidationErrors], createEmployee);
employeeRouter.get("/:id", getEmployeeById);
employeeRouter.put("/:id", [...updateEmployeeValidator, handleValidationErrors], updateEmployee);
employeeRouter.delete("/:id", deleteEmployee);
employeeRouter.patch("/:id/toggle-status", toggleAccountStatus);
employeeRouter.patch(
  "/:id/reset-password",
  [...resetPasswordValidator, handleValidationErrors],
  resetPassword
);

export default employeeRouter;