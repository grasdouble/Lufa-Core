---
package: '@grasdouble/lufa_config_tsconfig'
shortName: lufa_config_tsconfig
category: config
version: '0.1.1'
private: false
lastUpdated: '2026-02-24'
generatedAtCommit: 'd27c912328f538971b6720513be2c817c2feff15'
---

# @grasdouble/lufa_config_tsconfig

## Overview

`@grasdouble/lufa_config_tsconfig` is the shared TypeScript configuration package for the Lufa monorepo. It provides a set of pre-configured `tsconfig.json` presets that enforce consistent TypeScript compiler options across all packages and applications in the monorepo — eliminating per-package boilerplate and ensuring uniform strict-mode settings, module resolution strategies, and JSX transforms.

The package exposes four JSON configuration files, each targeting a distinct project archetype: a base config, a Node.js server config, a React library config, and a React application config. All specialized configs extend the base, keeping inheritance shallow and overrides minimal.

---

## Purpose

- Centralise TypeScript compiler settings so that every package in the monorepo stays in sync.
- Prevent configuration drift: one source of truth for `strict`, `moduleResolution`, `target`, and `jsx` options.
- Reduce the footprint of per-package `tsconfig.json` files to only the fields that are genuinely project-specific (e.g. `outDir`, `include`/`exclude`, `paths`).

---

## Architecture

```
base.json                    ← Foundation for all configs
  ├── node.json              ← Extends base → Node.js / CLI tools
  ├── react-app.json         ← Extends base → React SPA / microfrontends
  └── react-library.json     ← Extends base → Publishable React component libs
```

All three specialised configs only override the minimum set of options needed for their target runtime; every other option is inherited from `base.json`.

---

## Key Components

### `base.json`

**Source**: `packages/config/tsconfig/base.json`

The root configuration shared by all presets.

| Option                             | Value                                             | Rationale                                                           |
| ---------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------- |
| `strict`                           | `true`                                            | Full strict mode — all sub-flags enabled                            |
| `alwaysStrict`                     | `true`                                            | Emits `"use strict"` in every output file                           |
| `noImplicitAny`                    | `true`                                            | Forbids implicit `any` types                                        |
| `noImplicitThis`                   | `true`                                            | Forbids `this` of type `any`                                        |
| `strictNullChecks`                 | `true`                                            | `null`/`undefined` are not assignable to other types                |
| `strictFunctionTypes`              | `true`                                            | Enables contravariant function parameter checks                     |
| `strictPropertyInitialization`     | `true`                                            | Class properties must be initialised in the constructor             |
| `allowJs`                          | `false`                                           | Pure TypeScript only by default                                     |
| `allowSyntheticDefaultImports`     | `true`                                            | Allows `import x from 'y'` style imports                            |
| `esModuleInterop`                  | `true`                                            | Compatible CJS/ESM interop                                          |
| `isolatedModules`                  | `true`                                            | Each file is a standalone module (required for esbuild/swc)         |
| `module`                           | `"ESNext"`                                        | Output as ES Modules                                                |
| `moduleResolution`                 | `"node"`                                          | Classic Node module resolution                                      |
| `declaration`                      | `true`                                            | Emit `.d.ts` declaration files                                      |
| `declarationMap`                   | `true`                                            | Emit `.d.ts.map` source maps                                        |
| `sourceMap`                        | `true`                                            | Emit `.js.map` source maps                                          |
| `resolveJsonModule`                | `true`                                            | Allow importing `.json` files                                       |
| `skipLibCheck`                     | `true`                                            | Skip type-checking of `.d.ts` files in `node_modules`               |
| `forceConsistentCasingInFileNames` | `true`                                            | Prevent case-insensitive import bugs on case-sensitive OSes         |
| `composite`                        | `false`                                           | Project references disabled by default                              |
| `inlineSources`                    | `false`                                           | Source not inlined into source maps                                 |
| `preserveWatchOutput`              | `true`                                            | Keeps terminal clean in watch mode                                  |
| `tsBuildInfoFile`                  | `"./node_modules/.tmp/tsconfig.node.tsbuildinfo"` | Incremental build cache location                                    |
| `noUnusedLocals`                   | `false`                                           | Unused locals are allowed (not enforced by TS, delegated to linter) |
| `noUnusedParameters`               | `false`                                           | Unused parameters are allowed                                       |
| `exclude`                          | `["node_modules"]`                                | Excludes `node_modules` from compilation                            |

---

### `node.json`

**Source**: `packages/config/tsconfig/node.json`

Preset for Node.js servers, CLI tools, and scripts.

**Extends**: `./base.json`

| Override           | Value        | Rationale                                                             |
| ------------------ | ------------ | --------------------------------------------------------------------- |
| `module`           | `"NodeNext"` | Use Node's native ESM/CJS dual-mode resolution                        |
| `moduleResolution` | `"nodenext"` | Pairs with `NodeNext` — requires explicit `.js` extensions in imports |
| `target`           | `"ESNext"`   | Target latest ECMAScript features supported by the Node runtime       |

**Used by**: `design-system/cli`, `design-system/themes/scripts`, `plugins/vite/*`, `cdn/autobuild-server`

---

### `react-app.json`

**Source**: `packages/config/tsconfig/react-app.json`

Preset for React single-page applications and microfrontends consumed by a bundler (Vite, Webpack, etc.).

**Extends**: `./base.json`

| Override           | Value         | Rationale                                                                              |
| ------------------ | ------------- | -------------------------------------------------------------------------------------- |
| `jsx`              | `"react-jsx"` | Uses the React 17+ automatic JSX transform — no `import React` needed                  |
| `module`           | `"ESNext"`    | Bundler handles module format transformation                                           |
| `moduleResolution` | `"bundler"`   | TypeScript 5 resolution that mirrors what bundlers do (no `.js` extension requirement) |
| `target`           | `"ESNext"`    | Output targeting modern browsers                                                       |

**Used by**: `apps/microfrontend/home`, `apps/microfrontend/main-container`, `design-system/playwright`

---

### `react-library.json`

**Source**: `packages/config/tsconfig/react-library.json`

Preset for publishable React component libraries that need to generate type declarations alongside compiled output.

**Extends**: `./base.json`

| Override           | Value                               | Rationale                                           |
| ------------------ | ----------------------------------- | --------------------------------------------------- |
| `jsx`              | `"react-jsx"`                       | Automatic JSX transform                             |
| `module`           | `"ESNext"`                          | ESM output for tree-shaking consumers               |
| `moduleResolution` | `"bundler"`                         | Bundler-mode resolution                             |
| `target`           | `"ESNext"`                          | Modern output                                       |
| `lib`              | `["dom", "dom.iterable", "esnext"]` | Includes DOM type definitions for browser APIs      |
| `declaration`      | `true`                              | Generate `.d.ts` files (explicit; also in base)     |
| `declarationMap`   | `true`                              | Generate `.d.ts.map` files (explicit; also in base) |

> **Note**: `react-library.json` also contains a `rules.noImplicitAny: true` top-level key. This is not a standard TypeScript field and has no effect on the compiler — it appears to be a leftover annotation or mistake.

**Used by**: `design-system/main`, `design-system/tokens`, `design-system/themes`

---

## API Reference

This package exposes no JavaScript or TypeScript runtime exports. Its public API consists of the four JSON files listed below, referenced via TypeScript's `extends` mechanism.

| Exported Config      | Extend Path                                           |
| -------------------- | ----------------------------------------------------- |
| Base config          | `@grasdouble/lufa_config_tsconfig/base.json`          |
| Node.js config       | `@grasdouble/lufa_config_tsconfig/node.json`          |
| React app config     | `@grasdouble/lufa_config_tsconfig/react-app.json`     |
| React library config | `@grasdouble/lufa_config_tsconfig/react-library.json` |

---

## Usage Examples

### Minimal base extension

```json
// tsconfig.json
{
  "extends": "@grasdouble/lufa_config_tsconfig/base.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src"]
}
```

### Node.js package / CLI tool

```json
// tsconfig.json
{
  "extends": "@grasdouble/lufa_config_tsconfig/node.json",
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

> When using `node.json`, all imports must include explicit file extensions (`.js`) to satisfy `moduleResolution: nodenext`.

### React application (Vite / bundled)

```json
// tsconfig.json
{
  "extends": ["@grasdouble/lufa_config_tsconfig/react-app.json"],
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules", "dist"]
}
```

### React component library

```json
// tsconfig.json
{
  "extends": "@grasdouble/lufa_config_tsconfig/react-library.json",
  "include": ["src/**/*"],
  "compilerOptions": {
    "outDir": "./dist"
  },
  "exclude": ["dist", "build", "node_modules"]
}
```

### React library with path aliases (real-world: `design-system/main`)

```json
// tsconfig.json
{
  "extends": "@grasdouble/lufa_config_tsconfig/react-library.json",
  "include": ["src/**/*"],
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@foundation/*": ["foundation/*"],
      "@content/*": ["content/*"],
      "@interaction/*": ["interaction/*"]
    }
  },
  "exclude": ["dist", "build", "node_modules", "scripts"]
}
```

### Overriding strict defaults

```json
// tsconfig.json — relax unused variable checks for generated code
{
  "extends": "@grasdouble/lufa_config_tsconfig/react-library.json",
  "compilerOptions": {
    "outDir": "./dist",
    "allowJs": true,
    "emitDeclarationOnly": false
  }
}
```

---

## Dependencies

This package has **no runtime dependencies** and **no `devDependencies`** listed in its `package.json`. It is a pure JSON-file package with no build step required.

| Field           | Value                                          |
| --------------- | ---------------------------------------------- |
| License         | MIT                                            |
| Published to    | `https://npm.pkg.github.com` (GitHub Packages) |
| Registry access | `public`                                       |
| Lint-staged     | Runs `prettier --write` on `*.{json,md}` files |

---

## Changelog Summary

| Version | Type  | Summary                                                                   |
| ------- | ----- | ------------------------------------------------------------------------- |
| `0.1.1` | patch | Prettier config fix, README updates, lint/tsconfig improvements           |
| `0.1.0` | minor | Improved configs — added dedicated Node config, ESLint/Prettier variants  |
| `0.0.3` | patch | Updated `publishConfig`                                                   |
| `0.0.2` | patch | Improved shared TypeScript/ESLint config; applied changes across packages |

---

## Related Documentation

- `@grasdouble/lufa_config_eslint` — ESLint configuration (`packages/config/eslint/`)
- `@grasdouble/lufa_config_prettier` — Prettier configuration (`packages/config/prettier/`)
