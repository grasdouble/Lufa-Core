# @grasdouble/cdn_autobuild-server

## 0.3.11

### Patch Changes

- 8fb61e9: chore: bump dependencies (@dotenvx/dotenvx, @types/node, tsx, typescript-eslint, lint-staged)

## 0.3.10

### Patch Changes

- cdddab9: Security and reliability improvements to the CDN autobuild server.
  - Replace `sanitize-filename` with per-field sanitizers (scope, name, version, exportPath) for tighter path-traversal protection
  - Allow `localhost` origins in CORS (dev workflow) while keeping production whitelist
  - Use `ipKeyGenerator` from `express-rate-limit` for correct IP extraction behind proxies
  - Load `.env.development` over `.env` via `dotenvx` programmatic API (override mode)
  - Improve error responses: structured JSON body + `console.error` with context for failed routes and missing entries
  - Guard against missing `package.json` and missing resolved entry files before sending
  - Support `scope === 'grasdouble'` (without `@`) in GitHub registry lookup

## 0.3.9

### Patch Changes

- a864f44: fix: add missing field repository in package.json

## 0.3.8

### Patch Changes

- 7c889d3: Upgrade deps
- 5192d9e: fix: upgrade deps
- 50d07a6: fix: upgrade deps
- e9b1f1f: Update deps

## 0.3.7

### Patch Changes

- d90bfed: chore: update dependencies

## 0.3.6

### Patch Changes

- 9f95f14: Update Dependency

## 0.3.5

### Patch Changes

- 3d8eea0: Add `.prettierignore` to exclude `dist/` from Prettier formatting

## 0.3.4

### Patch Changes

- 03e75af: Fix tokens and their usage

## 0.3.3

### Patch Changes

- 07b892b: Add typecheck scripts and align docs/test fixtures after stricter TypeScript checks.

## 0.3.2

### Patch Changes

- 6c972e8: fix: prettier config
- 2d37fc0: Update dependencies
- 4d0893b: Update scripts and README files
- 412c362: fix(chore): add missing prettier and eslint config + add a script prettier in package.json
- b101244: fix(chore): eslint config + fix new issues

## 0.3.1

### Patch Changes

- dceff77: Upgrade deps

## 0.3.0

### Minor Changes

- 720e56d: Increase security adding domain whitelist and updating ratelimit

### Patch Changes

- a3d7a75: Adapt rate limit to distinguish client ip

## 0.2.0

### Minor Changes

- d4b3d7e: Put a limitation (accept only library in ESM), migrate to typescript, manage libraries with multiple entries

## 0.1.0

### Minor Changes

- 71b55cd: Initialize cdn autobuild server
