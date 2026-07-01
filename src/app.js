import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import logger from "./config/logger.js";
import { globalErrorHandler } from "./middlewares/error.middleware.js";
import authRouter from "./routes/auth.routes.js";
import employeeRouter from "./routes/employee.routes.js";
import statusRouter from "./routes/status.routes.js";
import eodRouter from "./routes/eod.routes.js";
import adminRouter from "./routes/admin.routes.js";

const app = express();

// Security headers
app.use(helmet());

// CORS - Allow multiple origins for development and production
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow if no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    
    // Allow localhost for development
    if (origin.includes("localhost")) {
      return callback(null, true);
    }
    
    // Allow any Vercel deployment
    if (origin.includes("vercel.app")) {
      return callback(null, true);
    }
    
    // Allow explicitly configured origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

// HTTP request logging via morgan → piped into winston
app.use(morgan("dev", {
  stream: { write: (message) => logger.http(message.trim()) },
}));

// Body parsers
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/employees", employeeRouter);
app.use("/api/status", statusRouter);
app.use("/api/eod", eodRouter);
app.use("/api/admin", adminRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler — must be last
app.use(globalErrorHandler);

export default app;