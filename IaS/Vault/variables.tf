# variables.tf
variable "database_url"       { sensitive = true }
variable "jwt_secret"         { sensitive = true }
variable "sendgrid_api_key"   { sensitive = true }
variable "email_from_address" {}
variable "email_from_name"    {}
variable "app_url"            {}
variable "frontend_url"       {}
