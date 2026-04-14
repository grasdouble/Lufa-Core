---
package: '@grasdouble/lufa_design-system-tokens'
shortName: lufa_design-system-tokens
category: design-system
type: context
lastUpdated: '2026-04-07'
generatedAtCommit: 'ab53a003edb177c2298250479fbe4465ee920bc3'
---

# Context: @grasdouble/lufa_design-system-tokens

## Quick facts

- **Package name:** `@grasdouble/lufa_design-system-tokens`
- **Version:** 1.2.1 | **License:** MIT | **Private:** false
- **Source:** `packages/design-system/tokens/`
- **Build tool:** Style Dictionary v5.3.3
- **Token format:** DTCG (Design Tokens Community Group)
- **Total tokens:** 698 | **CSS custom properties:** 1025

## What this package does

Single source of truth for all Lufa design decisions. Publishes static CSS and JSON artifacts — no runtime JS dependency. Consuming packages import the built CSS for styling and optionally the JSON for runtime value access. Also provides tiered CSS template files so theme authors can progressively override tokens at starter, extended, or advanced complexity levels.

## Package exports

```json
{
  ".":                    "./dist/tokens-values.json",           // default JS import (flat values)
  "./tokens.css":         "./dist/tokens.css",                   // all CSS custom properties (all modes)
  "./values":             "./dist/tokens-values.json",           // named JS/TS import
  "./metadata":           "./dist/tokens-metadata.json",         // full metadata (description, extensions)
  "./merged":             "./dist/tokens-source-merged.json",    // raw DTCG source, unresolved references
  "./themeable":          "./dist/themeable-tokens.css",         // all themeable tokens (no level filter)
  "./themeable-starter":  "./dist/themeable-tokens-starter.css", // starter-level themeable tokens only
  "./themeable-extended": "./dist/themeable-tokens-extended.css",// starter + extended themeable tokens
  "./themeable-advanced": "./dist/themeable-tokens-advanced.css" // all themeable (starter+extended+advanced)
}
```

Additional build artifact (not exported): `dist/tokens.map.json` — for the Lufa DS Preview VSCode extension, consumed via filesystem path.

## 4-level token hierarchy

```
Component (235) → Semantic (175) → Core (85) → Primitive (203)
```

Each level exclusively references the level below via DTCG `{path}` syntax. Primitive tokens contain raw values only. Cross-level references (e.g. component → primitive) are forbidden by the build validators.

## Theme level system

Tokens that support theming carry `themeable: true` in `$extensions.lufa`. They also carry a `themeLevel` property indicating the complexity tier at which a theme author is expected to override them:

| Level      | Meaning                                                                  |
| ---------- | ------------------------------------------------------------------------ |
| `starter`  | Essential overrides — brand color, primary accent, basic surface colors  |
| `extended` | Broader overrides — semantic colors, surface hierarchy, background style |
| `advanced` | Full control — every themeable token, including effects and animation    |

The levels are **cumulative**: `starter ⊂ extended ⊂ advanced`. The three CSS template exports (`themeable-starter`, `themeable-extended`, `themeable-advanced`) each contain progressively more custom property stubs for theme authors to fill in.

```json
"$extensions": {
  "lufa": {
    "themeable": true,
    "themeLevel": "starter"
  }
}
```

## Source directory structure

```
src/
├── primitives/          # Level 1 — raw values (16 files)
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
│   ├── typography-line-heights.json
│   └── colors-alpha.json    # alpha color scale (neutral alpha palette)
│
├── core/                # Level 2 — design intent applied to primitives (15 files)
│   ├── color/
│   │   ├── colors-brand.json      # primary (blue) + secondary (purple) + visited
│   │   ├── colors-neutral.json    # background/surface/border/text hierarchy
│   │   ├── colors-feedback.json   # success/error/warning/info (default/subtle/border/hover)
│   │   └── colors-alpha.json      # alpha variants of core colors for overlays/effects
│   ├── layout/
│   │   └── (9 files)              # containers, grid, header, hero, modal, page, section, sidebar
│   └── typography/
│       └── (9 files)              # body, button, caption, code, heading, label, medium, small, strong
│
├── semantic/            # Level 3 — UI context tokens (28+ files across 7 dirs)
│   ├── ui/
│   │   ├── background.json    # page/surface/overlay backgrounds; background-pattern (themeable/extended)
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
│   │   ├── action.json        # NEW: primary/secondary/destructive/success/warning/info/neutral intents
│   │   │                      #      each with default/hover/active/on states
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
│   │   └── glow.json          # uses neutral alpha tokens (not hardcoded brand colors) for focus glows
│   │                          # box.none/primary.default/primary.hover/focus + text + border glows
│   ├── layout/
│   │   └── breakpoints.json   # semantic breakpoint aliases
│   ├── typography/
│   │   └── (5 files)          # heading(h1-h6), body(large/default/small), button, caption, label
│   └── variant/
│       └── components.json    # button variants: primary/secondary/ghost/outline/destructive/success/warning/info
│
└── component/           # Level 4 — component-specific tokens (10 files)
    ├── button.json    # 3 types (solid/ghost/outline) × 7 variants × states; padding(sm/md/lg), height, glow
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

--lufa-primitive-color-blue-600                              (primitive color)
--lufa-primitive-spacing-16                                  (primitive spacing)
--lufa-core-brand-primary-default                            (core brand)
--lufa-core-neutral-text-primary                             (core neutral)
--lufa-semantic-ui-spacing-default                           (semantic ui)
--lufa-semantic-ui-text-primary                              (semantic context)
--lufa-semantic-interactive-focus-ring                       (semantic interactive)
--lufa-semantic-interactive-action-primary-background-default (semantic action)
--lufa-semantic-z-index-modal                                (semantic elevation)
--lufa-component-button-padding-md                           (component)
--lufa-component-button-solid-primary-background-default     (component button variant)
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

## Semantic interactive action tokens (new in v1.2.1)

`src/semantic/interactive/action.json` defines intent-based action tokens for interactive components (buttons, links, etc.). Each intent has a full set of states:

| Intent        | States                                     |
| ------------- | ------------------------------------------ |
| `primary`     | background.default/hover/active, on        |
| `secondary`   | background.default/hover/active, on        |
| `destructive` | background.default/hover/active, on        |
| `success`     | background.default/hover/active, on        |
| `warning`     | background.default/hover/active, on        |
| `info`        | background.default/hover/active, on        |
| `neutral`     | background.default/hover/active, on        |

CSS variable pattern: `--lufa-semantic-interactive-action-{intent}-{property}-{state}`

Example: `--lufa-semantic-interactive-action-primary-background-hover`

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
- Glow tokens (`effect/glow.json`) reference **neutral alpha tokens** (not hardcoded brand colors) so theme overrides propagate correctly into focus glows
- Disabled opacity: 0.38 (Material Design standard)
- `test:wcag` script runs automated contrast validation on every build

## Build system details

**Entry point:** `style-dictionary.config.js`

**Key scripts:**

| Script                  | Purpose                                                                  |
| ----------------------- | ------------------------------------------------------------------------ |
| `build`                 | Run Style Dictionary + post-process all dist artifacts                   |
| `merge:tokens`          | Run `scripts/merge-tokens.mjs` → produce `dist/tokens-source-merged.json`|
| `test:wcag`             | Validate all foreground/background token pairs against WCAG thresholds   |
| `validate:token-usage`  | ESLint check that components never import JSON tokens directly            |

**Custom transforms:**

- `size/rem/fluid` — converts px to rem AND preserves fluid `clamp()` values unmodified
- `shadow/css/shorthand-custom` — shadow shorthand without triggering size/rem warnings

**Custom formats:**

- `css/variables-with-modes` — outputs `[data-theme]` + `[data-mode]` selectors
- `css/themeable-template` — outputs CSS template stubs for themeable tokens (filtered by themeLevel)
- `json/nested-with-metadata` — preserves `description` + `extensions` in nested JSON
- `json/vscode-map` — flat CSS-var-to-value map for VSCode extension
- `json/source-merged` — raw DTCG source merged from all src/ files, references unresolved

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

**Accessing raw DTCG source (build tooling only):**

```typescript
import merged from '@grasdouble/lufa_design-system-tokens/merged';
// merged contains unresolved {references} — not for runtime use
```

**Accessing themeable token templates (theme authoring):**

```css
/* Import the complexity tier that fits your theme scope */
@import '@grasdouble/lufa_design-system-tokens/themeable-starter';
/* Fill in the CSS custom property stubs to create a theme */
```

**Critical rule: Components must never import JSON tokens directly. Use CSS variables only.**
(Enforced by `pnpm validate:token-usage` and ESLint.)

## Anti-patterns

| Anti-pattern                                           | Correct approach                                              |
| ------------------------------------------------------ | ------------------------------------------------------------- |
| Hard-coding `#2563eb` in component CSS                 | Use `var(--lufa-core-brand-primary-default)`                  |
| Importing `@grasdouble/lufa_design-system-tokens` JSON in a component | Use CSS variables via CSS Modules              |
| Referencing a primitive token directly in a component  | Reference a semantic or component-level token                 |
| Skipping a level (component → primitive)               | Follow the hierarchy: component → semantic → core → primitive |
| Using `./merged` export at runtime                     | `./merged` is for build tooling only (unresolved references)  |
| Overriding tokens outside `[data-theme]` scope         | Always scope overrides inside `[data-theme]` attribute        |

## Dependency graph

This package has **no runtime dependencies**. It is a pure dev/build artifact.

```
@grasdouble/lufa_design-system-tokens
  └── (consumed by) @grasdouble/lufa_design-system-*  (all component packages)
  └── (consumed by) @grasdouble/lufa_*                (any package needing tokens)
```

Dev dependencies only:

- `style-dictionary` ^5.3.3 — the entire build system
- `@grasdouble/lufa_config_*` workspace packages — shared linting/formatting/TS configs

## Common integration points

| Scenario                    | Which export                    | How                                              |
| --------------------------- | ------------------------------- | ------------------------------------------------ |
| Component CSS styling        | `./tokens.css`                  | `@import` in root CSS or bundler config          |
| Chart/canvas color values    | `./values`                      | `import tokens from '…/values'`                  |
| Custom theme override        | `./tokens.css` + `[data-theme]` | Set CSS vars on scoped container                 |
| Starter theme authoring      | `./themeable-starter`           | CSS template with starter-level token stubs      |
| Extended theme authoring     | `./themeable-extended`          | CSS template with starter+extended token stubs   |
| Advanced theme authoring     | `./themeable-advanced`          | CSS template with all themeable token stubs      |
| Design tooling / docs        | `./metadata`                    | Access `description`, `extensions.lufa.useCase`  |
| Build tooling / token merge  | `./merged`                      | Raw DTCG JSON with unresolved references         |
| VSCode extension preview     | `dist/tokens.map.json`          | Filesystem access (not a named export)           |
