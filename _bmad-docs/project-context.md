---
generatedAtCommit: "ab53a003edb177c2298250479fbe4465ee920bc3"
lastUpdated: "2026-04-07"
---

# Project Context for AI Agents - Lufa

> **Purpose**: Critical rules and patterns that AI agents MUST follow.
> **Generated**: 2026-04-07
> **Focus**: Unobvious details that agents might otherwise miss.

---

## Technology Stack & Versions

| Package / Tool                                    | Version    | Role                                              |
| ------------------------------------------------- | ---------- | ------------------------------------------------- |
| **pnpm**                                          | `10.30.1`  | Package manager (workspace monorepo)              |
| **TypeScript**                                    | `^5.9.3`   | Strict typing across all packages                 |
| **React**                                         | `^19.2.4`  | UI framework (peer dep — externalized in bundles) |
| **Vite**                                          | `^7.3.1`   | Build tool for all apps and the design system     |
| **Storybook**                                     | `^10.2.15` | Component explorer (`@storybook/react-vite`)      |
| **single-spa**                                    | `^6.0.3`   | Microfrontend orchestration                       |
| **ESLint**                                        | `^10.0.2`  | Linting (flat config via `lufa_config_eslint`)    |
| **Prettier**                                      | `^3.8.1`   | Formatting (via `lufa_config_prettier`)           |
| **lucide-react**                                  | `^0.577.0` | Icon library for the design system                |
| **clsx**                                          | `^2.1.1`   | CSS class composition utility                     |
| **style-dictionary**                              | `^5.3.3`   | Design token build pipeline (DTCG format)         |
| `@grasdouble/lufa_design-system`                  | `2.1.1`    | React component library                           |
| `@grasdouble/lufa_design-system-tokens`           | `1.2.1`    | 698 design tokens → 1025 CSS custom properties    |
| `@grasdouble/lufa_design-system-themes`           | `1.1.1`    | 10 CSS theme overrides                            |
| `@grasdouble/lufa_microfrontend_main-container`   | `0.6.15`   | Single-SPA root container                         |
| `@grasdouble/lufa_microfrontend_home`             | `0.3.7`    | Home page microfrontend                           |
| `@grasdouble/cdn_autobuild-server`                | `0.3.6`    | Self-hosted CDN (Express + esbuild)               |

### Workspace Layout (`pnpm-workspace.yaml`)

```
packages/plugins/vite/*       → Vite plugins (vite-plugin-import-map-injector, vite-plugin-react-preamble)
packages/plugins/vscode/*     → VSCode extensions (lufa-ds-preview)
packages/cdn/*                → CDN autobuild server
packages/config/*             → Shared ESLint, Prettier, TypeScript configs
packages/design-system/*      → tokens, themes, main DS, storybook, docusaurus, playwright, CLI
packages/apps/*               → Application packages
packages/apps/microfrontend/* → main-container (port 5173), home (port 4101)
packages/poc/*                → Proof of concept packages
```

**CRITICAL workspace setting**: `hoist: false` — NO global `node_modules` hoisting. Every package MUST declare all its own deps.

---

## 🚨 CRITICAL: Architecture Patterns (MUST READ)

### Monorepo Structure

Lufa is a **pnpm monorepo** combining:

1. A **design system** (token pipeline → component library → Storybook → Docusaurus)
2. A **microfrontend application** (Single-SPA orchestrator + lazy-loaded parcels via import maps)
3. A **CDN server** that serves versioned npm packages from GitHub Packages
4. Shared **config packages** (ESLint, Prettier, TypeScript)
5. **Vite plugins** that enable the import-map workflow

These are deeply coupled via workspace dependencies. Build order matters (see Build System section).

### Dependency Layers

```
@grasdouble/lufa_design-system-tokens  (CSS custom properties)
        ↓
CSS Modules (component-level scoped styles, clsx composition)
        ↓
React Components (utility-prop API → pre-generated CSS utility classes)
        ↓
Consumer Applications / Micro-frontends  (externalized, resolved via import map)
```

Components NEVER use inline styles. They translate props into pre-generated CSS utility classes that reference CSS custom properties.

---

## 🚨 CRITICAL: TypeScript Rules

### No root `tsconfig.json`

There is **NO** root-level `tsconfig.json`. Each package extends from a shared config:

```json
// Any app or library package tsconfig.json
{ "extends": "@grasdouble/lufa_config_tsconfig/react-app.json" }

// For publishable library packages
{ "extends": "@grasdouble/lufa_config_tsconfig/react-library.json" }

// For Node.js packages (CDN server)
{ "extends": "@grasdouble/lufa_config_tsconfig/node.json" }
```

NEVER add a root `tsconfig.json` — it breaks per-package isolation.

### Strict Mode is Enforced

The base config enables: `strict: true`, `strictNullChecks`, `strictFunctionTypes`, `strictPropertyInitialization`, `noImplicitAny`, `noImplicitThis`, `isolatedModules`.

`allowJs: false` — no plain JavaScript in TypeScript packages.

### Type Import Style

ESLint enforces `@typescript-eslint/consistent-type-imports` with `prefer: 'type-imports'`:

```ts
// ❌ WRONG
import { type Foo, Bar } from './types';

// ✅ CORRECT — inline type modifier
import { type Foo, Bar } from './types';

// ✅ ALSO CORRECT — separate type import
import type { Foo } from './types';
import { Bar } from './bar';
```

### Type Alias over Interface

ESLint enforces `@typescript-eslint/consistent-type-definitions: ['warn', 'type']`. ALWAYS use `type`, not `interface`.

```ts
// ❌ WRONG
interface ButtonProps { … }

// ✅ CORRECT
type ButtonProps = { … }
```

### CSS Module Typing

CSS Module files need accompanying `.d.ts` declarations:

```ts
// App.module.css.d.ts
declare const styles: { [className: string]: string };
export default styles;
```

---

## Import Patterns

### Design System — components

```tsx
// ✅ Named imports ONLY from package root
import { Badge, Button, Card, Icon, Stack, Text, useTheme } from '@grasdouble/lufa_design-system';

// ❌ FORBIDDEN — internal sub-paths are not stable API
import { Button } from '@grasdouble/lufa_design-system/dist/lufa-ui.mjs';
import { Button } from '@grasdouble/lufa_design-system/interaction/Button';
```

### Design System — CSS stylesheet (mandatory)

```tsx
// Import ONCE at application root (main.ts / parcel.tsx)
import '@grasdouble/lufa_design-system/style.css';
```

Omitting this import causes ALL component styles to be missing.

### Design System — tokens CSS

```css
/* Import once in application global styles */
@import '@grasdouble/lufa_design-system-tokens/tokens.css';
```

### Design System — token values (JS/TS)

```ts
// ✅ CORRECT — use named /values export
import tokens from '@grasdouble/lufa_design-system-tokens/values';

// tokens.core.color.brand.primary.default === "#2563eb"

// ❌ FORBIDDEN — /metadata is for tooling only (build scripts, docs)
import metadata from '@grasdouble/lufa_design-system-tokens/metadata';
// ❌ FORBIDDEN — default JSON import violates token-usage validation
import tokensJson from '@grasdouble/lufa_design-system-tokens/dist/tokens-values.json';
```

### Theme CSS files

```css
/* Each theme is a separate named CSS export */
@import '@grasdouble/lufa_design-system-themes/ocean.css';
@import '@grasdouble/lufa_design-system-themes/forest.css';
/* Only the active data-theme attribute activates a given theme's variables */
```

### Import order (Prettier plugin enforces this)

```ts
// 1. React types
// 2. react, react-dom
// 3. Other external types
// 4. Third-party modules
// (blank line)
// 5. @grasdouble/* types
// 6. @grasdouble/* packages
// (blank line)
// 7. Relative type imports
// 8. Relative imports
```

### Single-SPA dynamic imports (bypass Vite static analysis)

```ts
// ✅ CORRECT — @vite-ignore suppresses Vite's dynamic import warning
const loadApp = (url: string) => () => import(/* @vite-ignore */ url);
```

### Shared config packages

```
@grasdouble/lufa_config_eslint    → shared ESLint flat config (basic.mjs, react.mjs, node.mjs, light.mjs)
@grasdouble/lufa_config_prettier  → shared Prettier config
@grasdouble/lufa_config_tsconfig  → shared TypeScript base configs (base, react-app, react-library, node)
```

ALWAYS extend from shared configs. NEVER add custom eslint/tsconfig rules without extending the shared base.

---

## Design System Conventions

### Token Hierarchy — Use the Right Level

ALWAYS choose the most specific token level. NEVER skip levels upward.

| Level         | Prefix pattern       | When to use                                      |
| ------------- | -------------------- | ------------------------------------------------ |
| **Primitive** | `--lufa-primitive-*` | Raw values — **NEVER** use in components         |
| **Core**      | `--lufa-core-*`      | Global brand decisions — use when semantic doesn't fit |
| **Semantic**  | `--lufa-semantic-*`  | **Preferred** for custom component styles        |
| **Component** | `--lufa-component-*` | Use only for the specific targeted component     |

#### Token reference flow — ALWAYS reference downward

```
Component tokens → Semantic tokens → Core tokens → Primitive tokens
```

#### CSS variable naming convention

```
--lufa-{level}-{category}-{name}[-{variant}][-{state}]

Examples:
  --lufa-primitive-color-blue-600
  --lufa-core-color-brand-primary-default
  --lufa-semantic-ui-text-primary
  --lufa-semantic-ui-spacing-default
  --lufa-component-button-type-solid-variant-primary-background-default
```

### Token Usage in CSS — Right and Wrong

```css
/* ❌ FORBIDDEN — hard-coded values */
.button {
  background-color: #2563eb;
  padding: 12px 16px;
  border-radius: 4px;
  font-size: 14px;
  color: white;
}

/* ❌ WRONG — primitive in component (skips levels) */
.alert {
  background-color: var(--lufa-primitive-color-green-100);
}

/* ✅ CORRECT — semantic tokens for custom components */
.alert {
  background-color: var(--lufa-semantic-ui-background-success);
  color: var(--lufa-semantic-ui-text-success);
  border-color: var(--lufa-semantic-ui-border-success);
  padding: var(--lufa-semantic-ui-spacing-default);
}
```

### Semantic Spacing Tokens (NEVER use raw px)

| Semantic name | Value | CSS variable                             |
| ------------- | ----- | ---------------------------------------- |
| `tight`       | 4px   | `--lufa-semantic-ui-spacing-tight`       |
| `compact`     | 8px   | `--lufa-semantic-ui-spacing-compact`     |
| `default`     | 16px  | `--lufa-semantic-ui-spacing-default`     |
| `comfortable` | 24px  | `--lufa-semantic-ui-spacing-comfortable` |
| `spacious`    | 32px  | `--lufa-semantic-ui-spacing-spacious`    |

### Theme Activation — `data-*` attributes on HTML element

```html
<!-- ✅ CORRECT: set on <html> for global scope -->
<html data-theme="ocean" data-mode="dark">

<!-- ✅ CORRECT: scope a theme to a subtree -->
<section data-theme="matrix" data-mode="dark">…</section>
```

Available `data-theme` values: `ocean` | `forest` | `coffee` | `sunset` | `volcano` | `nordic` | `steampunk` | `volt` | `cyberpunk` | `matrix` (or omit for default theme)

Available `data-mode` values: `light` | `dark` | `high-contrast` (or omit for system `auto` mode)

### Multi-Mode Token Pattern — `[data-theme][data-mode]` selectors, NOT media queries

```css
/* ✅ CORRECT Lufa pattern */
[data-theme],
[data-theme][data-mode='light'] {
  --lufa-core-color-brand-primary-default: #2563eb;
}
[data-theme][data-mode='dark'] {
  --lufa-core-color-brand-primary-default: #60a5fa;
}
[data-theme][data-mode='high-contrast'] {
  --lufa-core-color-brand-primary-default: #0000ff;
}

/* ❌ DO NOT use media queries for token mode switching */
@media (prefers-color-scheme: dark) {
  /* NOT how Lufa works */
}
```

When mode is `auto`, the `useTheme` hook removes `data-mode` entirely, allowing `@media (prefers-color-scheme)` to apply naturally.

### CSS Import Order for Apps (MATTERS)

```css
/* globals.css — ALWAYS in this order */
@import '@grasdouble/lufa_design-system-tokens/tokens.css'; /* 1. Base tokens */
@import '@grasdouble/lufa_design-system-themes/ocean.css';  /* 2. Theme(s), optional */
/* Multiple themes can be imported; only active data-theme applies */
```

```tsx
/* In React app root — import DS stylesheet once */
import '@grasdouble/lufa_design-system/style.css';
```

### Component Prop API — Semantic Names, Not Raw Values

```tsx
// ❌ WRONG — raw pixel values not accepted
<Stack gap="16px" />
<Box padding="24px" />

// ✅ CORRECT — semantic names map to tokens
<Stack spacing="default" />
<Box padding="comfortable" />
```

**SpacingValue**: `'none' | 'tight' | 'compact' | 'default' | 'comfortable' | 'spacious'`

### Polymorphic `as` Prop

Many components accept an `as` prop for semantic rendering:

```tsx
<Box as="section" padding="comfortable">…</Box>
<Text as="h1" variant="h1" weight="bold">Title</Text>
<Button as="a" href="/link" type="outline">Link</Button>
```

### Z-index Scale (ALWAYS use these tokens)

| CSS Variable                                       | Value | Use case          |
| -------------------------------------------------- | ----- | ----------------- |
| `--lufa-semantic-elevation-z-index-base`           | 0     | Normal flow       |
| `--lufa-semantic-elevation-z-index-dropdown`       | 1000  | Dropdown menus    |
| `--lufa-semantic-elevation-z-index-sticky`         | 1100  | Sticky headers    |
| `--lufa-semantic-elevation-z-index-fixed`          | 1200  | Fixed navigation  |
| `--lufa-semantic-elevation-z-index-modal-backdrop` | 1300  | Modal overlays    |
| `--lufa-semantic-elevation-z-index-modal`          | 1400  | Modal dialogs     |
| `--lufa-semantic-elevation-z-index-popover`        | 1500  | Popovers/tooltips |
| `--lufa-semantic-elevation-z-index-toast`          | 1600  | Toasts            |

### Focus Ring Pattern (WCAG-compliant)

```css
/* ✅ ALWAYS use this pattern for focus-visible */
.interactive-element:focus-visible {
  outline: none;
  box-shadow: var(--lufa-semantic-effect-glow-box-focus);
}
```

### Glow Tokens (Cyberpunk and Matrix themes ONLY)

```css
/* Only available when data-theme="cyberpunk" or data-theme="matrix" */
.element { box-shadow: var(--lufa-glow-box); }
.element { text-shadow: var(--lufa-glow-text-intense); }
/* Referencing these in other themes produces NO effect */
```

---

## Microfrontend Conventions

### Architecture Overview

```
Browser
  └── main-container (port 5173 / CDN root)
        ├── Single-SPA orchestrator
        ├── Import maps (3 JSON files in src/)
        │     ├── importMapExternal.json  → React, react-dom from esm.sh (never overridable)
        │     ├── importMap.json          → prod CDN URLs for microfrontends
        │     └── importMap.dev.json      → localhost URLs (overridable in browser)
        └── Registered microfrontends
              ├── @grasdouble/lufa_microfrontend_home    → active at pathname === '/'
              └── @grasdouble/lufa_design-system-storybook → active at /storybook (iframe)
```

### Import Map Pattern — ALL THREE FILES Must Be Updated

EVERY new microfrontend MUST be registered in all three import map files:

```json
// src/importMapExternal.json — shared singletons (NEVER overridable)
{
  "imports": {
    "react": "https://esm.sh/react@19.0.0",
    "react/jsx-runtime": "https://esm.sh/react@19.0.0/jsx-runtime",
    "react-dom": "https://esm.sh/react-dom@19.0.0",
    "react-dom/client": "https://esm.sh/react-dom@19.0.0/client"
  }
}
```

```json
// src/importMap.json — production CDN URLs
{
  "imports": {
    "@grasdouble/lufa_microfrontend_home": "https://cdn.sebastien-lemouillour.fr/gh/@grasdouble/lufa_microfrontend_home@{version}"
  }
}
```

```json
// src/importMap.dev.json — local dev URLs
{
  "imports": {
    "@grasdouble/lufa_microfrontend_home": "http://localhost:4101/home.mjs"
  }
}
```

### Vite Config for Microfrontends

```ts
// vite.config.ts for any microfrontend
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import externalizeDeps from 'vite-plugin-externalize-deps';

export default defineConfig({
  plugins: [
    externalizeDeps({ peerDeps: true }), // ← externalizes react, react-dom, design-system
    cssInjectedByJsPlugin(),             // ← CSS bundled into .mjs; no separate .css file
  ],
  build: {
    lib: {
      entry: 'src/parcel.tsx',
      formats: ['es'],
      fileName: () => 'home.mjs',  // deterministic name for import map URL
    },
    minify: false,         // aids CDN debugging
    modulePreload: false,  // Single-SPA owns module loading; native preload interferes
    sourcemap: true,
  },
  server: { port: 4101 },
});
```

### Microfrontend Boundaries

| Package                             | Port   | Route              | Output file     |
| ----------------------------------- | ------ | ------------------ | --------------- |
| `lufa_microfrontend_main-container` | `5173` | all routes         | `dist/main.js`  |
| `lufa_microfrontend_home`           | `4101` | `pathname === '/'` | `dist/home.mjs` |

### Mount Target is Mandatory

ALL microfrontends MUST mount into `#lufa-container`:

```html
<!-- index.html in main-container -->
<div id="lufa-container"></div>
```

### Correct React Root Management in Lifecycle

```tsx
// ❌ WRONG — creates a new root on every mount/unmount cycle
export const unmount = async () => {
  createRoot(document.getElementById('lufa-container')!).unmount(); // re-creates root!
};

// ✅ CORRECT — store root reference, reuse for unmount
let root: Root | null = null;

export const mount = async () => {
  root = createRoot(document.getElementById('lufa-container')!);
  root.render(<App />);
};

export const unmount = async () => {
  root?.unmount();
  root = null;
};
```

### Registering a New Microfrontend

```typescript
// src/main.ts in main-container
registerApplication({
  name: '@grasdouble/lufa_microfrontend_my-app',
  app: loadApp('@grasdouble/lufa_microfrontend_my-app'),
  activeWhen: (location: Location) => location.pathname.startsWith('/my-app'),
});
```

### Cross-Microfrontend Communication

- Microfrontends MUST NOT directly import each other.
- Shared state crosses boundaries via Single-SPA custom events or the browser URL.
- Shared UI components come ONLY from `@grasdouble/lufa_design-system` (resolved via import map).
- The design system CSS is loaded ONCE in the main container's `main.ts`.

### Enabling Dev Mode (Import Map Overrides)

```js
// In browser console — activates the overrides devtools widget
localStorage.setItem('devtools', 'true');
location.reload();
```

---

## Testing Conventions

### Component Tests — Playwright CT

The design system uses `@playwright/experimental-ct-react` for component-level testing. There are **two** Playwright packages:

1. `@grasdouble/lufa_design-system-playwright` — standalone CT test suite (primary)
2. `@grasdouble/lufa_design-system` — also has inline CT tests via `playwright-ct.config.ts`

```bash
# Run component tests (dedicated playwright package)
pnpm ds:playwright:ci

# Update visual snapshots — MUST use Docker for cross-platform consistency
pnpm ds:playwright:docker:update-snapshots-linux
# ❌ NEVER update snapshots directly on macOS — they differ from CI Linux snapshots

# Interactive UI
pnpm ds:playwright:ui
```

### Accessibility Tests

The playwright package includes `@axe-core/playwright` for automated a11y testing.

### Token Tests

```bash
# DTCG format consistency checks (also runs as prebuild)
pnpm ds:tokens:validate:tokens

# WCAG contrast ratio tests
pnpm --filter @grasdouble/lufa_design-system-tokens test:wcag

# Token build (includes validate + size check)
pnpm ds:tokens:build
```

### Token Usage Validation

```bash
pnpm ds:main:validate:token-usage          # check for forbidden direct JSON imports
pnpm ds:main:validate:token-usage:unused   # find unused token references
pnpm ds:main:validate:components           # validate component export structure
pnpm ds:main:validate:components:strict    # strict validation
pnpm ds:themes:validate:all               # validate all 10 theme CSS files
```

### Monorepo-Wide Checks

```bash
pnpm all:typecheck    # TypeScript check all packages
pnpm all:lint         # ESLint all packages
pnpm all:test         # All package tests
```

---

## File Organization

### Design System Package Structure

```
packages/design-system/
├── main/           → @grasdouble/lufa_design-system (React components)
│   └── src/
│       ├── index.ts                  ← Public API (ONLY export from here)
│       ├── foundation/               ← Layout primitives (Box, Stack, Cluster, Flex, Grid, …)
│       ├── content/                  ← Display components (Text, Icon, Badge)
│       ├── interaction/              ← Form/action components (Button, Input, Label)
│       ├── composition/              ← Composed patterns (Card)
│       ├── utility/                  ← Technical helpers (Portal, VisuallyHidden)
│       ├── hooks/                    ← useTheme, useThemeMode
│       └── utils/                    ← accessibility.ts, responsive-visibility.ts
├── tokens/         → @grasdouble/lufa_design-system-tokens
│   └── src/
│       ├── primitives/               ← Raw values (color, spacing, typography, etc.)
│       ├── core/                     ← Design intent applied to primitives
│       ├── semantic/                 ← UI-context tokens
│       └── component/                ← Per-component tokens
├── themes/         → @grasdouble/lufa_design-system-themes
│   └── src/
│       ├── ocean.css, forest.css, coffee.css, … ← 10 theme CSS files
│       └── _token-template.css       ← Template for new themes
├── storybook/      → @grasdouble/lufa_design-system-storybook (private, port 6006)
│   └── src/stories/{numbered-category}/
├── playwright/     → @grasdouble/lufa_design-system-playwright (private, CT tests)
├── docusaurus/     → @grasdouble/lufa_design-system-docusaurus (private, docs site)
└── cli/            → @grasdouble/lufa_design-system-cli (theme validator binary)
```

### Microfrontend Structure

```
packages/apps/microfrontend/
├── main-container/
│   └── src/
│       ├── main.ts                   ← Single-SPA bootstrap + registerApplication + start()
│       ├── importMap.json            ← Production CDN URLs
│       ├── importMap.dev.json        ← Dev localhost URLs
│       └── importMapExternal.json    ← Shared singleton deps (React)
└── home/
    └── src/
        ├── parcel.tsx                ← Single-SPA lifecycle (bootstrap/mount/unmount)
        ├── App.tsx                   ← Root component
        ├── App.module.css            ← CSS Modules (uses design tokens)
        ├── App.module.css.d.ts       ← CSS module type declarations
        ├── getImageUrl.ts            ← import.meta.url asset resolver
        └── assets/                   ← .webp images
```

### Config Packages

```
packages/config/
├── eslint/     → @grasdouble/lufa_config_eslint   (basic.mjs, react.mjs, node.mjs, light.mjs)
├── prettier/   → @grasdouble/lufa_config_prettier  (prettier.config.mjs)
└── tsconfig/   → @grasdouble/lufa_config_tsconfig  (base.json, react-app.json, react-library.json, node.json)
```

### Plugin Packages

```
packages/plugins/vite/
├── vite-plugin-import-map-injector/ → @grasdouble/lufa_plugin_vite_vite-plugin-import-map-injector
└── vite-plugin-react-preamble/      → @grasdouble/lufa_plugin_vite_vite-plugin-react-preamble
packages/plugins/vscode/
└── lufa-ds-preview/                 → VSCode extension for design token preview
```

### New File Placement Rules

- New components → `packages/design-system/main/src/{category}/ComponentName/`
  - MUST include: `ComponentName.tsx`, `ComponentName.module.css`, `index.ts`
  - MUST export from the category `index.ts` and the root `src/index.ts`
- New tokens → `packages/design-system/tokens/src/{level}/` in DTCG JSON format
- New stories → `packages/design-system/storybook/src/stories/{N. Category}/ComponentName.stories.tsx`
- New microfrontend → `packages/apps/microfrontend/{name}/` + register in main-container

---

## Build System

### Build Order Dependency (MUST Follow This Sequence)

```
1. pnpm ds:tokens:build     → dist/tokens.css, tokens-values.json, themeable-tokens*.css
2. pnpm ds:themes:build     → copies 10 theme CSS files to dist/
3. pnpm ds:main:build       → dist/lufa-ui.mjs + style.css
4. pnpm ds:storybook:build  → storybook-static/
5. pnpm ds:docusaurus:build → static docs site
```

Or use the aggregate command (correct order guaranteed):

```bash
pnpm ds:all:build
```

### Design System Build Specifics

The `lufa_design-system` build MUST always run via the npm script — never directly via `vite build`:

```bash
# ✅ CORRECT — runs generate:utilities BEFORE vite build
pnpm --filter @grasdouble/lufa_design-system build

# ❌ WRONG — skips CSS utility class generation
vite build
```

The `generate:utilities` step pre-generates CSS utility classes for spacing, responsive visibility, and other utility props.

### Token Build Pipeline

```
pnpm validate:tokens
  └─> style-dictionary build
       ├─ Transforms: size/rem/fluid (px + clamp), color/css, shadow/css/shorthand-custom
       ├─ Formats: css/variables-with-modes, css/themeable-tokens, json/nested, json/vscode-map
       └─ Outputs: dist/tokens.css, themeable-tokens*.css, tokens-values.json,
                   tokens-metadata.json, tokens.map.json, tokens-source-merged.json
  └─> pnpm check:size  (warns if CSS > 120 KB)
  └─> pnpm merge:tokens
```

### Package Scripts Pattern (ALL Packages Expose These)

| Script              | Purpose                        |
| ------------------- | ------------------------------ |
| `build`             | Compile to `dist/`             |
| `dev`               | Watch mode / dev server        |
| `lint`              | ESLint check                   |
| `prettier:check`    | Format check                   |
| `prettier:write`    | Auto-format                    |
| `typecheck`         | `tsc --noEmit`                 |
| `validate:token-usage` | Check for forbidden imports |

### CDN Autobuild Server Build

```bash
# ESM output (Node.js)
pnpm cdn:autobuild-server:build
# Produces: dist/index.mjs (ESM) + dist/index.cjs (CJS)
```

The CDN server uses `esbuild` directly (not Vite). Built for Node.js `>=18`.

### Prettier Configuration (Enforced Across All Packages)

```
printWidth: 120, tabWidth: 2, singleQuote: true,
semi: true, trailingComma: 'es5', endOfLine: 'lf'
```

Import sorting: React first → third-party → @grasdouble/* → relative.

---

## Storybook Story Conventions

### Story File Structure

```tsx
// src/stories/{N. Category}/ComponentName.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';

import { MyComponent } from '@grasdouble/lufa_design-system';

import { CodeBlock, PropCard, StoryContainer } from '../../components/helpers';

const meta = {
  title: '6. Interaction/MyComponent', // ← Numeric category prefix REQUIRED
  component: MyComponent,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <StoryContainer>
      <PropCard label="Default">
        <MyComponent />
      </PropCard>
      <CodeBlock code="<MyComponent />" language="jsx" title="JSX" />
    </StoryContainer>
  ),
};
```

### Story Category Numbering (MANDATORY Sidebar Order)

```
1. Architecture   → Token architecture interactive demos
2. Guides         → Developer usage guides
3. Tokens         → Token catalog and visualization
4. Foundation     → Layout primitive components
5. Content        → Display components (Text, Icon, Badge)
6. Interaction    → Interactive components (Button, Input, Label)
7. Composition    → Composed patterns (Card)
8. Utility        → Technical helpers (Portal, VisuallyHidden)
```

### Theme Switching in Storybook

```tsx
// ❌ WRONG — @storybook/addon-themes is intentionally disabled
import { withThemeByDataAttribute } from '@storybook/addon-themes';

// ✅ CORRECT — handled automatically by ThemeAndModeWrapper global toolbar
// Theme/mode selection writes data-theme and data-mode to document.documentElement
```

### Theme-Aware Colors in Stories

```tsx
import { STORY_COLORS } from '../../constants/storyColors';

// ✅ For story chrome (adapts to active theme/mode)
<div style={{ color: STORY_COLORS.themed.text.primary }}>Label</div>

// ✅ For fixed decorative demo content
<Box style={{ backgroundColor: STORY_COLORS.primary.blue.main }}>Example</Box>
```

---

## Common Mistakes to Avoid

1. **NEVER hard-code color, spacing, or typography values** — ALWAYS use CSS custom properties from the token system (`--lufa-semantic-*`, `--lufa-component-*`).

2. **NEVER import `style.css` more than once** — it MUST be imported exactly once at the application root. Duplicates cause style specificity issues.

3. **NEVER import from design system sub-paths** (`/dist/lufa-ui.mjs`, `/interaction/Button`, etc.) — only the package root is a stable public API.

4. **NEVER import token JSON directly** from `dist/` or via the default export — use `@grasdouble/lufa_design-system-tokens/values` for runtime access.

5. **NEVER bundle React inside a microfrontend** — React MUST be externalized. It is provided as a singleton via the external import map from esm.sh.

6. **NEVER emit a separate CSS file from a microfrontend** — `vite-plugin-css-injected-by-js` bundles CSS into the `.mjs` file. A separate `.css` file would not be loaded by Single-SPA.

7. **NEVER call `createRoot()` inside `unmount`** — store the root reference from `mount` and call `.unmount()` on it. Re-creating root on every cycle leaks memory.

8. **NEVER skip the `generate:utilities` step in the design system build** — always run `pnpm build` (never `vite build` directly) so CSS utility classes are generated first.

9. **NEVER rely on package hoisting across the workspace** — `hoist: false` in pnpm-workspace.yaml means each package MUST declare all its own dependencies.

10. **NEVER reference `@grasdouble/lufa_design-system` as a bundled dependency in microfrontends** — it is always externalized and resolved via import map. Do NOT add it to `bundledDependencies`.

11. **NEVER add glow tokens to non-cyber themes** — `--lufa-glow-*` tokens are only defined in Cyberpunk and Matrix. Referencing them elsewhere produces undefined variables.

12. **NEVER use the `size` prop on `Input`** — it is excluded because it conflicts with the native HTML `size` attribute. Use `fullWidth` instead.

13. **NEVER use `ThemeName` values beyond `'default' | 'ocean' | 'forest'` in `useTheme()`** — the hook only manages these three. Apply `data-theme` attribute directly for other themes.

14. **NEVER create a new theme without running `pnpm ds:themes:validate:all`** — the template validator checks all 54 required alpha tokens, shadow structure, overlay tokens, and mode variants.

15. **NEVER use `interface` over `type`** — ESLint enforces `consistent-type-definitions: ['warn', 'type']`.

16. **NEVER use `@storybook/addon-themes` in stories** — it is intentionally disabled. Theme switching uses the custom `ThemeAndModeWrapper` global toolbar.

17. **NEVER use hard-coded icon name strings without checking `IconName` type** — e.g., `'close'` is not valid; use `'x'`. Check `IconName` export for the full list of 30 icons.

18. **NEVER update Playwright visual snapshots on macOS** — snapshots must be updated using the Docker command (`pnpm ds:playwright:docker:update-snapshots-linux`) for Linux-consistent rendering in CI.

---

## Quick Reference

### Dev Commands

```bash
# Start all microfrontends (container + home)
pnpm app:mf:dev

# Start design system (DS watch + Storybook + Docusaurus)
pnpm ds:all:dev

# Start only Storybook → http://localhost:6006
pnpm ds:storybook:dev

# Start only Docusaurus
pnpm ds:docusaurus:dev

# Run all package checks
pnpm all:typecheck && pnpm all:lint && pnpm all:test
```

### Build Commands

```bash
pnpm ds:all:build        # Full design system build (correct order)
pnpm app:mf:build        # Build all microfrontends
pnpm all:build           # Build every package in the monorepo
```

### Validation Commands

```bash
pnpm ds:tokens:validate:tokens           # DTCG format check
pnpm ds:main:validate:token-usage        # No forbidden direct imports
pnpm ds:main:validate:components         # Component export structure check
pnpm ds:all:validate:token-usage         # Token usage check across all DS packages
pnpm ds:themes:validate:all             # Validate all 10 theme CSS files
```

### Component Summary

| Component        | Category    | Key Props                                                                                              |
| ---------------- | ----------- | ------------------------------------------------------------------------------------------------------ |
| `Box`            | Foundation  | `as`, `padding*`, `margin*`, `background`, `borderRadius`, `show/hide/showFrom/hideFrom`               |
| `Stack`          | Foundation  | `direction`, `spacing`, `align`, `justify`, `wrap`                                                     |
| `Cluster`        | Foundation  | `spacing`, `align`, `justify`                                                                          |
| `Flex`           | Foundation  | Full flex props + `gap`, `inline`                                                                      |
| `Grid`           | Foundation  | `columns`, `gap*`, `align`, `justify`, `inline`                                                        |
| `Container`      | Foundation  | `fluid`, `size` (breakpoint)                                                                           |
| `Center`         | Foundation  | `inline` + all Box props                                                                               |
| `Bleed`          | Foundation  | `inline` (horizontal breakout), `block` (vertical)                                                     |
| `Divider`        | Foundation  | `orientation`, `emphasis`, `spacing`, `lineStyle`                                                      |
| `AspectRatio`    | Foundation  | Common ratios via CSS class; custom via `--aspect-ratio-padding` inline var                            |
| `Text`           | Content     | `as`, `variant`, `color`, `weight`, `align`, `transform`                                               |
| `Icon`           | Content     | `name` (required `IconName`), `size`, `color`, `title`                                                 |
| `Badge`          | Content     | `variant`, `size`, `dot`                                                                               |
| `Button`         | Interaction | `as`, `type`, `variant`, `size`, `radius`, `iconLeft`, `iconRight`, `loading`, `disabled`, `fullWidth` |
| `Input`          | Interaction | `error`, `fullWidth` (all native `<input>` props except `size`)                                        |
| `Label`          | Interaction | `as`, `htmlFor`                                                                                        |
| `Card`           | Composition | `as`                                                                                                   |
| `Portal`         | Utility     | `container`                                                                                            |
| `VisuallyHidden` | Utility     | `as`                                                                                                   |

### Hooks

| Hook                     | Returns                                                                         | localStorage key          |
| ------------------------ | ------------------------------------------------------------------------------- | ------------------------- |
| `useTheme(options?)`     | `{ theme, mode, effectiveMode, setTheme, setMode, systemPrefersDark }`          | `'lufa-theme'`            |
| `useThemeMode(options?)` | `{ mode, setMode, systemPrefersDark, systemPrefersContrast, systemPreference }` | `'lufa-theme-mode'`       |

**`useTheme` ThemeName**: `'default' | 'ocean' | 'forest'`  
**`useTheme` ThemeMode**: `'light' | 'dark' | 'auto'`  
**`useThemeMode` ThemeMode**: `'light' | 'dark' | 'high-contrast'`

### Port Assignments

| Service                     | Port   |
| --------------------------- | ------ |
| `lufa_microfrontend_main-container` | `5173` |
| `lufa_microfrontend_home`   | `4101` |
| Storybook                   | `6006` |

### CDN / External URLs

| Resource                | URL                                                   |
| ----------------------- | ----------------------------------------------------- |
| Production import map   | `https://cdn.sebastien-lemouillour.fr/importMap.json` |
| React (CDN)             | `https://esm.sh/react@19.0.0`                         |
| react-dom (CDN)         | `https://esm.sh/react-dom@19.0.0`                     |
| Storybook (hosted)      | `https://lufa-storybook.sebastien-lemouillour.fr`     |

### Package Registry

All packages publish to GitHub npm registry:

```json
"publishConfig": {
  "access": "public",
  "registry": "https://npm.pkg.github.com"
}
```

### Icon Names (30 total — `IconName` type)

`user`, `home`, `settings`, `menu`, `search`, `check`, `x`, `plus`, `minus`, `edit`, `trash`, `save`, `download`, `upload`, `chevron-down`, `chevron-up`, `chevron-left`, `chevron-right`, `arrow-left`, `arrow-right`, `alert-circle`, `info`, `check-circle`, `x-circle`, `loader`, `external-link`, `eye`, `eye-off`, `heart`, `star`

### Available Themes

| Theme     | `data-theme` value | Character                              |
| --------- | ------------------ | -------------------------------------- |
| Default   | (omit)             | Blue/gray neutral                      |
| Ocean     | `ocean`            | Cyan/teal marine                       |
| Forest    | `forest`           | Emerald/green organic                  |
| Coffee    | `coffee`           | Amber warm retro                       |
| Sunset    | `sunset`           | Orange/rose warm                       |
| Volcano   | `volcano`          | Red/orange intense                     |
| Nordic    | `nordic`           | Sky/slate arctic                       |
| Steampunk | `steampunk`        | Copper/bronze Victorian                |
| Volt      | `volt`             | Lime/black industrial                  |
| Cyberpunk | `cyberpunk`        | Fuchsia/cyan neon (has glow tokens)    |
| Matrix    | `matrix`           | Green/black terminal (has glow tokens) |
