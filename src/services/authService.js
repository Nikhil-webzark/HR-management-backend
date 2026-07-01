import bcrypt from "bcryptjs";
import userModel from "../models/User.js";
import AppError from "../utils/AppError.js";

export const loginService = async (email,password)=>{
    const user = await userModel.findOne({email:email}).select("+password");
    if (!user) throw new AppError("Invalid credentials",401);
    if (!user.isActive) throw new AppError("Account is disabled, contact Admin",403);

    const verified = await bcrypt.compare(password,user.password);
    if(!verified) throw new AppError("Invalid credentials",401);
    return user;
}
