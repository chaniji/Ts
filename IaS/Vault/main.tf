# main.tf
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

resource "vault_mount" "kv" {
  path    = "app-secret"
  type    = "kv"
  options = { version = "2" }
}

resource "vault_kv_secret_v2" "app_secrets" {
  mount = vault_mount.kv.path
  name  = "config"

  data_json = jsonencode({
    DATABASE_URL       = var.database_url
    JWT_SECRET         = var.jwt_secret
    SENDGRID_API_KEY   = var.sendgrid_api_key
    EMAIL_FROM_ADDRESS = var.email_from_address
    EMAIL_FROM_NAME    = var.email_from_name
    APP_URL            = var.app_url
    FRONTEND_URL       = var.frontend_url
  })
}
