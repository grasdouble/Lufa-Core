---
generatedAtCommit: "ab53a003edb177c2298250479fbe4465ee920bc3"
lastUpdated: "2026-04-07"
package: "@grasdouble/lufa_config_eslint"
version: "0.1.5"
---

# @grasdouble/lufa_config_eslint

Shared ESLint flat-config presets for the Lufa monorepo. Provides four composable configuration profiles that enforce consistent linting rules across all packages, covering vanilla JS, TypeScript, Node.js, and React environments.

## Overview

`@grasdouble/lufa_config_eslint` is a config-only package that ships four independent ESLint flat-config arrays as `.mjs` files. Each config is a self-contained, importable preset built on ESLint 9's flat config format. Packages consume a config by importing it as a direct subpath and spreading it into their own `eslint.config.mjs`.

The package is publicly published to the GitHub Package Registry at `@grasdouble/lufa_config_eslint` and consumed by every linted package in the monorepo via a `workspace:^` dependency.

## Purpose

- Centralise linting rules so all packages follow the same standards without copy-pasting rule objects.
- Provide layered profiles (light → basic → node / react) so each consumer opts into the strictness level appropriate for its environment.
- Integrate Prettier formatting rules to avoid conflicts between ESLint style rules and Prettier.

## Architecture

```
packages/config/eslint/
├── light.mjs      # Minimal JS-only preset (root monorepo config, CI tooling)
├── basic.mjs      # TypeScript + browser preset (base for node and react)
├── node.mjs       # Extends basic – Node.js globals, relaxed console rule
├── react.mjs      # Extends basic – React 19, JSX, hooks, react-refresh
├── package.json
├── README.md
└── CHANGELOG.md
```

### Config Inheritance Graph

```
light.mjs   (standalone)
    └── js.configs.recommended + eslintConfigPrettier

basic.mjs   (standalone)
    └── js.configs.recommended
    └── tseslint.configs.recommendedTypeChecked
    └── tseslint.configs.stylisticTypeChecked
    └── TypeScript rules (browser globals)
    └── eslintConfigPrettier

node.mjs    (extends basic)
    └── ...basicConfig
    └── Node.js globals (globals.node + globals.es2021)
    └── no-console: off, no-process-exit: warn

react.mjs   (extends basic)
    └── ...basicConfig
    └── eslint-plugin-react (recommended + jsx-runtime)
    └── eslint-plugin-react-hooks (recommended)
    └── eslint-plugin-react-refresh
    └── React 19 JSX settings
```

## Key Components

### `light.mjs`

The most minimal preset. Intended for configuration files, scripts, and the monorepo root where TypeScript type-checked linting is not necessary.

- `js.configs.recommended` — core ESLint JS rules
- `eslintConfigPrettier` — disables formatting rules that conflict with Prettier
- Standard `ignores` list: `dist`, `build`, `node_modules`, `coverage`, `*.config.js`, `*.config.mjs`, `.docusaurus`

### `basic.mjs`

The TypeScript foundation preset, targeting browser environments. All other typed configs extend this.

- `js.configs.recommended`
- `tseslint.configs.recommendedTypeChecked` — requires `project: true` in `parserOptions`
- `tseslint.configs.stylisticTypeChecked`
- Applies only to `**/*.{ts,tsx}` files
- `ecmaVersion: 2022`, `globals.browser`
- `eslintConfigPrettier` applied last to neutralise style conflicts

Key rules enabled by `basic.mjs`:

| Rule | Severity | Notes |
| ---- | -------- | ----- |
| `@typescript-eslint/no-explicit-any` | warn | Discourages `any`, non-blocking |
| `@typescript-eslint/no-unused-vars` | warn | Ignores `_`-prefixed identifiers |
| `@typescript-eslint/consistent-type-imports` | warn | Enforces `import type`, inline style |
| `@typescript-eslint/no-import-type-side-effects` | warn | Prevents unintended side-effect imports |
| `@typescript-eslint/consistent-type-definitions` | warn | Enforces `type` over `interface` |
| `@typescript-eslint/no-floating-promises` | **error** | Unhandled promise rejections |
| `@typescript-eslint/no-misused-promises` | **error** | Misused async callbacks |
| `no-console` | warn | Allows `console.warn` and `console.error` |
| `prefer-const` | warn | Prefers `const` declarations |
| `no-var` | **error** | Bans `var` |
| `eqeqeq` | **error** | Strict equality (`===`), `null` exempted |
| `no-unused-expressions` | warn | Detects dead expressions |

### `node.mjs`

Extends `basic.mjs` for Node.js packages. Adds Node.js and ES2021 globals for `.js`, `.mjs`, `.cjs` files, and removes the `no-console` warning (console output is expected in Node programs).

Additional rules:

| Rule | Severity | Notes |
| ---- | -------- | ----- |
| `no-console` | off | Overrides basic's `warn` |
| `no-process-exit` | warn | Discourages abrupt process termination |

### `react.mjs`

Extends `basic.mjs` for React 19 / Vite projects. Adds JSX parsing, React plugin rules, hooks enforcement, and HMR-compatible component exports.

Plugins registered: `react`, `react-hooks`, `react-refresh`.

Key rules enabled:

| Rule | Severity | Notes |
| ---- | -------- | ----- |
| `react/jsx-no-target-blank` | off | Disabled |
| `react/prop-types` | off | TypeScript replaces PropTypes |
| `react/react-in-jsx-scope` | off | Not needed with new JSX transform |
| `react/jsx-curly-brace-presence` | warn | Removes unnecessary `{}` in JSX |
| `react/self-closing-comp` | warn | Enforces `<Comp />` over `<Comp></Comp>` |
| `react/jsx-boolean-value` | warn | Enforces omitting `={true}` |
| `react-hooks/rules-of-hooks` | **error** | Hooks call order rules |
| `react-hooks/exhaustive-deps` | warn | Missing dependency in effect arrays |
| `react-refresh/only-export-components` | warn | Vite HMR compatibility; allows `loader`/`action` exports |

React version is pinned to `19.0` in `settings.react.version` so the plugin does not need to auto-detect it.

## API Reference

All exports are default ESLint flat-config arrays. There is no named-export index file; each preset is a direct subpath import.

| Subpath | Export | Extends |
| ------- | ------ | ------- |
| `@grasdouble/lufa_config_eslint/light.mjs` | `Array<FlatConfig>` | — |
| `@grasdouble/lufa_config_eslint/basic.mjs` | `Array<FlatConfig>` | — |
| `@grasdouble/lufa_config_eslint/node.mjs` | `Array<FlatConfig>` | `basic.mjs` |
| `@grasdouble/lufa_config_eslint/react.mjs` | `Array<FlatConfig>` | `basic.mjs` |

> **Note**: The `README.md` documents named imports (`{ basic }`, `{ node }`, `{ react }`) from the package root, but the actual `package.json` declares `"main": "index.js"` with no `index.js` present in the published files. All real consumers in the monorepo use the direct `.mjs` subpath imports shown above.

## Usage Examples

### Light — minimal JS config (monorepo root / tooling scripts)

```js
// eslint.config.mjs
import lufaLightConfig from '@grasdouble/lufa_config_eslint/light.mjs';

export default [
  ...lufaLightConfig,
  {
    ignores: ['dist/**', 'coverage/**'],
  },
];
```

**Used by**: monorepo root (`eslint.config.mjs`)

### Node — Node.js packages, CLI tools, Vite plugins

```js
// eslint.config.mjs
import lufaNodeConfig from '@grasdouble/lufa_config_eslint/node.mjs';

export default [
  ...lufaNodeConfig,
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

**Used by**: `lufa_design-system_tokens`, `lufa_design-system_themes`, `lufa_design-system_cli`, `cdn/autobuild-server`, `vite-plugin-import-map-injector`, `vite-plugin-react-preamble`, `vscode-lufa-ds-preview`

### React — React component libraries and applications

```js
// eslint.config.mjs
import lufaReactConfig from '@grasdouble/lufa_config_eslint/react.mjs';

export default [
  ...lufaReactConfig,
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      'no-console': 'off',
    },
  },
];
```

**Used by**: `lufa_design-system_main`, `lufa_design-system_docusaurus`, `lufa_design-system_storybook`, `lufa_design-system_playwright`, `apps/microfrontend/main-container`, `apps/microfrontend/home`

### Extending with additional plugins (e.g., Storybook)

```js
// eslint.config.mjs
import storybook from 'eslint-plugin-storybook';
import lufaReactConfig from '@grasdouble/lufa_config_eslint/react.mjs';

export default [
  ...lufaReactConfig,
  { ignores: ['storybook-static'] },
  ...storybook.configs['flat/recommended'],
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
```

### Extending with project-specific rules

```js
import lufaReactConfig from '@grasdouble/lufa_config_eslint/react.mjs';

export default [
  ...lufaReactConfig,
  {
    files: ['src/components/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: [{ group: ['some-internal-package'], message: 'Use the public API instead.' }] },
      ],
    },
  },
];
```

## Dependencies

### Runtime Dependencies

| Package | Version | Role |
| ------- | ------- | ---- |
| `@eslint/js` | `^10.0.1` | Core ESLint JS recommended rules |
| `eslint-config-prettier` | `^10.1.8` | Disables ESLint rules that conflict with Prettier |
| `eslint-plugin-react` | `^7.37.5` | React-specific linting rules |
| `eslint-plugin-react-hooks` | `^7.0.1` | Hooks rules of hooks and exhaustive-deps |
| `eslint-plugin-react-refresh` | `^0.5.2` | Vite HMR component export compatibility |
| `globals` | `^17.4.0` | Pre-built global variable sets (browser, node, es2021) |
| `typescript-eslint` | `^8.56.1` | TypeScript parser and typed rules |

### Peer Dependencies

| Package | Version |
| ------- | ------- |
| `eslint` | `^10.0.0` |

### Dev Dependencies

| Package | Version | Role |
| ------- | ------- | ---- |
| `sort-package-json` | `^3.6.1` | Sorts `package.json` keys in lint-staged |

## Configuration

This package has no runtime configuration. Configuration is implicit in the choice of which `.mjs` preset to import.

### tsconfig requirement

`basic.mjs`, `node.mjs`, and `react.mjs` all use `parserOptions.project: true`, which requires a `tsconfig.json` to be present (or configured via `tsconfigRootDir`). Consumers must set `parserOptions.project` to the correct tsconfig path(s) in their override block.

### Default ignores (all presets)

```
dist, build, node_modules, coverage, *.config.js, *.config.mjs, .docusaurus
```

Consumers typically add further package-specific ignores in an additional config object.

### Publishing

Published to GitHub Packages (`npm.pkg.github.com`) under the `@grasdouble` scope. Accessed within the monorepo via `workspace:^` protocol.

## Version History

| Version | Changes |
| ------- | ------- |
| 0.1.5 | Dependency update (`9f95f14`) |
| 0.1.4 | Add `light.mjs` config for root monorepo |
| 0.1.3 | Fix prettier config, dependency updates, README updates, fix missing prettier/eslint config, fix new lint issues |
| 0.1.2 | Dependency upgrades |
| 0.1.1 | Fix dependency declaration in `package.json` |
| 0.1.0 | Add Node.js config profile (`node.mjs`) |
| 0.0.3 | Update `publishConfig` |
| 0.0.2 | Improve shared ESLint and TypeScript configs |

## Related Documentation

- [`@grasdouble/lufa_config_prettier`](../prettier/) — Prettier formatting configuration
- [`@grasdouble/lufa_config_tsconfig`](../tsconfig/) — TypeScript compiler configuration
- [ESLint flat config docs](https://eslint.org/docs/latest/use/configure/configuration-files)
- [typescript-eslint docs](https://typescript-eslint.io/getting-started/)
