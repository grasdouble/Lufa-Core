---
'@grasdouble/lufa_config_vitest': major
---

feat: initial release — shared Vitest configuration for Lufa projects. Exports `baseConfig` with `happy-dom` environment, v8 coverage provider, and standard exclude patterns for barrel files, i18n, parcel entry points, and test files. Coverage thresholds use `autoUpdate: (n) => Math.floor(n - 1)` for a 1-point buffer.
