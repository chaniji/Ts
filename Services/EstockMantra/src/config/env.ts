import { loadSecrets } from "../utils/vault.js";
import { log } from "../utils/logger.js";
import { z } from "zod";

const secrets = await loadSecrets();

const envSchema = z.object({
  PORT: z.string().default("3001"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  CORS_ORIGIN: z.string().default("*"),
  SENDGRID_API_KEY: z.string().optional(),
  EMAIL_FROM_ADDRESS: z
    .string()
    .email()
    .default("inventory.emicrolabs@gmail.com"),
  EMAIL_FROM_NAME: z.string().default("E-Stock Mantra"),
  APP_URL: z.string().url().optional(),
  FRONTEND_URL: z.string().url().optional(),
});

const ParseResult = envSchema.safeParse(secrets);

if (ParseResult.success === false) {
  log.error("Invalid environment variables", {
    errors: ParseResult.error.format(),
  });
  process.exit(1);
}

log.info("Environment variables loaded", {
  port: ParseResult.data.PORT,
  env: ParseResult.data.NODE_ENV,
});

export const env = {
  port: ParseResult.data.PORT,
  nodeEnv: ParseResult.data.NODE_ENV,
  corsOrigin: ParseResult.data.CORS_ORIGIN,
  appUrl: (
    ParseResult.data.APP_URL ||
    ParseResult.data.FRONTEND_URL ||
    "http://localhost:5173"
  ).replace(/\/+$/, ""),
  sendGridApiKey: ParseResult.data.SENDGRID_API_KEY || "",
  emailFromAddress: ParseResult.data.EMAIL_FROM_ADDRESS,
  emailFromName: ParseResult.data.EMAIL_FROM_NAME,
  jwtSecret: ParseResult.data.JWT_SECRET,
};

log.debug("Env exported", { env: { ...env, jwtSecret: "***" } });
