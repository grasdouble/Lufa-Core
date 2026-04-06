---
package: '@grasdouble/lufa_plugin_vscode_lufa-ds-preview'
shortName: lufa_plugin_vscode_lufa-ds-preview
category: plugins
type: context
lastUpdated: '2026-02-24'
generatedAtCommit: 'd27c912328f538971b6720513be2c817c2feff15'
---

# Context: lufa_plugin_vscode_lufa-ds-preview

## One-Line Summary

VS Code extension that renders inline color decorators, hover value tooltips, and enriched autocomplete for Lufa design tokens in CSS/SCSS/PostCSS/TypeScript files.

---

## Package Identity

| Field          | Value                                            |
| -------------- | ------------------------------------------------ |
| npm name       | `@grasdouble/lufa_plugin_vscode_lufa-ds-preview` |
| Display name   | Lufa DS Preview                                  |
| Version        | 0.4.4                                            |
| Private        | false                                            |
| Publisher      | grasdouble                                       |
| VS Code engine | `^1.108.0`                                       |
| Activation     | `onStartupFinished`                              |
| Entry point    | `dist/extension.js`                              |
| Source entry   | `src/index.ts`                                   |
| Build tool     | esbuild (`esbuild.mjs`)                          |

---

## What This Package Does

- Registers a **DocumentColorProvider** — scans documents for Lufa token references and displays color swatches beside them.
- Registers a **HoverProvider** — shows the resolved value of any Lufa token when the cursor hovers over it.
- Registers a **CompletionItemProvider** — enriches VS Code autocomplete suggestions for Lufa tokens with their resolved values and color swatches.
- Loads and caches a **TokenMap JSON** (`tokens.map.json`) from a bundled copy in `dist/maps/` or from a user-configured custom path.
- Watches the token map file for changes and auto-invalidates cache.

---

## Source File Index

| File                                  | Role                                                                                                           |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `src/index.ts`                        | `activate` / `deactivate` — wires all providers and the config change listener                                 |
| `src/preview-providers.ts`            | `createDocumentColorProvider`, `createHoverProvider`, `createCompletionProvider`                               |
| `src/values-map-store.ts`             | `createValuesMapStore` — map loading, mtime caching, file watching, config resolution, workspace-path security |
| `src/values-map.ts`                   | `TokenMap` type, `isValidMap`, `getEmbeddedMapPath`                                                            |
| `src/reference-resolver.ts`           | `resolveTokenValueFromMap`, `getPathCandidates`, `lookupValue`, quote-variant helpers                          |
| `src/preview-config.ts`               | `LufaPreviewConfig` type, `parseObjectConfig`, `parseFlatConfig`, `mergePreviewConfig`                         |
| `src/patterns/css-var-patterns.ts`    | Regex for CSS color var usages, declarations, and literal OKLCH values                                         |
| `src/patterns/token-path-patterns.ts` | Regex for TypeScript/JS token path references                                                                  |
| `src/types/culori.d.ts`               | Ambient type declarations for the `culori` color library                                                       |

---

## TokenMap Shape

```typescript
type TokenMap = {
  version: number;
  generatedAt?: string;
  css: Record<string, string>; // "--lufa-*" CSS variable name → OKLCH / value string
  paths: Record<string, string>; // "tokens.*" / "primitives.*" path → value string
};
```

Produced by `@grasdouble/lufa_design-system-tokens` as `dist/tokens.map.json`. Copied into the extension bundle at `dist/maps/tokens.map.json` during the esbuild build step.

---

## Regex Patterns Summary

### CSS patterns (`css-var-patterns.ts`)

| Pattern factory               | Matches                |
| ----------------------------- | ---------------------- | ---- | -------- | ------------------------------------ |
| `createCssColorVarInVarRe()`  | `var(--lufa-{primitive | core | semantic | component}-_color-_, ...)`           |
| `createCssColorVarDirectRe()` | `--lufa-{primitive     | core | semantic | component}-_color-_:` (declarations) |
| `createOklchColorRe()`        | `oklch(...)` anywhere  |
| `cssVarNameRe` (hover)        | Any `--lufa-{primitive | core | semantic | component}-\*` variable              |

### TypeScript/JS patterns (`token-path-patterns.ts`)

| Pattern factory       | Matches                                                                   |
| --------------------- | ------------------------------------------------------------------------- |
| `createColorPathRe()` | `tokens.color.*`, `primitive.color.*`, etc. (color decorator)             |
| `tokenPathRe` (hover) | Any `tokens.*`, `primitive.*`, `core.*`, `semantic.*`, `component.*` path |

---

## Provider Behaviour Details

### DocumentColorProvider

- Passes: (1) CSS `var()` color usages, (2) CSS direct declarations, (3) raw `oklch()` literals, (4) TS/JS color paths.
- Each match is resolved against `TokenMap.css` or `TokenMap.paths`.
- OKLCH string → RGB via `culori` converter. Alpha preserved.
- Returns `vscode.ColorInformation[]`.

### HoverProvider

- Uses combined `cssVarNameRe | tokenPathRe` to find word range at cursor.
- Calls `resolveTokenValueFromMap` — routes CSS vars to `map.css`, paths to `map.paths`.
- Returns `vscode.Hover` with Markdown: `` `tokenName` = `value` ``.

### CompletionItemProvider

- Looks back up to 200 characters from cursor.
- CSS mode: prefix `--lufa-{primitive|core|semantic|component|tokens}-*` → items from `map.css`.
- Path mode: prefix `tokens.*` / `primitive.*` / etc. → items from `map.paths`.
- Max 200 items returned per call.
- Color tokens: `CompletionItemKind.Color` + inline HTML swatch in documentation.
- Non-color tokens: `CompletionItemKind.Variable` or `CompletionItemKind.Constant`.
- Quote-style preservation: detects `['` vs `["` context in prefix and normalises path items accordingly.

---

## Configuration Schema

```
lufaDsPreview                      (object)
├── tokensMapPath                  (string, optional)
│     Relative (to workspace root) or absolute path to tokens.map.json.
│     Falls back to bundled dist/maps/tokens.map.json when unset or file missing.
└── debug                          (boolean, default: false)
      Enables verbose logging to the "Lufa DS Preview" output channel.
```

Configuration is read on every provider invocation (not cached in memory beyond the map mtime). Both the nested object form (`"lufaDsPreview": { ... }`) and the flat form (`"lufaDsPreview.tokensMapPath": "..."`) are supported; object form takes precedence.

---

## Map Loading / Caching Logic

```
loadValuesMap() called
  │
  ├── Read lufaDsPreview config
  ├── Resolve tokensMapPath (custom > packaged fallback)
  ├── statSync → compare mtime with cache
  │     ├── HIT  → return cached TokenMap snapshot
  │     └── MISS → readFileSync + JSON.parse + isValidMap check
  │                 ├── VALID   → update cache, return map
  │                 └── INVALID → log warning, return null
  │
  └── If custom path fails → retry with packaged map
```

Cache invalidation triggers:

- `FileSystemWatcher.onDidChange/onCreate/onDelete` for the active map path.
- `onDidChangeConfiguration` for any `lufaDsPreview.*` setting.
- Explicit `resetAllCache()` call.

---

## Security Notes

- Relative `tokensMapPath` values are resolved against the first workspace folder and then validated to confirm they remain within the workspace (`isPathInWorkspace`).
- Absolute paths are accepted without workspace restriction.
- Paths that escape the workspace via relative traversal (`../../...`) are blocked with a logged warning and fall back to the packaged map.

---

## Build Artifacts

| Path                        | Content                                                          |
| --------------------------- | ---------------------------------------------------------------- |
| `dist/extension.js`         | Bundled extension (CJS, esbuild, `vscode` external)              |
| `dist/maps/tokens.map.json` | Token map copied from design-system tokens package at build time |
| `*.vsix`                    | Packaged extension (produced by `scripts/package.sh`)            |

---

## Test Coverage

| File                                       | What Is Tested                                        |
| ------------------------------------------ | ----------------------------------------------------- |
| `src/__tests__/index.test.ts`              | `activate` / `deactivate` lifecycle                   |
| `src/__tests__/preview-providers.test.ts`  | Color, hover, and completion provider logic           |
| `src/__tests__/values-map-store.test.ts`   | Map loading, caching, watcher setup, security checks  |
| `src/__tests__/values-map.test.ts`         | `isValidMap`, `getEmbeddedMapPath`                    |
| `src/__tests__/reference-resolver.test.ts` | Path candidate expansion, lookup, quote normalisation |
| `src/__tests__/preview-config.test.ts`     | Config parsing + merge                                |

---

## Key Dependencies

| Package                                 | Role                                                                   |
| --------------------------------------- | ---------------------------------------------------------------------- |
| `@grasdouble/lufa_design-system-tokens` | Build-time source of `tokens.map.json`                                 |
| `culori`                                | OKLCH → RGB conversion (runtime)                                       |
| `vscode`                                | VS Code extension API (external at runtime, types via `@types/vscode`) |

---

## Extension Lifecycle

```
onStartupFinished
  → activate()
      → createOutputChannel("Lufa DS Preview")
      → createValuesMapStore(logOnce)
      → store.setExtensionRootPath(context.extensionPath)
      → store.setupMapWatchers(context)
      → register onDidChangeConfiguration
      → createDocumentColorProvider  → registerColorProvider
      → createHoverProvider          → registerHoverProvider
      → createCompletionProvider     → registerCompletionItemProvider
  [extension active for session]
  → deactivate()
      → store.dispose()   (disposes watchers + clears cache)
      → outputChannel.dispose()
```

---

## Common Integration Points for AI Agents

- To understand **what tokens are available**, read `dist/maps/tokens.map.json` (or the source at `@grasdouble/lufa_design-system-tokens/dist/tokens.map.json`).
- To extend **pattern matching** (new token namespaces or CSS variable formats), modify `src/patterns/css-var-patterns.ts` or `src/patterns/token-path-patterns.ts`.
- To add a **new provider type** (e.g., code lens, diagnostic), follow the factory pattern in `src/preview-providers.ts` and register in `src/index.ts`.
- To add **new config options**, extend `LufaPreviewConfig` in `src/preview-config.ts` and `contributes.configuration` in `package.json`.
- The `TokenMap` type is the single contract between the design-system build output and this extension. Any map schema changes require updates to `isValidMap` and consumers.
