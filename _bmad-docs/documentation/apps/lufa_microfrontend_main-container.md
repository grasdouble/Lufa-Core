---
package: '@grasdouble/lufa_microfrontend_main-container'
shortName: lufa_microfrontend_main-container
category: apps
version: '0.6.13'
private: true
lastUpdated: '2026-02-24'
generatedAtCommit: 'd27c912328f538971b6720513be2c817c2feff15'
---

# @grasdouble/lufa_microfrontend_main-container

Single-SPA root container application that orchestrates the loading, routing, and lifecycle management of all Lufa microfrontend applications.

## Overview

This package is the **entry point of the entire Lufa platform**. It is a Single-SPA root config application — not a microfrontend itself — that boots the platform and dynamically composes other microfrontend applications into a single user experience.

The container runs at port `5173` during development and is deployed independently. All microfrontends are loaded at runtime via browser-native import maps, allowing each application to be deployed, versioned, and updated without rebuilding the container.

## Purpose

- Act as the Single-SPA root container (orchestrator)
- Register microfrontend applications and define their active URL routes
- Inject import maps to enable runtime module resolution of shared and app-specific dependencies
- Provide a development override mechanism via `import-map-overrides`
- Load the global design system stylesheet

## Architecture

### Single-SPA Orchestration

The container uses the `single-spa` library to register applications. Each registered application is a lazy-loaded ES module resolved via the browser import map. The container itself does **not** render any visible UI; it delegates all rendering to the registered microfrontends.

```
Browser
  └── index.html (root HTML)
        ├── import-map-overrides-full (devtools widget)
        ├── #lufa-container (mount target for microfrontends)
        └── inline script
              ├── [devMode] → imports /src/main.js directly (HMR enabled)
              └── [prodMode] → fetches importMap from CDN → injects as overridable-importmap → imports /src/main.js
```

### Module Loading Strategy

The container uses two separate import map strategies depending on environment:

| Mode                                          | Import Map Source                                                                                                              |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Development (`devtools=true` in localStorage) | Local Vite dev server; no CDN fetch                                                                                            |
| Production                                    | `https://cdn.sebastien-lemouillour.fr/importMap.json` fetched at runtime and injected as an `overridable-importmap` script tag |

The CDN-fetched map is injected as type `overridable-importmap`, meaning individual entries can be overridden at runtime using the `import-map-overrides` devtools widget.

### Import Map Files

Three JSON files in `src/` define module resolution:

| File                     | Purpose                                                                                                    |
| ------------------------ | ---------------------------------------------------------------------------------------------------------- |
| `importMap.json`         | Production CDN URLs for microfrontends (e.g., `lufa_microfrontend_home`) and the design system             |
| `importMap.dev.json`     | Local development URLs (localhost ports) for each microfrontend                                            |
| `importMapExternal.json` | CDN URLs for externalized peer dependencies: `react`, `react/jsx-runtime`, `react-dom`, `react-dom/client` |

The `importMapExternal.json` is injected at build time via the `vite-plugin-import-map-injector` plugin and ensures React is loaded only once, shared across all microfrontends.

### Build Configuration

Built with Vite, targeting `esnext` ESM output. Key build decisions:

- `modulePreload: false` — Single-SPA handles module loading; native preload would interfere
- `minify: false` — kept for debuggability; modules are versioned on the CDN
- `format: 'esm'` — required by Single-SPA and import maps
- `entryFileNames: '[name].js'` — deterministic filenames for CDN hosting
- `externalizeDeps` with `peerDeps: true` — React and similar are NOT bundled; resolved via import map

## Key Components

### `src/main.ts`

The sole application entry point. Responsibilities:

1. Imports `import-map-overrides` to activate the devtools override mechanism
2. Imports the global design system stylesheet (`@grasdouble/lufa_design-system/style.css`)
3. Registers microfrontend applications with `registerApplication`
4. Starts the Single-SPA router with `start()`

### `index.html`

The root HTML document. Contains:

- `<import-map-overrides-full>` web component (visible only when `localStorage.devtools === 'true'`)
- `#lufa-container` div (mount point for all microfrontend DOM output)
- Inline bootstrap script that conditionally loads the import map from CDN before importing `main.js`

### `vite.config.js`

Configures three custom plugins:

- **`importMapInjectorPlugin`** — Injects `importMapExternal.json` (always), `importMap.dev.json` (dev), and `importMap.json` (prod) into the HTML at build/serve time
- **`externalizeDeps`** — Excludes peer dependencies from bundle (resolved via import map at runtime)
- **`reactPreamblePlugin`** — Injects the `@vitejs/plugin-react` preamble required for React Fast Refresh in dev mode

## Registered Applications

### `@grasdouble/lufa_microfrontend_home`

- **Active route**: `location.pathname === '/'`
- **Loading**: Resolved via import map (`loadApp` helper uses dynamic `import()` with `@vite-ignore`)
- **CDN URL (prod)**: `https://cdn.sebastien-lemouillour.fr/gh/@grasdouble/lufa_microfrontend_home@0.1.2`
- **Dev URL**: `http://localhost:4101/home.mjs`

### `@grasdouble/lufa_design-system-storybook`

- **Active route**: `/storybook`
- **Loading**: Inline inline synthetic Single-SPA module (not resolved via import map)
- **Mechanism**: Creates an `<iframe>` pointing to `https://lufa-storybook.sebastien-lemouillour.fr`
- **Lifecycle**: `bootstrap` (noop), `mount` (creates and appends iframe to `#app`), `unmount` (removes iframe by id `storybook-iframe`)

## API Reference

This package does not export any public API. It is an application entry point and is not intended to be imported by other packages.

### `loadApp(url: string): () => Promise<LifeCycles>`

Internal factory used in `main.ts` to create a Single-SPA `app` loader function from a bare import specifier. Uses `import(/* @vite-ignore */ url)` to bypass Vite's static analysis of dynamic imports.

```typescript
const loadApp =
  (url: string): (() => Promise<LifeCycles>) =>
  () =>
    import(/* @vite-ignore */ url);
```

## Usage Examples

### Starting the Development Server

```bash
# From the monorepo root
pnpm app:mf:dev

# Or directly from the package
pnpm --filter @grasdouble/lufa_microfrontend_main-container dev
```

The container runs at `http://localhost:5173`. All microfrontends are resolved via CDN unless `localStorage.devtools = 'true'` is set.

### Enabling Dev Mode (Override Import Maps)

Open the browser console and run:

```js
localStorage.setItem('devtools', 'true');
location.reload();
```

This activates the `import-map-overrides` devtools panel (bottom-left corner) and switches to the dev-mode import map, where `@grasdouble/lufa_microfrontend_home` resolves to `http://localhost:4101/home.mjs`.

### Registering a New Microfrontend

In `src/main.ts`, add a new `registerApplication` call before `start()`:

```typescript
registerApplication({
  name: '@grasdouble/lufa_microfrontend_my-app',
  app: loadApp('@grasdouble/lufa_microfrontend_my-app'),
  activeWhen: (location: Location) => location.pathname.startsWith('/my-app'),
});
```

Then add the module URL to all three import map files:

- `src/importMap.json` — CDN production URL
- `src/importMap.dev.json` — localhost dev server URL
- (optionally update the CDN-served `importMap.json` at `https://cdn.sebastien-lemouillour.fr/importMap.json`)

### Building for Production

```bash
pnpm --filter @grasdouble/lufa_microfrontend_main-container build
```

Output is written to `dist/`. The HTML file will contain the injected import maps and the compiled `main.js` entry.

## Dependencies

### Runtime Dependencies

| Package                          | Version       | Purpose                                                             |
| -------------------------------- | ------------- | ------------------------------------------------------------------- |
| `@grasdouble/lufa_design-system` | `workspace:^` | Global CSS stylesheet (`style.css`) imported in `main.ts`           |
| `import-map-overrides`           | `^6.1.0`      | Devtools UI for overriding individual import map entries at runtime |
| `single-spa`                     | `^6.0.3`      | Microfrontend orchestration framework                               |

### Dev Dependencies (Notable)

| Package                                                        | Purpose                                                    |
| -------------------------------------------------------------- | ---------------------------------------------------------- |
| `@grasdouble/lufa_plugin_vite_vite-plugin-import-map-injector` | Injects import map JSON files into HTML during build/serve |
| `@grasdouble/lufa_plugin_vite_vite-plugin-react-preamble`      | Provides React Fast Refresh preamble for Vite dev server   |
| `vite-plugin-externalize-deps`                                 | Marks peer dependencies as external (not bundled)          |
| `@grasdouble/lufa_config_tsconfig`                             | Shared TypeScript config (`react-app.json` preset)         |
| `@grasdouble/lufa_config_eslint`                               | Shared ESLint config                                       |

### External Runtime Dependencies (via Import Map)

These are NOT bundled. They are loaded at runtime by the browser via import maps:

| Package             | CDN URL                                   |
| ------------------- | ----------------------------------------- |
| `react@19.0.0`      | `https://esm.sh/react@19.0.0`             |
| `react/jsx-runtime` | `https://esm.sh/react@19.0.0/jsx-runtime` |
| `react-dom@19.0.0`  | `https://esm.sh/react-dom@19.0.0`         |
| `react-dom/client`  | `https://esm.sh/react-dom@19.0.0/client`  |

## Related Documentation

- [Microfrontend Architecture Overview](../../../packages/apps/microfrontend/README.md)
- [@grasdouble/lufa_microfrontend_home](./lufa_microfrontend_home.md) — The primary microfrontend registered at `/`
- [@grasdouble/lufa_design-system](../ui/lufa_design-system.md) — Design system whose CSS is imported globally
- [@grasdouble/lufa_plugin_vite_vite-plugin-import-map-injector](../plugins/lufa_plugin_vite_vite-plugin-import-map-injector.md) — Vite plugin that handles import map injection
- [@grasdouble/lufa_plugin_vite_vite-plugin-react-preamble](../plugins/lufa_plugin_vite_vite-plugin-react-preamble.md) — Vite plugin for React Fast Refresh support
