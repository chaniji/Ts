terraform {
  required_providers {
    vault = {
      source  = "hashicorp/vault"
      version = "~> 4.0"
    }
  }
}

provider "vault" {
  address = "http://localhost:8200"
  token   = "dev-token"
}

# Enable KV v2 secret engine
resource "vault_mount" "kv" {
  path    = "app-secret"
  type    = "kv"
  options = { version = "2" }
}
