# Terraform Vault Setup

## Prerequisites
- Docker + Docker Compose
- Terraform installed
- Vault running locally

---

## Project Structure
```
terraform-vault/
├── main.tf
├── variables.tf
├── outputs.tf
├── terraform.tfvars
└── .gitignore
```

---

## Quick Start

### Step 1 — Start Vault
```bash
docker compose up -d
```

### Step 2 — Unseal Vault (prod mode only)
```bash
docker exec -it vault vault operator unseal <key1>
docker exec -it vault vault operator unseal <key2>
docker exec -it vault vault operator unseal <key3>
```

### Step 3 — Init Terraform
```bash
terraform init
```

### Step 4 — Preview Changes
```bash
terraform plan
```

### Step 5 — Apply
```bash
terraform apply
```

### Step 6 — Destroy
```bash
terraform destroy
```

---

## Vault UI
```
URL   → http://localhost:8200
token → dev-token (dev mode)
token → root token from init (prod mode)
```

---

## Secret Path
```
secret/config → all app secrets
```

## Secrets Stored
| Key | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | JWT signing key |
| `SESSION_SECRET` | Express session secret |
| `PORT` | App port |

---

## Important — Never Commit
```
.env
terraform.tfvars   ← has vault token + secrets
.terraform/
terraform.tfstate  ← has secret values
```

---

## Every Restart (prod mode)
```bash
docker compose up -d
terraform apply
```

---

## Unseal Keys Storage
Store unseal keys in a safe place:
- Password manager (1Password, Bitwarden)
- Encrypted file
- Never in git ❌
