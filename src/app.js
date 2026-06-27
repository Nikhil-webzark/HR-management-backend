import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import logger from "./config/logger.js";
import { globalErrorHandler } from "./middleware/error.middleware.js";

const app = express();

// Security headers
app.use(helmet());

// CORS — only allow your frontend origin
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true, // required for httpOnly cookies
}));

// HTTP request logging via morgan → piped into winston
app.use(morgan("dev", {
  stream: { write: (message) => logger.http(message.trim()) },
}));

// Body parsers
app.use(express.json());
app.use(cookieParser());

// Routes will be mounted here later
// app.use("/api/auth", authRoutes);
// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});
app.use(globalErrorHandler);

export default app;