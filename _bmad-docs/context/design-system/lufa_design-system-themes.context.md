---
package: '@grasdouble/lufa_design-system-themes'
shortName: lufa_design-system-themes
category: design-system
type: context
lastUpdated: '2026-02-24'
generatedAtCommit: 'd27c912328f538971b6720513be2c817c2feff15'
---

# Context: @grasdouble/lufa_design-system-themes

## What This Package Does

Ships 10 pre-built CSS theme files for the Lufa Design System. Each file completely overrides the adaptive color token set (brand, neutral, semantic) for light, dark, and high-contrast rendering modes. Themes are activated by HTML data attributes and have no JavaScript runtime dependency.

## Package Identity

- **npm name**: `@grasdouble/lufa_design-system-themes`
- **version**: `1.0.1`
- **private**: `false` (published to `https://npm.pkg.github.com`)
- **license**: MIT
- **module type**: ESM (`"type": "module"`)
- **source**: `packages/design-system/themes/src/`
- **output**: `packages/design-system/themes/dist/`

## The 10 Themes

| Theme     | Selector                 | Aesthetic            | Primary / Secondary   | Has Glows? |
| --------- | ------------------------ | -------------------- | --------------------- | ---------- |
| Ocean     | `data-theme="ocean"`     | Marine, cyan/teal    | `#0e7490` / `#0f766e` | No         |
| Forest    | `data-theme="forest"`    | Natural, emerald     | `#047857` / `#15803d` | No         |
| Coffee    | `data-theme="coffee"`    | Warm, vintage        | `#78350f` / `#a16207` | No         |
| Sunset    | `data-theme="sunset"`    | Warm, elegant        | `#c2410c` / `#be123c` | No         |
| Volcano   | `data-theme="volcano"`   | Intense, heat        | `#dc2626` / `#9a3412` | No         |
| Nordic    | `data-theme="nordic"`    | Minimalist, arctic   | `#0369a1` / `#64748b` | No         |
| Steampunk | `data-theme="steampunk"` | Victorian, brass     | `#8b4513` / `#1f5a37` | No         |
| Volt      | `data-theme="volt"`      | Industrial, high-vis | `#4d7c0f` / `#000000` | No         |
| Cyberpunk | `data-theme="cyberpunk"` | Neon, futuristic     | `#b300b3` / `#006666` | **Yes**    |
| Matrix    | `data-theme="matrix"`    | Digital, cinematic   | `#007800` / `#006400` | **Yes**    |

## How Themes Work

Themes are pure CSS files. They override CSS custom properties from `@grasdouble/lufa_design-system-tokens` using attribute selectors that are more specific than the base `:root` rules.

```
Import order:
  1. @grasdouble/lufa_design-system-tokens/style.css   ← base token values on :root
  2. @grasdouble/lufa_design-system-themes/ocean.css   ← overrides on [data-theme="ocean"]
```

Activation:

```html
<html data-theme="ocean" data-mode="dark"></html>
```

Scoping: any element can carry a `data-theme` attribute to scope a theme to a subtree.

## Token Structure Per Theme

Every theme file contains these sections:

```
[data-theme='X'], [data-theme='X'][data-mode='light'] {
  /* Brand tokens: primary/secondary color + hover/active/on-background */
  --lufa-core-brand-primary-default
  --lufa-core-brand-primary-hover
  --lufa-core-brand-primary-active
  --lufa-core-brand-secondary-default
  --lufa-core-brand-secondary-hover
  --lufa-core-brand-secondary-active
  --lufa-core-brand-accent-visited
  --lufa-core-brand-primary-on-background
  --lufa-core-brand-secondary-on-background

  /* Neutral tokens: background, surface, border, text (4 levels) */
  --lufa-core-neutral-background
  --lufa-core-neutral-surface-default / hover
  --lufa-core-neutral-border-default / strong
  --lufa-core-neutral-text-primary / secondary / tertiary / disabled

  /* Semantic tokens: 4 states × 4 variants = 16 tokens */
  --lufa-core-semantic-{success|error|warning|info}-{default|subtle|border|hover}

  /* RGB variables (6 colors, used to build alpha tokens) */
  --lufa-primary-rgb, --lufa-secondary-rgb, --lufa-success-rgb,
  --lufa-error-rgb, --lufa-warning-rgb, --lufa-info-rgb

  /* Alpha tokens: 6 colors × 9 opacity levels = 54 tokens */
  --lufa-color-alpha-{primary|secondary|success|error|warning|info}-{3|5|8|10|15|20|30|40|50}

  /* Shadow tokens: color variable + 5 size tokens */
  --lufa-shadow-color
  --lufa-shadow-{xs|sm|md|lg|xl}

  /* Overlay tokens: 9 tokens across light/dark/backdrop categories */
  --lufa-overlay-light-{subtle|default|strong}
  --lufa-overlay-dark-{subtle|default|strong}
  --lufa-overlay-backdrop-{light|default|strong}
}

[data-theme='X'][data-mode='dark'] {
  /* All brand + neutral + semantic tokens re-defined for dark backgrounds */
  /* Shadow color adjusted (stronger) */
  /* Overlay opacities adjusted (higher) */
  /* Alpha tokens use same pattern (RGB vars unchanged) */
}

[data-theme='X'][data-mode='high-contrast'] {
  /* Max-contrast palette: pure black/white neutrals, fully saturated brand colors */
  /* Shadow color at ~0.8 opacity */
  /* Overlay backdrops at 0.8–0.95 */
  /* Semantic colors at maximum legibility */
}
```

## Glow Tokens (Cyberpunk & Matrix Only)

```css
/* Color variables */
--lufa-glow-color            /* e.g. rgba(255, 0, 255, 0.3) for cyberpunk */
--lufa-glow-color-secondary  /* e.g. rgba(0, 255, 255, 0.2) for cyberpunk */

/* Box glows (4 levels) */
--lufa-glow-box-subtle / box / box-strong / box-intense

/* Text glows (4 levels) */
--lufa-glow-text-subtle / text / text-strong / text-intense

/* Inset glows (3 levels) */
--lufa-glow-inset-subtle / inset / inset-strong
```

Cyberpunk uses complementary magenta + cyan. Matrix uses monochrome neon green.

## File & Export Map

```
src/                           ← Source files (authored CSS)
  _token-template.css          ← Template + authoring guide (not exported)
  coffee.css
  cyberpunk.css
  forest.css
  matrix.css
  nordic.css
  ocean.css
  steampunk.css
  sunset.css
  volcano.css
  volt.css

dist/                          ← Built output (copied by build script)
  coffee.css ... volt.css

package.json exports:
  "./coffee.css"    → "./dist/coffee.css"
  "./cyberpunk.css" → "./dist/cyberpunk.css"
  "./forest.css"    → "./dist/forest.css"
  "./matrix.css"    → "./dist/matrix.css"
  "./nordic.css"    → "./dist/nordic.css"
  "./ocean.css"     → "./dist/ocean.css"
  "./steampunk.css" → "./dist/steampunk.css"
  "./sunset.css"    → "./dist/sunset.css"
  "./volcano.css"   → "./dist/volcano.css"
  "./volt.css"      → "./dist/volt.css"
```

## Build & Scripts

```
build           → pnpm clean && tsx scripts/copy-themes.ts
                  (copies src/*.css to dist/ — no compilation)
clean           → rm -rf dist
validate:template → tsx scripts/validate-template.ts
                    (programmatically validates _token-template.css)
validate:a11y   → tsx scripts/validate-a11y.ts
validate        → validate:template && validate:a11y
lint            → eslint scripts --ext .ts
typecheck       → tsc -p tsconfig.json --noEmit
```

## Validation System

`validate-template.ts` checks `_token-template.css` for:

- CSS structure: all tokens inside `[data-theme]` selectors
- Alpha tokens: 54 total (6 colors × 9 levels: 3,5,8,10,15,20,30,40,50)
- Shadow tokens: 5 sizes + `--lufa-shadow-color`; xl spec = `0 12px 24px`
- Overlay tokens: light/dark/backdrop variants
- Glow tokens: box (4), text (4), inset (3) intensity levels
- RGB naming: `--lufa-{color}-rgb` (not `--lufa-rgb-{color}`)
- Documentation: checklist, best practices, usage example sections
- Mode coverage: light, dark, high-contrast

## Dependency

**Runtime**: `@grasdouble/lufa_design-system-tokens` (workspace:^) — must be imported before any theme.  
**Dev**: `tsx`, `typescript`, shared config packages (`eslint`, `prettier`, `tsconfig`).

## Adding a New Theme

1. Copy `src/_token-template.css` → `src/your-theme.css`
2. Define all tokens for light, dark, and high-contrast modes
3. Add `'your-theme.css'` to the `themes` array in `scripts/copy-themes.ts`
4. Add `"./your-theme.css": "./dist/your-theme.css"` to `package.json#exports`
5. Run `pnpm build && pnpm validate:template`

## Key Constraints for AI Agents

- **Import order is mandatory**: tokens base must load before any theme.
- **Do not define new custom properties** in themes — only override existing ones (except glow tokens for cyber themes).
- **All tokens must be inside `[data-theme]` selectors** — never at `:root` or bare level.
- **RGB naming is `--lufa-{color}-rgb`** — not `--lufa-rgb-{color}`.
- **Shadow-xl is `0 12px 24px`** — not `0 16px 32px`.
- **Glow tokens are only for cyber/neon themes** — do not add them to organic/natural themes.
- **Build is a copy, not a compile** — do not add PostCSS, Sass, or transformation steps.
- **All three modes are required** for a theme to be complete (light + dark + high-contrast).

## Related Packages

| Package                                 | Relationship                                        |
| --------------------------------------- | --------------------------------------------------- |
| `@grasdouble/lufa_design-system-tokens` | Direct dependency — provides base token definitions |
| `@grasdouble/lufa_config_eslint`        | Dev — shared ESLint config                          |
| `@grasdouble/lufa_config_prettier`      | Dev — shared Prettier config                        |
| `@grasdouble/lufa_config_tsconfig`      | Dev — shared TypeScript config                      |
