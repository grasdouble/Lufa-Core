---
"@grasdouble/lufa_config_agents": patch
---

fix: `lufa-agents-sync` failed silently and showed wrong version label

Two issues fixed in the bin script:

1. **Silent no-op via pnpm shims** — the guard condition `import.meta.url === resolve(process.argv[1])` always failed because Node resolves `import.meta.url` through symlinks (real path) while `process.argv[1]` keeps the shim path. Fixed using `realpathSync` on both sides.

2. **Version always showed "local"** — `PACKAGE_DIR.startsWith(process.cwd())` was always `true` because pnpm installs packages inside `node_modules/.pnpm/` which is under `process.cwd()`. Fixed using `!PACKAGE_DIR.includes('node_modules')`.
