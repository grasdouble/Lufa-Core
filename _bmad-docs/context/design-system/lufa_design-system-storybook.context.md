---
package: '@grasdouble/lufa_design-system-storybook'
shortName: lufa_design-system-storybook
category: design-system
type: context
lastUpdated: '2026-02-24'
generatedAtCommit: 'd27c912328f538971b6720513be2c817c2feff15'
---

# Context: @grasdouble/lufa_design-system-storybook

## Quick Reference

| Field               | Value                                      |
| ------------------- | ------------------------------------------ |
| Package name        | `@grasdouble/lufa_design-system-storybook` |
| Version             | `1.1.0`                                    |
| Private             | `true` (not published)                     |
| Source path         | `packages/design-system/storybook/`        |
| Dev server          | `http://localhost:6006` (port 6006)        |
| Static build output | `storybook-static/`                        |
| Framework           | Storybook 10 + React + Vite                |
| React version       | 19                                         |

## What This Package Is

A private Storybook 10 application. It is the interactive documentation and component explorer for the Lufa Design System. It does not export any library code — its only artifacts are the running dev server and a built static site.

## Key Entry Points

| Path                                 | What it does                                                                              |
| ------------------------------------ | ----------------------------------------------------------------------------------------- | --- | --- | --- | ------------------------ |
| `.storybook/main.ts`                 | Storybook config: story glob `../src/\*_/_.stories.@(js                                   | jsx | mjs | ts  | tsx)`, addons, framework |
| `.storybook/preview.tsx`             | Global story parameters, `withThemeAndMode` decorator, toolbar globals for theme and mode |
| `.storybook/manager.ts`              | Storybook UI chrome config (dark theme, panel layout)                                     |
| `.storybook/ThemeAndModeWrapper.tsx` | Decorator that sets `data-theme` / `data-mode` on `document.documentElement`              |
| `.storybook/breakpoints.ts`          | Viewport presets: xsmall(320px) → xxlarge(1536px)                                         |
| `src/components/helpers/index.ts`    | Barrel for all reusable story helper components                                           |
| `src/constants/storyColors.ts`       | `STORY_COLORS` utility — themed CSS vars + fixed decorative hex values                    |
| `src/style.css`                      | Storybook-specific global CSS                                                             |

## Story Categories and Files

| Category               | Sidebar title     | Story files                                                                                         |
| ---------------------- | ----------------- | --------------------------------------------------------------------------------------------------- |
| Token architecture     | `1. Architecture` | `tokens/ThemeArchitecture.stories.tsx`                                                              |
| Developer guides       | `2. Guides`       | `guides/TokenUsage.stories.tsx`                                                                     |
| Token system           | `3. Tokens`       | `Colors`, `Typography`, `AlphaTokens`, `TokensCatalog`, `ThemeComparison`, `ThemeArchitecture`      |
| Layout primitives      | `4. Foundation`   | `Box`, `Stack`, `Flex`, `Grid`, `Container`, `Center`, `AspectRatio`, `Bleed`, `Cluster`, `Divider` |
| Content components     | `5. Content`      | `Text`, `Icon`, `Badge`                                                                             |
| Interactive components | `6. Interaction`  | `Button`, `Input`, `Label`                                                                          |
| Composed patterns      | `7. Composition`  | `Card`                                                                                              |
| Utility components     | `8. Utility`      | `Portal`, `VisuallyHidden`                                                                          |

Total story files: **26**

## Theme and Mode System

**11 themes** (via `data-theme` HTML attribute):
`default` (empty string), `ocean`, `forest`, `matrix`, `cyberpunk`, `sunset`, `nordic`, `volcano`, `coffee`, `volt`, `steampunk`

**3 modes** (via `data-mode` HTML attribute):
`light`, `dark`, `high-contrast`

`ThemeAndModeWrapper` synchronizes both attributes to `document.documentElement` and to the parent frame's root (for the docs iframe). The standard `@storybook/addon-themes` is disabled; the toolbar globals `theme` and `mode` drive the custom implementation.

## Story Helper Components

Imported from `../../components/helpers` within stories:

| Export                | Purpose                                                                       |
| --------------------- | ----------------------------------------------------------------------------- |
| `StoryContainer`      | Fullscreen story wrapper (max-width 1400px, padding 40px)                     |
| `PropCard`            | Clickable card with label; highlights on interaction to pair with `CodeBlock` |
| `CodeBlock`           | Syntax-highlighted snippet with title bar                                     |
| `PlaygroundContainer` | Storybook Controls-driven playground                                          |
| `MarginVisualizer`    | Directional color overlays for margin props                                   |
| `PaddingVisualizer`   | Directional color overlays for padding props                                  |
| `TokenCard`           | Single token display with resolved value                                      |
| `TokenComparison`     | Side-by-side token group comparison                                           |
| `TokenMatrix`         | Token grid across theme/mode combinations                                     |
| `TokenReferenceChain` | Primitive → Semantic → Component resolution chain visual                      |

## `STORY_COLORS` Utility

```ts
import { getColorByIndex, STORY_COLORS } from '../../constants/storyColors';
```

| Key                          | Content                                                       | When to use                                   |
| ---------------------------- | ------------------------------------------------------------- | --------------------------------------------- |
| `STORY_COLORS.themed.*`      | CSS custom property strings                                   | Story UI chrome that must adapt to theme/mode |
| `STORY_COLORS.primary.*`     | Hard-coded hex (blue, violet, pink, orange, green, cyan, red) | Fixed decorative example colors               |
| `STORY_COLORS.directional.*` | Per-side (top/right/bottom/left) colors                       | Margin/padding direction visualizers          |
| `STORY_COLORS.axis.*`        | X/Y axis colors                                               | Axis-based prop demos                         |
| `STORY_COLORS.neutral.*`     | Gray-scale hex (legacy)                                       | Backwards compatibility only                  |

`getColorByIndex(idx)` — wraps index into `EXTENDED_PALETTE` via modulo for consistent per-variant coloring.

## Token Architecture (documented here)

Stories in this package are the canonical interactive reference for the three-layer token system:

```
Primitive tokens   →   --lufa-primitive-color-blue-500          (immutable)
       ↓
Semantic tokens    →   --lufa-semantic-ui-background-page       (themeable, mode-aware)
       ↓
Component tokens   →   --lufa-component-button-primary-background  (component-specific)
```

Usage hierarchy enforced in docs: component tokens > semantic tokens > primitive tokens.

## Naming Conventions

- Story `title` format: `"{N}. {Category}/{ComponentName}"` (e.g., `"6. Interaction/Button"`)
- Story name for Controls-driven: always `"Playground"`
- Per-prop stories: `"Prop: propName"` (e.g., `"Prop: variant"`)
- Combination stories: descriptive, e.g., `"Type + Variant Matrix"`
- Use-case stories: `"Use Cases"`

## Scripts

```bash
pnpm dev             # storybook dev -p 6006 --no-open
pnpm build           # storybook build  →  storybook-static/
pnpm lint            # eslint .
pnpm prettier:check  # prettier --check .
pnpm prettier:write  # prettier --write .
pnpm typecheck       # tsc -p tsconfig.json --noEmit
```

Monorepo root aliases: `pnpm ds:storybook:dev`, `pnpm ds:storybook:build`, `pnpm ds:storybook:lint`, `pnpm ds:storybook:prettier`.

## Workspace Dependencies

```
@grasdouble/lufa_design-system          → source of all documented components
@grasdouble/lufa_design-system-themes   → theme CSS consumed by data-theme/data-mode
@grasdouble/lufa_design-system-tokens   → token JSON values (storyColors.ts imports /values)
```

## Internal Docs (`_docs/`)

| File                       | Content                                                |
| -------------------------- | ------------------------------------------------------ |
| `story-guide.md`           | Complete story writing guide (explanations, rationale) |
| `story-rules.md`           | All rules and standards (quick reference)              |
| `story-template.md`        | Copy-paste story templates                             |
| `storybook-conventions.md` | Conventions specific to this Storybook instance        |
| `writing-stories.md`       | In-depth story authoring patterns                      |
| `operational-notes.md`     | Dev/build operational notes                            |
| `storybook-patterns.md`    | Advanced story patterns                                |

## Relationships to Other Packages

```
lufa_design-system-storybook
    ├── consumes  @grasdouble/lufa_design-system       (component library)
    ├── consumes  @grasdouble/lufa_design-system-tokens (token values)
    ├── consumes  @grasdouble/lufa_design-system-themes (theme CSS)
    └── parallel  @grasdouble/lufa_design-system-docusaurus (Docusaurus docs site)
```

## Important Implementation Notes

- **Backgrounds addon is disabled** (`features: { backgrounds: false }`). Background is controlled by `ThemeAndModeWrapper` using `--lufa-semantic-ui-background-page`.
- **`@storybook/addon-themes` is installed but disabled** (commented out in `main.ts`). Custom toolbar globals replace it.
- **`react-docgen-typescript`** is used for automatic prop table generation from TypeScript types.
- **Story sort is numeric**: `a.title.localeCompare(b.title, undefined, { numeric: true })` ensures `10.` sorts after `9.`.
- **`Playground` always sorts first** within a component's stories (explicit sort logic in `preview.tsx`).
- **ESLint config** extends `plugin:storybook/recommended` (defined inline in `package.json` `eslintConfig`).
