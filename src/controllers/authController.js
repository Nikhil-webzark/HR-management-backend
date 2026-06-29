import { loginService } from "../services/authService.js";
import generateToken from "../utils/generateToken.js";
import { successResponse } from "../utils/responseFormatter.js";

export const login = async (req,res,next)=>{
    const {email,password} = req.body;
    try {
        const user = await loginService(email,password);
        delete user.password;
        if(user) {
            generateToken(res,user);
            return successResponse(res,"Login successfull",user)
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