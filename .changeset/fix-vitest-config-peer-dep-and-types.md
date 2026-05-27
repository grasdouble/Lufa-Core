---
'@grasdouble/lufa_config_vitest': patch
---

fix: declare `vitest` as `peerDependency` so consuming packages can resolve `vitest/config`; add explicit `number` type to `autoUpdate` callback to fix implicit `any` TS error.
