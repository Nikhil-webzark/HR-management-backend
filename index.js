import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import logger from "./src/config/logger.js";
import seedAdmin from "./src/config/seed.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await seedAdmin();
    app.listen(PORT, () => {
      logger.info(`Server running at port ${PORT}`);
    });
  } catch (error) {
    logger.error(`Error starting server: ${error.message}`);
    process.exit(1);
  }
};

startServer();