# @grasdouble/lufa_config_vitest

## 1.0.2

### Patch Changes

- 813286e: fix: export js

## 1.0.1

### Patch Changes

- 1b48398: fix: declare `vitest` as `peerDependency` so consuming packages can resolve `vitest/config`; add explicit `number` type to `autoUpdate` callback to fix implicit `any` TS error.

## 1.0.0

### Major Changes

- 6e46e78: feat: initial release — shared Vitest configuration for Lufa projects. Exports `baseConfig` with `happy-dom` environment, v8 coverage provider, and standard exclude patterns for barrel files, i18n, parcel entry points, and test files. Coverage thresholds use `autoUpdate: (n) => Math.floor(n - 1)` for a 1-point buffer.
