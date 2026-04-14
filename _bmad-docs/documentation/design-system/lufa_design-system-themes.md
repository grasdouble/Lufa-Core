---
generatedAtCommit: "ab53a003edb177c2298250479fbe4465ee920bc3"
lastUpdated: "2026-04-07"
package: "@grasdouble/lufa_design-system-themes"
version: "1.1.1"
---

# @grasdouble/lufa_design-system-themes

Pre-built CSS theme variants for the Lufa Design System. Each theme is a standalone CSS file that overrides the full adaptive token set — brand, neutral, and feedback — across light, dark, and high-contrast modes, plus structural personality tokens (shape, motion, shadows, background pattern).

---

## Overview

This package ships 10 independently importable CSS theme files. A theme activates by setting `data-theme` (and optionally `data-mode`) attributes on any HTML element. Themes are pure CSS with no JavaScript runtime dependency and can be scoped to any subtree of the DOM.

The package depends on `@grasdouble/lufa_design-system-tokens` for the base token definitions. Themes override those tokens to provide a full palette change without requiring any component-level changes.

---

## Purpose

- Provide a curated set of complete, accessibility-validated (WCAG AA) color themes.
- Allow applications to switch between radically different visual identities using a single HTML attribute.
- Support all three rendering modes (light, dark, high-contrast) per theme.
- Enable scoped multi-theme layouts — different DOM subtrees can use different themes simultaneously.
- Serve as a reference implementation and template for creating additional custom themes.

---

## Architecture

### Token Override Model

Themes work by redefining the same CSS custom property names that the base tokens package defines. Because CSS custom properties cascade, a `[data-theme="ocean"]` selector is more specific than the default `:root` selector in the tokens package, so the theme values win.

```
@grasdouble/lufa_design-system-tokens   ← Defines the default token values on :root
@grasdouble/lufa_design-system-themes   ← Overrides those values on [data-theme="..."]
```

### Selector Strategy

Each theme file uses these selector blocks:

```css
/* Structural tokens — apply to all modes */
[data-theme='ocean'] {
  --lufa-semantic-ui-border-radius-*: ...;
  --lufa-semantic-ui-transition-*: ...;
  --lufa-semantic-ui-shadow-*: ...;
  --lufa-semantic-ui-background-pattern: ...;
  /* Optional: typography overrides (selected themes only) */
}

/* Light mode (default when no data-mode specified) */
[data-theme='ocean'],
[data-theme='ocean'][data-mode='light'] { ... }

/* Dark mode */
[data-theme='ocean'][data-mode='dark'] { ... }

/* High-contrast mode */
[data-theme='ocean'][data-mode='high-contrast'] { ... }
```

The combined selector `[data-theme='X'], [data-theme='X'][data-mode='light']` means light is the default when no `data-mode` attribute is present.

### Token Categories per Theme File

#### Structural Tokens (mode-invariant, on `[data-theme='X']`)

| Token | Description |
|---|---|
| `--lufa-semantic-ui-border-radius-{small\|default\|medium\|large}` | Shape personality — from `none` to `full` |
| `--lufa-semantic-ui-transition-duration-{fast\|normal}` | Motion speed — from `instant` to `slow` |
| `--lufa-semantic-ui-transition-timing-function-default` | Easing curve |
| `--lufa-semantic-ui-shadow-{small\|medium\|large\|extra-large}` | Elevation with brand-tinted color |
| `--lufa-semantic-ui-background-pattern` | Decorative background CSS gradient or pattern |
| `--lufa-core-typography-heading-font-family` | Heading font (mono for cyber/technical themes) |
| `--lufa-core-typography-body-font-family` | Body font (mono for Matrix theme only) |
| `--lufa-core-typography-heading-letter-spacing` | Heading tracking |

#### Color Tokens (per mode block)

**Brand**

```css
--lufa-core-color-brand-primary-default
--lufa-core-color-brand-primary-hover
--lufa-core-color-brand-primary-active
--lufa-core-color-brand-primary-on-background
--lufa-core-color-brand-secondary-default
--lufa-core-color-brand-secondary-hover
--lufa-core-color-brand-secondary-active
--lufa-core-color-brand-secondary-on-background
--lufa-core-color-brand-accent-visited
```

**Neutral**

```css
--lufa-core-color-neutral-background
--lufa-core-color-neutral-surface-default
--lufa-core-color-neutral-surface-hover
--lufa-core-color-neutral-surface-active
--lufa-core-color-neutral-surface-raised
--lufa-core-color-neutral-border-default
--lufa-core-color-neutral-border-strong
--lufa-core-color-neutral-text-primary
--lufa-core-color-neutral-text-secondary
--lufa-core-color-neutral-text-tertiary
--lufa-core-color-neutral-text-disabled
```

**Feedback** (repeated for `success`, `error`, `warning`, `info`)

```css
--lufa-core-color-feedback-{state}-default
--lufa-core-color-feedback-{state}-subtle
--lufa-core-color-feedback-{state}-border
--lufa-core-color-feedback-{state}-hover
--lufa-core-color-feedback-{state}-active
--lufa-core-color-feedback-{state}-on-background
```

#### Effect Tokens (per mode block)

```css
/* All themes */
--lufa-semantic-effect-glow-box-primary-default
--lufa-semantic-effect-glow-box-primary-hover

/* Cyber themes only (Matrix, Cyberpunk, Volt, Ocean) — text and focus glows */
--lufa-semantic-effect-glow-text-primary-default
--lufa-semantic-effect-glow-text-primary-hover
--lufa-semantic-effect-glow-border-focus
--lufa-semantic-effect-glow-box-focus
```

#### Component Override Tokens (WCAG AA fixes)

Each theme includes targeted component-level overrides to fix cases where the core token cascade produces insufficient contrast ratios. These are documented inline with the contrast ratio:

```css
/* Example — Ocean light mode */
/* neutral-text-primary (#0c4a6e) on #f0f9ff = 8.87:1 */
--lufa-component-button-type-outline-variant-neutral-border-active: #0c4a6e;
```

Categories of component overrides present across themes:

| Token prefix | Purpose |
|---|---|
| `--lufa-semantic-interactive-background-active` | Interactive pressed-state background |
| `--lufa-semantic-interactive-text-active` | Interactive pressed-state text |
| `--lufa-component-button-type-outline-*` | Outline button border/bg in hover and active states |
| `--lufa-component-button-type-solid-*` | Solid button bg/text in hover and active states |
| `--lufa-component-button-type-ghost-*` | Ghost button bg/text in active state |
| `--lufa-component-input-border-error` | Input error border (Cyberpunk dark only) |

### Build Process

The build script (`scripts/copy-themes.ts`) copies source CSS files from `src/` to `dist/`. No compilation or transformation occurs — theme files ship exactly as authored.

```
pnpm build
  → pnpm clean               (rm -rf dist)
  → tsx scripts/copy-themes.ts
        copies src/{theme}.css → dist/{theme}.css  (10 files)
```

---

## Available Themes

### Natural / Organic Themes

| Theme | `data-theme` | Shape | Motion | Primary (light) |
|---|---|---|---|---|
| **Ocean** | `ocean` | Very rounded / full | Slow, wave-like, ease-out | Cyan `#0e7490` |
| **Forest** | `forest` | Organic, medium rounded | Natural, ease-in-out | Emerald `#047857` |
| **Coffee** | `coffee` | Comfortable, cozy | Slow, unhurried, ease | Amber `#78350f` |

### Atmospheric / Elemental Themes

| Theme | `data-theme` | Shape | Motion | Primary (light) |
|---|---|---|---|---|
| **Sunset** | `sunset` | Full pill | Bouncy, ease-bounce | Orange `#c2410c` |
| **Volcano** | `volcano` | Medium | Standard | Red `#dc2626` |
| **Nordic** | `nordic` | Minimal, slight | Fast, linear | Sky `#0369a1` |

### Industrial / Mechanical Themes

| Theme | `data-theme` | Shape | Motion | Primary (light) |
|---|---|---|---|---|
| **Steampunk** | `steampunk` | Slight rounding | Measured | Copper `#8b4513` |
| **Volt** | `volt` | Razor sharp, none | Instant snap, linear | Lime `#4d7c0f` |

### Cyber / Digital Themes

| Theme | `data-theme` | Shape | Motion | Primary (light) | Glow |
|---|---|---|---|---|---|
| **Cyberpunk** | `cyberpunk` | Sharp, no softness | Fast, aggressive, ease-in | Fuchsia `#b300b3` | Full suite |
| **Matrix** | `matrix` | Pure rectangles | Instant, linear | Matrix Green `#007800` | Full suite |

**Note:** Cyberpunk and Matrix have the most extensive glow effect tokens including text glow, focus glow, and box glow. All other themes include only `glow-box-primary-default/hover` (or `none` in high-contrast mode for accessibility).

---

## Key Components

### `scripts/copy-themes.ts`

The build script. Iterates over the hardcoded `themes` array and copies each `.css` from `src/` to `dist/`. Adding a new theme requires adding its filename to this array in addition to exporting it in `package.json`.

### `src/{theme}.css` (10 files)

Each theme file is self-contained and follows a consistent four-block pattern:

1. `[data-theme='X']` — structural/personality tokens
2. `[data-theme='X'], [data-theme='X'][data-mode='light']` — light color palette
3. `[data-theme='X'][data-mode='dark']` — dark color palette
4. `[data-theme='X'][data-mode='high-contrast']` — maximum-contrast palette

---

## API Reference

### HTML Attribute API

```html
<!-- Activate a theme (defaults to light mode) -->
<html data-theme="ocean">

<!-- Specific mode -->
<html data-theme="ocean" data-mode="dark">
<html data-theme="ocean" data-mode="light">
<html data-theme="ocean" data-mode="high-contrast">

<!-- Scope a theme to a subtree -->
<section data-theme="matrix" data-mode="dark">...</section>
```

### CSS Import API

Each theme is exported as a direct path in `package.json#exports`:

```json
{
  "./coffee.css":    "./dist/coffee.css",
  "./cyberpunk.css": "./dist/cyberpunk.css",
  "./forest.css":    "./dist/forest.css",
  "./matrix.css":    "./dist/matrix.css",
  "./nordic.css":    "./dist/nordic.css",
  "./ocean.css":     "./dist/ocean.css",
  "./steampunk.css": "./dist/steampunk.css",
  "./sunset.css":    "./dist/sunset.css",
  "./volcano.css":   "./dist/volcano.css",
  "./volt.css":      "./dist/volt.css"
}
```

The base tokens package must be imported before any theme:

```css
@import '@grasdouble/lufa_design-system-tokens/style.css'; /* required first */
@import '@grasdouble/lufa_design-system-themes/ocean.css';
```

### Validation Commands

| Script | Description |
|---|---|
| `pnpm validate:theme:all` | Validate all 10 themes against the required token set |
| `pnpm validate:theme:{name}` | Validate a single theme (e.g. `pnpm validate:theme:ocean`) |
| `pnpm validate:token-usage` | Verify all token names used in CSS are valid |
| `pnpm validate:token-usage:unused` | Find unused tokens |
| `pnpm validate:token-usage:verbose` | Verbose token usage report |

Validation is powered by `@grasdouble/lufa_design-system-cli` (`lufa-ds-cli theme-validate`).

---

## Usage Examples

### Basic HTML Setup

```html
<!DOCTYPE html>
<html data-theme="ocean" data-mode="dark">
  <head>
    <!-- 1. Base tokens first -->
    <link rel="stylesheet" href="node_modules/@grasdouble/lufa_design-system-tokens/style.css" />
    <!-- 2. Theme override -->
    <link rel="stylesheet" href="node_modules/@grasdouble/lufa_design-system-themes/ocean.css" />
  </head>
  <body>
    <!-- All elements inside inherit the ocean dark theme -->
  </body>
</html>
```

### Scoped / Multi-theme Page

```html
<html data-theme="nordic" data-mode="light">
  <main>
    <!-- Most of the page is Nordic light -->
    <section data-theme="matrix" data-mode="dark">
      <!-- This section uses Matrix dark -->
    </section>
  </main>
</html>
```

### Importing All Themes (for theme switchers)

Real usage from `packages/design-system/storybook/src/style.css` and `packages/design-system/docusaurus/src/css/custom.css`:

```css
@import '@grasdouble/lufa_design-system-tokens/style.css';

@import '@grasdouble/lufa_design-system-themes/ocean.css';
@import '@grasdouble/lufa_design-system-themes/forest.css';
@import '@grasdouble/lufa_design-system-themes/matrix.css';
@import '@grasdouble/lufa_design-system-themes/cyberpunk.css';
@import '@grasdouble/lufa_design-system-themes/sunset.css';
@import '@grasdouble/lufa_design-system-themes/nordic.css';
@import '@grasdouble/lufa_design-system-themes/volcano.css';
@import '@grasdouble/lufa_design-system-themes/coffee.css';
@import '@grasdouble/lufa_design-system-themes/volt.css';
@import '@grasdouble/lufa_design-system-themes/steampunk.css';
```

### React Hook with Theme Persistence

```tsx
// hooks/useTheme.ts
import { useEffect, useState } from 'react';

type Mode = 'light' | 'dark' | 'high-contrast';

export function useTheme() {
  const [mode, setModeState] = useState<Mode>(() => {
    const stored = localStorage.getItem('lufa-theme');
    if (stored && ['light', 'dark', 'high-contrast'].includes(stored)) return stored as Mode;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  });

  useEffect(() => {
    localStorage.setItem('lufa-theme', mode);
    document.documentElement.setAttribute('data-mode', mode);
  }, [mode]);

  return { mode, setMode: setModeState };
}
```

### Prevent Flash of Wrong Theme (FOUC)

```html
<head>
  <!-- Inline script BEFORE any stylesheets -->
  <script>
    (function () {
      const theme = localStorage.getItem('lufa-theme') || 'light';
      document.documentElement.setAttribute('data-mode', theme);
    })();
  </script>
  <link rel="stylesheet" href="tokens.css" />
  <link rel="stylesheet" href="ocean.css" />
</head>
```

### SSR Hydration Safety

```tsx
function App() {
  const [mounted, setMounted] = useState(false);
  const { mode } = useTheme();

  useEffect(() => setMounted(true), []);

  // Render with stable default until client hydrates
  if (!mounted) return <div data-mode="light">{/* loading state */}</div>;

  return <div data-mode={mode}>{/* app content */}</div>;
}
```

### Adding a New Theme

1. Copy an existing `src/*.css` as a starting template.
2. Fill in all token values for all three mode blocks (light, dark, high-contrast).
3. Add the filename to the `themes` array in `scripts/copy-themes.ts`.
4. Add `"./your-theme.css": "./dist/your-theme.css"` to `package.json#exports`.
5. Run `pnpm build` then `pnpm validate:theme:your-theme` to confirm validity.

---

## Dependencies

### Runtime Dependencies

| Package | Version | Role |
|---|---|---|
| `@grasdouble/lufa_design-system-tokens` | `workspace:^` | Provides all primitive and adaptive tokens that themes override |

Themes are purely additive CSS overrides. The tokens package **must** be loaded before any theme CSS.

### Dev Dependencies

| Package | Purpose |
|---|---|
| `@grasdouble/lufa_design-system-cli` | `lufa-ds-cli theme-validate` used by validate scripts |
| `tsx` | Executes the TypeScript build script (`copy-themes.ts`) |
| `typescript` | Type-checking the build script |
| `@grasdouble/lufa_config_eslint` | Shared ESLint configuration |
| `@grasdouble/lufa_config_prettier` | Shared Prettier configuration |
| `@grasdouble/lufa_config_tsconfig` | Shared TypeScript configuration |
| `@ianvs/prettier-plugin-sort-imports` | Import sorting in Prettier |
| `sort-package-json` | Package.json key ordering |

### Known In-monorepo Consumers

| Package | Usage |
|---|---|
| `@grasdouble/lufa_design-system-storybook` | Imports all 10 themes for component stories |
| `@grasdouble/lufa_design-system-docusaurus` | Imports all 10 themes for the documentation site |

---

## Configuration

### tsconfig.json

The TypeScript config covers only the `scripts/` directory. Theme source files are plain CSS and require no transpilation.

```json
{
  "extends": "@grasdouble/lufa_config_tsconfig/tsconfig.base.json",
  "include": ["scripts"]
}
```

### Package Publishing

Published to `https://npm.pkg.github.com` under `@grasdouble` scope with public access.

---

## Accessibility

All theme color values are selected to meet WCAG AA contrast standards (minimum 4.5:1 for text, 3:1 for UI components). Design decisions:

- **Light mode**: Darker, more saturated brand colors ensure sufficient contrast against light backgrounds. For example, Cyberpunk light uses `#b300b3` (not pure `#ff00ff`) to achieve the required ratio.
- **Dark mode**: Brighter, lighter color variants against dark backgrounds.
- **High-contrast mode**: Maximum contrast — typically pure `#000000` backgrounds and fully saturated foreground colors, targeting WCAG AAA (21:1 for text in many cases).
- **Glow effects** are disabled (`none`) in high-contrast mode for all themes where they could reduce readability (Ocean, Sunset, Coffee, Volt high-contrast blocks explicitly set `none`).
- **Component overrides** are documented inline with measured contrast ratios, e.g. `/* #001a00 on #c6f7c6 = 15.27:1 ✓ */`.

---

## Related Documentation

| Resource | Path |
|---|---|
| Design System README | `packages/design-system/themes/README.md` |
| Token Architecture | `packages/design-system/tokens/_docs/ARCHITECTURE.md` |
| Base Tokens Package | `packages/design-system/tokens/` |
| CHANGELOG | `packages/design-system/themes/CHANGELOG.md` |
