---
package: '@grasdouble/lufa_design-system-tokens'
shortName: lufa_design-system-tokens
category: design-system
type: context
lastUpdated: '2026-02-24'
generatedAtCommit: 'd27c912328f538971b6720513be2c817c2feff15'
---

# Context: @grasdouble/lufa_design-system-tokens

## Quick facts

- **Package name:** `@grasdouble/lufa_design-system-tokens`
- **Version:** 1.1.0 | **License:** MIT | **Private:** false
- **Source:** `packages/design-system/tokens/`
- **Build tool:** Style Dictionary v5.2.0
- **Token format:** DTCG (Design Tokens Community Group)
- **Total tokens:** 698 | **CSS custom properties:** 1025

## What this package does

Single source of truth for all Lufa design decisions. Publishes static CSS and JSON artifacts — no runtime JS dependency. Consuming packages import the built CSS for styling and optionally the JSON for runtime value access.

## Package exports

```json
{
  ".": "./dist/tokens-values.json", // default JS import (flat values)
  "./tokens.css": "./dist/tokens.css", // CSS custom properties (all modes)
  "./values": "./dist/tokens-values.json", // named JS/TS import
  "./metadata": "./dist/tokens-metadata.json" // full metadata (description, extensions)
}
```

Additional build artifact (not exported): `dist/tokens.map.json` — for the Lufa DS Preview VSCode extension.

## 4-level token hierarchy

```
Component (235) → Semantic (175) → Core (85) → Primitive (203)
```

Each level exclusively references the level below via DTCG `{path}` syntax. Primitive tokens contain raw values only.

## Source directory structure

```
src/
├── primitives/          # Level 1 — raw values (15 files)
│   ├── color.json           # gray/blue/red/green/yellow/purple + hc + alpha palettes
│   ├── spacing.json         # 0–96px (12 steps)
│   ├── radius.json          # none/sm/base/md/lg/xl/2xl/full
│   ├── shadow.json          # none/sm/base/md/lg/xl (6 elevation levels)
│   ├── motion.json          # duration (5) + easing (7)
│   ├── breakpoint.json      # xs-2xl (320px–1536px)
│   ├── border-width.json    # thin/base/thick
│   ├── opacity.json         # disabled/placeholder/loading
│   ├── height.json          # 24–96px (8 steps)
│   ├── icon-size.json       # xs-xl (16–40px)
│   ├── typography-font-families.json   # sans + mono
│   ├── typography-font-sizes.json      # xs–8xl (px + fluid clamp)
│   ├── typography-font-weights.json    # normal/medium/semibold/bold
│   ├── typography-letter-spacing.json
│   └── typography-line-heights.json
│
├── core/                # Level 2 — design intent applied to primitives (15 files)
│   ├── color/
│   │   ├── colors-brand.json      # primary (blue) + secondary (purple) + visited
│   │   ├── colors-neutral.json    # background/surface/border/text hierarchy
│   │   └── colors-semantic.json   # success/error/warning/info (default/subtle/border/hover)
│   ├── layout/
│   │   └── (9 files)              # containers, grid, header, hero, modal, page, section, sidebar
│   └── typography/
│       └── (9 files)              # body, button, caption, code, heading, label, medium, small, strong
│
├── semantic/            # Level 3 — UI context tokens (28 files across 7 dirs)
│   ├── ui/
│   │   ├── context.json       # background/overlay/text/border context tokens
│   │   ├── spacing.json       # tight/compact/default/comfortable/spacious
│   │   ├── shadow.json        # small/medium/large/extra-large
│   │   ├── animations.json    # pulse/shimmer/slide-in
│   │   ├── backdrop.json
│   │   ├── border-radius.json
│   │   ├── border-width.json
│   │   ├── height.json
│   │   └── transition.json
│   ├── interactive/
│   │   ├── focus.json         # ring + ring-offset + background
│   │   ├── background.json    # hover/pressed/selected overlays
│   │   ├── border.json
│   │   ├── cursor.json        # default/disabled/loading
│   │   ├── link.json
│   │   ├── opacity.json
│   │   ├── selected.json
│   │   ├── text.json
│   │   ├── transforms.json
│   │   └── underline.json
│   ├── elevation/
│   │   └── z-index.json       # base(0)/dropdown(1000)/sticky(1100)/fixed(1200)/modal-backdrop(1300)/modal(1400)/popover(1500)/toast(1600)
│   ├── effect/
│   │   └── glow.json          # box.none/primary.default/primary.hover/focus + text + border glows
│   ├── layout/
│   │   └── breakpoints.json   # semantic breakpoint aliases
│   ├── typography/
│   │   └── (5 files)          # heading(h1-h6), body(large/default/small), button, caption, label
│   └── variant/
│       └── components.json    # button variants: primary/secondary/ghost/outline/destructive/success/warning/info
│
└── component/           # Level 4 — component-specific tokens (10 files)
    ├── button.json    # padding(sm/md/lg), height, font-size, border-radius, glow, variants, states
    ├── card.json
    ├── input.json
    ├── badge.json
    ├── modal.json
    ├── container.json
    ├── divider.json
    ├── popover.json
    ├── tooltip.json
    └── shared.json    # icon.spacing and shared patterns
```

## CSS variable naming

```
--lufa-{level}-{category}-{name}[-{variant}][-{state}]

--lufa-primitive-color-blue-600           (primitive color)
--lufa-primitive-spacing-16               (primitive spacing)
--lufa-core-brand-primary-default         (core brand)
--lufa-core-neutral-text-primary          (core neutral)
--lufa-semantic-ui-spacing-default        (semantic ui)
--lufa-semantic-ui-text-primary           (semantic context)
--lufa-semantic-interactive-focus-ring    (semantic interactive)
--lufa-semantic-z-index-modal             (semantic elevation)
--lufa-component-button-padding-md        (component)
--lufa-component-button-variant-primary-background-default
```

## Multi-mode system

Modes are CSS attribute-based, not media-query-based:

```css
[data-theme],
[data-theme][data-mode='light'] {
  /* light (default) values */
}
[data-theme][data-mode='dark'] {
  /* dark mode overrides */
}
[data-theme][data-mode='high-contrast'] {
  /* HC mode overrides */
}
```

Mode-aware tokens carry a `modes` object in `$extensions.lufa.modes`:

```json
"$extensions": {
  "lufa": {
    "modes": {
      "dark": "{primitive.color.blue.400}",
      "high-contrast": "{primitive.color.hc.blue}"
    }
  }
}
```

Tokens without a `modes` object are constant across all modes.

## Key color tokens quick reference

| CSS Variable                             | Light value     | Use                         |
| ---------------------------------------- | --------------- | --------------------------- |
| `--lufa-core-brand-primary-default`      | `#2563eb`       | Primary buttons, links      |
| `--lufa-core-brand-primary-hover`        | `#1d4ed8`       | Hover primary               |
| `--lufa-core-brand-secondary-default`    | `#9333ea`       | Secondary actions           |
| `--lufa-core-neutral-background`         | `#f9fafb`       | Page canvas                 |
| `--lufa-core-neutral-surface-default`    | `#f3f4f6`       | Cards, panels               |
| `--lufa-core-neutral-text-primary`       | `#111827`       | Body text, headings         |
| `--lufa-core-neutral-text-secondary`     | `#4b5563`       | Supporting text             |
| `--lufa-core-neutral-border-default`     | `#d1d5db`       | Dividers, card borders      |
| `--lufa-core-semantic-success-default`   | `#15803d`       | Success indicators          |
| `--lufa-core-semantic-error-default`     | `#dc2626`       | Errors, destructive actions |
| `--lufa-core-semantic-warning-default`   | `#eab308`       | Warnings                    |
| `--lufa-core-semantic-info-default`      | `#1d4ed8`       | Info messages               |
| `--lufa-semantic-ui-background-page`     | → neutral.bg    | Root page background        |
| `--lufa-semantic-ui-text-primary`        | → neutral.text  | Primary text                |
| `--lufa-semantic-interactive-focus-ring` | → brand.primary | Focus ring color            |

## WCAG and accessibility

- WCAG contrast ratios are **automatically computed** at build time by the `add-wcag-metadata.js` preprocessor
- High-contrast mode uses pure RGB values (`#000000`, `#ffffff`, `#0000ff`, `#ff0000`, `#00ff00`, `#ffff00`) for WCAG AAA compliance
- Focus rings use 2px offset (`primitive.border-width.scale.base`) — a WCAG/Material Design constant, not themeable
- Default focus glow: `0 0 0 3px rgba(59, 130, 246, 0.25)` (blue-500 at 25% opacity)
- Disabled opacity: 0.38 (Material Design standard)
- `test:wcag` script runs automated contrast validation on every build

## Build system details

**Entry point:** `style-dictionary.config.js`

**Custom transforms:**

- `size/rem/fluid` — converts px to rem AND preserves fluid `clamp()` values unmodified
- `shadow/css/shorthand-custom` — shadow shorthand without triggering size/rem warnings

**Custom formats:**

- `css/variables-with-modes` — outputs `[data-theme]` + `[data-mode]` selectors
- `json/nested-with-metadata` — preserves `description` + `extensions` in nested JSON
- `json/vscode-map` — flat CSS-var-to-value map for VSCode extension

**Build-time validators (`build/validators/`):**

- Token consistency: checks DTCG compliance (`$value`, `$type`, `$description` presence)
- WCAG contrast: validates foreground/background pairs against AA/AAA thresholds

**Size guard:** `scripts/check-css-size.mjs` — warns if `dist/tokens.css` exceeds 120 KB.

## Consuming this package

**In CSS (standard pattern):**

```css
@import '@grasdouble/lufa_design-system-tokens/tokens.css';
```

**In component CSS Modules:**

```css
.element {
  background: var(--lufa-semantic-ui-background-surface);
}
```

**In JS/TS (only for canvas, charts, generated styles):**

```typescript
import tokens from '@grasdouble/lufa_design-system-tokens/values';

const blue600 = tokens.primitive.color.blue['600']; // "#2563eb"
```

**Rule: Components must never import JSON tokens directly. Use CSS variables only.**
(Enforced by `pnpm validate:token-usage` and ESLint.)

## Dependency graph

This package has **no runtime dependencies**. It is a pure dev/build artifact.

```
@grasdouble/lufa_design-system-tokens
  └── (consumed by) @grasdouble/lufa_design-system-*  (all component packages)
  └── (consumed by) @grasdouble/lufa_*                (any package needing tokens)
```

Dev dependencies only:

- `style-dictionary` ^5.2.0 — the entire build system
- `@grasdouble/lufa_config_*` workspace packages — shared linting/formatting/TS configs

## Common integration points

| Scenario                  | Which export                    | How                                             |
| ------------------------- | ------------------------------- | ----------------------------------------------- |
| Component CSS styling     | `./tokens.css`                  | `@import` in root CSS or bundler config         |
| Chart/canvas color values | `./values`                      | `import tokens from '…/values'`                 |
| Custom theme override     | `./tokens.css` + `[data-theme]` | Set CSS vars on scoped container                |
| Design tooling / docs     | `./metadata`                    | Access `description`, `extensions.lufa.useCase` |
| VSCode extension preview  | `dist/tokens.map.json`          | Filesystem access (not a named export)          |
