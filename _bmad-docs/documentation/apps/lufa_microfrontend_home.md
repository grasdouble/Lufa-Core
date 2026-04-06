---
package: '@grasdouble/lufa_microfrontend_home'
shortName: lufa_microfrontend_home
category: apps
version: '0.3.5'
private: false
lastUpdated: '2026-02-24'
generatedAtCommit: 'd27c912328f538971b6720513be2c817c2feff15'
---

# @grasdouble/lufa_microfrontend_home

## Overview

The `@grasdouble/lufa_microfrontend_home` package is the **home page microfrontend** for the Lufa platform. It implements the Single-SPA parcel lifecycle protocol, enabling it to be dynamically loaded and managed by the main container application at the root (`/`) route.

This microfrontend displays the Lufa landing page — including the logo, a project title, and navigation links to external resources (Design System docs, Storybook, GitHub, LinkedIn).

---

## Purpose

- Serve as the **landing/home page** of the Lufa microfrontend architecture.
- Demonstrate **Single-SPA integration patterns** — specifically the parcel lifecycle (bootstrap / mount / unmount) without using the `single-spa-react` helper library.
- Consume components from the shared `@grasdouble/lufa_design-system` to enforce visual consistency across microfrontends.
- Show how **design tokens** (CSS custom properties) are applied in a standalone microfrontend's styles.

---

## Architecture

### Build Strategy

The package is built as an **ES module library** using Vite:

- **Entry point**: `src/parcel.tsx` (aliased to `index` in build config, output as `home.mjs`).
- **Output format**: `es` (ESM), single file `dist/home.mjs`.
- **CSS strategy**: `vite-plugin-css-injected-by-js` injects CSS directly into the JS bundle, so the microfrontend is self-contained — no separate `.css` file is emitted.
- **Externalized dependencies**: All `dependencies` (React, react-dom, `@grasdouble/lufa_design-system`) are externalized via `vite-plugin-externalize-deps` **except** `clsx`, which is bundled inline.
- **Source maps**: Enabled. Minification is disabled to aid debugging.
- **Dev server**: Runs at `http://localhost:4101` with HMR enabled.

### Deployment & Loading

The main container resolves this microfrontend via **import maps**:

| Environment | URL                                                                                     |
| ----------- | --------------------------------------------------------------------------------------- |
| Development | `http://localhost:4101/home.mjs`                                                        |
| Production  | `https://cdn.sebastien-lemouillour.fr/gh/@grasdouble/lufa_microfrontend_home@{version}` |

The main container registers the microfrontend using `single-spa`:

```ts
registerApplication({
  name: '@grasdouble/lufa_microfrontend_home',
  app: loadApp('@grasdouble/lufa_microfrontend_home'),
  activeWhen: (location: Location) => location.pathname === '/',
});
```

The microfrontend is active **only when `location.pathname === '/'`**.

### Mount Target

The parcel mounts into a DOM element with `id="lufa-container"`, which must be provided by the host application (main container).

---

## Key Components

### `src/parcel.tsx` — Single-SPA Lifecycle Entry Point

The public entry point of the package. Exports the three required Single-SPA lifecycle functions:

| Export      | Type                  | Description                                                                                                                  |
| ----------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `bootstrap` | `() => Promise<void>` | No-op; resolves immediately.                                                                                                 |
| `mount`     | `() => Promise<void>` | Renders the `<App />` component into `#lufa-container` using React 19's `createRoot`. Also imports design system CSS tokens. |
| `unmount`   | `() => Promise<void>` | Unmounts the React root from `#lufa-container`.                                                                              |

**Note**: The `unmount` implementation re-calls `createRoot(container)` before calling `.unmount()`. This is technically incorrect — React 19's `createRoot` should only be called once per container; a reference to the existing root should be stored and reused for unmounting. This is a known minor issue in the current implementation.

### `src/App.tsx` — Root UI Component

The main React component. Renders a full-viewport centered layout using design system layout components:

- `Stack` (vertical) — centers logo and title.
- `Stack` (horizontal) — groups navigation links.
- Four external links: **Lufa Design System**, **Lufa Storybook**, **GitHub**, **LinkedIn**.
- Logo image loaded via `getImageUrl('Lufa_Logo')`.

### `src/getImageUrl.ts` — Asset URL Resolver

A small utility that resolves bundled image assets using `import.meta.url`:

```ts
export function getImageUrl(filename: string): string {
  return new URL(`./assets/${filename}.webp`, import.meta.url).href;
}
```

This approach ensures images work correctly whether the microfrontend is served locally or from a CDN.

### `src/App.module.css` — Scoped Styles

CSS Modules file defining component-scoped styles. Uses Lufa design tokens (CSS custom properties) for spacing, typography, color, and transitions:

| Class               | Purpose                                                         |
| ------------------- | --------------------------------------------------------------- |
| `.lufa-home`        | Full-viewport centering container, dark background (`#101010`)  |
| `.centered-image`   | Logo dimensions (`18rem × 18rem`) with design token margin      |
| `.centered-message` | Heading typography using `--lufa-primitive-typography-*` tokens |
| `.link`             | Base styles for navigation link buttons                         |
| `.storybook`        | Pink background (`#db2777`)                                     |
| `.design`           | Green background (`#16a34a`)                                    |
| `.github`           | Purple background (`#9333ea`)                                   |
| `.linkedin`         | Blue background (`#3b82f6`)                                     |

### `src/assets/` — Static Assets

Contains `Lufa_Logo.webp` — the platform logo displayed on the home page.

---

## API Reference

This package exposes **one public module** (via `exports["."]: "./dist/home.mjs"`):

### Exports from `@grasdouble/lufa_microfrontend_home`

| Export      | Signature             | Description                                                               |
| ----------- | --------------------- | ------------------------------------------------------------------------- |
| `bootstrap` | `() => Promise<void>` | Single-SPA bootstrap lifecycle. No-op.                                    |
| `mount`     | `() => Promise<void>` | Single-SPA mount lifecycle. Renders `<App />` into `#lufa-container`.     |
| `unmount`   | `() => Promise<void>` | Single-SPA unmount lifecycle. Unmounts React root from `#lufa-container`. |

These three exports conform to the [Single-SPA parcel lifecycle API](https://single-spa.js.org/docs/parcels-overview).

**The `App` component is not a public export** — it is an internal implementation detail.

---

## Usage Examples

### Registering in Single-SPA (main container pattern)

```ts
import { registerApplication, start } from 'single-spa';

registerApplication({
  name: '@grasdouble/lufa_microfrontend_home',
  app: () => import('@grasdouble/lufa_microfrontend_home'),
  activeWhen: (location) => location.pathname === '/',
});

start();
```

### Required Host HTML

The host application must provide the mount container element:

```html
<div id="lufa-container"></div>
```

### Development Standalone Mode

```bash
# Start the standalone dev server (port 4101)
pnpm --filter @grasdouble/lufa_microfrontend_home dev

# Or run all microfrontends together
pnpm app:mf:dev
```

### Build

```bash
# Build to dist/home.mjs
pnpm --filter @grasdouble/lufa_microfrontend_home build

# Build all microfrontend apps
pnpm app:mf:build
```

---

## Dependencies

### Runtime Dependencies

| Package                          | Version       | Purpose                                             |
| -------------------------------- | ------------- | --------------------------------------------------- |
| `@grasdouble/lufa_design-system` | `workspace:^` | Shared UI components (`Stack`) and design token CSS |
| `clsx`                           | `^2.1.1`      | Conditional CSS class name utility (bundled inline) |
| `react`                          | `^19.2.4`     | UI framework (externalized)                         |
| `react-dom`                      | `^19.2.4`     | React DOM renderer (externalized)                   |

### Development Dependencies (key)

| Package                            | Purpose                                     |
| ---------------------------------- | ------------------------------------------- |
| `vite` `^7.3.1`                    | Build tool and dev server                   |
| `@vitejs/plugin-react`             | React fast refresh and JSX transform        |
| `vite-plugin-css-injected-by-js`   | Injects CSS into the JS bundle              |
| `vite-plugin-externalize-deps`     | Externalizes runtime deps from the bundle   |
| `typescript` `^5.9.3`              | TypeScript compiler                         |
| `@grasdouble/lufa_config_eslint`   | Shared ESLint config                        |
| `@grasdouble/lufa_config_prettier` | Shared Prettier config                      |
| `@grasdouble/lufa_config_tsconfig` | Shared TypeScript config (`react-app.json`) |

---

## Related Documentation

- **Main Container**: `packages/apps/microfrontend/main-container/` — registers and orchestrates all microfrontends
- **Design System**: `@grasdouble/lufa_design-system` — provides the `Stack` component and CSS design tokens
- **Microfrontends Overview**: `packages/apps/microfrontend/README.md`
- **Root workspace scripts**: `pnpm app:mf:dev`, `pnpm app:mf:build`, `pnpm app:mf:preview`
