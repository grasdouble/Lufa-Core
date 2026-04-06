---
package: '@grasdouble/lufa_plugin_vite_vite-plugin-react-preamble'
shortName: lufa_plugin_vite_vite-plugin-react-preamble
category: plugins
type: context
lastUpdated: '2026-02-24'
generatedAtCommit: 'd27c912328f538971b6720513be2c817c2feff15'
---

# Context: lufa_plugin_vite_vite-plugin-react-preamble

## Quick Reference

```
Package : @grasdouble/lufa_plugin_vite_vite-plugin-react-preamble
Version : 0.0.4
Type    : Vite plugin (ESM, no build step)
Entry   : index.mjs
Exports : default function reactPreamblePlugin() → VitePlugin
Port    : hardcoded 4101 (dev server target)
```

## What This Plugin Does

In **development mode** (`env.MODE === 'development'`) it injects two `<script type="module">` tags into `<head>` before any other scripts (Vite hook order `'pre'`):

1. React Fast Refresh bootstrap — imports `@react-refresh` from `http://localhost:4101`, calls `RefreshRuntime.injectIntoGlobalHook(window)`, and sets up the three globals required by `@vitejs/plugin-react` components:
   - `window.$RefreshReg$`
   - `window.$RefreshSig$`
   - `window.__vite_plugin_react_preamble_installed__`

2. Vite HMR client — loads `http://localhost:4101/@vite/client`.

In **production mode** the plugin returns the HTML untouched.

## Source: index.mjs (full)

```js
export default function reactPreamblePlugin() {
  let isDev = false;

  return {
    name: 'vite-plugin-react-preamble',
    configResolved(config) {
      isDev = config.env.MODE === 'development';
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        if (!isDev) return html;

        return {
          html,
          tags: [
            {
              tag: 'script',
              attrs: { type: 'module' },
              children: `
                  import RefreshRuntime from 'http://localhost:4101/@react-refresh'
                  RefreshRuntime.injectIntoGlobalHook(window)
                  window.$RefreshReg$ = () => { }
                  window.$RefreshSig$ = () => (type) => type
                  window.__vite_plugin_react_preamble_installed__ = true
                `,
              injectTo: 'head',
            },
            {
              tag: 'script',
              attrs: {
                type: 'module',
                src: 'http://localhost:4101/@vite/client',
              },
              injectTo: 'head',
            },
          ],
        };
      },
    },
  };
}
```

**File**: `packages/plugins/vite/vite-plugin-react-preamble/index.mjs:1`

## Architectural Context

### Why this plugin exists

`@vitejs/plugin-react` injects a React Fast Refresh preamble automatically, but only when Vite is serving the HTML from the same origin. In this monorepo's Single-SPA microfrontend setup:

- The **shell** (main-container) serves the HTML and orchestrates routing via import maps.
- Each **microfrontend** runs its own Vite dev server on a dedicated port.
- The preamble must reference the **microfrontend's own Vite dev server** by absolute URL, not a relative path.

This plugin fills that gap by injecting absolute-URL preamble scripts pointing to `http://localhost:4101`.

### Port constraint

The dev server port `4101` is **hardcoded** inside the plugin. Any application consuming this plugin must therefore configure its Vite dev server to listen on port `4101`:

```js
// vite.config.js of consuming app
server: {
  port: 4101,
  cors: true,
  hmr: true,
}
```

Failure to match this port means the injected scripts will 404 in development, breaking React Fast Refresh.

### Plugin hook flow

```
Vite resolves config
       │
       ▼
configResolved(config)          ← plugin reads config.env.MODE
       │
       ▼
transformIndexHtml { order:'pre' }
       │
       ├─ isDev === false → return html unchanged  (production)
       │
       └─ isDev === true  → return { html, tags: [...] }
                            tags injected into <head>
                            before any other <script>
```

## Real-World Usage

**Consumer**: `packages/apps/microfrontend/main-container/vite.config.js:22`

```js
import reactPreamblePlugin from '@grasdouble/lufa_plugin_vite_vite-plugin-react-preamble';

export default defineConfig({
  plugins: [
    importMapInjectorPlugin({ ... }),
    externalizeDeps({ peerDeps: true, nodeBuiltins: true }),
    reactPreamblePlugin(),    // called with no arguments
  ],
  // ...
});
```

## API Surface

| Export    | Type               | Description                              |
| --------- | ------------------ | ---------------------------------------- |
| `default` | `() => VitePlugin` | Factory — returns the Vite plugin object |

The plugin object exposes:

- `name`: `'vite-plugin-react-preamble'`
- `configResolved`: standard Vite hook
- `transformIndexHtml`: standard Vite hook with `order: 'pre'`

**No options are accepted.** The README lists `reactVersion`, `additionalImports`, `position`, and `external` but these are not implemented in the current version (v0.0.4).

## Package Metadata

```json
{
  "name": "@grasdouble/lufa_plugin_vite_vite-plugin-react-preamble",
  "version": "0.0.4",
  "private": false,
  "type": "module",
  "main": "index.mjs",
  "license": "MIT",
  "peerDependencies": { "vite": "^6.2.2" },
  "publishConfig": {
    "access": "public",
    "registry": "https://npm.pkg.github.com"
  }
}
```

## Constraints and Limitations

| Constraint        | Detail                                                                       |
| ----------------- | ---------------------------------------------------------------------------- |
| Hardcoded port    | Dev server must run on port `4101`; no option to override                    |
| Dev-only effect   | Plugin is a no-op in any non-development mode                                |
| No options        | Factory takes no arguments in current implementation                         |
| No build step     | Shipped as raw `.mjs`; no bundler/transpiler in the build pipeline           |
| Peer Vite version | Requires `vite ^6.2.2`; not validated against Vite 4/5 despite README claims |

## Related Packages

| Package                                                        | Relationship                                                    |
| -------------------------------------------------------------- | --------------------------------------------------------------- |
| `@grasdouble/lufa_plugin_vite_vite-plugin-import-map-injector` | Sibling plugin used together in `main-container/vite.config.js` |
| `@grasdouble/lufa_microfrontend_main-container`                | Only known consumer                                             |
| `@grasdouble/lufa_config_eslint`                               | Dev tooling — ESLint config                                     |
| `@grasdouble/lufa_config_prettier`                             | Dev tooling — Prettier config                                   |
| `@grasdouble/lufa_config_tsconfig`                             | Dev tooling — TypeScript base config                            |
