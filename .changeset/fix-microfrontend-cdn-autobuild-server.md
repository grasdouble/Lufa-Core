---
"@grasdouble/cdn_autobuild-server": patch
---

Security and reliability improvements to the CDN autobuild server.

- Replace `sanitize-filename` with per-field sanitizers (scope, name, version, exportPath) for tighter path-traversal protection
- Allow `localhost` origins in CORS (dev workflow) while keeping production whitelist
- Use `ipKeyGenerator` from `express-rate-limit` for correct IP extraction behind proxies
- Load `.env.development` over `.env` via `dotenvx` programmatic API (override mode)
- Improve error responses: structured JSON body + `console.error` with context for failed routes and missing entries
- Guard against missing `package.json` and missing resolved entry files before sending
- Support `scope === 'grasdouble'` (without `@`) in GitHub registry lookup
