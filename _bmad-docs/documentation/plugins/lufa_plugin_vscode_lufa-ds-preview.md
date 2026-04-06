---
package: '@grasdouble/lufa_plugin_vscode_lufa-ds-preview'
shortName: lufa_plugin_vscode_lufa-ds-preview
category: plugins
version: '0.4.4'
private: false
lastUpdated: '2026-02-24'
generatedAtCommit: 'd27c912328f538971b6720513be2c817c2feff15'
---

# lufa_plugin_vscode_lufa-ds-preview

## Overview

`@grasdouble/lufa_plugin_vscode_lufa-ds-preview` (display name: **Lufa DS Preview**) is a VS Code extension that brings the Lufa design system directly into the editor. It provides inline color decorators, hover previews, and autocomplete enrichment for Lufa design tokens — covering CSS/SCSS/PostCSS variable syntax and TypeScript/TSX path-based token references.

The extension ships with bundled token maps from `@grasdouble/lufa_design-system-tokens`, so it works out of the box without any extra configuration. Custom maps are also supported for workspace-specific overrides.

---

## Purpose

The extension solves a common design-token developer experience problem: token names like `--lufa-core-color-brand-500` or `tokens.color.chromatic.red[500]` carry no visual information in source code. Lufa DS Preview resolves each token reference against a compiled map and renders color swatches, inline value hints, and autocomplete details directly inside the editor, bridging the gap between token usage and design intent.

---

## Architecture

```
src/
├── index.ts                  # Extension entry point — activate/deactivate lifecycle
├── preview-providers.ts      # Factory functions for the three VS Code providers
├── values-map-store.ts       # Map loading, caching, file-watching, config resolution
├── values-map.ts             # TokenMap type + validation + embedded path resolution
├── reference-resolver.ts     # Token path/CSS-var lookup and path-variant utilities
├── preview-config.ts         # Config parsing and merging (object-style + flat-style)
└── patterns/
    ├── css-var-patterns.ts   # Regex patterns for CSS variable detection
    └── token-path-patterns.ts# Regex patterns for TS/JS path-style token detection
```

### Data Flow

```
Extension Activated
       │
       ▼
ValuesMapStore created
  ├── Reads lufaDsPreview config (tokensMapPath, debug)
  ├── Resolves map path: custom → packaged fallback (dist/maps/tokens.map.json)
  ├── Loads & validates TokenMap JSON
  ├── Caches result (mtime-based invalidation)
  └── Establishes FileSystemWatcher for auto-reload
       │
       ▼
Three Providers registered for [css, scss, postcss, typescript, typescriptreact]
  ├── DocumentColorProvider  → inline color swatches
  ├── HoverProvider          → tooltip showing token value
  └── CompletionItemProvider → enriched autocomplete suggestions
       │
       ▼
On document open / edit:
  ├── Regex scan → token matches
  ├── Map lookup (css or paths index)
  ├── OKLCH → RGB via culori
  └── VS Code Color / Hover / CompletionItem emitted
```

### Build Pipeline

The build uses **esbuild** (`esbuild.mjs`) to bundle `src/index.ts` into `dist/extension.js` (CommonJS, Node platform). A custom esbuild plugin (`copy-lufa-maps`) copies `tokens.map.json` from the workspace-local `node_modules/@grasdouble/lufa_design-system-tokens/dist/` (or a relative monorepo path) into `dist/maps/tokens.map.json` after each successful build.

For distribution the `scripts/package.sh` script uses `@vscode/vsce` to package a `.vsix`, temporarily renaming the scoped npm package name to satisfy the VS Code marketplace publisher requirements.

---

## VS Code Contribution Points

### Configuration (`lufaDsPreview`)

Declared under `contributes.configuration` in `package.json`:

| Property                      | Type      | Default          | Description                                                                                                         |
| ----------------------------- | --------- | ---------------- | ------------------------------------------------------------------------------------------------------------------- |
| `lufaDsPreview.tokensMapPath` | `string`  | _(packaged map)_ | Optional path to a custom `tokens.map.json`, relative to workspace root or absolute. Falls back to the bundled map. |
| `lufaDsPreview.debug`         | `boolean` | `false`          | Enables verbose logging to the "Lufa DS Preview" output channel.                                                    |

**Example workspace settings:**

```json
{
  "lufaDsPreview": {
    "tokensMapPath": "packages/design-system/tokens/dist/tokens.map.json",
    "debug": false
  }
}
```

### Activation

```json
"activationEvents": ["onStartupFinished"]
```

The extension activates once VS Code finishes starting, ensuring it is always available for any supported file type without an explicit trigger.

### Language Selector

Providers are registered for all five of these language identifiers:

- `css`
- `scss`
- `postcss`
- `typescript`
- `typescriptreact`

### Registered Providers

| VS Code API                                       | Factory                       | Purpose                                        |
| ------------------------------------------------- | ----------------------------- | ---------------------------------------------- |
| `vscode.languages.registerColorProvider`          | `createDocumentColorProvider` | Inline color swatches for color tokens         |
| `vscode.languages.registerHoverProvider`          | `createHoverProvider`         | Tooltip with resolved token value              |
| `vscode.languages.registerCompletionItemProvider` | `createCompletionProvider`    | Enriched autocomplete items with value details |

Completion triggers: `-` `.` `[` `"` `'`

### Output Channel

Creates a named output channel `"Lufa DS Preview"` accessible from **View → Output → Lufa DS Preview**. Used for status logs and debug output via the `logOnce` deduplication helper.

---

## Key Components

### `src/index.ts` — Extension Entry Point

`activate(context)` wires up the full lifecycle:

1. Creates the output channel.
2. Instantiates `ValuesMapStore` via `createValuesMapStore`.
3. Registers a `onDidChangeConfiguration` listener to reset cache and re-initialize watchers when `lufaDsPreview` settings change.
4. Creates and registers all three providers.
5. Pushes all disposables to `context.subscriptions`.

`deactivate()` disposes the map store (including file watchers) and the output channel.

### `src/preview-providers.ts` — Provider Factories

**`createDocumentColorProvider`**

Scans the full document text using four regex passes:

1. `createCssColorVarInVarRe()` — `var(--lufa-*-color-*)` usages, with optional fallback values.
2. `createCssColorVarDirectRe()` — Direct CSS variable declarations `--lufa-*-color-*:`.
3. `createOklchColorRe()` — Raw `oklch(...)` values anywhere in the document.
4. `createColorPathRe()` — TypeScript/JS path expressions `tokens.color.*` / `primitive.color.*`.

For each match, the OKLCH value is converted to RGB via `culori` and a `vscode.ColorInformation` entry is produced.

**`createHoverProvider`**

Uses a combined regex (`cssVarNameRe | tokenPathRe`) to find the token under the cursor and resolves its value via `resolveTokenValueFromMap`. Returns a Markdown hover with `\`token\` = \`value\``.

**`createCompletionProvider`**

Looks backward up to 200 characters from the cursor to detect either:

- A CSS prefix like `--lufa-primitive-color-` → `buildCssCompletionItems` (from `valuesMap.css`)
- A path prefix like `tokens.spacing.` → `buildPathCompletionItems` (from `valuesMap.paths`)

Each item includes the resolved value as `detail` and a Markdown `documentation` block. Color tokens additionally receive an inline HTML swatch and `CompletionItemKind.Color`. Limited to 200 items per invocation (`MAX_COMPLETION_ITEMS`).

### `src/values-map-store.ts` — Map Store

Central state manager, created by `createValuesMapStore(logOnce)`. Exposes:

| Method                       | Description                                                                                                                |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `loadValuesMap()`            | Returns a `TokenMap` (or `null`). Uses mtime-based cache; reads config on every call to pick up live changes.              |
| `setupMapWatchers(context)`  | Creates a `FileSystemWatcher` for the active tokens map path. Invalidates cache on `change`, `create`, or `delete` events. |
| `resetAllCache()`            | Forces full reload on the next `loadValuesMap()` call.                                                                     |
| `setExtensionRootPath(path)` | Stores the VS Code extension context path for locating embedded maps.                                                      |
| `isDebugEnabled()`           | Returns the current debug setting from workspace config.                                                                   |
| `dispose()`                  | Disposes watchers and clears all cached state.                                                                             |

**Security:** `resolveConfiguredPath` validates that relative paths resolve to a location inside the workspace. Absolute paths outside the workspace are permitted but relative paths that escape the workspace root are blocked.

**Fallback chain for map resolution:**

```
1. lufaDsPreview.tokensMapPath (if set, workspace-validated)
   └── on failure → falls back to packaged map
2. dist/maps/tokens.map.json  (bundled inside extension)
```

### `src/values-map.ts` — TokenMap Utilities

Defines the `TokenMap` interface:

```typescript
type TokenMap = {
  version: number;
  generatedAt?: string;
  css: Record<string, string>; // "--lufa-*" → OKLCH/value string
  paths: Record<string, string>; // "tokens.*" / "primitives.*" → value string
};
```

`isValidMap(data)` performs runtime validation before caching.  
`getEmbeddedMapPath(extensionRootPath, mapFile, exists)` resolves `dist/maps/{mapFile}` relative to the extension bundle root.

### `src/reference-resolver.ts` — Lookup Utilities

- `resolveTokenValueFromMap(tokenText, valuesMap)` — Routes CSS var names to `valuesMap.css` and path expressions to `valuesMap.paths`.
- `getPathCandidates(path)` — Expands a single path into quote-variant candidates (`["key"]` ↔ `['key']`).
- `lookupValue(map, keys)` — Iterates candidates and returns the first hit.

### `src/patterns/` — Regex Modules

| File                     | Exports                                                                                       | Matches                                                       |
| ------------------------ | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `css-var-patterns.ts`    | `createCssColorVarInVarRe`, `createCssColorVarDirectRe`, `createOklchColorRe`, `cssVarNameRe` | CSS color variable usages, declarations, and raw OKLCH values |
| `token-path-patterns.ts` | `tokenPathRe`, `createColorPathRe`                                                            | TypeScript/JS path expressions for tokens and primitives      |

### `src/preview-config.ts` — Configuration Parsing

Handles VS Code's dual configuration API (object-style `lufaDsPreview` and flat-style `lufaDsPreview.tokensMapPath`). `mergePreviewConfig` combines both, with the object-style taking precedence.

---

## Supported Token Formats

### CSS / SCSS / PostCSS

```css
/* var() usage — color decorator */
color: var(--lufa-core-color-brand-500);
background: var(--lufa-semantic-ui-background-primary, #fallback);

/* Direct declaration — color decorator */
--lufa-primitive-color-neutral-neutral-900: oklch(20% 0.1 180 / 0.5);

/* Raw OKLCH literal — color decorator */
border-color: oklch(70% 0.1 200 / 0.5);

/* Non-color var — hover preview only */
padding: var(--lufa-semantic-ui-spacing-default);
```

### TypeScript / TSX

```typescript
// Color paths — color decorator
const c1 = primitives.color.chromatic.red[500];
const c2 = tokens.color.brand.primary;

// Non-color paths — hover preview only
const gap = tokens.spacing.base;
const scale = primitives.spacing[16];
```

---

## Usage Guide

### Development / Extension Host

1. Clone the monorepo and run `pnpm install`.
2. Build the design-system tokens: `pnpm --filter @grasdouble/lufa_design-system-tokens build`
3. Build the extension: `pnpm run build` (from the package root).
4. Press **F5** in VS Code to launch an Extension Development Host.
5. Open any CSS, SCSS, PostCSS, TypeScript, or TSX file that uses Lufa tokens.

### Local Installation (VSIX)

```bash
# Build and package (no install)
pnpm run build-and-no-install

# Build, package, and install
pnpm run build-and-install
```

The `.vsix` file is produced by `scripts/package.sh` using `@vscode/vsce`.

### Updating Bundled Maps

```bash
# From the monorepo root
pnpm --filter @grasdouble/lufa_design-system-tokens build
pnpm run build   # from the extension package directory
```

The esbuild `copy-lufa-maps` plugin copies the fresh map into `dist/maps/` automatically.

### Custom Map Configuration

```json
{
  "lufaDsPreview": {
    "tokensMapPath": "packages/design-system/tokens/dist/tokens.map.json"
  }
}
```

The extension watches the file and reloads automatically on change.

### Debug Mode

```json
{
  "lufaDsPreview": { "debug": true }
}
```

View output at **View → Output → Lufa DS Preview**.

---

## Dependencies

### Runtime

| Package                                 | Version       | Purpose                                           |
| --------------------------------------- | ------------- | ------------------------------------------------- |
| `@grasdouble/lufa_design-system-tokens` | `workspace:^` | Source of bundled `tokens.map.json` at build time |
| `culori`                                | `^4.0.2`      | OKLCH → RGB color conversion                      |

### Development

| Package                            | Version       | Purpose                             |
| ---------------------------------- | ------------- | ----------------------------------- |
| `@types/vscode`                    | `^1.108.1`    | VS Code extension API types         |
| `@vscode/vsce`                     | `^3.7.1`      | VSIX packaging                      |
| `esbuild`                          | `^0.27.2`     | Bundler                             |
| `typescript`                       | `^5.9.3`      | TypeScript compiler (ES2020 target) |
| `vitest`                           | `^4.0.18`     | Unit test runner                    |
| `@vitest/coverage-v8`              | `^4.0.18`     | Coverage reporting                  |
| `eslint`                           | `^9.39.2`     | Linting                             |
| `prettier`                         | `^3.8.1`      | Formatting                          |
| `@grasdouble/lufa_config_eslint`   | `workspace:^` | Shared ESLint config                |
| `@grasdouble/lufa_config_prettier` | `workspace:^` | Shared Prettier config              |

### VS Code Engine

```json
"engines": { "vscode": "^1.108.0" }
```

---

## Testing

Tests live in `src/__tests__/` and use **Vitest**. Coverage provided by `@vitest/coverage-v8`.

| Test File                    | Coverage Area                                                |
| ---------------------------- | ------------------------------------------------------------ |
| `index.test.ts`              | Extension activation / deactivation lifecycle                |
| `preview-providers.test.ts`  | Provider factory behaviour (color, hover, completion)        |
| `values-map-store.test.ts`   | Map loading, caching, watcher lifecycle, security validation |
| `values-map.test.ts`         | `isValidMap` and `getEmbeddedMapPath` helpers                |
| `reference-resolver.test.ts` | Path candidate generation and lookup logic                   |
| `preview-config.test.ts`     | Config parsing and merging                                   |

```bash
pnpm test              # run once
pnpm test:watch        # watch mode
pnpm test:coverage     # with coverage
pnpm typecheck         # TypeScript type checking (tsconfig.typecheck.json)
```

---

## Related Documentation

- `@grasdouble/lufa_design-system-tokens` — produces `tokens.map.json` consumed by this extension
- `@grasdouble/lufa_design-system-primitives` — historical source of primitives map (now unified into tokens map)
- Monorepo root `README.md` — overall project structure
- `CHANGELOG.md` (this package) — full version history

---

## Troubleshooting Quick Reference

| Symptom                   | Resolution                                                                                              |
| ------------------------- | ------------------------------------------------------------------------------------------------------- |
| No color swatches visible | Verify `dist/maps/tokens.map.json` exists; rebuild the design-system tokens package then the extension. |
| Colors are stale          | Rebuild tokens package, then rebuild extension.                                                         |
| Custom map not loading    | Check path is correct; enable debug mode; ensure path is inside workspace.                              |
| Extension not activating  | Check VS Code version is ≥ 1.108.0.                                                                     |
