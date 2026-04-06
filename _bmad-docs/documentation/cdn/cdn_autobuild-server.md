---
package: '@grasdouble/cdn_autobuild-server'
shortName: cdn_autobuild-server
category: cdn
version: '0.3.4'
private: false
lastUpdated: '2026-02-24'
generatedAtCommit: 'd27c912328f538971b6720513be2c817c2feff15'
---

# @grasdouble/cdn_autobuild-server

## Overview

`@grasdouble/cdn_autobuild-server` is a self-fed CDN HTTP server that fetches, caches, and serves npm/GitHub package assets on demand. When a package file is requested via URL, the server transparently pulls the package from the appropriate registry (npm or GitHub Packages), extracts it to a local cache directory, resolves the correct entry point, and streams the file to the client. Subsequent requests for the same package version are served directly from the local cache without re-fetching.

The server enforces a strict **ESM-only** policy: CommonJS packages (those lacking `"type": "module"` in their `package.json`) are rejected with HTTP 415. Only `@grasdouble`-scoped packages are loaded from the private GitHub Package Registry; all other packages are fetched from the public npm registry.

## Purpose

- Provides a single HTTP endpoint that acts as a CDN for microfrontend bundles and shared npm libraries.
- Eliminates the need for a pre-populated asset store by building/fetching assets lazily on first access.
- Supports versioned asset URLs so that consumers can pin exact dependency versions.
- Integrates seamlessly with browser-native import maps or `<script type="module">` loading patterns.

## Architecture

```
Request: GET /:scope/:name@:version/:exportPath
              │
              ▼
  ┌─────────────────────┐
  │  Security layer      │
  │  ─ IP block check   │
  │  ─ Rate limiter      │
  │  ─ CORS validation   │
  └────────┬────────────┘
           │
           ▼
  ┌─────────────────────┐
  │  extractParams()     │  Sanitize & resolve paths
  └────────┬────────────┘
           │
           ▼
  ┌─────────────────────────────────────────────┐
  │  Cache check                                 │
  │  CDN_DIR/<scope>/<name>@<version>/           │
  │  ─ HIT  → skip to sendEntry()               │
  │  ─ MISS → loadLibrary()                     │
  └────────┬────────────────────────────────────┘
           │
     ┌─────┴──────┐
     │            │
     ▼            ▼
  @grasdouble   other
  scope         scope
  GitHub Pkg    npm registry
  Registry      (public)
     │            │
     └─────┬──────┘
           │
           ▼
  ┌─────────────────────┐
  │  ESM check          │  Reject non-ESM (415)
  └────────┬────────────┘
           │
           ▼
  ┌─────────────────────┐
  │  sendEntry()        │  Resolve entry from
  │                     │  exports / module / main
  └────────┬────────────┘
           │
           ▼
  res.sendFile(outputFile)
```

**Directory structure at runtime:**

| Variable  | Default           | Purpose                                       |
| --------- | ----------------- | --------------------------------------------- |
| `TMP_DIR` | `$TMPDIR/tmp_cdn` | Temporary extraction dir for non-@grasdouble  |
| `CDN_DIR` | `$TMPDIR/cdn`     | Permanent cache dir; all packages served here |

## Key Components

### `src/index.ts` — Express Application Entry Point

Bootstraps the Express server, wires all middleware, and defines the single catch-all route.

**Startup sequence:**

1. Load environment variables via `@dotenvx/dotenvx`.
2. Assert `GITHUB_TOKEN` is present (hard exit if missing).
3. Initialize `blockedIPs` set and rate limiter.
4. Apply middleware stack: IP block → rate limit → CORS.
5. Register `GET /unblock-ip` management route.
6. Register main asset route `GET /{/:urlScope}/:urlName@:urlVersion{/:urlExportPath}`.
7. Start HTTP listener.

**Main route logic (`index.ts:65-158`):**

1. Call `extractParams()` to sanitize URL segments and build filesystem paths.
2. Validate `cdnPkgPath` stays inside `CDN_DIR` (path traversal guard).
3. If package not in CDN cache → call `loadLibrary()`.
4. If scope is not `@grasdouble`, verify ESM format before copying to CDN.
5. Call `sendEntry()` to resolve the correct file path.
6. Stream file via `res.sendFile()`. Includes a 500 ms retry timeout for files that may not yet be flushed to disk.

### `src/security.ts` — Security Middleware

| Export                   | Type                 | Description                                                                                    |
| ------------------------ | -------------------- | ---------------------------------------------------------------------------------------------- |
| `whitelist`              | `string[]`           | Domain allowlist for CORS: `sebastien-lemouillour.fr` (www and non-www)                        |
| `CorsError`              | `class`              | Custom `Error` subclass used to signal CORS rejection with HTTP 403                            |
| `corsOptions`            | `CorsOptions`        | Strict origin check; denies requests with no `Origin` header                                   |
| `ipBlockMiddleware`      | `Middleware factory` | Rejects requests from IPs in the `blockedIPs` set with HTTP 403                                |
| `getRateLimiter`         | `Function`           | Creates an `express-rate-limit` instance (1000 req / 10 min window); auto-blocks exceeding IPs |
| `unblockIPsAfterTimeout` | `Function`           | Clears all blocked IPs every 15 minutes via `setInterval`                                      |

**Rate limit behaviour:** When a client exceeds 1000 requests in a 10-minute window, its IP is added to `blockedIPs`. All subsequent requests receive HTTP 429 immediately (bypassing the limiter itself). The IP is auto-cleared from the set after 15 minutes.

**CORS policy:** Only origins present in `whitelist` are allowed. Requests without an `Origin` header are explicitly denied (not silently passed through). Allowed methods: `GET`, `POST`, `PUT`, `DELETE`. Allowed headers: `Content-Type`, `Authorization`.

### `src/utils.ts` — Core Utilities

#### `extractParams(props: ExtractParamsProps): ExtractedParams`

Sanitizes all URL-sourced inputs using `sanitize-filename` and constructs the filesystem paths used throughout the request lifecycle.

| Input field     | URL segment    | Example          |
| --------------- | -------------- | ---------------- |
| `urlScope`      | `/:scope`      | `@grasdouble`    |
| `urlName`       | `/:name`       | `ui_button`      |
| `urlVersion`    | `@:version`    | `1.2.3`          |
| `urlExportPath` | `/:exportPath` | `dist/index.mjs` |

Returns `ExtractedParams`: `{ scope, exportPath, fullName, dirName, cdnPkgPath, tmpPkgPath }`.

#### `loadLibrary(props: LoadLibraryProps): Promise<LoadLibraryResult>`

Fetches and extracts a package from the appropriate registry using `pacote.extract()`.

- `scope === '@grasdouble'` → GitHub Package Registry (`https://npm.pkg.github.com`) with Bearer token auth; extracts directly to `cdnPkgPath`.
- Any other scope → npm public registry; extracts to `tmpPkgPath` (caller is responsible for moving to `cdnPkgPath` after ESM verification).
- On error, removes both `tmpPkgPath` and `cdnPkgPath` to avoid stale partial extractions.
- Returns `{ status: 200 | 403 | 500, message: string }`.

#### `sendEntry(props: SendEntryProps): Promise<{ status, outputFile? }>`

Reads `package.json` from the cached package and resolves the entry file path for the requested export path. Resolution priority:

1. `exports[exportPath].import`
2. `exports[exportPath].default`
3. `exports[exportPath]` (string shorthand)
4. `module`
5. `main`

Returns `{ status: 200, outputFile: string }` on success, or `{ status: 500, message: string }` if no valid entry is found.

### `src/types.ts` — Shared Type Definitions

See [Key Types](#key-types) in the context document.

## API Reference

### HTTP Endpoints

#### `GET /{/:scope}/:name@:version{/:exportPath}`

Serves a static asset file from a versioned npm or GitHub package.

| Segment       | Required | Description                                    |
| ------------- | -------- | ---------------------------------------------- |
| `:scope`      | No       | npm scope, e.g. `@grasdouble`                  |
| `:name`       | Yes      | Package name                                   |
| `:version`    | Yes      | Exact semver version                           |
| `:exportPath` | No       | Sub-path export, defaults to `.` (root export) |

**Response codes:**

| Code | Condition                                                            |
| ---- | -------------------------------------------------------------------- |
| 200  | File served successfully                                             |
| 403  | Path traversal attempt detected, or IP is blocked, or CORS violation |
| 415  | Package is not ESM (`"type"` is not `"module"`)                      |
| 429  | Rate limit exceeded                                                  |
| 500  | Registry fetch error, or entry point could not be resolved           |

**Examples:**

```
GET /@grasdouble/ui_button@1.2.3
GET /@grasdouble/ui_button@1.2.3/dist/secondary.mjs
GET /react@18.2.0
```

#### `GET /unblock-ip`

Self-service endpoint that removes the requesting client's IP from the blocked-IP set and resets its rate-limit counter.

| Code | Condition                     |
| ---- | ----------------------------- |
| 200  | IP successfully unblocked     |
| 400  | IP was not in the blocked set |

### Environment Variables

| Variable       | Required | Default           | Description                                                                       |
| -------------- | -------- | ----------------- | --------------------------------------------------------------------------------- |
| `GITHUB_TOKEN` | **Yes**  | —                 | Bearer token for GitHub Package Registry. Server **throws** on startup if absent. |
| `PORT`         | No       | `3000`            | HTTP port the server listens on                                                   |
| `TMP_DIR`      | No       | `$TMPDIR/tmp_cdn` | Temporary extraction directory for non-@grasdouble packages                       |
| `CDN_DIR`      | No       | `$TMPDIR/cdn`     | Persistent CDN cache directory                                                    |

## Usage Examples

### Starting the server

```bash
# Development (hot-reload via nodemon + tsx)
pnpm dev

# Build ESM bundle
pnpm build

# Build CJS bundle
pnpm build:cjs

# Run production build
pnpm preview
```

### Programmatic import (library mode)

The package exposes dual CJS/ESM builds. It can be imported to reuse individual utilities:

```ts
import { extractParams, loadLibrary, sendEntry } from '@grasdouble/cdn_autobuild-server';
```

### Requesting an asset

```bash
# Serve root export of a @grasdouble package
curl https://cdn.example.com/@grasdouble/ui_button@1.2.3

# Serve a named sub-export
curl https://cdn.example.com/@grasdouble/ui_table@2.0.0/dist/table.mjs

# Serve a public npm package
curl https://cdn.example.com/lodash-es@4.17.21
```

### Using in an import map

```html
<script type="importmap">
  {
    "imports": {
      "@grasdouble/ui_button": "https://cdn.example.com/@grasdouble/ui_button@1.2.3"
    }
  }
</script>
<script type="module">
  import Button from '@grasdouble/ui_button';
</script>
```

## Dependencies

### Runtime

| Package              | Version | Purpose                                                    |
| -------------------- | ------- | ---------------------------------------------------------- |
| `@dotenvx/dotenvx`   | ^1.52.0 | Environment variable loading with `.env` file support      |
| `cors`               | ^2.8.6  | CORS middleware for Express                                |
| `escape-html`        | ^1.0.3  | HTML-escapes user-controlled strings in error messages     |
| `express`            | ^5.2.1  | HTTP server framework                                      |
| `express-rate-limit` | ^8.2.1  | Per-IP rate limiting middleware                            |
| `fs-extra`           | ^11.3.3 | Extended filesystem utilities (copy, remove, readJson)     |
| `pacote`             | ^21.1.0 | npm package fetcher/extractor (supports scoped registries) |
| `sanitize-filename`  | ^1.6.3  | Strips dangerous characters from URL-derived filenames     |

### Dev / Build

| Package                            | Purpose                                          |
| ---------------------------------- | ------------------------------------------------ |
| `esbuild`                          | Bundles TypeScript source to ESM and CJS outputs |
| `tsx`                              | TypeScript execution for development mode        |
| `nodemon`                          | File-watch restarter for development             |
| `typescript`                       | Type checking                                    |
| `@grasdouble/lufa_config_tsconfig` | Shared TypeScript base config (`node.json`)      |
| `@grasdouble/lufa_config_eslint`   | Shared ESLint config                             |
| `@grasdouble/lufa_config_prettier` | Shared Prettier config                           |

## Related Documentation

- [`@grasdouble/lufa_config_tsconfig`](../../lufa/lufa_config_tsconfig.md) — Shared TypeScript configuration extended by this package.
- [`@grasdouble/lufa_config_eslint`](../../lufa/lufa_config_eslint.md) — Shared ESLint configuration.
- [`@grasdouble/lufa_config_prettier`](../../lufa/lufa_config_prettier.md) — Shared Prettier configuration.
