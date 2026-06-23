# Ts

> Reference monorepo: Bun + TypeScript service wired to HashiCorp Vault via Terraform-provisioned KV v2.

## Overview

Reference implementation of a secrets-driven TypeScript backend. The `RefernceServices/Server` app bootstraps by pulling runtime config from Vault. The `IaS/Vault` Terraform module provisions the KV v2 engine (`app-secret` mount) consumed by the server. `docker-compose.yml` runs Vault in dev mode.

## Tech Stack

| Layer | Tech |
|-------|------|
| Runtime | Bun |
| Language | TypeScript 5 |
| Logger | Winston |
| Secrets | node-vault |
| Config | dotenv |
| IaC | Terraform (`hashicorp/vault` ~> 4.0) |
| Orchestration | Docker Compose |

## Project Structure

```
.
├── IaS/
│   └── Vault/
│       └── main.tf        → provisions KV v2 engine
├── RefernceServices/
│   └── Server/
│       ├── src/
│       │   ├── server.ts           → entrypoint
│       │   ├── config/vault.ts     → loadSecrets()
│       │   └── utils/logger.ts     → winston wrapper
│       ├── package.json
│       └── tsconfig.json
├── docker-compose.yml     → Vault dev container
└── .gitignore
```

## Getting Started

```bash
# 1. Start Vault
docker compose up -d

# 2. Provision KV engine
cd IaS/Vault && terraform init && terraform apply

# 3. Run server
cd ../../RefernceServices/Server
bun install
bun run dev
```

## API

No HTTP API endpoints exposed. Service is a CLI bootstrap.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (loaded from Vault) | ✓ |
| `DATABASE_URL` | DB connection string (loaded from Vault) | ✓ |
| `VAULT_ADDR` | Vault endpoint URL | ✓ |
| `VAULT_TOKEN` | Vault auth token | ✓ |
| `VAULT_PATH` | Secret path override (default `app-secret/data/config`) | ✗ |
| `LOG_LEVEL` | Winston level (default `info`) | ✗ |