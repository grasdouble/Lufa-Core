# @grasdouble/lufa_config_tsconfig

> Shared TypeScript configurations for the Lufa monorepo.

## Overview

This package ships four `tsconfig` presets suited to different project types. All presets extend a strict `base.json` and can be further customized locally.

| File                 | Target             | Module / Resolution              |
| -------------------- | ------------------ | -------------------------------- |
| `base.json`          | All projects       | ESNext / bundler                 |
| `node.json`          | Node.js servers    | NodeNext / nodenext              |
| `react-app.json`     | React applications | ESNext / bundler + JSX           |
| `react-library.json` | React libraries    | ESNext / bundler + JSX + `.d.ts` |

## Installation

```bash
pnpm add -D @grasdouble/lufa_config_tsconfig
```

## Usage

### Base (generic TypeScript project)

```json
{
  "extends": "@grasdouble/lufa_config_tsconfig/base.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src"]
}
```

### Node.js project

```json
{
  "extends": "@grasdouble/lufa_config_tsconfig/node.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src"]
}
```

### React application

```json
{
  "extends": "@grasdouble/lufa_config_tsconfig/react-app.json",
  "include": ["src"]
}
```

### React library (with declaration files)

```json
{
  "extends": "@grasdouble/lufa_config_tsconfig/react-library.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src"]
}
```

## Base compiler options

These options are set in `base.json` and inherited by all presets:

| Option                         | Value     |
| ------------------------------ | --------- |
| `strict`                       | `true`    |
| `noImplicitAny`                | `true`    |
| `strictNullChecks`             | `true`    |
| `strictFunctionTypes`          | `true`    |
| `strictPropertyInitialization` | `true`    |
| `alwaysStrict`                 | `true`    |
| `isolatedModules`              | `true`    |
| `esModuleInterop`              | `true`    |
| `resolveJsonModule`            | `true`    |
| `skipLibCheck`                 | `true`    |
| `declaration`                  | `true`    |
| `declarationMap`               | `true`    |
| `sourceMap`                    | `true`    |
| `module`                       | `ESNext`  |
| `moduleResolution`             | `bundler` |

> ⚠️ Because `declaration: true` and `sourceMap: true` are set in the base, **never run bare `tsc`** in source folders — it will emit `.js`, `.d.ts`, and `.map` files next to your source files. Always use `--noEmit` or the `pnpm typecheck` script.

## Customization

Local overrides go in your project's `tsconfig.json`:

```json
{
  "extends": "@grasdouble/lufa_config_tsconfig/react-app.json",
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## Related

- [`@grasdouble/lufa_config_eslint`](../eslint/) — ESLint configuration
- [`@grasdouble/lufa_config_prettier`](../prettier/) — Prettier configuration
