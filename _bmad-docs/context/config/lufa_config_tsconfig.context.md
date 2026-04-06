---
package: '@grasdouble/lufa_config_tsconfig'
shortName: lufa_config_tsconfig
category: config
type: context
lastUpdated: '2026-02-24'
generatedAtCommit: 'd27c912328f538971b6720513be2c817c2feff15'
---

# Context: @grasdouble/lufa_config_tsconfig

## Package Info

| Field           | Value                                                |
| --------------- | ---------------------------------------------------- |
| Full name       | `@grasdouble/lufa_config_tsconfig`                   |
| Version         | `0.1.1`                                              |
| Private         | `false`                                              |
| Source path     | `packages/config/tsconfig/`                          |
| No JS/TS source | Config-only package — four JSON files, no build step |

---

## Critical Rules

1. **No runtime code**: This package contains only `.json` files. Do not add `.ts`/`.js` source files to it.
2. **All specialised configs must extend `base.json`**: `node.json`, `react-app.json`, and `react-library.json` all use `"extends": "./base.json"`. New configs must follow this pattern.
3. **`node.json` requires explicit `.js` extensions in imports**: `moduleResolution: nodenext` enforces this at the TypeScript level. Packages using `node.json` must suffix all relative imports with `.js`.
4. **Do not override `strict`**: All configs inherit `"strict": true` from the base. Packages must not set `"strict": false` in their local `tsconfig.json`.
5. **`react-library.json` includes DOM types**: The `lib: ["dom", "dom.iterable", "esnext"]` field is set in `react-library.json`. Packages targeting a pure Node environment should use `node.json` instead.
6. **`composite: false` by default**: Project references are disabled. If a package requires incremental project-reference builds, it must explicitly set `"composite": true` locally.
7. **The `rules` key in `react-library.json` is non-standard**: `react-library.json` contains `"rules": { "noImplicitAny": true }`. This is not a valid TypeScript compiler field and has no effect — treat it as dead weight and do not replicate this pattern.

---

## Import Pattern

There is no JavaScript/TypeScript import. Configs are consumed via the `extends` key in a consumer's `tsconfig.json`:

```json
// String form (most common)
{ "extends": "@grasdouble/lufa_config_tsconfig/<config>.json" }

// Array form (also valid, seen in several packages)
{ "extends": ["@grasdouble/lufa_config_tsconfig/<config>.json"] }
```

Install as a dev dependency:

```bash
pnpm add -D @grasdouble/lufa_config_tsconfig
```

Or in workspace packages:

```json
// package.json devDependencies
{
  "@grasdouble/lufa_config_tsconfig": "workspace:^"
}
```

---

## Available Configs

| File                 | Use When                                                        |
| -------------------- | --------------------------------------------------------------- |
| `base.json`          | Generic TypeScript library with no environment-specific needs   |
| `node.json`          | Node.js server, CLI tool, or build script                       |
| `react-app.json`     | React SPA or microfrontend consumed by a bundler (Vite/Webpack) |
| `react-library.json` | Publishable React component library requiring `.d.ts` output    |

---

## Key Compiler Options by Config

### Inherited by all (from `base.json`)

```
strict: true
alwaysStrict: true
noImplicitAny: true
noImplicitThis: true
strictNullChecks: true
strictFunctionTypes: true
strictPropertyInitialization: true
isolatedModules: true          ← required for esbuild/swc compatibility
allowJs: false
esModuleInterop: true
allowSyntheticDefaultImports: true
declaration: true
declarationMap: true
sourceMap: true
resolveJsonModule: true
skipLibCheck: true
forceConsistentCasingInFileNames: true
module: ESNext
moduleResolution: node
```

### `node.json` overrides

```
module: NodeNext
moduleResolution: nodenext     ← requires ".js" extension on all relative imports
target: ESNext
```

### `react-app.json` overrides

```
jsx: react-jsx                 ← React 17+ automatic transform, no "import React" needed
module: ESNext
moduleResolution: bundler      ← TypeScript 5 bundler mode, no extension requirement
target: ESNext
```

### `react-library.json` overrides

```
jsx: react-jsx
module: ESNext
moduleResolution: bundler
target: ESNext
lib: ["dom", "dom.iterable", "esnext"]   ← adds browser DOM types
declaration: true              (explicit)
declarationMap: true           (explicit)
```

---

## Common Patterns

### Minimal consumer tsconfig for a Node package

```json
{
  "extends": "@grasdouble/lufa_config_tsconfig/node.json",
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### React app with bundler output

```json
{
  "extends": ["@grasdouble/lufa_config_tsconfig/react-app.json"],
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules", "dist"]
}
```

### React library with path aliases

```json
{
  "extends": "@grasdouble/lufa_config_tsconfig/react-library.json",
  "include": ["src/**/*"],
  "compilerOptions": {
    "outDir": "./dist",
    "baseUrl": "./src",
    "paths": { "@components/*": ["components/*"] }
  },
  "exclude": ["dist", "node_modules"]
}
```

### Overriding a base option locally (e.g. allow JS files in generated output)

```json
{
  "extends": "@grasdouble/lufa_config_tsconfig/react-library.json",
  "compilerOptions": {
    "allowJs": true,
    "emitDeclarationOnly": false,
    "outDir": "./dist",
    "rootDir": "./dist"
  }
}
```

### Multiple tsconfig files in one package (typecheck vs build)

```
tsconfig.json              ← build config, extends this package
tsconfig.typecheck.json    ← type-check only config, may extend this package separately
```

---

## Anti-patterns

| Anti-pattern                                             | Why Avoid                                                                 |
| -------------------------------------------------------- | ------------------------------------------------------------------------- |
| `"strict": false` in a consumer tsconfig                 | Defeats the monorepo-wide strict guarantee; all packages must stay strict |
| Using `node.json` for a React component lib              | Missing `lib: ["dom"]` — browser API types will be absent                 |
| Using `react-library.json` for a pure Node CLI           | Unnecessarily pulls in DOM type definitions                               |
| Omitting `include` / `exclude`                           | TypeScript will scan the entire workspace; be explicit                    |
| Replicating base options in a consumer config            | Adds noise and risks going out of sync; rely on inheritance               |
| Adding `"rules"` or other non-TS keys                    | TypeScript silently ignores unknown top-level keys — no effect            |
| Importing with no `.js` extension when using `node.json` | `moduleResolution: nodenext` will fail to resolve the module              |

---

## Dependencies Context

This package has zero declared dependencies. It is a leaf in the dependency graph — nothing in this package depends on other Lufa packages.

**Packages that depend on `@grasdouble/lufa_config_tsconfig`** (workspace consumers):

| Package                                        | Config used          |
| ---------------------------------------------- | -------------------- |
| `design-system/main`                           | `react-library.json` |
| `design-system/tokens`                         | `react-library.json` |
| `design-system/themes`                         | `react-library.json` |
| `design-system/themes/scripts`                 | `node.json`          |
| `design-system/cli`                            | `node.json`          |
| `design-system/storybook`                      | (devDep, config TBD) |
| `design-system/docusaurus`                     | (devDep, config TBD) |
| `design-system/playwright`                     | `react-app.json`     |
| `apps/microfrontend/home`                      | `react-app.json`     |
| `apps/microfrontend/main-container`            | `react-app.json`     |
| `cdn/autobuild-server`                         | `node.json`          |
| `plugins/vite/vite-plugin-react-preamble`      | `node.json`          |
| `plugins/vite/vite-plugin-import-map-injector` | `node.json`          |
