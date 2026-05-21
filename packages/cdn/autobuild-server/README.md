# @grasdouble/cdn_autobuild-server

> Self-fed CDN — fetches npm packages on demand and serves their built assets directly.

## Overview

`cdn_autobuild-server` is an Express-based HTTP server that acts as a CDN proxy for npm packages. Given a package name and version in the URL, it:

1. Downloads the package from the GitHub Package Registry via `pacote`
2. Caches the result locally on disk
3. Serves the requested export path directly to the client

This enables micro-frontends and shared libraries to be loaded at runtime without a dedicated build pipeline.

## Features

- **On-demand fetching** — packages are downloaded only when first requested
- **Disk caching** — subsequent requests are served instantly from the local cache
- **Scoped package support** — supports both `@scope/name` and plain `name` formats
- **Input sanitization** — all URL parameters are sanitized before use
- **CORS** — configurable allowlist for accepted origins
- **Rate limiting** — built-in IP-based rate limiting with an unblock endpoint
- **ESM + CJS** — ships both `dist/index.mjs` and `dist/index.cjs`

## Requirements

- Node.js >= 18
- A valid `GITHUB_TOKEN` environment variable with read access to the GitHub Package Registry

## Installation

```bash
pnpm add @grasdouble/cdn_autobuild-server
```

## Scripts

Run from the package directory:

```bash
# Development (hot-reload via nodemon + tsx)
pnpm dev

# Build ESM bundle
pnpm build

# Build CJS bundle
pnpm build:cjs

# Production preview (uses .env.production)
pnpm preview

# Lint
pnpm lint

# Format (check / write)
pnpm prettier:check
pnpm prettier:write

# Type check
pnpm typecheck
```

## Configuration

All configuration is done via environment variables. Create a `.env` file at the package root:

| Variable       | Required | Default                 | Description                                |
| -------------- | -------- | ----------------------- | ------------------------------------------ |
| `GITHUB_TOKEN` | ✅       | —                       | GitHub PAT with `read:packages` scope      |
| `PORT`         | ❌       | `3000`                  | HTTP port the server listens on            |
| `TMP_DIR`      | ❌       | `<os.tmpdir()>/tmp_cdn` | Directory used while downloading packages  |
| `CDN_DIR`      | ❌       | `<os.tmpdir()>/cdn`     | Directory where cached packages are stored |

## API

### Serve a package export

```
GET /{:scope}/:name@:version{/:exportPath}
```

| Segment       | Required | Example                         |
| ------------- | -------- | ------------------------------- |
| `:scope`      | ❌       | `grasdouble` or `@grasdouble`   |
| `:name`       | ✅       | `lufa_config_eslint`            |
| `:version`    | ✅       | `0.1.8`                         |
| `:exportPath` | ❌       | `react` → resolves to `./react` |

**Examples:**

```
GET /grasdouble/lufa_config_eslint@0.1.8
GET /grasdouble/lufa_config_eslint@0.1.8/react
```

### Unblock your IP

```
GET /unblock-ip
```

Removes the caller's IP from the rate-limit blocklist and resets their counter.

## Security

- **CORS allowlist** — only origins declared in `security.ts` are allowed. Requests without an `Origin` header are permitted (asset fetches).
- **Rate limiting** — excessive requests result in a temporary IP block.
- **Input sanitization** — scope, name, version, and export path segments are sanitized with strict regex patterns before any file-system or registry operation.
