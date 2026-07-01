import { loginService } from "../services/authService.js";
import generateToken from "../utils/generateToken.js";
import { successResponse } from "../utils/responseFormatter.js";

export const login = async (req,res,next)=>{
    const {email,password} = req.body;
    try {
        const user = await loginService(email,password);
        const userData = user.toObject ? user.toObject() : JSON.parse(JSON.stringify(user));
        delete userData.password;
        
        // Ensure role is included
        if(!userData.role) {
            userData.role = user.role;
        }
        
        if(userData) {
            generateToken(res,userData);
            return successResponse(res,"Login successfull",userData)
        }
    } catch (error) {
        next(error);
    }
    
}
export const logout = (req,res)=>{
    res.clearCookie("token");
    return successResponse(res,"Logged out successfully");
}

export const getMe = async(req,res)=>{
    return successResponse(res, "User fetched successfully", req.user);
}