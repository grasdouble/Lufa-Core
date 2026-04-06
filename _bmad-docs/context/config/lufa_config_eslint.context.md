---
package: '@grasdouble/lufa_config_eslint'
shortName: lufa_config_eslint
category: config
type: context
lastUpdated: '2026-02-24'
generatedAtCommit: 'd27c912328f538971b6720513be2c817c2feff15'
---

# lufa_config_eslint — AI Context

Quick-reference context for AI agents working with `@grasdouble/lufa_config_eslint`.

## Package Info

| Field         | Value                                                |
| ------------- | ---------------------------------------------------- |
| Package       | `@grasdouble/lufa_config_eslint`                     |
| Version       | `0.1.3`                                              |
| License       | MIT                                                  |
| Private       | false                                                |
| Registry      | `https://npm.pkg.github.com`                         |
| Source        | `packages/config/eslint/`                            |
| ESLint format | **Flat config** (ESLint 9+) — NOT legacy `.eslintrc` |

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

// basic — TypeScript + browser (rarely used directly; prefer node or react)
import basicConfig from '@grasdouble/lufa_config_eslint/basic.mjs';
import lufaLightConfig from '@grasdouble/lufa_config_eslint/light.mjs';
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

## Key Types / Shapes

All exports are `Array<FlatConfig>` where `FlatConfig` is the ESLint 9 flat-config object shape:

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

| Project type                                 | Config to use |
| -------------------------------------------- | ------------- |
| Monorepo root / CI scripts / `.github/` JS   | `light.mjs`   |
| Pure TypeScript library (no Node, no React)  | `basic.mjs`   |
| Node.js CLI, server, build tool, Vite plugin | `node.mjs`    |
| React component library, Vite app, Storybook | `react.mjs`   |

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
    ignores: ['**/*.config.cjs', 'scripts/**/*.js'],
  },
];
```

### Restrict imports for specific directories

```js
export default [
  ...lufaReactConfig,
  {
    files: ['src/components/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: [{ group: ['some-pkg'], message: 'Use CSS variables instead.' }] },
      ],
    },
  },
  {
    files: ['**/*.stories.{ts,tsx}', '**/*.test.{ts,tsx}'],
    rules: { 'no-restricted-imports': 'off' },
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

## Default Ignores (all configs)

All configs include this `ignores` block:

```js
['dist', 'build', 'node_modules', 'coverage', '*.config.js', '*.config.mjs', '.docusaurus'];
```

When adding project-level ignores, append a separate `{ ignores: [...] }` config block — do not attempt to remove or replace the built-in ignores.

## Key Rules Summary (what to expect)

| Rule                                   | `light` | `basic`  | `node` | `react`  |
| -------------------------------------- | :-----: | :------: | :----: | :------: |
| `no-var` error                         |    —    |    ✓     |   ✓    |    ✓     |
| `prefer-const` warn                    |    —    |    ✓     |   ✓    |    ✓     |
| `eqeqeq` error                         |    —    |    ✓     |   ✓    |    ✓     |
| `no-console` warn                      |    —    | ✓ (warn) |  off   | ✓ (warn) |
| TS `no-floating-promises` error        |    —    |    ✓     |   ✓    |    ✓     |
| TS `no-misused-promises` error         |    —    |    ✓     |   ✓    |    ✓     |
| TS `consistent-type-imports` warn      |    —    |    ✓     |   ✓    |    ✓     |
| TS `consistent-type-definitions: type` |    —    |    ✓     |   ✓    |    ✓     |
| React hooks rules-of-hooks error       |    —    |    —     |   —    |    ✓     |
| React hooks exhaustive-deps warn       |    —    |    —     |   —    |    ✓     |
| react-refresh/only-export-components   |    —    |    —     |   —    |    ✓     |
| `no-process-exit` warn                 |    —    |    —     |   ✓    |    —     |
| Prettier conflict resolution           |    ✓    |    ✓     |   ✓    |    ✓     |

## Dependencies Context

| Package                       | Why it's needed                                                                            |
| ----------------------------- | ------------------------------------------------------------------------------------------ |
| `@eslint/js`                  | Provides `js.configs.recommended` — the JS rule baseline used in all configs               |
| `eslint-config-prettier`      | Disables all ESLint rules that would conflict with Prettier formatting                     |
| `typescript-eslint`           | TypeScript parser + typed lint rules (`recommendedTypeChecked`, `stylisticTypeChecked`)    |
| `globals`                     | Provides `globals.browser`, `globals.node`, `globals.es2021` variable sets                 |
| `eslint-plugin-react`         | React JSX rules and recommended rule sets (includes `jsx-runtime` for React 17+ transform) |
| `eslint-plugin-react-hooks`   | Enforces Rules of Hooks and exhaustive dependency arrays                                   |
| `eslint-plugin-react-refresh` | Ensures only components are exported from files for Vite HMR compatibility                 |

`eslint ^9.22.0` is a peer dependency — it must be installed by the consuming package.
