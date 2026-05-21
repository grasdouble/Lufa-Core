# @grasdouble/lufa_config_prettier

> Shared Prettier configuration for the Lufa monorepo.

## Overview

This package provides a single, opinionated [Prettier](https://prettier.io/) configuration shared across all Lufa projects. It includes automatic import sorting via [`@ianvs/prettier-plugin-sort-imports`](https://github.com/IanVs/prettier-plugin-sort-imports).

## Requirements

- Prettier >= 3.7 (peer dependency)

## Installation

```bash
pnpm add -D @grasdouble/lufa_config_prettier
```

## Usage

```js
// prettier.config.mjs
import prettierConfig from '@grasdouble/lufa_config_prettier';

export default prettierConfig;
```

Extend with project-specific overrides:

```js
// prettier.config.mjs
import prettierConfig from '@grasdouble/lufa_config_prettier';

export default {
  ...prettierConfig,
  printWidth: 100,
};
```

## Default settings

| Option                       | Value       |
| ---------------------------- | ----------- |
| `printWidth`                 | `120`       |
| `tabWidth`                   | `2`         |
| `useTabs`                    | `false`     |
| `semi`                       | `true`      |
| `singleQuote`                | `true`      |
| `quoteProps`                 | `as-needed` |
| `trailingComma`              | `es5`       |
| `bracketSpacing`             | `true`      |
| `bracketSameLine`            | `false`     |
| `arrowParens`                | `always`    |
| `proseWrap`                  | `preserve`  |
| `htmlWhitespaceSensitivity`  | `css`       |
| `endOfLine`                  | `lf`        |
| `embeddedLanguageFormatting` | `auto`      |

## Import order

Imports are automatically sorted in the following order:

1. React types → `react` / `react-dom`
2. `react` and `react-dom`
3. Other type imports
4. Third-party modules
5. _(empty line)_
6. Internal monorepo types (`@grasdouble/*`)
7. Internal monorepo packages (`@grasdouble/*`)
8. _(empty line)_
9. Relative type imports
10. Relative imports

## IDE Integration

### VS Code

Install the [Prettier – Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extension and add to `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
}
```

## Related

- [`@grasdouble/lufa_config_eslint`](../eslint/) — ESLint configuration
- [`@grasdouble/lufa_config_tsconfig`](../tsconfig/) — TypeScript configuration
