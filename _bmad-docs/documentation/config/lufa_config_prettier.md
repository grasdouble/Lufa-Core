---
package: '@grasdouble/lufa_config_prettier'
shortName: lufa_config_prettier
category: config
version: '0.1.3'
private: false
lastUpdated: '2026-02-24'
generatedAtCommit: 'd27c912328f538971b6720513be2c817c2feff15'
---

# @grasdouble/lufa_config_prettier

Shared Prettier configuration for the Lufa monorepo. Provides a single, opinionated formatting baseline consumed by all packages to guarantee consistent code style across the entire repository.

## Overview

`@grasdouble/lufa_config_prettier` is a zero-logic configuration-only package. It exports a single `prettier.Config` object defined in `prettier.config.mjs` that encodes the project-wide formatting rules and activates two Prettier plugins:

- **`@ianvs/prettier-plugin-sort-imports`** — deterministic, grouping-aware import ordering
- **`prettier-plugin-packagejson`** — consistent `package.json` key sorting

The config is consumed by every other package in the monorepo through a trivial spread pattern, making it easy to adopt wholesale or selectively override individual options.

## Purpose

| Goal                              | How it is achieved                                                        |
| --------------------------------- | ------------------------------------------------------------------------- |
| Uniform style across all packages | Single shared config object                                               |
| No ESLint conflicts               | Formatting rules chosen to be compatible with `eslint-config-prettier`    |
| Deterministic import order        | `@ianvs/prettier-plugin-sort-imports` with explicit monorepo-aware groups |
| Consistent `package.json` layout  | `prettier-plugin-packagejson`                                             |
| Cross-platform line endings       | `endOfLine: 'lf'` enforced everywhere                                     |

## Architecture

```
packages/config/prettier/
├── package.json           # Package manifest, exports map, peer/runtime deps
├── prettier.config.mjs    # Single exported config object (ESM)
├── README.md
└── CHANGELOG.md
```

The package contains no build step and no TypeScript sources. The single `.mjs` file is shipped as-is and referenced directly via the `exports` map.

### Exports map

```json
{
  ".": {
    "import": "./prettier.config.mjs"
  },
  "./prettier.config.mjs": {
    "import": "./prettier.config.mjs"
  }
}
```

Both the bare specifier (`@grasdouble/lufa_config_prettier`) and the explicit sub-path (`@grasdouble/lufa_config_prettier/prettier.config.mjs`) resolve to the same file. In practice, all consumers in the monorepo use the explicit sub-path form.

## Key Components

### `prettier.config.mjs`

The entire public API of this package is the default export of this file.

#### Plugins

| Plugin                                | Role                                                                      |
| ------------------------------------- | ------------------------------------------------------------------------- |
| `@ianvs/prettier-plugin-sort-imports` | Sorts and groups `import` statements according to the `importOrder` array |
| `prettier-plugin-packagejson`         | Sorts keys inside `package.json` files                                    |

#### Formatting Rules

| Option                       | Value         | Rationale                                   |
| ---------------------------- | ------------- | ------------------------------------------- |
| `printWidth`                 | `120`         | Modern wide-screen standard                 |
| `tabWidth`                   | `2`           | 2-space indentation                         |
| `useTabs`                    | `false`       | Spaces, not tabs                            |
| `semi`                       | `true`        | Always add semicolons                       |
| `singleQuote`                | `true`        | Single-quoted strings                       |
| `quoteProps`                 | `'as-needed'` | Quote object keys only when required        |
| `trailingComma`              | `'es5'`       | Trailing commas in objects and arrays       |
| `bracketSpacing`             | `true`        | `{ foo: bar }` style                        |
| `bracketSameLine`            | `false`       | Closing `>` of JSX elements on its own line |
| `arrowParens`                | `'always'`    | `(x) => x` not `x => x`                     |
| `proseWrap`                  | `'preserve'`  | Do not reflow Markdown prose                |
| `htmlWhitespaceSensitivity`  | `'css'`       | Follow CSS `display` for whitespace         |
| `endOfLine`                  | `'lf'`        | Unix line endings everywhere                |
| `embeddedLanguageFormatting` | `'auto'`      | Format embedded code blocks automatically   |

#### Import Order Groups

The `importOrder` array defines the following sort sequence (top to bottom):

1. `<TYPES>^(react|react-dom)$` — React type imports
2. `^react$` — React itself
3. `^react-dom$` — React DOM
4. `<TYPES>` — All other type-only imports
5. `<THIRD_PARTY_MODULES>` — External npm packages
6. _(empty line separator)_
7. `<TYPES>^@grasdouble/(.*)$` — Internal monorepo type imports
8. `^@grasdouble/(.*)$` — Internal monorepo packages
9. _(empty line separator)_
10. `<TYPES>^[.]` — Relative type imports
11. `^[./]` — Relative imports

#### Import Parser Plugins

```js
importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'];
importOrderTypeScriptVersion: '5.0.0';
importOrderCaseSensitive: false;
```

## API Reference

### Default export

```ts
import config from '@grasdouble/lufa_config_prettier/prettier.config.mjs';

// config: import("prettier").Config
```

The exported value is a plain JavaScript object conforming to Prettier's `Config` type. It has no methods and carries no runtime behaviour beyond being read by Prettier's configuration loader.

**Shape (abbreviated):**

```ts
{
  plugins: string[];          // ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-packagejson']
  printWidth: number;         // 120
  tabWidth: number;           // 2
  useTabs: boolean;           // false
  semi: boolean;              // true
  singleQuote: boolean;       // true
  quoteProps: string;
  trailingComma: string;      // 'es5'
  bracketSpacing: boolean;    // true
  bracketSameLine: boolean;   // false
  arrowParens: string;        // 'always'
  proseWrap: string;
  htmlWhitespaceSensitivity: string;
  endOfLine: string;          // 'lf'
  embeddedLanguageFormatting: string;
  importOrder: string[];
  importOrderParserPlugins: string[];
  importOrderTypeScriptVersion: string;
  importOrderCaseSensitive: boolean;
}
```

## Usage Examples

### Direct adoption (most common pattern in the monorepo)

```js
// prettier.config.mjs
import sharedConfig from '@grasdouble/lufa_config_prettier/prettier.config.mjs';

export default {
  ...sharedConfig,
  plugins: [...sharedConfig.plugins],
};
```

The `plugins` spread is required when the consumer wants to be explicit that it is not adding any extra plugins. Omitting it and relying solely on `...sharedConfig` also works.

### Minimal adoption

```js
// prettier.config.mjs
import sharedConfig from '@grasdouble/lufa_config_prettier/prettier.config.mjs';

export default { ...sharedConfig };
```

### Overriding individual options

```js
// prettier.config.mjs
import sharedConfig from '@grasdouble/lufa_config_prettier/prettier.config.mjs';

export default {
  ...sharedConfig,
  plugins: [...sharedConfig.plugins],
  printWidth: 100, // override for this package only
};
```

### Adding extra plugins

```js
import sharedConfig from '@grasdouble/lufa_config_prettier/prettier.config.mjs';

export default {
  ...sharedConfig,
  plugins: [...sharedConfig.plugins, 'prettier-plugin-tailwindcss'],
};
```

### Recommended `package.json` scripts

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

### lint-staged integration

The package itself ships a `lint-staged` configuration that can serve as a reference:

```json
{
  "lint-staged": {
    "*.{js,mjs}": ["prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

## Dependencies

### Runtime dependencies (bundled with the package)

| Package                               | Version  | Role                              |
| ------------------------------------- | -------- | --------------------------------- |
| `@ianvs/prettier-plugin-sort-imports` | `^4.7.0` | Import sorting plugin             |
| `prettier-plugin-packagejson`         | `^3.0.0` | `package.json` key sorting plugin |

### Peer dependencies

| Package    | Version  | Role                                                    |
| ---------- | -------- | ------------------------------------------------------- |
| `prettier` | `^3.7.3` | The formatter itself; must be installed by the consumer |

## Adoption in the Monorepo

The following 13 packages (including the root) currently consume this config:

| Package / Location                                   | Relationship                   |
| ---------------------------------------------------- | ------------------------------ |
| Root `prettier.config.mjs`                           | Spread + explicit plugin array |
| `@grasdouble/lufa_design-system_main`                | Spread + explicit plugin array |
| `@grasdouble/lufa_design-system_tokens`              | Spread                         |
| `@grasdouble/lufa_design-system_themes`              | Spread                         |
| `@grasdouble/lufa_design-system_docusaurus`          | Spread                         |
| `@grasdouble/lufa_design-system_storybook`           | Spread                         |
| `@grasdouble/lufa_design-system_cli`                 | Spread                         |
| `@grasdouble/lufa_apps_microfrontend_main-container` | Spread                         |
| `@grasdouble/lufa_apps_microfrontend_home`           | Spread                         |
| `@grasdouble/lufa_cdn_autobuild-server`              | Spread                         |
| `@grasdouble/lufa_plugins_vite_import-map-injector`  | Spread                         |
| `@grasdouble/lufa_plugins_vite_react-preamble`       | Spread                         |
| `@grasdouble/lufa_plugins_vscode_lufa-ds-preview`    | Spread                         |

All consumers use `workspace:^` as the version specifier, pinning to the local workspace copy.

## Related Documentation

- `@grasdouble/lufa_config_eslint` — ESLint configuration for the monorepo (`packages/config/eslint/`)
- `@grasdouble/lufa_config_tsconfig` — Shared TypeScript configuration (`packages/config/tsconfig/`)
- [Prettier configuration reference](https://prettier.io/docs/configuration)
- [`@ianvs/prettier-plugin-sort-imports` docs](https://github.com/IanVS/prettier-plugin-sort-imports)
- [`prettier-plugin-packagejson` docs](https://github.com/matzkoh/prettier-plugin-packagejson)
