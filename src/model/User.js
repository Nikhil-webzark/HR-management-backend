// Users
// Name
// Email
// Password
// Role
// Status
// Temporary Availability
// department
// designation
// phoneNumber
// profilePicture
// isActive
import bcrypt from "bcryptjs"
import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase:true,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select:false
    },

    role: {
      type: String,
      required: true,
      enum: ["admin", "employee"],
      default: "employee",
    },

    status: {
      type: String,
      required: true,
      enum: ["available", "on-leave", "half-day-leave"],
      trim: true,
      default: "available",
    },
    temporaryAvailability: {
      type: Boolean,
      default: false,
    },
    department: {
      type: String,
      trim: true,
    },
    designation: {
      type: String,
      trim: true,
    },

    phoneNumber: {
      type: String,
      trim: true,
    },
    profilePicture: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    statusUpdatedAt:{
      type:Date,
      default:Date.now,
    }
  },
  { timestamps: true },
);
userSchema.pre("save",async function (next){
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password,10);
  next();
})
const userModel = model("User",userSchema);
export default userModel;