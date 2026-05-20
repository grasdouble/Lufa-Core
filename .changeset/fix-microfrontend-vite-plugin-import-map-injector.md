---
"@grasdouble/lufa_plugin_vite_vite-plugin-import-map-injector": minor
---

Add preview mode support and fix dev-mode detection.

- Introduce `previewImportMap` option (default `importMap.preview.json`) merged into the import-map during preview builds
- Fix dev-mode detection: use `config.command === 'serve'` via `configResolved` hook instead of checking `ctx.server` in `transformIndexHtml` (more reliable across Vite versions)
- Expose `isPreview` runtime flag so prod and preview builds are correctly distinguished
- Apply `overridable="true"` import-map script for both dev and preview modes
