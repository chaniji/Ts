import { loadSecrets } from "./config/vault";

async function startServer() {
  const env = await loadSecrets();
  console.log(env.PORT);
  console.log(env.DATABASE_URL);
}

startServer();
