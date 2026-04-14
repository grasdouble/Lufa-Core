---
generatedAtCommit: "ab53a003edb177c2298250479fbe4465ee920bc3"
lastUpdated: "2026-04-07"
package: "@grasdouble/lufa_design-system-themes"
---

# Context: @grasdouble/lufa_design-system-themes

## Package Info

- **npm name**: `@grasdouble/lufa_design-system-themes`
- **version**: `1.1.1`
- **private**: `false` (published to `https://npm.pkg.github.com`)
- **license**: MIT
- **module type**: ESM (`"type": "module"`)
- **source**: `packages/design-system/themes/src/`
- **output**: `packages/design-system/themes/dist/`

Ships 10 pre-built CSS theme files. Each file completely overrides the adaptive color token set (brand, neutral, feedback) and adds structural personality tokens (shape, motion, shadow, background pattern) for light, dark, and high-contrast rendering modes. Themes are activated by HTML data attributes; no JavaScript runtime dependency.

## Critical Rules

1. **Import order is mandatory** — `@grasdouble/lufa_design-system-tokens/style.css` must load before any theme CSS.
2. **Never introduce new custom properties in themes** — only override existing tokens (exception: `--lufa-semantic-effect-glow-*` tokens for cyber/neon themes).
3. **All tokens must be inside `[data-theme]` selectors** — never at `:root` or bare level.
4. **All three modes are required** for a complete theme — light + dark + high-contrast.
5. **Structural tokens go in `[data-theme='X']` (mode-invariant block)** — not inside the mode blocks.
6. **Build is a copy, not a compile** — do not add PostCSS, Sass, or any transformation.
7. **Glow effects must be set to `none`** in high-contrast mode for accessibility (where they are used).
8. **WCAG AA compliance is required** — all text contrast ≥ 4.5:1, UI components ≥ 3:1. Document ratios in comments.
9. **Token namespace is `--lufa-core-color-*`** — not the older `--lufa-core-brand-*` or `--lufa-core-semantic-*` (those are deprecated).
10. **Feedback tokens use `feedback` namespace** — `--lufa-core-color-feedback-{success|error|warning|info}-*`, not `--lufa-core-semantic-*`.

## Import Pattern

```css
/* 1. Required: base tokens first */
@import '@grasdouble/lufa_design-system-tokens/style.css';

/* 2. Theme override */
@import '@grasdouble/lufa_design-system-themes/ocean.css';

/* Multiple themes can be loaded — only the matching data-theme activates */
@import '@grasdouble/lufa_design-system-themes/matrix.css';
```

```html
<!-- Activate theme on any element (scoped to that subtree) -->
<html data-theme="ocean" data-mode="dark">
<section data-theme="matrix" data-mode="dark"></section>

<!-- Valid data-theme values -->
<!-- ocean | forest | matrix | cyberpunk | sunset | nordic | volcano | coffee | steampunk | volt -->

<!-- Valid data-mode values -->
<!-- light (default when omitted) | dark | high-contrast -->
```

## The 10 Themes

| Theme | Selector | Aesthetic | Primary (light) | Shape | Glow |
|---|---|---|---|---|---|
| Ocean | `data-theme="ocean"` | Marine, cyan/teal | `#0e7490` | Very rounded / full | Subtle box only |
| Forest | `data-theme="forest"` | Natural, emerald | `#047857` | Organic, medium | None (box only) |
| Coffee | `data-theme="coffee"` | Warm, vintage | `#78350f` | Comfortable, cozy | Warm amber box only |
| Sunset | `data-theme="sunset"` | Warm, elegant | `#c2410c` | Full pill | Warm orange box only |
| Volcano | `data-theme="volcano"` | Intense, heat | `#dc2626` | Medium | Warm red box only |
| Nordic | `data-theme="nordic"` | Minimalist, arctic | `#0369a1` | Minimal, slight | None |
| Steampunk | `data-theme="steampunk"` | Victorian, brass | `#8b4513` | Slight | None |
| Volt | `data-theme="volt"` | Industrial, high-vis | `#4d7c0f` | Razor sharp | Electric yellow (full suite) |
| Cyberpunk | `data-theme="cyberpunk"` | Neon, futuristic | `#b300b3` | Sharp, none | Full suite (box + text + focus) |
| Matrix | `data-theme="matrix"` | Digital, terminal | `#007800` | Pure rectangles | Full suite (box + text + focus) |

## Key Types / Token Groups

### Token Namespace Reference (current — v1.1.x)

```css
/* Brand */
--lufa-core-color-brand-primary-{default|hover|active|on-background}
--lufa-core-color-brand-secondary-{default|hover|active|on-background}
--lufa-core-color-brand-accent-visited

/* Neutral */
--lufa-core-color-neutral-background
--lufa-core-color-neutral-surface-{default|hover|active|raised}
--lufa-core-color-neutral-border-{default|strong}
--lufa-core-color-neutral-text-{primary|secondary|tertiary|disabled}

/* Feedback (replaces old --lufa-core-semantic-* namespace) */
--lufa-core-color-feedback-{success|error|warning|info}-{default|subtle|border|hover|active|on-background}

/* Structural (mode-invariant, on [data-theme='X']) */
--lufa-semantic-ui-border-radius-{small|default|medium|large}
--lufa-semantic-ui-transition-duration-{fast|normal}
--lufa-semantic-ui-transition-timing-function-default
--lufa-semantic-ui-shadow-{small|medium|large|extra-large}
--lufa-semantic-ui-background-pattern

/* Typography (selected themes) */
--lufa-core-typography-heading-font-family
--lufa-core-typography-body-font-family      /* Matrix only */
--lufa-core-typography-heading-letter-spacing

/* Effects */
--lufa-semantic-effect-glow-box-primary-{default|hover}           /* all themes */
--lufa-semantic-effect-glow-text-primary-{default|hover}          /* cyber themes */
--lufa-semantic-effect-glow-border-focus                          /* cyber themes */
--lufa-semantic-effect-glow-box-focus                             /* cyber themes */

/* Component overrides (WCAG AA fixes) */
--lufa-semantic-interactive-background-active
--lufa-semantic-interactive-text-active
--lufa-component-button-type-outline-border-hover
--lufa-component-button-type-outline-background-hover
--lufa-component-button-type-outline-text-hover
--lufa-component-button-type-outline-variant-{primary|secondary|success|destructive|warning|info|neutral}-{border|background}-active
--lufa-component-button-type-solid-variant-primary-{background-hover|background-active|text}
--lufa-component-button-type-solid-variant-secondary-{background-active|text}
--lufa-component-button-type-ghost-background-active
--lufa-component-button-type-ghost-text-hover
--lufa-component-button-type-ghost-variant-{primary|secondary|...}-text-active
--lufa-component-input-border-error                                /* Cyberpunk dark only */
```

### Deprecated Namespaces (do not use)

```css
/* DEPRECATED — replaced in v1.1.0 */
--lufa-core-brand-*          → use --lufa-core-color-brand-*
--lufa-core-neutral-*        → use --lufa-core-color-neutral-*
--lufa-core-semantic-*       → use --lufa-core-color-feedback-*
--lufa-shadow-{xs|sm|md|lg|xl}         → use --lufa-semantic-ui-shadow-*
--lufa-overlay-*             → use component-level or semantic tokens
--lufa-glow-*                → use --lufa-semantic-effect-glow-*
--lufa-color-alpha-*         → alpha tokens removed from themes in v1.1.0 refactor
```

## Common Patterns

### CSS file anatomy for a new theme

```css
/* YourTheme Theme — Lufa Design System */

/* Structural tokens — apply to all modes */
[data-theme='yourtheme'] {
  --lufa-semantic-ui-border-radius-small: var(--lufa-primitive-radius-scale-md);
  --lufa-semantic-ui-border-radius-default: var(--lufa-primitive-radius-scale-xl);
  --lufa-semantic-ui-border-radius-medium: var(--lufa-primitive-radius-scale-2xl);
  --lufa-semantic-ui-border-radius-large: var(--lufa-primitive-radius-scale-full);
  --lufa-semantic-ui-transition-duration-fast: var(--lufa-primitive-motion-duration-fast);
  --lufa-semantic-ui-transition-duration-normal: var(--lufa-primitive-motion-duration-normal);
  --lufa-semantic-ui-transition-timing-function-default: var(--lufa-primitive-motion-easing-ease);
  --lufa-semantic-ui-shadow-small: 0px 1px 2px 0px rgba(R, G, B, 0.15);
  --lufa-semantic-ui-shadow-medium: 0px 2px 4px 0px rgba(R, G, B, 0.18);
  --lufa-semantic-ui-shadow-large: 0px 8px 16px 0px rgba(R, G, B, 0.22);
  --lufa-semantic-ui-shadow-extra-large: 0px 12px 24px 0px rgba(R, G, B, 0.28);
  --lufa-semantic-ui-background-pattern: /* your pattern */;
}

/* Light mode (default) */
[data-theme='yourtheme'],
[data-theme='yourtheme'][data-mode='light'] {
  /* Brand */
  --lufa-core-color-brand-primary-default: #xxxxxx;
  /* ... all required tokens ... */
}

[data-theme='yourtheme'][data-mode='dark'] { /* ... */ }
[data-theme='yourtheme'][data-mode='high-contrast'] { /* ... */ }
```

### Checking a contrast ratio (inline documentation style)

```css
/* Document the ratio with a comment — required pattern */
--lufa-component-button-type-outline-variant-neutral-border-active: #0c4a6e; /* neutral-text-primary on #f0f9ff = 8.87:1 */
```

### Disabling glow in high-contrast mode

```css
[data-theme='yourtheme'][data-mode='high-contrast'] {
  --lufa-semantic-effect-glow-box-primary-default: none;
  --lufa-semantic-effect-glow-box-primary-hover: none;
  --lufa-semantic-effect-glow-text-primary-default: none;  /* if text glow was set */
  --lufa-semantic-effect-glow-text-primary-hover: none;
}
```

### React FOUC prevention

```html
<!-- In <head>, before all stylesheets -->
<script>
  (function () {
    const theme = localStorage.getItem('lufa-theme') || 'light';
    document.documentElement.setAttribute('data-mode', theme);
  })();
</script>
```

## Anti-patterns

| Anti-pattern | Correct approach |
|---|---|
| `@import '@grasdouble/lufa_design-system-themes/ocean.css'` without importing tokens first | Always import `@grasdouble/lufa_design-system-tokens/style.css` first |
| Defining tokens on `:root` in a theme file | All tokens must be inside `[data-theme='X']` selectors |
| Using `--lufa-core-semantic-{state}-*` | Use `--lufa-core-color-feedback-{state}-*` (current namespace) |
| Using `--lufa-core-brand-*` | Use `--lufa-core-color-brand-*` (current namespace) |
| Using `--lufa-shadow-*` or `--lufa-glow-*` (old names) | Use `--lufa-semantic-ui-shadow-*` / `--lufa-semantic-effect-glow-*` |
| Adding glow tokens to organic/natural themes | Glow tokens are for cyber/neon themes only |
| Leaving glow tokens active in high-contrast mode | Always set `none` in high-contrast for glow properties |
| Omitting one of the three mode blocks | All themes must have light, dark, and high-contrast |
| Skipping contrast ratio validation | Every component override must have a measured contrast ratio in a comment |
| Adding PostCSS or bundling to the build | The build is a file copy — no transformation |

## Dependencies Context

### Required At Runtime

```
@grasdouble/lufa_design-system-tokens (workspace:^)
  → Provides :root token definitions that themes override via [data-theme] selectors
  → Must be imported BEFORE any theme CSS
  → Version constraint: workspace:^ (always latest compatible workspace version)
```

### Developer Toolchain

```
@grasdouble/lufa_design-system-cli (workspace:^)
  → Provides lufa-ds-cli theme-validate command
  → Used by: pnpm validate:theme:* and pnpm validate:token-usage

tsx (^4.21.0)
  → Runs scripts/copy-themes.ts (build)
  → ESM TypeScript execution, no compilation

typescript (^5.9.3)
  → Type-checks scripts/ only
```

### In-monorepo Consumers

```
@grasdouble/lufa_design-system-storybook
  → storybook/src/style.css: imports all 10 themes

@grasdouble/lufa_design-system-docusaurus
  → docusaurus/src/css/custom.css: imports all 10 themes
```

## Quick Reference

### All valid CSS import paths

```
@grasdouble/lufa_design-system-themes/coffee.css
@grasdouble/lufa_design-system-themes/cyberpunk.css
@grasdouble/lufa_design-system-themes/forest.css
@grasdouble/lufa_design-system-themes/matrix.css
@grasdouble/lufa_design-system-themes/nordic.css
@grasdouble/lufa_design-system-themes/ocean.css
@grasdouble/lufa_design-system-themes/steampunk.css
@grasdouble/lufa_design-system-themes/sunset.css
@grasdouble/lufa_design-system-themes/volcano.css
@grasdouble/lufa_design-system-themes/volt.css
```

### File structure

```
packages/design-system/themes/
  src/
    coffee.css       ← source (authored)
    cyberpunk.css
    forest.css
    matrix.css
    nordic.css
    ocean.css
    steampunk.css
    sunset.css
    volcano.css
    volt.css
  dist/
    *.css            ← built output (identical copies of src/)
  scripts/
    copy-themes.ts   ← build script
    tsconfig.json
  package.json
  README.md
  CHANGELOG.md
```

### Adding a theme checklist

1. Create `src/your-theme.css` with 4 selector blocks (structural + 3 modes)
2. Add `'your-theme.css'` to the `themes` array in `scripts/copy-themes.ts`
3. Add `"./your-theme.css": "./dist/your-theme.css"` to `package.json#exports`
4. Run `pnpm build`
5. Run `pnpm validate:theme:your-theme`
6. Run `pnpm validate:token-usage`

### Build commands

```bash
pnpm build                        # clean + copy themes to dist/
pnpm validate:theme:all           # validate all themes
pnpm validate:theme:ocean         # validate one theme
pnpm validate:token-usage         # check all token names are valid
pnpm validate:token-usage:unused  # find unused tokens
```

## See Also

- [`@grasdouble/lufa_design-system-tokens`](./lufa_design-system-tokens.context.md) — base token definitions that themes override
- [`@grasdouble/lufa_design-system-cli`](./lufa_design-system-cli.context.md) — CLI tool providing `lufa-ds-cli theme-validate`
- [`@grasdouble/lufa_design-system-storybook`](./lufa_design-system-storybook.context.md) — imports all themes for component stories
- [`@grasdouble/lufa_design-system-docusaurus`](./lufa_design-system-docusaurus.context.md) — imports all themes for the docs site
