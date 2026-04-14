---
generatedAtCommit: "ab53a003edb177c2298250479fbe4465ee920bc3"
lastUpdated: "2026-04-07"
package: "@grasdouble/lufa_config_prettier"
version: "0.1.4"
shortName: lufa_config_prettier
category: config
private: false
---

# @grasdouble/lufa_config_prettier

Shared Prettier configuration for the Lufa monorepo. Provides a single, opinionated formatting baseline consumed by all packages to guarantee consistent code style across the entire repository.

## Overview

`@grasdouble/lufa_config_prettier` is a zero-logic, configuration-only package. It exports a single `prettier.Config` object defined in `prettier.config.mjs` that encodes the project-wide formatting rules and activates one Prettier plugin:

- **`@ianvs/prettier-plugin-sort-imports`** — deterministic, grouping-aware import ordering with full TypeScript 5, JSX, and decorator support.

The config is consumed by every other package in the monorepo through a trivial spread pattern, making it easy to adopt wholesale or selectively override individual options.

## Purpose

| Goal                              | How it is achieved                                                        |
| --------------------------------- | ------------------------------------------------------------------------- |
| Uniform style across all packages | Single shared config object                                               |
| No ESLint conflicts               | Formatting rules chosen to be compatible with `eslint-config-prettier`    |
| Deterministic import order        | `@ianvs/prettier-plugin-sort-imports` with explicit monorepo-aware groups |
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
| `arrowParens`                | `'always'`    | `(x) => x` not `x => x`                    |
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
  plugins: string[];                    // ['@ianvs/prettier-plugin-sort-imports']
  printWidth: number;                   // 120
  tabWidth: number;                     // 2
  useTabs: boolean;                     // false
  semi: boolean;                        // true
  singleQuote: boolean;                 // true
  quoteProps: string;                   // 'as-needed'
  trailingComma: string;               // 'es5'
  bracketSpacing: boolean;             // true
  bracketSameLine: boolean;            // false
  arrowParens: string;                 // 'always'
  proseWrap: string;                   // 'preserve'
  htmlWhitespaceSensitivity: string;   // 'css'
  endOfLine: string;                   // 'lf'
  embeddedLanguageFormatting: string;  // 'auto'
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

The explicit `plugins` spread is used by some consumers (e.g., the monorepo root) to make the plugin list visible in the consuming file. Omitting it and relying solely on `...sharedConfig` also works.

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
    "package.json": ["sort-package-json"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

## Dependencies

### Runtime dependencies (bundled with the package)

| Package                               | Version  | Role                  |
| ------------------------------------- | -------- | --------------------- |
| `@ianvs/prettier-plugin-sort-imports` | `^4.7.1` | Import sorting plugin |

### Dev dependencies

| Package           | Version  | Role                                    |
| ----------------- | -------- | --------------------------------------- |
| `sort-package-json`| `^3.6.1` | Used in `lint-staged` to sort `package.json` keys |

### Peer dependencies

| Package    | Version  | Role                                                    |
| ---------- | -------- | ------------------------------------------------------- |
| `prettier` | `^3.7.3` | The formatter itself; must be installed by the consumer |

## Adoption in the Monorepo

The following 13 packages (including the root) currently consume this config:

| Package / Location                                   | Relationship                   |
| ---------------------------------------------------- | ------------------------------ |
| Root `prettier.config.mjs`                           | Spread + explicit plugin array |
| `@grasdouble/lufa_design-system_main`                | Spread                         |
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

## Configuration

The package ships no configuration of its own beyond `prettier.config.mjs`. There are no environment variables, no runtime flags, and no secondary entry points.

The `lint-staged` block in `package.json` applies only within the package itself during development and is not exported to consumers.

## Related Documentation

- `@grasdouble/lufa_config_eslint` — ESLint configuration for the monorepo (`packages/config/eslint/`)
- `@grasdouble/lufa_config_tsconfig` — Shared TypeScript configuration (`packages/config/tsconfig/`)
- [Prettier configuration reference](https://prettier.io/docs/configuration)
- [`@ianvs/prettier-plugin-sort-imports` docs](https://github.com/IanVS/prettier-plugin-sort-imports)
