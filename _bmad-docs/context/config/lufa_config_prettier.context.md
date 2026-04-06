---
package: '@grasdouble/lufa_config_prettier'
shortName: lufa_config_prettier
category: config
type: context
lastUpdated: '2026-02-24'
generatedAtCommit: 'd27c912328f538971b6720513be2c817c2feff15'
---

# lufa_config_prettier — AI Context File

Quick-reference context for AI agents working with or referencing `@grasdouble/lufa_config_prettier`.

## Package Info

| Field        | Value                              |
| ------------ | ---------------------------------- |
| Full name    | `@grasdouble/lufa_config_prettier` |
| Version      | `0.1.3`                            |
| Private      | `false`                            |
| Source       | `packages/config/prettier/`        |
| Main file    | `prettier.config.mjs`              |
| Published to | `https://npm.pkg.github.com`       |
| License      | MIT                                |

## Critical Rules

1. **This package has no build step.** `prettier.config.mjs` is the source _and_ the published artifact. Never add a compile/build stage.
2. **ESM only.** The file uses `export default` and the exports map only exposes an `import` condition. No CommonJS path exists.
3. **Do not rename the export file.** The exports map and all 13+ consumers reference `prettier.config.mjs` explicitly.
4. **Plugins are in `dependencies`, not `devDependencies`.** `@ianvs/prettier-plugin-sort-imports` and `prettier-plugin-packagejson` must travel with the package so consumers do not need to install them separately.
5. **`prettier` itself is a `peerDependency`.** Consumers must have `prettier ^3.7.3` installed themselves.
6. **`importOrder` encodes monorepo conventions.** The `@grasdouble/(.*)` group must stay between third-party and relative imports. Do not reorder these groups without coordinating a monorepo-wide change.

## Import Pattern

### Canonical consumer pattern (used by all monorepo packages)

```js
// prettier.config.mjs  (in the consuming package)
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

Both resolve to the same `prettier.config.mjs` file.

### Adding extra plugins (correct way)

```js
export default {
  ...sharedConfig,
  plugins: [...sharedConfig.plugins, 'your-additional-plugin'],
};
```

## Key Types

The package re-exports no TypeScript types of its own. The config object is typed via JSDoc:

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

### Adopt and re-declare plugins explicitly (most common in the repo)

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
| Moving plugin packages to `devDependencies`                                       | They must be present at consumer runtime                                                     |
| Overriding `importOrder` in the shared config directly                            | Breaks the monorepo import convention for all consumers — override only in the consumer file |
| Adding a `tsconfig.json` or build script to this package                          | No compilation is needed or wanted                                                           |
| Referencing this package from `dependencies` (not `devDependencies`) in consumers | It is a dev-time formatter; always use `devDependencies`                                     |

## Dependencies Context

### `@ianvs/prettier-plugin-sort-imports` (`^4.7.0`)

- Provides `importOrder`, `importOrderParserPlugins`, `importOrderTypeScriptVersion`, `importOrderCaseSensitive` options.
- Supports TypeScript 5, JSX, and `decorators-legacy` out of the box via `importOrderParserPlugins`.
- The `<TYPES>` prefix in `importOrder` patterns matches `import type` statements.
- The `<THIRD_PARTY_MODULES>` token matches all packages not matched by other rules.

### `prettier-plugin-packagejson` (`^3.0.0`)

- Automatically sorts keys in `package.json` files when Prettier formats them.
- Requires no extra configuration options beyond being listed in `plugins`.

### `prettier` peer (`^3.7.3`)

- Consumers must install Prettier 3.x themselves.
- Prettier 2.x is not supported.

## Versioning Notes

- `0.0.2` — Initial release, basic config.
- `0.1.0` — First significant improvement pass; added ESLint-compatible rules.
- `0.1.1` — Dependency upgrades.
- `0.1.2` — Small fixes.
- `0.1.3` — Current; `prettier.config.mjs` content stabilised, README updated.

All monorepo consumers pin with `workspace:^`, so a version bump here automatically propagates to all consumers on next install.
