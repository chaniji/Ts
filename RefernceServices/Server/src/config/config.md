# config

Vault secret loader. Reads KV v2 secrets from `app-secret/data/config` (overridable via `VAULT_PATH`) using a `node-vault` client authenticated by `VAULT_TOKEN`. Exits process on failure.

---

## .ts

### `loadSecrets(): Promise<Record<string, string>>`

Reads secrets from Vault and returns the flattened `data.data` object.

**Parameters** — none.

**Returns** `Promise<Record<string, string>>` — key/value secret map.

**Throws** — exits process with code `1` on read failure.

**Example**
```ts
const env = await loadSecrets();
console.log(env.PORT);
```

---