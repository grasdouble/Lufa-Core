---
package: '@grasdouble/cdn_autobuild-server'
shortName: cdn_autobuild-server
category: cdn
type: context
lastUpdated: '2026-02-24'
generatedAtCommit: 'd27c912328f538971b6720513be2c817c2feff15'
---

# cdn_autobuild-server — AI Context File

## Package Info

| Field            | Value                                                |
| ---------------- | ---------------------------------------------------- |
| Package name     | `@grasdouble/cdn_autobuild-server`                   |
| Version          | `0.3.4`                                              |
| Category         | `cdn`                                                |
| Source path      | `packages/cdn/autobuild-server/src/`                 |
| Entry point      | `src/index.ts` → `dist/index.mjs` / `dist/index.cjs` |
| Node requirement | `>=18`                                               |
| Registry         | GitHub Packages (`https://npm.pkg.github.com`)       |
| Type             | Runnable server + importable library                 |

## Critical Rules

1. **`GITHUB_TOKEN` is mandatory.** The server throws a hard error at startup if this env var is absent. It must be a valid bearer token for `https://npm.pkg.github.com`.
2. **ESM-only policy.** Packages without `"type": "module"` are rejected with HTTP 415. This check occurs during the first-access load, before any file is written to `CDN_DIR`.
3. **Two-registry routing is fixed by scope.** `@grasdouble`-scoped packages always use the GitHub registry; all other packages always use the public npm registry. This is not configurable.
4. **Path traversal is actively guarded.** Both `loadLibrary()` and the main route verify that resolved paths stay inside `TMP_DIR`/`CDN_DIR`. Any path starting with `..` relative to these directories returns HTTP 403.
5. **CORS whitelist is hardcoded.** Only `https://sebastien-lemouillour.fr` and `https://www.sebastien-lemouillour.fr` are allowed. Requests with no `Origin` header are also rejected. To support additional origins, edit `security.ts:6`.
6. **Rate limit auto-blocks.** After 1000 requests in 10 minutes the client IP is added to `blockedIPs` in memory. It auto-clears after 15 minutes, or the client can self-unblock via `GET /unblock-ip`.
7. **500 ms file-write delay.** After `pacote.extract()`, the route waits 500 ms before calling `res.sendFile()` if the output file does not yet exist on disk. This is a workaround, not a reliable synchronisation mechanism.
8. **Trust proxy is enabled.** `app.set('trust proxy', true)` is set, so `req.ip` returns the real client IP from `X-Forwarded-For`. Ensure the reverse proxy is configured correctly to prevent IP spoofing.

## Import Pattern

```ts
// Full package import (library mode)

// Type-only imports
import type { ExtractedParams, LoadLibraryResult, PackageJson } from '@grasdouble/cdn_autobuild-server';
import { extractParams, loadLibrary, sendEntry } from '@grasdouble/cdn_autobuild-server';
```

The package is built as dual ESM/CJS. Use the ESM import in modern Node.js environments or bundlers; the CJS build is provided for compatibility.

## Key Types

```ts
// src/types.ts

/** Subset of package.json used for entry-point resolution */
type PackageJson = {
  name: string;
  version: string;
  type?: 'module' | 'commonjs'; // ESM gate check
  main?: string; // Fallback entry
  module?: string; // Preferred ESM entry
  exports?: Record<
    string,
    | string
    | {
        import?: string;
        default?: string;
      }
  >;
  peerDependencies?: Record<string, string>;
};

/** Sanitised and path-resolved URL parameters */
type ExtractedParams = {
  scope?: string; // e.g. '@grasdouble'
  exportPath?: string; // e.g. './dist/secondary.mjs' (always prefixed with './')
  fullName: string; // e.g. '@grasdouble/ui_button@1.2.3'
  dirName: string; // Filesystem-safe version of fullName
  cdnPkgPath: string; // Absolute path in CDN_DIR
  tmpPkgPath: string; // Absolute path in TMP_DIR
};

/** Return value of loadLibrary() */
type LoadLibraryResult = {
  status: number; // 200 | 403 | 500
  message: string;
};
```

## Common Patterns

### Adding a new allowed CORS origin

```ts
// src/security.ts
export const whitelist: string[] = [
  'https://sebastien-lemouillour.fr',
  'https://www.sebastien-lemouillour.fr',
  'https://your-new-domain.com', // add here
];
```

### Adjusting rate limit thresholds

```ts
// src/security.ts — getRateLimiter()
rateLimit({
  windowMs: 10 * 60 * 1000, // change window (ms)
  max: 1000, // change request cap
  // ...
});
```

### Adjusting the auto-unblock timeout

```ts
// src/security.ts — unblockIPsAfterTimeout()
const unblockTimeout = 15 * 60 * 1000; // change duration (ms)
```

### Checking whether a package is in the CDN cache

```ts
import path from 'path';
import fs from 'fs-extra';

const CDN_DIR = process.env.CDN_DIR ?? '/tmp/cdn';
const isCached = fs.existsSync(path.resolve(CDN_DIR, '@grasdouble/ui_button@1.2.3'));
```

### Resolving the entry file for a package export

```ts
import { sendEntry } from '@grasdouble/cdn_autobuild-server';

const result = await sendEntry({
  cdnPkgPath: '/tmp/cdn/@grasdouble/ui_button@1.2.3',
  exportPath: '.',
  fullName: '@grasdouble/ui_button@1.2.3',
});

if (result.status === 200) {
  console.log(result.outputFile); // absolute path to the file
}
```

### Fetching a package into the CDN cache

```ts
import { loadLibrary } from '@grasdouble/cdn_autobuild-server';

const result = await loadLibrary({
  scope: '@grasdouble',
  fullName: '@grasdouble/ui_button@1.2.3',
  tmpPkgPath: '/tmp/tmp_cdn/@grasdouble/ui_button@1.2.3',
  cdnPkgPath: '/tmp/cdn/@grasdouble/ui_button@1.2.3',
  TMP_DIR: '/tmp/tmp_cdn',
  CDN_DIR: '/tmp/cdn',
  GITHUB_TOKEN: process.env.GITHUB_TOKEN!,
});
// result.status === 200 on success
```

## Anti-patterns

| Anti-pattern                                                              | Why it is wrong                                           | Correct approach                                                                                                                                  |
| ------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Requesting a CJS package from the CDN                                     | The server rejects non-ESM packages with 415              | Ensure the npm package has `"type": "module"`                                                                                                     |
| Omitting `GITHUB_TOKEN` env var                                           | Server throws at startup and exits                        | Always provide `GITHUB_TOKEN` in `.env`                                                                                                           |
| Relying on the 500 ms file-write delay                                    | It is a workaround, not a guarantee                       | For production reliability, verify the file exists before serving or use a proper async wait                                                      |
| Hardcoding paths outside `CDN_DIR`/`TMP_DIR` when calling `loadLibrary()` | The path-traversal guard returns 403                      | Always derive paths via `extractParams()`                                                                                                         |
| Sending requests without an `Origin` header                               | Denied by CORS policy (`CorsError`)                       | Always include a valid `Origin` header matching the whitelist                                                                                     |
| Using `req.socket.remoteAddress` directly for IP logic                    | `trust proxy` is enabled; real IP is in `X-Forwarded-For` | Use `req.ip` which Express resolves correctly when trust proxy is set                                                                             |
| Re-fetching a package that is already in `CDN_DIR`                        | Wastes registry bandwidth and time                        | The main route already skips `loadLibrary()` when `cdnPkgPath/package.json` exists — replicate this check before calling `loadLibrary()` directly |

## Dependencies Context

| Package                 | Why it matters to AI agents                                                                                                                                                                                                         |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pacote`                | Core fetch/extract engine. Supports scoped registries and auth headers. Uses the same resolution algorithm as npm. Cannot be replaced without rewriting registry logic.                                                             |
| `express` v5            | Breaking changes vs v4: route params use `{:param}` optional syntax in v5; async errors propagate to error handlers automatically. The route pattern `['{/:urlScope}/:urlName@:urlVersion{/:urlExportPath}']` is Express v5 syntax. |
| `express-rate-limit` v8 | The `handler` callback signature changed in v7+: `(req, res, next, options)`. Current code uses `(req, res)` which is still valid.                                                                                                  |
| `fs-extra`              | Drop-in extension of Node `fs`. Use `fs.readJson()`, `fs.copy()`, `fs.remove()`, `fs.existsSync()` — all from this package.                                                                                                         |
| `sanitize-filename`     | Only sanitizes individual filename segments, not full paths. `@` and `/` in scope names must be handled before passing to `sanitize()`. The current code sanitizes scope and name separately, which is correct.                     |
| `escape-html`           | Used exclusively for escaping `fullName` in error response bodies to prevent reflected XSS.                                                                                                                                         |
| `@dotenvx/dotenvx`      | Loaded via side-effect import (`import '@dotenvx/dotenvx/config'`). Reads `.env` and `.env.development`/`.env.production` depending on the npm script used.                                                                         |
