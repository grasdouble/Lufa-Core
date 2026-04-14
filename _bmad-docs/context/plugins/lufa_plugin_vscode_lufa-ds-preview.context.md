---
generatedAtCommit: "ab53a003edb177c2298250479fbe4465ee920bc3"
lastUpdated: "2026-04-07"
package: "@grasdouble/lufa_plugin_vscode_lufa-ds-preview"
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
| Version        | 0.4.6                                            |
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

## Key Types

```typescript
// Token map loaded from dist/maps/tokens.map.json
type TokenMap = {
  version: number;
  generatedAt?: string;
  css: Record<string, string>;   // "--lufa-*" CSS variable name → OKLCH / value string
  paths: Record<string, string>; // "tokens.*" / "primitives.*" path → value string
};

// Extension configuration
type LufaPreviewConfig = {
  tokensMapPath?: string; // custom path to tokens.map.json
  debug?: boolean;        // enable verbose logging
};

// Dependency injection shape used by all provider factories
type DocumentColorProviderDeps = {
  loadValuesMap: () => TokenMap | null;
  isDebugEnabled: () => boolean;
  getOutputChannel: () => vscode.OutputChannel | null;
};

type HoverProviderDeps = {
  loadValuesMap: () => TokenMap | null;
};

type CompletionProviderDeps = {
  loadValuesMap: () => TokenMap | null;
};

// culori RGB representation (values in range [0, 1])
type Rgb = {
  r: number;
  g: number;
  b: number;
  alpha?: number;
};
```

---

## Critical Rules

1. **`vscode` is an external dependency** — never bundled; always provided by the extension host at runtime.
2. **TokenMap is the single contract** between the design-system build and this extension. Any schema change requires updating `isValidMap` in `src/values-map.ts`.
3. **Map path security** — relative `tokensMapPath` values are validated against workspace folders via `isPathInWorkspace`. Paths escaping the workspace are silently blocked and fall back to the packaged map.
4. **`provideColorPresentations` always returns `[]`** — color decorators are read-only display only; color pickers must not modify token values.
5. **Completion is capped at 200 items** (`MAX_COMPLETION_ITEMS`) to avoid overwhelming the VS Code UI.
6. **`logOnce` deduplication** — identical consecutive log lines are suppressed to keep the output channel readable.
7. **Config is never cached beyond mtime** — `getLufaPreviewConfig()` is called on every `loadValuesMap()` invocation so live config changes are always picked up.

---

## Import Pattern

This package is a VS Code extension — it is not imported by other packages. It is consumed exclusively through the VS Code extension host after being installed as a `.vsix` or loaded via F5 in an Extension Development Host.

The only external npm import inside the source is:

```typescript
import { converter } from 'culori'; // runtime color conversion
import * as vscode from 'vscode';   // VS Code API (external, not bundled)
```

---

## Common Patterns

### Provider factory with injected dependencies

All three providers follow the same dependency injection pattern:

```typescript
const provider = createDocumentColorProvider({
  loadValuesMap: () => mapStore?.loadValuesMap() ?? null,
  isDebugEnabled: () => mapStore?.isDebugEnabled() ?? false,
  getOutputChannel,
});
```

### Resolving a token value

```typescript
// CSS variable
resolveTokenValueFromMap('--lufa-core-color-brand-500', map);
// → looks up map.css['--lufa-core-color-brand-500']

// Token path
resolveTokenValueFromMap('tokens.color.brand[500]', map);
// → tries map.paths['tokens.color.brand[500]'] and quote variants
```

### Checking whether a value is a color

Color conversion via `culori` is wrapped in `safeToRgb` to avoid exceptions:

```typescript
const rgb = safeToRgb(value); // null if not a parseable color
if (rgb) {
  const color = new vscode.Color(rgb.r, rgb.g, rgb.b, rgb.alpha ?? 1);
}
```

### Configuration change handling

```typescript
vscode.workspace.onDidChangeConfiguration((e) => {
  if (e.affectsConfiguration('lufaDsPreview')) {
    mapStore?.resetAllCache();
    mapStore?.setupMapWatchers(context);
  }
});
```

---

## Anti-patterns

- **Do not cache `LufaPreviewConfig`** — always call `getLufaPreviewConfig()` fresh; the VS Code configuration API is the source of truth.
- **Do not bundle `vscode`** — it must remain in the `external` list in `esbuild.mjs`.
- **Do not call `loadValuesMap()` outside providers** — the store handles caching; calling it at module level would bypass lifecycle disposal.
- **Do not modify `provideColorPresentations`** — returning anything other than `[]` would allow VS Code to write back changed colors into token references, corrupting them.
- **Do not import from `dist/`** — always import source modules; the build output is for the extension host only.

---

## Regex Patterns Summary

### CSS patterns (`css-var-patterns.ts`)

| Export                        | Matches                                                                          |
| ----------------------------- | -------------------------------------------------------------------------------- |
| `createCssColorVarInVarRe()`  | `var(--lufa-{primitive\|core\|semantic\|component}-*color-*, ...)` usages        |
| `createCssColorVarDirectRe()` | `--lufa-{primitive\|core\|semantic\|component}-*color-*:` declarations           |
| `createOklchColorRe()`        | `oklch(...)` anywhere in document                                                |
| `cssVarNameRe`                | Any `--lufa-{primitive\|core\|semantic\|component}-*` variable (used in hover)   |

### TypeScript/JS patterns (`token-path-patterns.ts`)

| Export                | Matches                                                                                       |
| --------------------- | --------------------------------------------------------------------------------------------- |
| `createColorPathRe()` | `tokens.color.*`, `primitive.color.*`, `core.color.*`, etc. (for color decorator)             |
| `tokenPathRe`         | Any `tokens.*`, `primitive.*`, `core.*`, `semantic.*`, `component.*` path (for hover)         |

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

## Dependencies Context

| Package                                 | Role                                                                   |
| --------------------------------------- | ---------------------------------------------------------------------- |
| `@grasdouble/lufa_design-system-tokens` | Build-time source of `tokens.map.json`                                 |
| `culori` `^4.0.2`                       | OKLCH → RGB conversion (runtime, bundled into `dist/extension.js`)     |
| `vscode`                                | VS Code extension API (external at runtime, types via `@types/vscode`) |

---

## Build Artifacts

| Path                        | Content                                                          |
| --------------------------- | ---------------------------------------------------------------- |
| `dist/extension.js`         | Bundled extension (CJS, esbuild, `vscode` external)              |
| `dist/maps/tokens.map.json` | Token map copied from design-system tokens package at build time |
| `*.vsix`                    | Packaged extension (produced by `scripts/package.sh`)            |

---

## Quick Reference

| Task                            | Command / Location                                                                         |
| ------------------------------- | ------------------------------------------------------------------------------------------ |
| Build extension                 | `pnpm run build`                                                                           |
| Build + package VSIX            | `pnpm run build-and-no-install`                                                            |
| Build + package + install       | `pnpm run build-and-install`                                                               |
| Run tests                       | `pnpm test`                                                                                |
| Run tests with coverage         | `pnpm test:coverage`                                                                       |
| Type check                      | `pnpm typecheck`                                                                           |
| Update bundled token map        | Build `@grasdouble/lufa_design-system-tokens`, then rebuild extension                      |
| Enable debug logging            | `"lufaDsPreview": { "debug": true }` in workspace settings                                 |
| View debug output               | View → Output → "Lufa DS Preview"                                                          |
| Extend CSS token patterns       | `src/patterns/css-var-patterns.ts`                                                         |
| Extend TS/JS token patterns     | `src/patterns/token-path-patterns.ts`                                                      |
| Add a new provider              | Add factory in `src/preview-providers.ts`, register in `src/index.ts`                     |
| Add a new config option         | Extend `LufaPreviewConfig` in `src/preview-config.ts` + `contributes.configuration` in `package.json` |

---

## See Also

- `@grasdouble/lufa_design-system-tokens` — produces the `tokens.map.json` consumed by this extension
- `packages/plugins/vscode/vscode-lufa-ds-preview/CHANGELOG.md` — full version history
- `packages/plugins/vscode/vscode-lufa-ds-preview/README.md` — end-user guide including troubleshooting
