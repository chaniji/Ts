# src

Root source directory for the reference server. Contains entrypoint and sub-modules for config and utilities.

---

## .ts

### `startServer(): Promise<void>`

Entry bootstrap. Loads secrets from Vault, then logs `PORT` and `DATABASE_URL`.

**Returns** `Promise<void>` — resolves after secret load completes.

**Example**
```ts
startServer();
```

---