# server-example

> Bun + TypeScript reference service. Loads runtime config from HashiCorp Vault.

## Overview

CLI bootstrap service. On startup, `loadSecrets()` pulls KV v2 secrets from Vault and logs the `PORT` and `DATABASE_URL` values. No HTTP server is exposed.

## Tech Stack

| Layer | Tech |
|-------|------|
| Runtime | Bun |
| Language | TypeScript |
| Logger | Winston |
| Secrets | node-vault |
| Config | dotenv |

## Project Structure

```
src/
  server.ts         → entrypoint (startServer)
  config/
    vault.ts        → loadSecrets()
    config.md
  utils/
    logger.ts       → log, default
    utils.md
```

## Getting Started

```bash
bun install
bun run dev
```

Ensure Vault is reachable (`VAULT_ADDR`, `VAULT_TOKEN` exported in `.env`).

## API

No HTTP endpoints. See root [API.md](../../API.md) if present.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (from Vault) | ✓ |
| `DATABASE_URL` | DB URL (from Vault) | ✓ |
| `VAULT_ADDR` | Vault endpoint | ✓ |
| `VAULT_TOKEN` | Vault auth token | ✓ |
| `VAULT_PATH` | Secret path override | ✗ |
| `LOG_LEVEL` | Winston log level | ✗ |

---

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.3.14. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.