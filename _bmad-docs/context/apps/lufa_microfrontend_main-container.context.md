---
generatedAtCommit: "ab53a003edb177c2298250479fbe4465ee920bc3"
lastUpdated: "2026-04-07"
package: "@grasdouble/lufa_microfrontend_main-container"
---

# lufa_microfrontend_main-container - AI Context

> Quick reference for AI agents working with this package.
> **Generated**: 2026-04-07

## Package Info

| Field             | Value                                                               |
| ----------------- | ------------------------------------------------------------------- |
| Full name         | `@grasdouble/lufa_microfrontend_main-container`                     |
| Version           | `0.6.15`                                                            |
| Private           | `true` (not published to npm registry as a library)                 |
| Type              | Single-SPA root config application (app entry point, not a library) |
| Source path       | `packages/apps/microfrontend/main-container/`                       |
| Dev port          | `5173`                                                              |
| Build output      | `dist/` (ESM, `esnext` target)                                      |
| No public exports | This package exports nothing — it IS the running application        |

## Critical Rules

1. **Do not bundle React** — React and React DOM are intentionally excluded from the bundle and loaded at runtime via import maps (`importMapExternal.json`). Bundling them would break sharing with microfrontends.

2. **Do not remove `modulePreload: false`** — Single-SPA handles module loading. Enabling native `modulePreload` will interfere with lazy application registration.

3. **Register all new microfrontends in `src/main.ts` BEFORE calling `start()`** — `start()` triggers the initial routing evaluation. Applications registered after `start()` may not activate on the initial page load.

4. **Update ALL three import map files when adding a microfrontend** — `importMap.json` (prod CDN), `importMap.dev.json` (localhost), and the remote CDN file at `https://cdn.sebastien-lemouillour.fr/importMap.json` must all be kept in sync.

5. **Use `/* @vite-ignore */` for dynamic imports of bare specifiers** — The `loadApp` helper uses `import(/* @vite-ignore */ url)` because Vite cannot statically analyze bare-specifier dynamic imports. Removing this comment causes build warnings/errors.

6. **Dev mode is toggled via `localStorage`** — `localStorage.setItem('devtools', 'true')` switches the container to dev-mode import maps and enables the `import-map-overrides` UI. This is intentional and must not be removed.

## Import Pattern

This package is **not imported by any other package**. It is loaded directly by the browser as the root HTML application.

Microfrontends are loaded via dynamic import using bare specifiers resolved by the browser import map:

```typescript
// In src/main.ts — internal pattern only
import(/* @vite-ignore */ '@grasdouble/lufa_microfrontend_home');
```

The import map resolves `@grasdouble/lufa_microfrontend_home` to the appropriate CDN or localhost URL at runtime.

## Key Types

From `single-spa`:

```typescript
// Used as the return type of the app loader function
import type { LifeCycles } from 'single-spa';

// loadApp factory signature (internal, src/main.ts:7)
const loadApp: (url: string) => () => Promise<LifeCycles>;
```

The `LifeCycles` type requires an object with `bootstrap`, `mount`, and `unmount` functions. The Storybook registration provides these inline as plain `Promise<void>` functions.

## Common Patterns

### Registering a Path-Prefix-Activated App

```typescript
registerApplication({
  name: '@grasdouble/lufa_microfrontend_my-feature',
  app: loadApp('@grasdouble/lufa_microfrontend_my-feature'),
  activeWhen: (location: Location) => location.pathname.startsWith('/my-feature'),
});
```

### Registering an Exact-Path App

```typescript
registerApplication({
  name: '@grasdouble/lufa_microfrontend_home',
  app: loadApp('@grasdouble/lufa_microfrontend_home'),
  activeWhen: (location: Location) => location.pathname === '/',
});
```

### Registering an Iframe-Based App (non-SPA)

```typescript
registerApplication({
  name: '@grasdouble/some-external-app',
  app: () =>
    Promise.resolve({
      bootstrap: (): Promise<void> => Promise.resolve(),
      mount: (): Promise<void> => {
        const iframe = document.createElement('iframe');
        iframe.id = 'external-app-iframe';
        iframe.src = 'https://external-app.example.com';
        iframe.style.width = '100%';
        iframe.style.height = '100vh';
        iframe.style.border = 'none';
        document.getElementById('lufa-container')?.appendChild(iframe);
        return Promise.resolve();
      },
      unmount: (): Promise<void> => {
        document.getElementById('external-app-iframe')?.remove();
        return Promise.resolve();
      },
    }),
  activeWhen: ['/external-app'],
});
```

### Adding an Import Map Entry (Dev)

```json
// src/importMap.dev.json
{
  "imports": {
    "@grasdouble/lufa_microfrontend_my-feature": "http://localhost:4102/my-feature.mjs"
  }
}
```

### Adding an Import Map Entry (Production)

```json
// src/importMap.json
{
  "imports": {
    "@grasdouble/lufa_microfrontend_my-feature": "https://cdn.sebastien-lemouillour.fr/gh/@grasdouble/lufa_microfrontend_my-feature@1.0.0"
  }
}
```

## Anti-patterns

### Do NOT import React components directly in main.ts

The container is a root config, not a React application. It does not render React trees. Do not add `ReactDOM.render()` or use JSX in `main.ts`.

```typescript
// WRONG — container should not render its own React components
import ReactDOM from 'react-dom/client';
ReactDOM.createRoot(document.getElementById('lufa-container')!).render(<App />);
```

### Do NOT add React to `dependencies` without externalizing it

React must always be treated as a peer dependency and externalized. It is provided to all microfrontends via the shared import map.

```javascript
// WRONG — bundling React defeats the shared singleton pattern
externalizeDeps({ peerDeps: false });
```

### Do NOT hardcode module URLs in dynamic imports

Always use bare specifiers resolved via import map, never hardcode CDN URLs in `main.ts`.

```typescript
// WRONG — hardcoded URL bypasses import map override mechanism
app: () => import('https://cdn.example.com/home@1.0.0/home.mjs');

// CORRECT — bare specifier resolved by import map
app: loadApp('@grasdouble/lufa_microfrontend_home');
```

### Do NOT mount microfrontends to elements other than the designated container

The `#lufa-container` div is the expected mount root. The Storybook iframe integration mounts to `#app` — this is a known inconsistency. New registrations should target `#lufa-container`.

## Dependencies Context

### `single-spa@^6.0.3`

Core framework. Provides `registerApplication` and `start`. The container calls `start()` exactly once after all registrations. Single-SPA handles URL change detection and lifecycle orchestration.

- `registerApplication({ name, app, activeWhen })` — registers a microfrontend
- `start()` — begins routing and activates apps matching current URL

### `import-map-overrides@^6.1.0`

Provides the `<import-map-overrides-full>` web component and the override runtime. Imported as a side effect in `main.ts`. The web component is declared in `index.html` and only renders when `localStorage.devtools === 'true'`. Allows developers to point individual import map entries to local servers without modifying source files.

### `@grasdouble/lufa_design-system` (`workspace:^`, currently `2.1.1`)

Imported exclusively for its global stylesheet:

```typescript
import '@grasdouble/lufa_design-system/style.css';
```

No components from the design system are rendered by the container itself. The CSS is bundled into the container's output to ensure global styles (Tailwind base, design tokens) are available for all microfrontends.

### `@grasdouble/lufa_plugin_vite_vite-plugin-import-map-injector`

Custom Vite plugin (workspace package). Injects three import map files into the HTML:

- `extImportMap` (`importMapExternal.json`) — always injected (React CDN URLs)
- `devImportMap` (`importMap.dev.json`) — injected in dev mode
- `prodImportMap` (`importMap.json`) — injected in prod mode

### `@grasdouble/lufa_plugin_vite_vite-plugin-react-preamble`

Custom Vite plugin (workspace package). Required for React Fast Refresh to work in dev mode when React is loaded via import map (external) rather than bundled. Injects the `@vitejs/plugin-react` preamble script.

### `vite-plugin-externalize-deps`

Marks peer dependencies as external. Configured with `peerDeps: true` and `deps: false`, meaning only peer deps are externalized, not regular runtime dependencies. This ensures `single-spa`, `import-map-overrides`, and the design system are bundled while React (a peer dep) is not.

## Quick Reference

| Task                          | Command / File                                                         |
| ----------------------------- | ---------------------------------------------------------------------- |
| Start dev server              | `pnpm app:mf:dev` (port 5173)                                          |
| Enable devtools / dev imports | `localStorage.setItem('devtools', 'true')` in browser console + reload |
| Add a new microfrontend       | Edit `src/main.ts` + `src/importMap.json` + `src/importMap.dev.json`   |
| Build for production          | `pnpm --filter @grasdouble/lufa_microfrontend_main-container build`    |
| Type-check                    | `pnpm --filter @grasdouble/lufa_microfrontend_main-container typecheck` |
| Lint                          | `pnpm --filter @grasdouble/lufa_microfrontend_main-container lint`      |
| Main entry point              | `src/main.ts`                                                          |
| Root HTML                     | `index.html`                                                           |
| Vite config                   | `vite.config.js`                                                       |
| Prod import map               | `src/importMap.json`                                                   |
| Dev import map                | `src/importMap.dev.json`                                               |
| External deps map (React)     | `src/importMapExternal.json`                                           |

## See Also

- [Full Documentation](../../documentation/apps/lufa_microfrontend_main-container.md)
- [lufa_microfrontend_home context](./lufa_microfrontend_home.context.md) — primary microfrontend loaded at `/`
- [lufa_plugin_vite_vite-plugin-import-map-injector context](../plugins/lufa_plugin_vite_vite-plugin-import-map-injector.context.md)
- [lufa_plugin_vite_vite-plugin-react-preamble context](../plugins/lufa_plugin_vite_vite-plugin-react-preamble.context.md)
