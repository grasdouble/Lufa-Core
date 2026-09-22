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
- **Rate limiting** — built-in IP-based rate limiting with automatic expiration
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

# Build both ESM and CommonJS entry points
pnpm build

# Build ESM only
pnpm build:esm

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

# Build and run regression + HTTP startup tests
pnpm test
```

## Configuration

All configuration is done via environment variables. Create a `.env` file at the package root:

| Variable          | Required | Default                | Description                                                                        |
| ----------------- | -------- | ---------------------- | ---------------------------------------------------------------------------------- |
| `GITHUB_TOKEN`    | ✅       | —                      | GitHub PAT with `read:packages` scope                                              |
| `PORT`            | ❌       | `3000`                 | HTTP port the server listens on                                                    |
| `TRUSTED_PROXIES` | ❌       | unset                  | Comma-separated trusted proxy IPs/CIDRs; forwarding headers are ignored by default |
| `CDN_DIR`         | ❌       | `<os.tmpdir()>/cdn-v2` | Directory where cached packages are stored                                         |

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

### Cache and migration

Downloads use unique staging directories on the same filesystem as the cache. Concurrent requests in one process share a download; completed packages are published with an atomic rename and a completion marker. A failed request only cleans up its own staging directory. Separate server processes may download the same package, but do not remove another process's completed cache.

The default cache directory is now `<os.tmpdir()>/cdn-v2`. If you set `CDN_DIR`, use a fresh directory during migration: pre-existing package caches without a completion marker return 503 and must be removed by an administrator before retrying. `TMP_DIR` is no longer used, so staging and publication remain on the same filesystem. Cache storage must be writable only by the server administrator/service account.

The public `/unblock-ip` endpoint has been removed. Rate limits expire automatically after ten minutes. Configure `TRUSTED_PROXIES` only with the actual upstream proxy IPs or CIDRs; those proxies must overwrite forwarding headers from clients. Do not use a catch-all network.

The server supports root string exports, nested browser/import/default conditions, arrays and wildcard subpaths. Unknown or blocked exports return 404 rather than falling back to the root entry. Entries resolving outside the package, including symlinks, are forbidden. Packages from npm must declare `type: module`; built packages from the configured GitHub scope retain their existing behavior.

The build bundles runtime dependencies into both entry points. For a deployment without `node_modules`, copy `dist/index.cjs` to the Passenger application root as `index.cjs` and configure the required environment variables there. Tests copy each bundle to an isolated directory and launch it on a temporary local port without fetching registry packages.

The build scripts use esbuild's JavaScript API through `build.mjs` to avoid CLI launcher issues with native executables in CI. `pnpm build:esm` and `pnpm build:cjs` remain available for individual formats.

## Security

- **CORS allowlist** — only origins declared in `security.ts` are allowed. Requests without an `Origin` header are permitted (asset fetches).
- **Rate limiting** — excessive requests result in a temporary IP block.
- **Input sanitization** — scope, name, version, and export path segments are sanitized with strict regex patterns before any file-system or registry operation.
