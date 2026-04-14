---
generatedAtCommit: "ab53a003edb177c2298250479fbe4465ee920bc3"
lastUpdated: "2026-04-07"
package: "@grasdouble/lufa_config_eslint"
---

# lufa_config_eslint — AI Context

Quick-reference context for AI agents working with `@grasdouble/lufa_config_eslint`.

## Package Info

| Field | Value |
| ----- | ----- |
| Package | `@grasdouble/lufa_config_eslint` |
| Version | `0.1.5` |
| License | MIT |
| Private | false |
| Registry | `https://npm.pkg.github.com` |
| Source | `packages/config/eslint/` |
| ESLint format | **Flat config** (ESLint 10+) — NOT legacy `.eslintrc` |

## Critical Rules

1. **All configs are flat-config arrays** — import and spread with `...`, never use as a single object.
2. **Use direct `.mjs` subpath imports** — there is no working `index.js` in the published files. Always import the specific file.
3. **`basic.mjs` requires `project: true` in `parserOptions`** — it uses `recommendedTypeChecked` which needs a TypeScript project reference. Omitting this causes type-aware lint rules to fail.
4. **`react.mjs` pins React to version `19.0`** — if a project uses a different React version, the `settings.react.version` should be overridden in a subsequent config block.
5. **`eslintConfigPrettier` is always last** in the base presets — preserve this when extending; adding Prettier-conflicting rules after it will re-introduce conflicts.
6. **`node.mjs` and `react.mjs` re-export all of `basic.mjs`** — do not spread `basic.mjs` in addition to `node.mjs` or `react.mjs`; rules will be duplicated.

## Import Pattern

```js
// light — for plain JS/config files, no TypeScript project needed
import lufaLightConfig from '@grasdouble/lufa_config_eslint/light.mjs';

// basic — TypeScript + browser (rarely used directly; prefer node or react)
import basicConfig from '@grasdouble/lufa_config_eslint/basic.mjs';

// node — TypeScript + Node.js globals
import lufaNodeConfig from '@grasdouble/lufa_config_eslint/node.mjs';

// react — TypeScript + React 19 + hooks + react-refresh
import lufaReactConfig from '@grasdouble/lufa_config_eslint/react.mjs';
```

Minimal `eslint.config.mjs`:

```js
import lufaNodeConfig from '@grasdouble/lufa_config_eslint/node.mjs';

export default [...lufaNodeConfig];
```

## Key Types

All exports are `Array<FlatConfig>` where `FlatConfig` is the ESLint 9+ flat-config object shape:

```ts
type FlatConfig = {
  files?: string[];
  ignores?: string[];
  languageOptions?: { ecmaVersion?; globals?; parserOptions? };
  plugins?: Record<string, Plugin>;
  rules?: Record<string, RuleConfig>;
  settings?: Record<string, unknown>;
};
```

## Config Selection Guide

| Project type | Config to use |
| ------------ | ------------- |
| Monorepo root / CI scripts / `.github/` JS | `light.mjs` |
| Pure TypeScript library (no Node, no React) | `basic.mjs` |
| Node.js CLI, server, build tool, Vite plugin | `node.mjs` |
| React component library, Vite app, Storybook | `react.mjs` |

## Common Patterns

### Add a TypeScript project path (required for `basic`, `node`, `react`)

```js
import lufaReactConfig from '@grasdouble/lufa_config_eslint/react.mjs';

export default [
  ...lufaReactConfig,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
```

### Override a specific rule

```js
import lufaNodeConfig from '@grasdouble/lufa_config_eslint/node.mjs';

export default [
  ...lufaNodeConfig,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error', // promote from warn to error
    },
  },
];
```

### Add file-specific ignores

```js
import lufaReactConfig from '@grasdouble/lufa_config_eslint/react.mjs';

export default [
  ...lufaReactConfig,
  {
    ignores: ['storybook-static', 'dist/**'],
  },
];
```

### Integrate a third-party plugin (e.g., Storybook)

```js
import storybook from 'eslint-plugin-storybook';
import lufaReactConfig from '@grasdouble/lufa_config_eslint/react.mjs';

export default [
  ...lufaReactConfig,
  ...storybook.configs['flat/recommended'],
  {
    rules: { '@typescript-eslint/no-explicit-any': 'off' },
  },
];
```

### Override unsafe TypeScript rules for third-party libraries

```js
import lufaNodeConfig from '@grasdouble/lufa_config_eslint/node.mjs';

export default [
  ...lufaNodeConfig,
  {
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
    },
  },
];
```

## Anti-patterns

### Wrong: named import from package root

```js
// BROKEN — no index.js exists in published files
import { basic, react } from '@grasdouble/lufa_config_eslint';
```

### Wrong: using as a single object

```js
// BROKEN — config is an array, not a single object
export default lufaReactConfig;
```

### Wrong: double-spreading base configs

```js
// BROKEN — node.mjs already includes all of basic.mjs
import basicConfig from '@grasdouble/lufa_config_eslint/basic.mjs';
import lufaNodeConfig from '@grasdouble/lufa_config_eslint/node.mjs';

export default [...basicConfig, ...lufaNodeConfig]; // Rules duplicated
```

### Wrong: using `react.mjs` without `project` config for type-checked rules

```js
// Will cause lint errors — type-aware rules need a tsconfig
import lufaReactConfig from '@grasdouble/lufa_config_eslint/react.mjs';

export default [...lufaReactConfig]; // Missing parserOptions.project
```

### Wrong: using `light.mjs` for TypeScript packages

```js
// light.mjs has no TypeScript support — use basic/node/react instead
import lufaLightConfig from '@grasdouble/lufa_config_eslint/light.mjs';

export default [...lufaLightConfig]; // No TS rules applied
```

## Dependencies Context

| Package | Why it's needed |
| ------- | --------------- |
| `@eslint/js` | Provides `js.configs.recommended` — the JS rule baseline used in all configs |
| `eslint-config-prettier` | Disables all ESLint rules that would conflict with Prettier formatting |
| `typescript-eslint` | TypeScript parser + typed lint rules (`recommendedTypeChecked`, `stylisticTypeChecked`) |
| `globals` | Provides `globals.browser`, `globals.node`, `globals.es2021` variable sets |
| `eslint-plugin-react` | React JSX rules and recommended rule sets (includes `jsx-runtime` for React 17+ transform) |
| `eslint-plugin-react-hooks` | Enforces Rules of Hooks and exhaustive dependency arrays |
| `eslint-plugin-react-refresh` | Ensures only components are exported from files for Vite HMR compatibility |

`eslint ^10.0.0` is a peer dependency — it must be installed by the consuming package.

## Quick Reference

### Key Rules Summary

| Rule | `light` | `basic` | `node` | `react` |
| ---- | :-----: | :-----: | :----: | :-----: |
| `no-var` error | — | ✓ | ✓ | ✓ |
| `prefer-const` warn | — | ✓ | ✓ | ✓ |
| `eqeqeq` error | — | ✓ | ✓ | ✓ |
| `no-console` warn | — | ✓ (warn) | off | ✓ (warn) |
| TS `no-floating-promises` error | — | ✓ | ✓ | ✓ |
| TS `no-misused-promises` error | — | ✓ | ✓ | ✓ |
| TS `consistent-type-imports` warn | — | ✓ | ✓ | ✓ |
| TS `consistent-type-definitions: type` | — | ✓ | ✓ | ✓ |
| React hooks `rules-of-hooks` error | — | — | — | ✓ |
| React hooks `exhaustive-deps` warn | — | — | — | ✓ |
| `react-refresh/only-export-components` | — | — | — | ✓ |
| `no-process-exit` warn | — | — | ✓ | — |
| Prettier conflict resolution | ✓ | ✓ | ✓ | ✓ |

### Default Ignores (all configs)

```js
['dist', 'build', 'node_modules', 'coverage', '*.config.js', '*.config.mjs', '.docusaurus']
```

When adding project-level ignores, append a separate `{ ignores: [...] }` config block — do not attempt to remove or replace the built-in ignores.

### Monorepo Consumers (as of commit ab53a003)

| Package | Config used |
| ------- | ----------- |
| Monorepo root | `light.mjs` |
| `design-system/tokens` | `node.mjs` |
| `design-system/themes` | `node.mjs` |
| `design-system/cli` | `node.mjs` |
| `cdn/autobuild-server` | `node.mjs` |
| `vite-plugin-import-map-injector` | `node.mjs` |
| `vite-plugin-react-preamble` | `node.mjs` |
| `vscode-lufa-ds-preview` | `node.mjs` |
| `design-system/main` | `react.mjs` |
| `design-system/docusaurus` | `react.mjs` |
| `design-system/storybook` | `react.mjs` |
| `design-system/playwright` | `react.mjs` |
| `apps/microfrontend/main-container` | `react.mjs` |
| `apps/microfrontend/home` | `react.mjs` |

## See Also

- Full documentation: `_bmad-docs/documentation/config/lufa_config_eslint.md`
- [`@grasdouble/lufa_config_prettier`](lufa_config_prettier.context.md) — Prettier formatting configuration
- [`@grasdouble/lufa_config_tsconfig`](lufa_config_tsconfig.context.md) — TypeScript compiler configuration
