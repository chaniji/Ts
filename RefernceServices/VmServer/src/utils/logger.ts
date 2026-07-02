import winston from "winston";
import path from "path";

const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(
  ({ level, message, timestamp, file, line, ...meta }) => {
    const location = file ? `[${file}${line ? `:${line}` : ""}]` : "";
    const extra = Object.keys(meta).length ? JSON.stringify(meta) : "";
    return `${timestamp} ${level} ${location} ${message} ${extra}`.trim();
  },
);

const consoleFormat = combine(
  colorize({ all: true }),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  logFormat,
);

winston.addColors({
  error: "red bold",
  warn: "yellow bold",
  info: "green bold",
  debug: "blue bold",
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
  transports: [
    new winston.transports.Console({ format: consoleFormat }),
    new winston.transports.File({
      filename: path.join(process.cwd(), "Temp/logs/error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(process.cwd(), "Temp/logs/combined.log"),
    }),
  ],
});

const getLocation = () => {
  const stack = new Error().stack?.split("\n")[3] || "";
  const match =
    stack.match(/\((.+):(\d+):\d+\)/) || stack.match(/at (.+):(\d+):\d+/);
  return { file: match?.[1], line: match?.[2] };
};

export const log = {
  info: (message: string, meta?: object) =>
    logger.info(message, { ...getLocation(), ...meta }),
  error: (message: string, meta?: object) =>
    logger.error(message, { ...getLocation(), ...meta }),
  warn: (message: string, meta?: object) =>
    logger.warn(message, { ...getLocation(), ...meta }),
  debug: (message: string, meta?: object) =>
    logger.debug(message, { ...getLocation(), ...meta }),
};

export default logger;
