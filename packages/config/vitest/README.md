# @grasdouble/lufa_config_vitest

Shared [Vitest](https://vitest.dev) configuration for Lufa projects.

## Base config

| Option            | Value                                          |
| ----------------- | ---------------------------------------------- |
| Environment       | `happy-dom`                                    |
| Coverage provider | `v8`                                           |
| Coverage include  | `src/**/*.ts`                                  |
| Coverage exclude  | `src/index.ts`, `src/**/*.test.ts`             |
| Thresholds        | 100% statements / branches / functions / lines |

## Usage

### 1. Add the dependency

```bash
pnpm add -D @grasdouble/lufa_config_vitest --workspace
```

### 2. Create `vitest.config.ts`

```ts
import { baseConfig } from '@grasdouble/lufa_config_vitest';

export default baseConfig;
```

### 3. Add test scripts to `package.json`

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

## Overrides

Use `mergeConfig` from vitest to extend the base config with custom options.

```ts
import { defineConfig, mergeConfig } from 'vitest/config';

import { baseConfig } from '@grasdouble/lufa_config_vitest';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      coverage: {
        exclude: ['src/index.ts', 'src/**/*.test.ts', 'src/constants.ts'],
      },
    },
  })
);
```
