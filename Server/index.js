const winston = require("winston");
const express = require("express");
const sequelize = require("./db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const certificate_router = require("./routes/certificate.routes");
const auth_router = require("./routes/auth.routes");
const institute_router = require("./routes/institute.routes");

// Create a logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf((info) => {
      const { timestamp, level, message } = info;
      const levelColor =
        level === "error"
          ? "\x1b[31m" // Red
          : level === "warn"
          ? "\x1b[33m" // Yellow
          : "\x1b[32m"; // Green
      const resetColor = "\x1b[0m"; // Reset color
      return `[${timestamp}] ${levelColor}${level.toUpperCase()}${resetColor}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs.log" }),
  ],
});

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use("/api", certificate_router);
app.use("/auth", auth_router);
app.use("/institute", institute_router);
app.use(cookieParser());

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    app.listen(PORT, () => {
      logger.info(`Server started on port ${PORT}`);
    });
  } catch (error) {
    logger.error(`Error starting server: ${error.message}`);
  }
};

start();
