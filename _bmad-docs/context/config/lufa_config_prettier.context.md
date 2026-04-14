---
generatedAtCommit: "ab53a003edb177c2298250479fbe4465ee920bc3"
lastUpdated: "2026-04-07"
package: "@grasdouble/lufa_config_prettier"
shortName: lufa_config_prettier
category: config
type: context
---

# lufa_config_prettier — AI Context File

Quick-reference context for AI agents working with or referencing `@grasdouble/lufa_config_prettier`.

## Package Info

| Field        | Value                              |
| ------------ | ---------------------------------- |
| Full name    | `@grasdouble/lufa_config_prettier` |
| Version      | `0.1.4`                            |
| Private      | `false`                            |
| Source       | `packages/config/prettier/`        |
| Main file    | `prettier.config.mjs`              |
| Published to | `https://npm.pkg.github.com`       |
| License      | MIT                                |

## Critical Rules

1. **This package has no build step.** `prettier.config.mjs` is the source _and_ the published artifact. Never add a compile/build stage.
2. **ESM only.** The file uses `export default` and the exports map only exposes an `import` condition. No CommonJS path exists.
3. **Do not rename the export file.** The exports map and all 13+ consumers reference `prettier.config.mjs` explicitly.
4. **The only runtime dependency is `@ianvs/prettier-plugin-sort-imports`.** It must stay in `dependencies` (not `devDependencies`) so consumers do not need to install it separately.
5. **`prettier` itself is a `peerDependency`.** Consumers must have `prettier ^3.7.3` installed themselves.
6. **`importOrder` encodes monorepo conventions.** The `@grasdouble/(.*)` group must stay between third-party and relative imports. Do not reorder these groups without coordinating a monorepo-wide change.

## Import Pattern

### Canonical consumer pattern (used by all monorepo packages)

```js
// prettier.config.mjs  (in the consuming package)
import sharedConfig from '@grasdouble/lufa_config_prettier/prettier.config.mjs';

export default {
  ...sharedConfig,
};
```

### Variant with explicit plugin array (used by root `prettier.config.mjs`)

```js
import sharedConfig from '@grasdouble/lufa_config_prettier/prettier.config.mjs';

export default {
  ...sharedConfig,
  plugins: [...sharedConfig.plugins],
};
```

### Alternative bare specifier (less common, equally valid)

```js
import sharedConfig from '@grasdouble/lufa_config_prettier';
```

Both specifiers resolve to the same `prettier.config.mjs` file.

### Adding extra plugins (correct way)

```js
export default {
  ...sharedConfig,
  plugins: [...sharedConfig.plugins, 'your-additional-plugin'],
};
```

## Key Types

The package exports no TypeScript types of its own. The config object is typed via JSDoc:

```ts
// prettier.config.mjs
/** @type {import("prettier").Config} */
const config = { ... };
export default config;
```

When consuming in TypeScript consumers can annotate:

```ts
import type { Config } from 'prettier';

import sharedConfig from '@grasdouble/lufa_config_prettier/prettier.config.mjs';

const config: Config = { ...sharedConfig };
```

## Common Patterns

### Adopt without changes

```js
import sharedConfig from '@grasdouble/lufa_config_prettier/prettier.config.mjs';

export default { ...sharedConfig };
```

### Adopt and re-declare plugins explicitly

```js
import sharedConfig from '@grasdouble/lufa_config_prettier/prettier.config.mjs';

export default {
  ...sharedConfig,
  plugins: [...sharedConfig.plugins],
};
```

### Override a single formatting option

```js
import sharedConfig from '@grasdouble/lufa_config_prettier/prettier.config.mjs';

export default {
  ...sharedConfig,
  plugins: [...sharedConfig.plugins],
  printWidth: 80,
};
```

### lint-staged reference block

```json
{
  "lint-staged": {
    "*.{js,mjs}": ["prettier --write"],
    "package.json": ["sort-package-json"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

## Anti-patterns

| Anti-pattern                                                                      | Why it is wrong                                                                              |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `import config from '@grasdouble/lufa_config_prettier/prettier.config.js'`        | The file extension is `.mjs`, not `.js`                                                      |
| `const config = require('@grasdouble/lufa_config_prettier')`                      | No CJS export exists                                                                         |
| Adding `prettier` to `dependencies` of this package                               | It is intentionally a peer dependency                                                        |
| Moving `@ianvs/prettier-plugin-sort-imports` to `devDependencies`                 | It must be present at consumer install time                                                  |
| Overriding `importOrder` in the shared config directly                            | Breaks the monorepo import convention for all consumers — override only in the consumer file |
| Adding a `tsconfig.json` or build script to this package                          | No compilation is needed or wanted                                                           |
| Referencing this package from `dependencies` (not `devDependencies`) in consumers | It is a dev-time formatter; always use `devDependencies`                                     |

## Dependencies Context

### `@ianvs/prettier-plugin-sort-imports` (`^4.7.1`)

- Provides `importOrder`, `importOrderParserPlugins`, `importOrderTypeScriptVersion`, `importOrderCaseSensitive` options.
- Supports TypeScript 5, JSX, and `decorators-legacy` out of the box via `importOrderParserPlugins`.
- The `<TYPES>` prefix in `importOrder` patterns matches `import type` statements.
- The `<THIRD_PARTY_MODULES>` token matches all packages not matched by other rules.

### `prettier` peer (`^3.7.3`)

- Consumers must install Prettier 3.x themselves.
- Prettier 2.x is not supported.

## Quick Reference

| Setting         | Value           |
| --------------- | --------------- |
| `printWidth`    | `120`           |
| `tabWidth`      | `2`             |
| `useTabs`       | `false`         |
| `semi`          | `true`          |
| `singleQuote`   | `true`          |
| `trailingComma` | `'es5'`         |
| `arrowParens`   | `'always'`      |
| `endOfLine`     | `'lf'`          |
| Plugins         | `sort-imports`  |

## Versioning Notes

- `0.0.2` — Initial release, basic config.
- `0.1.0` — First significant improvement pass; added ESLint-compatible rules.
- `0.1.1` — Dependency upgrades.
- `0.1.2` — Small fixes.
- `0.1.3` — Config content stabilised, README updated.
- `0.1.4` — Current; updated `@ianvs/prettier-plugin-sort-imports` to `^4.7.1`.

All monorepo consumers pin with `workspace:^`, so a version bump here automatically propagates to all consumers on the next install.

## See Also

- [`@grasdouble/lufa_config_eslint`](lufa_config_eslint.context.md) — ESLint configuration; designed to be conflict-free with this Prettier config.
- [`@grasdouble/lufa_config_tsconfig`](lufa_config_tsconfig.context.md) — Shared TypeScript configuration.
- [Prettier configuration reference](https://prettier.io/docs/configuration)
- [`@ianvs/prettier-plugin-sort-imports` docs](https://github.com/IanVS/prettier-plugin-sort-imports)
