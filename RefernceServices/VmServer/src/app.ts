import express from "express";
import { log } from "./utils/logger.js";
import helmet from "helmet";
import compression from "compression";

const app = express();
app.set("trust proxy", 1);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(helmet());
app.use(compression());
log.info("Express Configuration Completed");

app.get("/", (req, res) => {
  res.status(200).json({
    message: "API is running",
    version: "1.0.0",
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});
app.get("/test", (_, res) => {
  res.status(200).json({
    success: true,
    message: "Backend working",
    timestamp: new Date().toISOString(),
  });
});
log.info("Express Routes Initilized");

export default app;
