const { createLogger, format, transports } = require("winston");
require("winston-daily-rotate-file");
const env = require("./env");
const path = require("path");

const logDir = env.LOG_DIR || "logs"; // directory path for logs

// Ensure log directory exists
const fs = require("fs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Create the log format
const logFormat = format.combine(
  format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  format.errors({ stack: true }), // log the error stack if available
  format.splat(),
  format.json()
);

// Create a Winston logger instance
const logger = createLogger({
  format: logFormat,
  transports: [
    // Console transport
    new transports.Console({
      level: "error",
      format: format.combine(
        format.colorize(),
        format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
      ),
    }),
    // Daily Rotate File transport for `error` level
    new transports.DailyRotateFile({
      filename: path.join(logDir, "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      level: "error",
      maxSize: "20m",
      maxFiles: "14d",
    }),
    // Daily Rotate File transport for all levels
    new transports.DailyRotateFile({
      filename: path.join(logDir, "combined-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: path.join(logDir, "exceptions.log") }),
  ],
});

// Export the logger to use in other files
module.exports = logger;
