---
package: '@grasdouble/lufa_plugin_vite_vite-plugin-import-map-injector'
shortName: lufa_plugin_vite_vite-plugin-import-map-injector
category: plugins
version: '0.2.3'
private: false
lastUpdated: '2026-02-24'
generatedAtCommit: 'd27c912328f538971b6720513be2c817c2feff15'
---

# lufa_plugin_vite_vite-plugin-import-map-injector

## Overview

`@grasdouble/lufa_plugin_vite_vite-plugin-import-map-injector` is a Vite plugin that automatically injects [Import Map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) `<script>` tags into the `index.html` during both development and production builds. It is purpose-built for microfrontend architectures (particularly Single-SPA) where multiple independently deployed bundles must share external dependencies and declare their own module resolution at the browser level.

## Purpose

In a microfrontend architecture:

- Multiple applications must share singleton dependencies (React, React DOM) loaded from a CDN to avoid duplication.
- Each microfrontend's URL may differ between development (localhost) and production (CDN).
- The `import-map-overrides` tooling used by Single-SPA requires specific script tag attributes (`overridable="true"`) to allow runtime override of select maps.

This plugin solves all three concerns by reading three distinct JSON import map files and merging/injecting them at the right time with the right attributes.

## Architecture

The plugin is a single-file ESM module (`index.mjs`) with no runtime dependencies beyond Node.js built-ins (`fs`, `path`). It hooks into Vite's `transformIndexHtml` lifecycle.

```
vite build / vite dev
       │
       ▼
transformIndexHtml hook
       │
       ├── Read extImportMap  (always injected, non-overridable)
       ├── Read prodImportMap (injected in production only)
       └── Read devImportMap  (injected in development only, overridable)
       │
       ▼
Inject <script type="importmap"> tags before </head>
```

### Import Map Separation Strategy

| File            | Mode             | Script type attribute                 | Overridable |
| --------------- | ---------------- | ------------------------------------- | ----------- |
| `extImportMap`  | Both             | `type="importmap"`                    | No          |
| `prodImportMap` | Production only  | merged into overridable map           | No (merged) |
| `devImportMap`  | Development only | `type="importmap" overridable="true"` | Yes         |

The `extImportMap` is intentionally kept non-overridable. This is an explicit design decision documented in the source (see `index.mjs:46-49`) to prevent accidental or malicious replacement of shared singleton dependencies (e.g., React) via `import-map-overrides`.

## Key Components

### `index.mjs` — Plugin Entry Point

The entire plugin implementation lives in this single file.

**Exported default function: `importMapPlugin(options?)`**

- Accepts a single optional options object (destructured with defaults).
- Returns a Vite plugin object conforming to the Vite `Plugin` interface.
- Plugin name: `"vite-plugin-importmap"`.
- Uses only the `transformIndexHtml` hook.

#### Dev vs. Production Detection

```js
// index.mjs:12
const isDev = ctx?.server ? true : false;
```

Vite passes a `server` property on the transform context during `vite dev`. Its absence indicates a production build.

#### HTML Injection

```js
// index.mjs:58
return html.replace('</head>', `${importMapScripts.join('\n')}\n</head>`);
```

Tags are injected immediately before the closing `</head>` tag. In production, only the `extImportMap` script is injected. In development, both the `extImportMap` and the merged overridable map (containing `devImportMap` entries) are injected.

## Plugin Options / API

```ts
importMapPlugin(options?: {
  extImportMap?: string;   // default: 'importMapExternal.json'
  prodImportMap?: string;  // default: 'importMap.json'
  devImportMap?: string;   // default: 'importMap.dev.json'
})
```

All paths are resolved relative to `process.cwd()` (i.e., the project root where Vite is invoked). Missing files produce a `console.warn` and are silently skipped — the plugin does not throw.

| Option          | Type     | Default                    | Description                                                                                                                     |
| --------------- | -------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `extImportMap`  | `string` | `'importMapExternal.json'` | Path to the external/CDN dependencies import map. Injected in all modes as a non-overridable `type="importmap"` script.         |
| `prodImportMap` | `string` | `'importMap.json'`         | Path to the production microfrontend URLs import map. Merged and injected only in production builds.                            |
| `devImportMap`  | `string` | `'importMap.dev.json'`     | Path to the development microfrontend URLs import map. Merged and injected as an `overridable="true"` script during `vite dev`. |

### Import Map File Format

Each file must be a valid JSON object with an `imports` key (standard Import Map format):

```json
{
  "imports": {
    "module-specifier": "https://url-to-module"
  }
}
```

## Usage Examples

### Basic `vite.config.ts` Usage

```ts
import { defineConfig } from 'vite';

import importMapInjectorPlugin from '@grasdouble/lufa_plugin_vite_vite-plugin-import-map-injector';

export default defineConfig({
  plugins: [
    importMapInjectorPlugin({
      extImportMap: 'src/importMapExternal.json',
      devImportMap: 'src/importMap.dev.json',
      prodImportMap: 'src/importMap.json',
    }),
  ],
});
```

### Real-world Usage in `main-container`

Source: `packages/apps/microfrontend/main-container/vite.config.js`

```js
import importMapInjectorPlugin from '@grasdouble/lufa_plugin_vite_vite-plugin-import-map-injector';

export default defineConfig({
  plugins: [
    importMapInjectorPlugin({
      extImportMap: 'src/importMapExternal.json',
      devImportMap: 'src/importMap.dev.json',
      prodImportMap: 'src/importMap.json',
    }),
    // ...other plugins
  ],
});
```

### Companion Import Map Files

**`src/importMapExternal.json`** — Shared CDN dependencies (non-overridable):

```json
{
  "imports": {
    "react": "https://esm.sh/react@19.0.0",
    "react/jsx-runtime": "https://esm.sh/react@19.0.0/jsx-runtime",
    "react-dom": "https://esm.sh/react-dom@19.0.0",
    "react-dom/client": "https://esm.sh/react-dom@19.0.0/client"
  }
}
```

**`src/importMap.json`** — Production microfrontend URLs:

```json
{
  "imports": {
    "@grasdouble/lufa_microfrontend_home": "https://cdn.example.com/home@1.0.0"
  }
}
```

**`src/importMap.dev.json`** — Development microfrontend URLs (overridable):

```json
{
  "imports": {
    "@grasdouble/lufa_microfrontend_home": "http://localhost:4101/home.mjs"
  }
}
```

### Resulting HTML Output (Development)

```html
<head>
  <!-- ... -->
  <script type="importmap">
    {
        "imports": {
          "react": "https://esm.sh/react@19.0.0",
          ...
        }
      }
  </script>
  <script type="importmap" overridable="true">
    {
        "imports": {
          "@grasdouble/lufa_microfrontend_home": "http://localhost:4101/home.mjs",
          ...
        }
      }
  </script>
</head>
```

## Dependencies

### Runtime Dependencies

None. The plugin uses only Node.js built-ins (`fs`, `path`).

### Peer Dependencies

| Package | Version  |
| ------- | -------- |
| `vite`  | `^6.2.2` |

### Dev Dependencies

| Package                            | Purpose                                      |
| ---------------------------------- | -------------------------------------------- |
| `@grasdouble/lufa_config_eslint`   | Shared ESLint configuration                  |
| `@grasdouble/lufa_config_prettier` | Shared Prettier configuration                |
| `@grasdouble/lufa_config_tsconfig` | Shared TypeScript configuration              |
| `eslint`                           | Linting                                      |
| `prettier`                         | Code formatting                              |
| `typescript`                       | Type checking (`allowJs` + `checkJs: false`) |

## Changelog Summary

| Version | Change                                                             |
| ------- | ------------------------------------------------------------------ |
| `0.2.3` | Add typecheck scripts; align docs after stricter TypeScript checks |
| `0.2.2` | Fix Prettier config; update scripts and README                     |
| `0.2.1` | Fix dev mode behavior                                              |
| `0.2.0` | Load import map from CDN                                           |
| `0.1.1` | Prevent external deps (e.g., React) from being overridable         |
| `0.1.0` | Add `overridable` import map support                               |
| `0.0.2` | Initial extraction from Single-SPA PoC                             |

## Related Documentation

- `packages/apps/microfrontend/main-container/vite.config.js` — Primary consumer of this plugin
- `packages/plugins/vite/vite-plugin-react-preamble` — Companion Vite plugin used alongside this one
- [import-map-overrides configuration](https://github.com/single-spa/import-map-overrides/blob/main/docs/configuration.md#client-side-single-map) — Upstream spec for the `overridable` attribute
- [Import Maps specification](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) — Browser standard
