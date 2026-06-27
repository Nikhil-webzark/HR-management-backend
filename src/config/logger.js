import winston from "winston";
import fs from "fs";

// Ensure logs directory exists
if (!fs.existsSync("logs")) {
  fs.mkdirSync("logs");
}

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }), // log full stack trace on errors
  printf(({ timestamp, level, message, stack }) =>
    stack
      ? `${timestamp} [${level.toUpperCase()}] ${message}\n${stack}`
      : `${timestamp} [${level.toUpperCase()}] ${message}`
  )
);

const transports = [
  new winston.transports.File({ filename: "logs/app.log" }),
  new winston.transports.File({ filename: "logs/error.log", level: "error" }),
];

// Console only in development
if (process.env.NODE_ENV !== "production") {
  transports.push(
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    })
  );
}

const logger = winston.createLogger({
  levels: winston.config.npm.levels, // includes http level
  level: process.env.NODE_ENV === "production" ? "warn" : "http",
  format: logFormat,
  transports,
});

export default logger;