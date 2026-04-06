---
package: '@grasdouble/lufa_design-system-themes'
shortName: lufa_design-system-themes
category: design-system
version: '1.0.1'
private: false
lastUpdated: '2026-02-24'
generatedAtCommit: 'd27c912328f538971b6720513be2c817c2feff15'
---

# @grasdouble/lufa_design-system-themes

Pre-built visual theme variants for the Lufa Design System. Each theme is a standalone CSS file that overrides the full adaptive token set — brand, neutral, and semantic — across light, dark, and high-contrast modes.

---

## Overview

This package ships 10 independently importable CSS theme files. A theme activates by setting `data-theme` (and optionally `data-mode`) attributes on any HTML element. Themes are pure CSS with no JavaScript runtime dependency and can be scoped to any subtree of the DOM.

The package depends on `@grasdouble/lufa_design-system-tokens` for the base token definitions. Themes override those tokens to provide a full palette change without requiring any component-level changes.

---

## Purpose

- Provide a curated set of complete, accessibility-validated color themes.
- Allow applications to switch between radically different visual identities using a single HTML attribute.
- Support all three rendering modes (light, dark, high-contrast) per theme.
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

Each theme file uses two selector forms:

```css
/* Default (no mode specified = light) */
[data-theme='ocean'],
[data-theme='ocean'][data-mode='light'] { ... }

/* Dark mode */
[data-theme='ocean'][data-mode='dark'] { ... }

/* High contrast mode */
[data-theme='ocean'][data-mode='high-contrast'] { ... }
```

This means the theme activates by default in light mode and mode-specific overrides are applied by adding the `data-mode` attribute.

### Token Categories per Theme File

Each theme file defines the following token groups:

| Token Group         | Naming Pattern                         | Description                                                            |
| ------------------- | -------------------------------------- | ---------------------------------------------------------------------- |
| **Brand tokens**    | `--lufa-core-brand-*`                  | Primary, secondary, accent colors and their hover/active states        |
| **Neutral tokens**  | `--lufa-core-neutral-*`                | Backgrounds, surfaces, borders, and text hierarchy                     |
| **Semantic tokens** | `--lufa-core-semantic-*`               | Success, error, warning, info states with subtle/border/hover variants |
| **RGB variables**   | `--lufa-{color}-rgb`                   | Raw RGB triplets used to compose alpha tokens                          |
| **Alpha tokens**    | `--lufa-color-alpha-{color}-{opacity}` | 9 transparency levels (3–50%) for each of 6 colors = 54 tokens         |
| **Shadow tokens**   | `--lufa-shadow-{size}`                 | 5 elevation sizes (xs, sm, md, lg, xl) built from a theme shadow color |
| **Overlay tokens**  | `--lufa-overlay-{tone}-{intensity}`    | Light/dark tonal overlays for hover states, modals, and backdrops      |
| **Glow tokens**     | `--lufa-glow-{type}-{intensity}`       | Neon luminescence effects — **Matrix and Cyberpunk only**              |

### File Structure per Theme

```
[data-theme='mytheme']                    ← RGB variables + 54 alpha tokens
[data-theme='mytheme'][data-mode='light'] ← Shadow color, shadow sizes, overlays
[data-theme='mytheme'][data-mode='dark']  ← Adjusted shadow color, overlays
[data-theme='mytheme'][data-mode='high-contrast'] ← Accessibility-optimized values
```

### Build Process

The build script (`scripts/copy-themes.ts`) simply copies the source CSS files from `src/` to `dist/`. No compilation or transformation occurs — theme files ship as authored.

```
pnpm build
  → pnpm clean       (rm -rf dist)
  → tsx scripts/copy-themes.ts  (copies 10 .css files from src/ to dist/)
```

---

## Available Themes

### Natural / Organic Themes

| Theme      | `data-theme` value | Identity                   | Primary Colors                             |
| ---------- | ------------------ | -------------------------- | ------------------------------------------ |
| **Ocean**  | `ocean`            | Marine, flowing, calm      | Cyan 600 (#0891b2), Teal 500 (#14b8a6)     |
| **Forest** | `forest`           | Organic, grounded, natural | Emerald 600 (#059669), Green 600 (#16a34a) |
| **Coffee** | `coffee`           | Retro, warm, nostalgic     | Amber 900 (#78350f), Yellow 800 (#a16207)  |

### Atmospheric / Elemental Themes

| Theme       | `data-theme` value | Identity                     | Primary Colors                           |
| ----------- | ------------------ | ---------------------------- | ---------------------------------------- |
| **Sunset**  | `sunset`           | Warm, elegant, calm          | Orange 600 (#c2410c), Rose 700 (#be123c) |
| **Volcano** | `volcano`          | Powerful, intense, high-heat | Red 600 (#dc2626), Orange 800 (#9a3412)  |
| **Nordic**  | `nordic`           | Minimalist, arctic, clean    | Sky 500 (#0369a1), Slate 500 (#64748b)   |

### Industrial / Mechanical Themes

| Theme         | `data-theme` value | Identity                     | Primary Colors                             |
| ------------- | ------------------ | ---------------------------- | ------------------------------------------ |
| **Steampunk** | `steampunk`        | Victorian, brass, industrial | Copper (#8b4513), Oxidized Green (#2e8b57) |
| **Volt**      | `volt`             | Industrial, high-visibility  | Lime 700 (#4d7c0f), Pure Black (#000000)   |

### Cyber / Digital Themes

| Theme         | `data-theme` value | Identity                     | Primary Colors                               |
| ------------- | ------------------ | ---------------------------- | -------------------------------------------- |
| **Cyberpunk** | `cyberpunk`        | Futuristic, neon, night-city | Fuchsia (#b300b3), Dark Cyan (#006666)       |
| **Matrix**    | `matrix`           | Digital, terminal, cinematic | Matrix Green (#007800), Deep Black (#000000) |

**Note:** Cyberpunk and Matrix are the only two themes that include glow tokens (`--lufa-glow-*`). All other themes use only shadow and overlay tokens for depth effects.

---

## Key Components

### `src/_token-template.css`

The authoritative template file for creating new themes. Contains:

- **Alpha tokens section** — copy-paste template for all 54 alpha tokens (6 colors × 9 opacity levels).
- **Shadow tokens section** — standardized shadow size tokens with mode-specific shadow color guidance.
- **Overlay tokens section** — light/dark/backdrop overlay tokens with per-mode opacity recommendations.
- **Glow tokens section** — optional neon luminescence tokens for cyber/neon themes only.
- **Implementation checklist** — step-by-step checklist for theme authors.
- **Best practices** — 12 documented conventions.
- **RGB extraction guide** — manual and DevTools methods for converting hex to RGB.
- **Full steampunk example** — complete reference implementation.

This file is validated by `scripts/validate-template.ts` to ensure it stays conformant to the design system conventions.

### `scripts/copy-themes.ts`

The build script. Iterates over the hardcoded `themes` array and copies each `.css` from `src/` to `dist/`. Adding a new theme requires adding its filename to this array in addition to exporting it in `package.json`.

### `scripts/validate-template.ts`

A TypeScript validation script that programmatically checks `_token-template.css` against the expected structure. It validates:

- CSS structure (tokens in `[data-theme]` selectors, not at root level)
- Alpha token completeness (all 54 tokens, all 9 opacity levels per color)
- Shadow token completeness (5 sizes, `--lufa-shadow-color` variable)
- Shadow-xl spec compliance (`0 12px 24px`, not `0 16px 32px`)
- Overlay token completeness (light and dark variants)
- Glow token structure (4 box intensities, 4 text intensities, 3 inset intensities)
- RGB variable naming convention (`--lufa-{color}-rgb`, not `--lufa-rgb-{color}`)
- Documentation sections presence
- All 3 mode variants documented

### `scripts/validate-a11y.ts`

An accessibility validation script runnable via `pnpm validate:a11y`.

---

## API Reference

### HTML Attribute API

Themes are activated entirely through HTML attributes:

```html
<!-- Activate a theme (defaults to light mode) -->
<html data-theme="ocean">
  <!-- Activate a theme in a specific mode -->
  <html data-theme="ocean" data-mode="dark">
    <html data-theme="ocean" data-mode="light">
      <html data-theme="ocean" data-mode="high-contrast">
        <!-- Scope a theme to a subtree -->
        <section data-theme="matrix" data-mode="dark">...</section>
      </html>
    </html>
  </html>
</html>
```

### CSS Import API

Each theme is exported as a direct path in `package.json#exports`:

```css
@import '@grasdouble/lufa_design-system-themes/ocean.css';
@import '@grasdouble/lufa_design-system-themes/forest.css';
@import '@grasdouble/lufa_design-system-themes/matrix.css';
@import '@grasdouble/lufa_design-system-themes/cyberpunk.css';
@import '@grasdouble/lufa_design-system-themes/nordic.css';
@import '@grasdouble/lufa_design-system-themes/steampunk.css';
@import '@grasdouble/lufa_design-system-themes/coffee.css';
@import '@grasdouble/lufa_design-system-themes/sunset.css';
@import '@grasdouble/lufa_design-system-themes/volcano.css';
@import '@grasdouble/lufa_design-system-themes/volt.css';
```

The base tokens package must be imported before any theme:

```css
@import '@grasdouble/lufa_design-system-tokens/style.css'; /* required */
@import '@grasdouble/lufa_design-system-themes/ocean.css'; /* then theme */
```

### CSS Token Reference

All token names follow the pattern established by `@grasdouble/lufa_design-system-tokens`. Themes redefine the existing tokens — they do not introduce new property names (except the optional glow tokens in cyber themes).

#### Brand Tokens (31 adaptive tokens per theme)

```css
--lufa-core-brand-primary-default
--lufa-core-brand-primary-hover
--lufa-core-brand-primary-active
--lufa-core-brand-secondary-default
--lufa-core-brand-secondary-hover
--lufa-core-brand-secondary-active
--lufa-core-brand-accent-visited
--lufa-core-brand-primary-on-background
--lufa-core-brand-secondary-on-background
```

#### Neutral Tokens

```css
--lufa-core-neutral-background
--lufa-core-neutral-surface-default
--lufa-core-neutral-surface-hover
--lufa-core-neutral-border-default
--lufa-core-neutral-border-strong
--lufa-core-neutral-text-primary
--lufa-core-neutral-text-secondary
--lufa-core-neutral-text-tertiary
--lufa-core-neutral-text-disabled
```

#### Semantic Tokens (per state: success, error, warning, info)

```css
--lufa-core-semantic-{state}-default
--lufa-core-semantic-{state}-subtle
--lufa-core-semantic-{state}-border
--lufa-core-semantic-{state}-hover
```

#### Alpha Tokens (54 per theme — 6 colors × 9 opacity levels)

```css
--lufa-color-alpha-{primary|secondary|success|error|warning|info}-{3|5|8|10|15|20|30|40|50}
/* e.g. */
--lufa-color-alpha-primary-10: rgba(var(--lufa-primary-rgb), 0.1);
--lufa-color-alpha-error-50:   rgba(var(--lufa-error-rgb), 0.5);
```

#### Shadow Tokens

```css
--lufa-shadow-color   /* Theme-specific base color, mode-adjusted opacity */
--lufa-shadow-xs      /* 0 1px 2px  */
--lufa-shadow-sm      /* 0 2px 4px  */
--lufa-shadow-md      /* 0 4px 8px  */
--lufa-shadow-lg      /* 0 8px 16px */
--lufa-shadow-xl      /* 0 12px 24px */
```

#### Overlay Tokens

```css
--lufa-overlay-light-subtle        /* rgba(255,255,255, 0.05) */
--lufa-overlay-light               /* rgba(255,255,255, 0.10) */
--lufa-overlay-light-strong        /* rgba(255,255,255, 0.20) */
--lufa-overlay-dark-subtle         /* rgba(0,0,0, 0.05–0.20)  */
--lufa-overlay-dark                /* rgba(0,0,0, 0.10–0.40)  */
--lufa-overlay-dark-strong         /* rgba(0,0,0, 0.30–0.60)  */
--lufa-overlay-backdrop-light      /* rgba(0,0,0, 0.30–0.60)  */
--lufa-overlay-backdrop            /* rgba(0,0,0, 0.50–0.80)  */
--lufa-overlay-backdrop-strong     /* rgba(0,0,0, 0.70–0.95)  */
```

#### Glow Tokens (Cyberpunk and Matrix only)

```css
--lufa-glow-color                  /* Primary glow color (rgba) */
--lufa-glow-color-secondary        /* Secondary glow color (rgba) */

/* Box glows (4 intensity levels) */
--lufa-glow-box-subtle
--lufa-glow-box
--lufa-glow-box-strong
--lufa-glow-box-intense

/* Text glows (4 intensity levels) */
--lufa-glow-text-subtle
--lufa-glow-text
--lufa-glow-text-strong
--lufa-glow-text-intense

/* Inset glows (3 intensity levels) */
--lufa-glow-inset-subtle
--lufa-glow-inset
--lufa-glow-inset-strong
```

---

## Usage Examples

### Basic theme in HTML

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

### Scoped theme (mixed themes on one page)

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

### CSS import order

```css
/* globals.css */
@import '@grasdouble/lufa_design-system-tokens/style.css';
@import '@grasdouble/lufa_design-system-themes/ocean.css';
/* Multiple themes can be imported — only the active data-theme applies */
@import '@grasdouble/lufa_design-system-themes/forest.css';
```

### React hook with theme persistence

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

### Prevent flash of wrong theme (FOUC)

```html
<head>
  <!-- Inline script before any stylesheets -->
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

### SSR hydration safety

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

### Using glow tokens (Cyberpunk/Matrix)

```css
/* Glowing card with elevation */
.cyber-card {
  box-shadow: var(--lufa-shadow-md), var(--lufa-glow-box);
}

/* Neon button hover state */
.cyber-button:hover {
  box-shadow: var(--lufa-shadow-sm), var(--lufa-glow-box-strong);
}

/* Glowing heading text */
.hero-title {
  text-shadow: var(--lufa-glow-text-intense);
}

/* Inner glow on a panel */
.cyber-panel {
  box-shadow: var(--lufa-glow-inset);
}
```

### Adding a new theme

1. Copy `src/_token-template.css` to `src/your-theme.css`
2. Fill in all token values for all three modes (light, dark, high-contrast)
3. Add `'your-theme.css'` to the `themes` array in `scripts/copy-themes.ts`
4. Add `"./your-theme.css": "./dist/your-theme.css"` to `package.json#exports`
5. Run `pnpm build` then `pnpm validate:template` to confirm the output is valid

---

## Dependencies

### Runtime Dependencies

| Package                                 | Version       | Role                                                     |
| --------------------------------------- | ------------- | -------------------------------------------------------- |
| `@grasdouble/lufa_design-system-tokens` | `workspace:^` | Provides the base token definitions that themes override |

### Dev Dependencies

| Package                            | Purpose                                              |
| ---------------------------------- | ---------------------------------------------------- |
| `tsx`                              | Executes the build and validation TypeScript scripts |
| `typescript`                       | Type checking for scripts                            |
| `eslint` / `prettier`              | Code quality for TypeScript scripts in `scripts/`    |
| `@grasdouble/lufa_config_eslint`   | Shared ESLint configuration                          |
| `@grasdouble/lufa_config_prettier` | Shared Prettier configuration                        |
| `@grasdouble/lufa_config_tsconfig` | Shared TypeScript configuration                      |

---

## Scripts

| Script              | Command                                        | Description                                   |
| ------------------- | ---------------------------------------------- | --------------------------------------------- |
| `build`             | `pnpm clean && tsx scripts/copy-themes.ts`     | Copies theme CSS from `src/` to `dist/`       |
| `clean`             | `rm -rf dist`                                  | Removes the dist directory                    |
| `validate:template` | `tsx scripts/validate-template.ts`             | Validates `_token-template.css` conformance   |
| `validate:a11y`     | `tsx scripts/validate-a11y.ts`                 | Validates accessibility in theme color values |
| `validate`          | `pnpm validate:template && pnpm validate:a11y` | Runs all validation checks                    |
| `lint`              | `eslint scripts --ext .ts`                     | Lints TypeScript scripts                      |
| `typecheck`         | `tsc -p tsconfig.json --noEmit`                | Type-checks scripts without emitting          |

---

## Accessibility

All theme color values are selected to meet WCAG AA contrast standards. Key design decisions:

- **Light mode**: Darker, more saturated brand colors are used to ensure sufficient contrast against light backgrounds. For example, Cyberpunk light mode uses `#b300b3` (not pure `#ff00ff`) to achieve a 5.65:1 contrast ratio.
- **Dark mode**: Brighter, lighter color variants are used against dark backgrounds.
- **High-contrast mode**: Maximum contrast — typically pure black/white backgrounds with fully saturated foreground colors — targeting WCAG AAA.
- The `validate:a11y` script provides automated contrast checking.

---

## Related Documentation

| Resource             | Path                                                        |
| -------------------- | ----------------------------------------------------------- |
| Design System README | `packages/design-system/themes/README.md`                   |
| Token Architecture   | `packages/design-system/tokens/_docs/ARCHITECTURE.md`       |
| Token Conventions    | `packages/design-system/tokens/_docs/TOKENS_CONVENTIONS.md` |
| Base Tokens Package  | `packages/design-system/tokens/`                            |
| Token Template       | `packages/design-system/themes/src/_token-template.css`     |
| CHANGELOG            | `packages/design-system/themes/CHANGELOG.md`                |
