import { config } from "dotenv";
import vault from "node-vault";
import { log } from "../utils/logger";

config({ path: ".env" });

const client = vault({
  token: process.env.VAULT_TOKEN,
});

log.info("Vault client created", { endpoint: process.env.VAULT_ADDR });
export async function loadSecrets(): Promise<Record<string, string>> {
  try {
    const result = await client.read(
      process.env.VAULT_PATH || "app-secret/data/config",
    );
    const secrets = result.data.data;
    log.info("Secrets loaded", { keys: Object.keys(secrets) });
    return secrets;
  } catch (err) {
    log.error("Failed to load secrets from vault", { err });
    process.exit(1);
  }
}
