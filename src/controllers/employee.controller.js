import {
  getAllEmployeesService,
  createEmployeeService,
  getEmployeeByIdService,
  updateEmployeeService,
  deleteEmployeeService,
  toggleAccountStatusService,
  resetPasswordService,
} from "../services/employee.service.js";
import { successResponse, errorResponse } from "../utils/responseFormatter.js";

export const getAllEmployees = async (req, res, next) => {
  try {
    const employees = await getAllEmployeesService(req.query);
    return successResponse(res, "Employees fetched successfully", employees);
  } catch (error) {
    next(error);
  }
};

export const createEmployee = async (req, res, next) => {
  try {
    const employee = await createEmployeeService(req.body);
    return successResponse(res, "Employee created successfully", employee, 201);
  } catch (error) {
    next(error);
  }
};

export const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await getEmployeeByIdService(req.params.id);
    return successResponse(res, "Employee fetched successfully", employee);
  } catch (error) {
    next(error);
  }
};

export const updateEmployee = async (req, res, next) => {
  try {
    const employee = await updateEmployeeService(req.params.id, req.body);
    return successResponse(res, "Employee updated successfully", employee);
  } catch (error) {
    next(error);
  }
};

export const deleteEmployee = async (req, res, next) => {
  try {
    const result = await deleteEmployeeService(req.params.id);
    return successResponse(res, result.message);
  } catch (error) {
    next(error);
  }
};

export const toggleAccountStatus = async (req, res, next) => {
  try {
    const employee = await toggleAccountStatusService(req.params.id);
    const message = employee.isActive
      ? "Account activated successfully"
      : "Account deactivated successfully";
    return successResponse(res, message, employee);
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const result = await resetPasswordService(req.params.id, req.body.password);
    return successResponse(res, result.message);
  } catch (error) {
    next(error);
  }
};