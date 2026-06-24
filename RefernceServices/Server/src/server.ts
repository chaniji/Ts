import { env } from "./config/env.js";
import { log } from "./utils/logger.js";

log.info("Server config", {
  port: env.port,
  nodeEnv: env.nodeEnv,
  corsOrigin: env.corsOrigin,
  appUrl: env.appUrl,
  emailFromAddress: env.emailFromAddress,
  emailFromName: env.emailFromName,
  sendGridApiKey: env.sendGridApiKey ? "***" : "NOT SET",
  jwtSecret: env.jwtSecret ? "***" : "NOT SET",
});
