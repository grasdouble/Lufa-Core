# @grasdouble/lufa_config_eslint

> Shared ESLint flat configs for every project in the Lufa monorepo.

## Overview

This package ships four ready-to-use ESLint configurations using the [flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new) format (ESLint 10+):

| Export  | File        | Purpose                                        |
| ------- | ----------- | ---------------------------------------------- |
| `basic` | `basic.mjs` | TypeScript + Prettier compat (base for all)    |
| `light` | `light.mjs` | Plain JS only — no TypeScript rules            |
| `node`  | `node.mjs`  | Extends `basic` with Node.js globals and rules |
| `react` | `react.mjs` | Extends `basic` with React, hooks, and refresh |

## Requirements

- ESLint >= 10 (peer dependency)

## Installation

```bash
pnpm add -D @grasdouble/lufa_config_eslint
```

## Usage

### TypeScript project (basic)

```js
// eslint.config.mjs
import basic from '@grasdouble/lufa_config_eslint/basic.mjs';

export default [
  ...basic,
  // project-specific overrides
];
```

### Plain JS / config files (light)

```js
// eslint.config.mjs
import light from '@grasdouble/lufa_config_eslint/light.mjs';

export default [...light];
```

### Node.js project

```js
// eslint.config.mjs
import node from '@grasdouble/lufa_config_eslint/node.mjs';

export default [
  ...node,
  // project-specific overrides
];
```

### React project

```js
// eslint.config.mjs
import react from '@grasdouble/lufa_config_eslint/react.mjs';

export default [
  ...react,
  // project-specific overrides
];
```

## What's included

### `basic`

- `@eslint/js` recommended
- `typescript-eslint` strict + stylistic type-checked rules
- `eslint-config-prettier` (disables style rules that conflict with Prettier)
- Ignores: `dist`, `build`, `node_modules`, `coverage`, `*.config.js/mjs`, `.docusaurus`

### `light`

- `@eslint/js` recommended
- `eslint-config-prettier`
- No TypeScript rules — suitable for plain JS config files

### `node`

- Everything from `basic`
- Node.js + ES2021 globals
- `no-console: off` (expected in server-side code)
- `no-process-exit: warn`

### `react`

- Everything from `basic`
- `eslint-plugin-react` (React 19 settings)
- `eslint-plugin-react-hooks` recommended
- `eslint-plugin-react-refresh`

## Extending

Add overrides after spreading the config:

```js
import react from '@grasdouble/lufa_config_eslint/react.mjs';

export default [
  ...react,
  {
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
];
```

## Related

- [`@grasdouble/lufa_config_prettier`](../prettier/) — Prettier configuration
- [`@grasdouble/lufa_config_tsconfig`](../tsconfig/) — TypeScript configuration
