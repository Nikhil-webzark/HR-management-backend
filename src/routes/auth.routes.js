import {Router} from "express"
import loginValidator from "../validators/auth.validator.js";
import { handleValidationErrors } from "../middlewares/validate.middleware.js";
import { getMe, login, logout } from "../controllers/authController.js";
import { protect } from "../middlewares/auth.middleware.js";

const authRoutes = Router();

authRoutes.post("/login",[...loginValidator,handleValidationErrors],login);
authRoutes.post("/logout",protect,logout);
authRoutes.get("/me",protect,getMe);

export default authRoutes;