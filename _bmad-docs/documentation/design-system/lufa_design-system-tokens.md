---
package: '@grasdouble/lufa_design-system-tokens'
shortName: lufa_design-system-tokens
category: design-system
version: '1.1.0'
private: false
lastUpdated: '2026-02-24'
generatedAtCommit: 'd27c912328f538971b6720513be2c817c2feff15'
---

# @grasdouble/lufa_design-system-tokens

## Overview

The design token package for the Lufa Design System. It defines **685 tokens** across a 4-level hierarchy and builds to **~1025 CSS custom properties**. The package uses [Style Dictionary v5](https://styledictionary.com) and follows the [DTCG (Design Tokens Community Group)](https://www.designtokens.org/) token format.

All tokens are authored in JSON source files, processed through a Style Dictionary build pipeline, and emitted as:

- `dist/tokens.css` — CSS custom properties with light/dark/high-contrast mode support
- `dist/tokens-values.json` — Flat JSON for runtime JS/TS consumption
- `dist/tokens-metadata.json` — Full token metadata (description, extensions) for tooling
- `dist/tokens.map.json` — VSCode extension map for the Lufa DS Preview extension

## Purpose

Centralize every design decision (color, spacing, typography, motion, elevation, etc.) in a single versioned package consumed by all other Lufa packages. Components must **never hard-code values** — they reference these tokens through CSS variables.

## Architecture

The token system is organized as a strict 4-level cascade:

```
┌─────────────────────────────────────────────────────────┐
│  Level 4: COMPONENT (235)  button · card · input · …    │
├─────────────────────────────────────────────────────────┤
│  Level 3: SEMANTIC (175)   ui · interactive · typography│
├─────────────────────────────────────────────────────────┤
│  Level 2: CORE (85)        brand · layout · typography  │
├─────────────────────────────────────────────────────────┤
│  Level 1: PRIMITIVE (203)  color · spacing · motion · … │
└─────────────────────────────────────────────────────────┘
```

| Level         | Source path      | Token count | CSS vars  | Description                   |
| ------------- | ---------------- | ----------- | --------- | ----------------------------- |
| **Primitive** | `src/primitives` | 203         | ~250      | Raw immutable values          |
| **Core**      | `src/core`       | 85          | ~180      | Global design decisions       |
| **Semantic**  | `src/semantic`   | 175         | ~290      | UI-context tokens             |
| **Component** | `src/component`  | 235         | ~305      | Component-specific tokens     |
| **Total**     |                  | **~700**    | **~1025** | Including responsive variants |

### Token reference flow

```
Component tokens → Semantic tokens → Core tokens → Primitive tokens
```

Each layer references the layer below using DTCG reference syntax: `{layer.category.name}`.
Primitive tokens always contain plain values; all other layers use aliases.

### CSS variable naming convention

```
--lufa-{level}-{category}-{name}[-{variant}][-{state}]

Examples:
  --lufa-primitive-color-blue-600
  --lufa-core-brand-primary-default
  --lufa-semantic-ui-text-primary
  --lufa-component-button-variant-primary-background-default
```

### Multi-mode support

The CSS output uses `[data-theme]` and `[data-mode]` data attributes (not media queries) to switch between light, dark, and high-contrast modes. Tokens that vary by mode carry a `modes` object in their `$extensions.lufa` field; all other tokens remain constant across modes.

```css
[data-theme],
[data-theme][data-mode='light'] {
  --lufa-core-brand-primary-default: #2563eb;
}
[data-theme][data-mode='dark'] {
  --lufa-core-brand-primary-default: #60a5fa;
}
[data-theme][data-mode='high-contrast'] {
  --lufa-core-brand-primary-default: #0000ff;
}
```

### Build pipeline

```
pnpm validate:tokens               (DTCG format checks)
  └─> style-dictionary build       (style-dictionary.config.js)
       ├─ Preprocessors            add-wcag-metadata (injects WCAG contrast ratios)
       ├─ Transforms               size/rem/fluid (px + clamp), color/css, shadow/css/shorthand-custom
       ├─ Formats                  css/variables-with-modes, json/nested, json/nested-with-metadata, json/vscode-map
       └─ Outputs                  dist/tokens.css, tokens-values.json, tokens-metadata.json, tokens.map.json
  └─> pnpm check:size              (CSS output size guard, warns >120 KB)
```

---

## Token Categories

### Level 1 — Primitive

Raw values. Never reference other tokens. Used as the source of truth for all higher levels.

#### Colors (`src/primitives/color.json`)

Six standard color scales (10 stops each, 50–900), plus high-contrast and alpha variants.

| Palette         | Range    | Primary use case                              |
| --------------- | -------- | --------------------------------------------- |
| `gray`          | 50–900   | Neutrals, text, backgrounds, borders          |
| `blue`          | 50–900   | Brand primary, links, info                    |
| `red`           | 50–900   | Errors, destructive actions                   |
| `green`         | 50–900   | Success, positive feedback                    |
| `yellow`        | 50–900   | Warnings, alerts, attention                   |
| `purple`        | 50–900   | Brand secondary, accents                      |
| `hc.*`          | 6 values | Pure colors for high-contrast mode (WCAG AAA) |
| `alpha.black.*` | 4–100%   | Overlay layers, scrims, shadows               |
| `alpha.white.*` | 4–100%   | Dark-mode overlay layers                      |

**CSS variable pattern:** `--lufa-primitive-color-{palette}-{stop}`

#### Spacing (`src/primitives/spacing.json`)

12-step scale from `0px` to `96px`.

| Token key | Value | Use case                           |
| --------- | ----- | ---------------------------------- |
| `0`       | 0px   | Reset/remove gaps                  |
| `4`       | 4px   | Icon-text gap, tight lists         |
| `8`       | 8px   | Button padding, inline gaps        |
| `12`      | 12px  | Form field gaps, card padding      |
| `16`      | 16px  | Standard component gaps            |
| `24`      | 24px  | Section spacing, card gaps         |
| `32`      | 32px  | Major section spacing              |
| `40`      | 40px  | Hero sections, large gutters       |
| `48`      | 48px  | Page headers, major separators     |
| `64`      | 64px  | Section separators, page breaks    |
| `80`      | 80px  | Footer spacing, large hero margins |
| `96`      | 96px  | Page-level margins, hero sections  |

#### Typography

Split across five files:

**Font families** (`typography-font-families.json`)

| Token  | Stack                                      | Performance  |
| ------ | ------------------------------------------ | ------------ |
| `sans` | system-ui, -apple-system, …, sans-serif    | 0kb download |
| `mono` | ui-monospace, SFMono-Regular, …, monospace | 0kb download |

**Font sizes** (`typography-font-sizes.json`) — 11 steps

| Token  | Value (or fluid clamp)                     | Use case                   |
| ------ | ------------------------------------------ | -------------------------- |
| `xs`   | 12px                                       | Labels, footnotes          |
| `sm`   | 14px                                       | Secondary text             |
| `base` | 16px                                       | Body text                  |
| `lg`   | 18px                                       | Emphasized text            |
| `xl`   | 20px                                       | Subtitles, H5-H6           |
| `2xl`  | `clamp(1.25rem, 1rem + 1vw, 1.5rem)`       | H4 headings                |
| `3xl`  | `clamp(1.5rem, 1.25rem + 1vw, 1.875rem)`   | H3 headings                |
| `4xl`  | `clamp(1.75rem, 1.5rem + 1.25vw, 2.25rem)` | H2 headings                |
| `5xl`  | `clamp(2rem, 1.5rem + 2vw, 3rem)`          | H1 headings, hero titles   |
| `6xl`  | `clamp(2.5rem, 2rem + 2.5vw, 3.75rem)`     | Hero headlines             |
| `7xl`  | `clamp(3rem, 2.5rem + 3vw, 4.5rem)`        | Marketing hero sections    |
| `8xl`  | `clamp(4rem, 3rem + 4vw, 6rem)`            | Display text, brand impact |

**Font weights** (`typography-font-weights.json`): `normal` (400), `medium` (500), `semibold` (600), `bold` (700)

**Line heights** (`typography-line-heights.json`) and **Letter spacing** (`typography-letter-spacing.json`) — additional typographic primitives.

#### Radius (`src/primitives/radius.json`)

| Token  | Value  | Use case                               |
| ------ | ------ | -------------------------------------- |
| `none` | 0px    | Square elements                        |
| `sm`   | 2px    | Badges, tags, small elements           |
| `base` | 4px    | Buttons, inputs, standard cards        |
| `md`   | 6px    | Featured cards, panels                 |
| `lg`   | 8px    | Modals, large cards                    |
| `xl`   | 12px   | Large surfaces, modern design          |
| `2xl`  | 16px   | Modal dialogs, hero cards              |
| `full` | 9999px | Pill buttons, avatars, circular shapes |

#### Shadow (`src/primitives/shadow.json`)

6 elevation levels (none → xl). Uses alpha color references for shadow color.

| Token  | Offset / Blur | Elevation | Use case                      |
| ------ | ------------- | --------- | ----------------------------- |
| `none` | 0/0/0         | 0         | Flat elements                 |
| `sm`   | 0/1px/2px     | 1         | Light cards, badges           |
| `base` | 0/2px/4px     | 2         | Standard cards                |
| `md`   | 0/4px/6px     | 3         | Dropdowns, popovers, tooltips |
| `lg`   | 0/8px/16px    | 4         | Modals, sidebars, drawers     |
| `xl`   | 0/12px/24px   | 5         | Floating elements, dialogs    |

#### Motion (`src/primitives/motion.json`)

**Durations:** `instant` (100ms), `fast` (150ms), `normal` (300ms), `slow` (500ms), `slower` (2s)

**Easing functions:** `linear`, `ease-in`, `ease-out`, `ease-in-out`, `ease`, `ease-bounce`, `ease-elastic`

#### Other primitives

| File                | Values                                                                                 |
| ------------------- | -------------------------------------------------------------------------------------- |
| `breakpoint.json`   | `xs` (320px), `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px), `2xl` (1536px) |
| `border-width.json` | `thin` (1px), `base` (2px), `thick` (4px)                                              |
| `opacity.json`      | `disabled` (0.38), `placeholder` (0.5), `loading` (0.6)                                |
| `height.json`       | 24px → 96px (8 steps for buttons, inputs, headers)                                     |
| `icon-size.json`    | `xs` (16px), `sm` (20px), `md` (24px), `lg` (32px), `xl` (40px)                        |

---

### Level 2 — Core

Applies design intent to primitives. All tokens here reference primitives and carry multi-mode overrides.

#### Brand colors (`src/core/color/colors-brand.json`)

| Token path                               | Light value (→ primitive)    | Role               |
| ---------------------------------------- | ---------------------------- | ------------------ |
| `core.color.brand.primary.default`       | `primitive.color.blue.600`   | Main CTA, links    |
| `core.color.brand.primary.hover`         | `primitive.color.blue.700`   | Hover on primary   |
| `core.color.brand.primary.active`        | `primitive.color.blue.800`   | Pressed primary    |
| `core.color.brand.primary.on.background` | `primitive.color.hc.white`   | Text on primary bg |
| `core.color.brand.secondary.default`     | `primitive.color.purple.600` | Secondary actions  |
| `core.color.brand.secondary.hover`       | `primitive.color.purple.600` | Hover on secondary |
| `core.color.brand.secondary.active`      | `primitive.color.purple.700` | Pressed secondary  |
| `core.color.brand.accent.visited`        | `primitive.color.purple.600` | Visited links      |

#### Neutral colors (`src/core/color/colors-neutral.json`)

| Token path                           | Light value                | Role                    |
| ------------------------------------ | -------------------------- | ----------------------- |
| `core.color.neutral.background`      | `primitive.color.gray.50`  | Page canvas             |
| `core.color.neutral.surface.default` | `primitive.color.gray.100` | Cards, panels           |
| `core.color.neutral.surface.hover`   | `primitive.color.gray.200` | Hover on surfaces       |
| `core.color.neutral.border.default`  | `primitive.color.gray.300` | Dividers, card borders  |
| `core.color.neutral.border.strong`   | `primitive.color.gray.400` | Emphasized borders      |
| `core.color.neutral.text.primary`    | `primitive.color.gray.900` | Body text, headings     |
| `core.color.neutral.text.secondary`  | `primitive.color.gray.600` | Supporting text         |
| `core.color.neutral.text.tertiary`   | `primitive.color.gray.500` | Placeholder, timestamps |
| `core.color.neutral.text.disabled`   | `primitive.color.gray.400` | Disabled labels         |

#### Semantic feedback colors (`src/core/color/colors-semantic.json`)

Four states — `success`, `error`, `warning`, `info` — each with: `default`, `subtle` (background), `border`, `hover`.

| State     | Default → primitive | Subtle (bg) → primitive |
| --------- | ------------------- | ----------------------- |
| `success` | `green.700`         | `green.100`             |
| `error`   | `red.600`           | `red.100`               |
| `warning` | `yellow.500`        | `yellow.100`            |
| `info`    | `blue.700`          | `blue.100`              |

#### Core typography (`src/core/typography/`)

9 files defining font-size scales for: `body`, `button`, `caption`, `code`, `heading`, `label`, `medium`, `small`, `strong`.

#### Core layout (`src/core/layout/`)

9 files covering layout-specific spacing and sizing: `container`, `content`, `grid`, `header`, `hero`, `modal`, `page`, `section`, `sidebar`.

---

### Level 3 — Semantic

Assigns tokens to specific UI purposes. References core or primitive tokens.

#### UI context (`src/semantic/ui/context.json`)

Provides named UI tokens consumed directly by components:

**Backgrounds:** `page`, `surface`, `success`, `error`, `warning`, `info`  
**Backgrounds (on-brand):** `on.success`, `on.error`, `on.warning`, `on.info`, `on.primary`, `on.secondary`  
**Overlays:** `backdrop` (50% black), `hover` (4% black), `pressed` (8% black), `selected` (16% black), `scrim` (38% black)  
**Text:** `primary`, `secondary`, `tertiary`, `success`, `error`, `warning`, `info`  
**Borders:** `default`, `strong`, `success`, `error`, `warning`, `info`

#### UI utilities (`src/semantic/ui/`)

| File                 | Token group                   | Key values                                                                                |
| -------------------- | ----------------------------- | ----------------------------------------------------------------------------------------- |
| `spacing.json`       | `semantic.ui.spacing.*`       | `tight` (4px), `compact` (8px), `default` (16px), `comfortable` (24px), `spacious` (32px) |
| `shadow.json`        | `semantic.ui.shadow.*`        | `small`, `medium`, `large`, `extra-large`                                                 |
| `border-radius.json` | `semantic.ui.border-radius.*` | References primitive radius scale                                                         |
| `border-width.json`  | `semantic.ui.border-width.*`  | References primitive border-width scale                                                   |
| `height.json`        | `semantic.ui.height.*`        | `sm`, `md`, `lg` for interactive element sizing                                           |
| `transition.json`    | `semantic.ui.transition.*`    | Composites from motion primitives                                                         |
| `animations.json`    | `semantic.ui.animation.*`     | `pulse`, `shimmer`, `slide-in` (duration + timing)                                        |
| `backdrop.json`      | `semantic.ui.backdrop.*`      | Backdrop blur and overlay values                                                          |

#### Interactive states (`src/semantic/interactive/`)

10 files covering all interactive behaviors:

| File              | Tokens                                                          |
| ----------------- | --------------------------------------------------------------- |
| `focus.json`      | `focus.ring`, `focus.ring-offset` (2px), `focus.background`     |
| `background.json` | Hover/pressed/selected background overlays                      |
| `border.json`     | Focus and active border states                                  |
| `cursor.json`     | `default` (pointer), `disabled` (not-allowed), `loading` (wait) |
| `opacity.json`    | `disabled` (0.38), `placeholder` (0.5)                          |
| `selected.json`   | Selected state indicator colors                                 |
| `text.json`       | Interactive text colors (link, hover, visited)                  |
| `link.json`       | Link colors with all interaction states                         |
| `transforms.json` | Scale transforms for interactive elements                       |
| `underline.json`  | Text underline styles for links                                 |

#### Elevation (`src/semantic/elevation/z-index.json`)

| Token                    | Value | Use case              |
| ------------------------ | ----- | --------------------- |
| `z-index.base`           | 0     | Normal content flow   |
| `z-index.dropdown`       | 1000  | Dropdown menus        |
| `z-index.sticky`         | 1100  | Sticky headers        |
| `z-index.fixed`          | 1200  | Fixed navigation bars |
| `z-index.modal-backdrop` | 1300  | Modal overlays        |
| `z-index.modal`          | 1400  | Modal dialogs         |
| `z-index.popover`        | 1500  | Popovers, tooltips    |
| `z-index.toast`          | 1600  | Toast notifications   |

#### Effects (`src/semantic/effect/glow.json`)

Glow effects (box, text, border) — default to `none` in light mode; themeable for neon/dark themes.
Includes a WCAG-compliant focus ring glow: `0 0 0 3px rgba(59, 130, 246, 0.25)`.

#### Semantic typography (`src/semantic/typography/`)

| File           | Tokens                                     |
| -------------- | ------------------------------------------ |
| `heading.json` | `heading.h1` → `heading.h6` (font sizes)   |
| `body.json`    | `body.large`, `body.default`, `body.small` |
| `button.json`  | `button` font size                         |
| `caption.json` | `caption` font size                        |
| `label.json`   | `label` font size                          |

#### Layout breakpoints (`src/semantic/layout/breakpoints.json`)

Semantic aliases for the 6 primitive breakpoint values.

#### Variant / Button semantic (`src/semantic/variant/components.json`)

Button-variant color tokens for: `primary`, `secondary`, `ghost`, `outline`, `destructive`, `success`, `warning`, `info`.
Each variant carries `background.default`, `background.hover`, `background.active`, and `text` tokens.

---

### Level 4 — Component

Component-specific tokens that compose semantic tokens. 10 component files:

| File             | Component | Token count (approx)                                                         |
| ---------------- | --------- | ---------------------------------------------------------------------------- |
| `button.json`    | Button    | 60+ (padding, height, font-size, border-radius, glow, all variants & states) |
| `card.json`      | Card      | Border, padding, radius, shadow                                              |
| `input.json`     | Input     | Border, padding, height, focus, placeholder                                  |
| `badge.json`     | Badge     | Padding, border-radius, font-size, variant colors                            |
| `modal.json`     | Modal     | Width, padding, border-radius, shadow, backdrop                              |
| `container.json` | Container | Max-widths for responsive layout                                             |
| `divider.json`   | Divider   | Color, width, spacing                                                        |
| `popover.json`   | Popover   | Border, shadow, padding, radius                                              |
| `tooltip.json`   | Tooltip   | Background, text, padding, radius                                            |
| `shared.json`    | Shared    | Common icon spacing and shared patterns                                      |

---

## API Reference — Package Exports

The package ships 4 export paths (defined in `package.json#exports`):

| Export path    | Resolved file               | Type | Use case                              |
| -------------- | --------------------------- | ---- | ------------------------------------- |
| `.` (default)  | `dist/tokens-values.json`   | JSON | Default JS/TS import                  |
| `./values`     | `dist/tokens-values.json`   | JSON | Named JS/TS runtime import            |
| `./tokens.css` | `dist/tokens.css`           | CSS  | CSS custom properties (all modes)     |
| `./metadata`   | `dist/tokens-metadata.json` | JSON | Full token metadata for build tooling |

> **Note:** A fourth build artifact, `dist/tokens.map.json`, is not a named export. It is consumed by the Lufa DS Preview VSCode extension via filesystem access.

---

## Usage Examples

### CSS (primary pattern — CSS Modules)

```css
/* Import once in the application root */
@import '@grasdouble/lufa_design-system-tokens/tokens.css';
```

```css
/* button.module.css */
.button {
  background-color: var(--lufa-component-button-variant-primary-background-default);
  color: var(--lufa-component-button-variant-primary-text);
  padding: var(--lufa-component-button-padding-md);
  height: var(--lufa-component-button-height-md);
  border-radius: var(--lufa-component-button-border-radius);
  font-size: var(--lufa-component-button-font-size-md);
}

.button:hover {
  background-color: var(--lufa-component-button-variant-primary-background-hover);
}

.button:disabled {
  opacity: var(--lufa-component-button-state-disabled-opacity);
  cursor: var(--lufa-component-button-state-disabled-cursor);
}
```

### Semantic tokens (preferred for custom components)

```css
.alert-success {
  background-color: var(--lufa-semantic-ui-background-success);
  color: var(--lufa-semantic-ui-text-success);
  border: var(--lufa-semantic-ui-border-width-base) solid var(--lufa-semantic-ui-border-success);
  border-radius: var(--lufa-semantic-ui-border-radius-default);
  padding: var(--lufa-semantic-ui-spacing-default);
}
```

### Multi-mode activation (HTML attribute)

```html
<!-- Light mode (default) -->
<div data-theme>…</div>

<!-- Dark mode -->
<div data-theme data-mode="dark">…</div>

<!-- High-contrast mode -->
<div data-theme data-mode="high-contrast">…</div>
```

### JavaScript / TypeScript (runtime values)

```typescript
import tokens from '@grasdouble/lufa_design-system-tokens/values';

// Access resolved primitive values
const primary = tokens.core.color.brand.primary.default; // "#2563eb"
const spacing = tokens.primitive.spacing['16']; // "16px"
const fontBase = tokens.primitive.typography['font-size'].base; // "1rem"
```

### Token metadata (build scripts, documentation tools)

```typescript
import metadata from '@grasdouble/lufa_design-system-tokens/metadata';

// metadata includes description, extensions (category, useCase, modes, themeable, a11y)
const token = metadata.core.color.brand.primary.default;
console.log(token.description); // "Primary brand color used for main actions…"
console.log(token.extensions.lufa.themeable); // true
```

### Focus ring pattern (WCAG-compliant)

```css
.interactive-element:focus-visible {
  outline: var(--lufa-semantic-interactive-focus-ring-offset) solid var(--lufa-semantic-interactive-focus-ring);
  outline-offset: var(--lufa-semantic-interactive-focus-ring-offset);
  box-shadow: var(--lufa-semantic-effect-glow-box-focus);
}
```

---

## Build Scripts

| Script                      | Description                                                                   |
| --------------------------- | ----------------------------------------------------------------------------- |
| `pnpm build`                | Validate tokens → clean `dist/` → Style Dictionary build → size check         |
| `pnpm validate:tokens`      | Runs DTCG format consistency checks (`build/validators/token-consistency.js`) |
| `pnpm test`                 | Runs both `test:validator` and `test:wcag`                                    |
| `pnpm test:validator`       | Token consistency tests                                                       |
| `pnpm test:wcag`            | WCAG contrast ratio tests (`build/utils/wcag-contrast.test.js`)               |
| `pnpm check:size`           | Guards CSS output size (warns if >120 KB)                                     |
| `pnpm clean`                | Removes `dist/`                                                               |
| `pnpm typecheck`            | TypeScript check via `tsconfig.typecheck.json`                                |
| `pnpm validate:token-usage` | Checks for forbidden direct JSON imports in consuming packages                |

---

## Dependencies

### Dev dependencies (no runtime dependencies)

| Package                            | Version   | Role                                              |
| ---------------------------------- | --------- | ------------------------------------------------- |
| `style-dictionary`                 | ^5.2.0    | Token build system (transforms, formats, outputs) |
| `@grasdouble/lufa_config_eslint`   | workspace | Shared ESLint configuration                       |
| `@grasdouble/lufa_config_prettier` | workspace | Shared Prettier configuration                     |
| `@grasdouble/lufa_config_tsconfig` | workspace | Shared TypeScript configuration                   |
| `typescript`                       | ^5.9.3    | TypeScript checking                               |
| `tsx`                              | ^4.21.0   | TypeScript execution for build scripts            |
| `glob`                             | ^13.0.0   | File pattern matching for validators              |
| `@types/node`                      | ^25.1.0   | Node.js type definitions                          |

This package has **zero runtime dependencies**. All outputs are static assets (CSS, JSON).

---

## Related Documentation

| Resource                                | Path                                                       |
| --------------------------------------- | ---------------------------------------------------------- |
| Design System Overview                  | `packages/design-system/README.md`                         |
| Quick Reference (developer cheat sheet) | `packages/design-system/tokens/_docs/QUICK_REFERENCE.md`   |
| Architecture (naming, hierarchy)        | `packages/design-system/tokens/_docs/ARCHITECTURE.md`      |
| Token Reference Tables                  | `packages/design-system/tokens/_docs/TOKENS.md`            |
| CSS Modules Usage Pattern               | `packages/design-system/tokens/_docs/USAGE.md`             |
| Build Transforms README                 | `packages/design-system/tokens/build/transforms/README.md` |
| Build Formats README                    | `packages/design-system/tokens/build/formats/README.md`    |
| Scripts README                          | `packages/design-system/tokens/scripts/README.md`          |
