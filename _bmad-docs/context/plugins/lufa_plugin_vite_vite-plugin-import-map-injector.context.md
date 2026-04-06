---
package: '@grasdouble/lufa_plugin_vite_vite-plugin-import-map-injector'
shortName: lufa_plugin_vite_vite-plugin-import-map-injector
category: plugins
type: context
lastUpdated: '2026-02-24'
generatedAtCommit: 'd27c912328f538971b6720513be2c817c2feff15'
---

# Context: lufa_plugin_vite_vite-plugin-import-map-injector

## Package Identity

- **NPM name**: `@grasdouble/lufa_plugin_vite_vite-plugin-import-map-injector`
- **Version**: `0.2.3`
- **License**: MIT
- **Published to**: GitHub Packages (`https://npm.pkg.github.com`)
- **Public**: yes (`"private": false`)
- **Module format**: ESM (`"type": "module"`)
- **Entry point**: `index.mjs` (single file, no build step required)

## Role in the Monorepo

This package is the **import map injection mechanism** for the Lufa microfrontend architecture. It is used exclusively by the `main-container` application — the Single-SPA root config — to inject browser-native Import Map `<script>` tags into the served HTML at dev/build time.

Without this plugin, microfrontends would have no way to resolve module specifiers (e.g., `@grasdouble/lufa_microfrontend_home`) to actual URLs in the browser, making the entire Single-SPA orchestration inoperable.

## What It Does (Technical Summary)

1. Hooks into Vite's `transformIndexHtml` lifecycle.
2. Reads up to three JSON files from the project root (relative to `process.cwd()`):
   - **extImportMap** (`importMapExternal.json` by default): CDN URLs for shared singletons (React, etc.).
   - **prodImportMap** (`importMap.json` by default): CDN URLs for microfrontend bundles in production.
   - **devImportMap** (`importMap.dev.json` by default): localhost URLs for microfrontend bundles in development.
3. Detects dev vs. production mode via the presence of `ctx.server` in the transform context.
4. In **production**: injects one `<script type="importmap">` containing the external map only.
5. In **development**: injects two scripts:
   - `<script type="importmap">` for the external map (not overridable).
   - `<script type="importmap" overridable="true">` merging the dev map (compatible with `import-map-overrides`).
6. Inserts both tags immediately before `</head>`.

## Key Design Decisions

### External map is never overridable

The `extImportMap` is always injected as a plain `type="importmap"` (without `overridable="true"`). This is an intentional architectural constraint: shared singleton dependencies like React must not be replaceable at runtime via developer tooling, as doing so would break the singleton guarantee required by Single-SPA.

### Dev map is always overridable

The dev import map is injected with `overridable="true"`, enabling engineers to use the `import-map-overrides` browser extension or UI to redirect individual microfrontend module specifiers to a different local dev server without modifying any files.

### Missing files are non-fatal

All three file reads are guarded with `fs.existsSync`. A missing file produces a `console.warn` and is silently treated as an empty import map `{}`. This allows the plugin to operate even when only a subset of map files exists.

### No TypeScript source — pure JavaScript

The plugin is authored directly as `.mjs` with no TypeScript source. Type checking is enabled via `tsconfig.json` with `allowJs: true` and `checkJs: false`, meaning types are validated structurally without strict JS type annotations.

## File Map

```
vite-plugin-import-map-injector/
├── index.mjs            # Full plugin implementation (61 lines)
├── package.json         # Package manifest
├── tsconfig.json        # TypeScript config (allowJs, checkJs: false)
├── eslint.config.mjs    # ESLint config (extends lufa_config_eslint/node)
├── prettier.config.mjs  # Prettier config
├── README.md            # User-facing documentation
└── CHANGELOG.md         # Version history
```

## Plugin Function Signature

```js
// index.mjs:4-8
export default function importMapPlugin({
  extImportMap = 'importMapExternal.json',
  prodImportMap = 'importMap.json',
  devImportMap = 'importMap.dev.json',
} = {}) { ... }
```

Returns a plain Vite `Plugin` object:

```js
{
  name: 'vite-plugin-importmap',
  transformIndexHtml(html, ctx) { ... }
}
```

## Dev / Production Branching Logic

```
isDev = ctx?.server !== undefined

if isDev:
  inject extImportMap as standard importmap
  inject merge(devImportMap) as overridable importmap

if !isDev (production):
  inject extImportMap as standard importmap
  (prodImportMap is read but NOT injected separately —
   the production map is available in files but not merged
   into a separate script in the current implementation)
```

> **Note**: In the current implementation (`0.2.3`), `prodImportMap` is read and parsed but `mergedImportMap` in production mode will be empty (`imports: {}`), and the second overridable script is only added when `isDev` is true. The `prodImportMap` content is effectively unused in the current code path — it is parsed but never inserted into the HTML in production. This may be an area for future development.

## Known Consumers in This Monorepo

| Package          | Path                                                        | Usage                     |
| ---------------- | ----------------------------------------------------------- | ------------------------- |
| `main-container` | `packages/apps/microfrontend/main-container/vite.config.js` | Primary and sole consumer |

## Import Map Files in `main-container`

| File            | Path in `main-container`     | Content                                                        |
| --------------- | ---------------------------- | -------------------------------------------------------------- |
| `extImportMap`  | `src/importMapExternal.json` | React 19, react-dom, react/jsx-runtime from `esm.sh`           |
| `prodImportMap` | `src/importMap.json`         | Microfrontend home and design-system from CDN                  |
| `devImportMap`  | `src/importMap.dev.json`     | Microfrontend home on `localhost:4101`, design-system from CDN |

## Tooling Configuration

- **ESLint**: Extends `@grasdouble/lufa_config_eslint/node.mjs`. TypeScript-aware unsafe rules are disabled for `.mjs` files (since there are no type annotations).
- **Prettier**: Extends `@grasdouble/lufa_config_prettier`.
- **TypeScript**: Extends `@grasdouble/lufa_config_tsconfig/node.json` with `allowJs: true`, `checkJs: false`, includes only `index.mjs`.
- **Lint-staged**: Runs ESLint + Prettier on `*.{js,mjs}` and Prettier on `*.{json,md}`.

## Integration Context: Single-SPA Architecture

This plugin exists at the intersection of:

1. **Vite build tooling** — hooks into HTML transformation.
2. **Browser Import Maps** — a web standard for module specifier resolution.
3. **Single-SPA** — a microfrontend orchestration framework that expects module specifiers declared in an import map.
4. **import-map-overrides** — a development tool that reads `overridable="true"` import maps to allow per-engineer URL overrides without code changes.

The non-overridable / overridable split directly maps to the Single-SPA recommended architecture where external shared deps are locked and application-level maps are flexible for local development.

## Relationships to Other Packages

- **`@grasdouble/lufa_plugin_vite_vite-plugin-react-preamble`**: Companion plugin always used alongside this one in `main-container`. Handles React fast-refresh preamble injection — orthogonal concern.
- **`@grasdouble/lufa_config_eslint`**: Dev dependency for linting.
- **`@grasdouble/lufa_config_prettier`**: Dev dependency for formatting.
- **`@grasdouble/lufa_config_tsconfig`**: Dev dependency for TypeScript configuration baseline.
