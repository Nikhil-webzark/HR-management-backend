import userModel from "../models/User.js";
import logger from "./logger.js";

const seedAdmin = async () => {
  try {
    const existingAdmin = await userModel.findOne({ role: "admin" });

    if (existingAdmin) {
      logger.info("Admin already exists, skipping seed");
      return;
    }

    await userModel.create({
      fullName: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: "admin",
    });

    logger.info("Admin seeded successfully");
  } catch (error) {
    logger.error(`Error seeding admin: ${error.message}`);
  }
};

export default seedAdmin;