# utils

Winston-based logger wrapper. Adds caller location (`file:line`) via stack parsing, colorized console output, and rotating file transports under `Temp/logs/`.

---

## .ts

### `log`

Structured logger with `info`, `error`, `warn`, `debug` methods. Each call injects caller location metadata automatically.

**Methods**

| Method | Signature | Description |
|--------|-----------|-------------|
| `info` | `(message: string, meta?: object) => void` | Info-level log |
| `error` | `(message: string, meta?: object) => void` | Error-level log |
| `warn` | `(message: string, meta?: object) => void` | Warning-level log |
| `debug` | `(message: string, meta?: object) => void` | Debug-level log |

**Example**
```ts
log.info("Vault client created", { endpoint: "http://localhost:8200" });
log.error("Failed to load secrets from vault", { err });
```

### `default`

Underlying `winston.Logger` instance. Use when direct `winston` API access is needed (e.g. custom transports).

**Example**
```ts
import logger from "../utils/logger";
logger.add(new winston.transports.Console());
```

---