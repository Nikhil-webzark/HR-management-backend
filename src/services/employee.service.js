import userModel from "../models/User.js";
import AppError from "../utils/AppError.js";

export const getAllEmployeesService = async (query) => {
  const { search, status, isActive } = query;
  const filter = { role: "employee" };

  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { department: { $regex: search, $options: "i" } },
    ];
  }

  if (status) filter.status = status;

  // isActive comes as string from query params
  if (isActive !== undefined) filter.isActive = isActive === "true";

  const employees = await userModel.find(filter).select("-password");
  return employees;
};

export const createEmployeeService = async (data) => {
  const existingUser = await userModel.findOne({ email: data.email });
  if (existingUser) throw new AppError("Email already exists", 400);

  const employee = await userModel.create({ ...data, role: "employee" });
  const employeeData = employee.toObject();
  delete employeeData.password;
  return employeeData;
};

export const getEmployeeByIdService = async (id) => {
  const employee = await userModel.findById(id).select("-password");
  if (!employee) throw new AppError("Employee not found", 404);
  return employee;
};

export const updateEmployeeService = async (id, data) => {
  // Never allow role or password to be updated via this route
  delete data.role;
  delete data.password;

  const employee = await userModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!employee) throw new AppError("Employee not found", 404);
  return employee;
};

export const deleteEmployeeService = async (id) => {
  const employee = await userModel.findByIdAndDelete(id);
  if (!employee) throw new AppError("Employee not found", 404);
  return { message: "Employee deleted successfully" };
};

export const toggleAccountStatusService = async (id) => {
  const employee = await userModel.findById(id);
  if (!employee) throw new AppError("Employee not found", 404);

  employee.isActive = !employee.isActive;
  await employee.save({ validateBeforeSave: false });

  return employee;
};

export const resetPasswordService = async (id, password) => {
  const employee = await userModel.findById(id).select("+password");
  if (!employee) throw new AppError("Employee not found", 404);

  // Assigning triggers the pre-save hook for hashing
  employee.password = password;
  await employee.save();

  return { message: "Password reset successfully" };
};