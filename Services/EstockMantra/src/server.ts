import { env } from "./config/env.js";
import app from "./app.js";
import { log } from "./utils/logger.js";
const server = app.listen(env.port, () => {
  log.info(`Server running on port ${env.port} in ${env.nodeEnv} mode `);
});
