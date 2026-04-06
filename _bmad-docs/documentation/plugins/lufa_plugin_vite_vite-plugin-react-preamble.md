---
package: '@grasdouble/lufa_plugin_vite_vite-plugin-react-preamble'
shortName: lufa_plugin_vite_vite-plugin-react-preamble
category: plugins
version: '0.0.4'
private: false
lastUpdated: '2026-02-24'
generatedAtCommit: 'd27c912328f538971b6720513be2c817c2feff15'
---

# lufa_plugin_vite_vite-plugin-react-preamble

## Overview

`@grasdouble/lufa_plugin_vite_vite-plugin-react-preamble` is a Vite plugin that injects the React Fast Refresh preamble script into the HTML `<head>` during development. It enables proper React HMR (Hot Module Replacement) when the Vite dev server runs as a **remote** at a fixed port — a pattern required in Single-SPA microfrontend architectures where the shell/main-container page is served from a different origin than the microfrontend's own Vite dev server.

In production mode the plugin is a no-op: the HTML is returned unmodified.

## Purpose

In a standard single-app Vite + React setup the `@vitejs/plugin-react` plugin automatically injects the React Fast Refresh preamble into every HTML entry point. That injection works because the Vite dev server is the origin serving the HTML.

In a microfrontend setup using **import maps** (e.g. Single-SPA), the shell application's HTML is served from its own origin while individual microfrontend bundles are loaded from their own Vite dev servers on different ports. The React preamble that `@vitejs/plugin-react` injects is port-relative, so it fails when loaded cross-origin.

This plugin solves that by injecting two `<script type="module">` tags that explicitly reference the **fixed hardcoded dev server port (`4101`)**:

1. A React Fast Refresh bootstrap script that sets up `window.$RefreshReg$`, `window.$RefreshSig$`, and `window.__vite_plugin_react_preamble_installed__`.
2. The Vite client script (`/@vite/client`) from the same dev server.

## Architecture

```
packages/plugins/vite/vite-plugin-react-preamble/
├── index.mjs          # Plugin implementation (ESM, no build step)
├── package.json       # Package manifest
├── tsconfig.json      # TypeScript type-check config (allowJs, noEmit)
├── eslint.config.mjs  # ESLint config (extends lufa_config_eslint/node)
├── prettier.config.mjs
├── README.md
└── CHANGELOG.md
```

The package ships as a **pre-built ESM file** (`index.mjs`) with no separate `src/` directory and no compile/bundle step. TypeScript is used only for type-checking via `tsc --noEmit` with `allowJs: true`.

## Key Components

### `index.mjs` — Plugin factory

The entire plugin is a single default-exported factory function:

```
reactPreamblePlugin() → VitePlugin
```

**Internal state**

| Variable | Type      | Description                                                            |
| -------- | --------- | ---------------------------------------------------------------------- |
| `isDev`  | `boolean` | Set to `true` when Vite's resolved config `env.MODE === 'development'` |

**Vite hooks used**

| Hook                     | Order   | Purpose                                                 |
| ------------------------ | ------- | ------------------------------------------------------- |
| `configResolved(config)` | —       | Reads `config.env.MODE` to determine environment        |
| `transformIndexHtml`     | `'pre'` | Conditionally injects two `<script>` tags into `<head>` |

**Injected tags (development only)**

Tag 1 — React Fast Refresh bootstrap:

```html
<script type="module">
  import RefreshRuntime from 'http://localhost:4101/@react-refresh';

  RefreshRuntime.injectIntoGlobalHook(window);
  window.$RefreshReg$ = () => {};
  window.$RefreshSig$ = () => (type) => type;
  window.__vite_plugin_react_preamble_installed__ = true;
</script>
```

Tag 2 — Vite client:

```html
<script type="module" src="http://localhost:4101/@vite/client"></script>
```

Both tags are injected into `<head>` at `order: 'pre'`, ensuring they run before any application module is loaded.

> **Important**: The port `4101` is hardcoded in the plugin implementation. The consuming application's Vite dev server must be configured to run on that exact port for the preamble to function correctly.

## Plugin Options / API

The plugin currently accepts **no options**. The factory function signature is:

```ts
function reactPreamblePlugin(): VitePlugin;
```

The README describes optional parameters (`reactVersion`, `additionalImports`, `position`, `external`) but these are **not implemented** in the current source (`index.mjs` v0.0.4). The README appears to be aspirational/placeholder content.

## Usage Examples

### Basic usage (vite.config.js)

From `packages/apps/microfrontend/main-container/vite.config.js`:

```js
import { defineConfig } from 'vite';
import { externalizeDeps } from 'vite-plugin-externalize-deps';

import importMapInjectorPlugin from '@grasdouble/lufa_plugin_vite_vite-plugin-import-map-injector';
import reactPreamblePlugin from '@grasdouble/lufa_plugin_vite_vite-plugin-react-preamble';

export default defineConfig({
  plugins: [
    importMapInjectorPlugin({
      extImportMap: 'src/importMapExternal.json',
      devImportMap: 'src/importMap.dev.json',
      prodImportMap: 'src/importMap.json',
    }),
    externalizeDeps({ peerDeps: true, nodeBuiltins: true }),
    reactPreamblePlugin(), // no arguments required
  ],
  server: {
    port: 5173,
    cors: true,
    hmr: true,
  },
});
```

The plugin is placed **last** in the plugins array so that the import-map injector and externalize-deps plugins run first.

### Minimal TypeScript config

```ts
// vite.config.ts
import { defineConfig } from 'vite';

import reactPreamblePlugin from '@grasdouble/lufa_plugin_vite_vite-plugin-react-preamble';

export default defineConfig({
  plugins: [reactPreamblePlugin()],
});
```

## Behaviour by Environment

| Mode                      | `config.env.MODE` | Plugin action                                            |
| ------------------------- | ----------------- | -------------------------------------------------------- |
| Development (`vite dev`)  | `"development"`   | Injects React Fast Refresh + Vite client `<script>` tags |
| Production (`vite build`) | anything else     | Returns HTML unmodified — no-op                          |

## Dependencies

### Peer Dependencies

| Package | Version  | Role                                     |
| ------- | -------- | ---------------------------------------- |
| `vite`  | `^6.2.2` | Host build tool; provides the plugin API |

### Dev Dependencies (workspace-internal)

| Package                            | Role                                 |
| ---------------------------------- | ------------------------------------ |
| `@grasdouble/lufa_config_eslint`   | ESLint shared config                 |
| `@grasdouble/lufa_config_prettier` | Prettier shared config               |
| `@grasdouble/lufa_config_tsconfig` | TypeScript base config (`node.json`) |

### Dev Dependencies (external)

| Package                               | Version   | Role                               |
| ------------------------------------- | --------- | ---------------------------------- |
| `eslint`                              | `^9.39.2` | Linting                            |
| `prettier`                            | `^3.8.1`  | Formatting                         |
| `typescript`                          | `^5.9.3`  | Type-checking `.mjs` via `allowJs` |
| `@ianvs/prettier-plugin-sort-imports` | `^4.7.0`  | Import sorting                     |
| `prettier-plugin-packagejson`         | `^3.0.0`  | package.json formatting            |

## Known Consumers

| Package                                         | Path                                         | Usage                                       |
| ----------------------------------------------- | -------------------------------------------- | ------------------------------------------- |
| `@grasdouble/lufa_microfrontend_main-container` | `packages/apps/microfrontend/main-container` | `reactPreamblePlugin()` in `vite.config.js` |

## Version History

| Version | Changes                                                                            |
| ------- | ---------------------------------------------------------------------------------- |
| `0.0.4` | Add typecheck scripts; align docs/test fixtures after stricter TypeScript checks   |
| `0.0.3` | Fix prettier config; update scripts and README; add missing eslint/prettier config |
| `0.0.2` | Initial extraction — transformed from Single-SPA PoC into a standalone package     |

## Related Documentation

- [`@grasdouble/lufa_plugin_vite_vite-plugin-import-map-injector`](./lufa_plugin_vite_vite-plugin-import-map-injector.md) — sibling Vite plugin used alongside this one to inject import maps
- [`@grasdouble/lufa_microfrontend_main-container`](../apps/lufa_microfrontend_main-container.md) — the only current consumer of this plugin
