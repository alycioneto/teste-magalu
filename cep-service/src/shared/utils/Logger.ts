import path from "path";

import winston from "winston";

const { NODE_ENV } = process.env;

const Logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, "../../error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(__dirname, "../../info.log"),
      level: "info",
    }),
  ],
});

if (NODE_ENV !== "production") {
  Logger.add(new winston.transports.Console());
}

export { Logger };
