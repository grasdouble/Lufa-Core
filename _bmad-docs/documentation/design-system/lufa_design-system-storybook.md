---
package: '@grasdouble/lufa_design-system-storybook'
shortName: lufa_design-system-storybook
category: design-system
version: '1.1.0'
private: true
lastUpdated: '2026-02-24'
generatedAtCommit: 'd27c912328f538971b6720513be2c817c2feff15'
---

# @grasdouble/lufa_design-system-storybook

Interactive component explorer and documentation environment for the Lufa Design System.

## Overview

This package is the Storybook instance for the Lufa Design System. It provides a live, interactive catalog of all design system components, token visualizations, and developer-focused documentation. It is a private, development-only package that is not published as a library — its output is a static Storybook build (`storybook-static/`) deployed for reference and QA.

- **Storybook version**: 10.x
- **Framework**: `@storybook/react-vite` (React + Vite)
- **Dev server port**: 6006
- **Module type**: ESM (`"type": "module"`)
- **License**: MIT

## Purpose

- Provide a single reference environment where developers and designers can interactively explore every component in the design system.
- Document component props, variants, states, and usage patterns through code-driven stories.
- Visualize the full token system (primitive, semantic, and component tokens) live in the browser.
- Test theming (11 themes) and color modes (light, dark, high-contrast) in real time.
- Serve as the canonical source of copy-paste code examples.

## Architecture

### Build Toolchain

| Tool                               | Version   | Role                                                       |
| ---------------------------------- | --------- | ---------------------------------------------------------- |
| Storybook                          | `^10.2.3` | Story runner and static builder                            |
| `@storybook/react-vite`            | `^10.2.3` | React + Vite integration framework                         |
| Vite                               | `^7.3.1`  | Underlying bundler                                         |
| TypeScript                         | `^5.9.3`  | Type safety; `react-docgen-typescript` for prop extraction |
| ESLint + `eslint-plugin-storybook` | `^10.2.3` | Story-specific lint rules                                  |
| Prettier                           | `^3.8.1`  | Formatting                                                 |

### Storybook Configuration (`.storybook/`)

| File                      | Purpose                                                                                                                    |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `main.ts`                 | Declares story glob, addons, framework, and TypeScript config                                                              |
| `preview.tsx`             | Global parameters, decorators, and toolbar `globalTypes` (theme/mode)                                                      |
| `manager.ts`              | Storybook UI chrome: panel sizes, dark UI theme, sidebar layout                                                            |
| `ThemeAndModeWrapper.tsx` | React decorator that writes `data-theme` and `data-mode` attributes to `document.documentElement` and the docs iframe root |
| `breakpoints.ts`          | Viewport breakpoint definitions (xsmall–xxlarge, matching token primitives)                                                |

**Theme system**: The built-in `@storybook/addon-themes` is intentionally disabled. A custom global toolbar provides 11 theme options (default, ocean, forest, matrix, cyberpunk, sunset, nordic, volcano, coffee, volt, steampunk) and 3 modes (light, dark, high-contrast). `ThemeAndModeWrapper` applies the selection via HTML attributes that the CSS token layer responds to.

**Active addons**:

- `@storybook/addon-docs` — MDX and auto-generated docs pages
- (backgrounds addon explicitly disabled)

**Story sorting**: Stories are numerically sorted by title category, with `Playground` pinned first within each component.

### Source Structure (`src/`)

```
src/
├── style.css               # Storybook-specific global styles
├── style.css.d.ts          # CSS module type declaration
├── components/
│   ├── helpers/            # Reusable story UI primitives (see below)
│   └── ThemeSwitcher/      # Standalone theme-switcher component (CSS module)
├── constants/
│   └── storyColors.ts      # Color utilities for story authoring
└── stories/
    ├── tokens/             # Token system documentation stories
    ├── foundation/         # Layout primitive stories
    ├── content/            # Content component stories
    ├── interaction/        # Interactive component stories
    ├── composition/        # Composed pattern stories
    ├── utility/            # Utility component stories
    ├── guides/             # Developer usage guides
    └── assets/             # Static assets for MDX docs
```

## Key Components

### Story Helper Components (`src/components/helpers/`)

These components are used exclusively within stories to maintain a consistent documentation UI.

| Component             | Purpose                                                                |
| --------------------- | ---------------------------------------------------------------------- |
| `StoryContainer`      | Full-width wrapper (max 1400px, 40px padding) for fullscreen stories   |
| `PropCard`            | Labeled card that highlights on click/hover to pair with a `CodeBlock` |
| `CodeBlock`           | Syntax-highlighted code snippet with title and language label          |
| `PlaygroundContainer` | Controls-driven interactive playground wrapper                         |
| `MarginVisualizer`    | Overlays directional margin colors for Box margin stories              |
| `PaddingVisualizer`   | Overlays directional padding colors for Box padding stories            |
| `TokenCard`           | Renders a single design token with its current resolved value          |
| `TokenComparison`     | Side-by-side comparison of two token groups across themes              |
| `TokenMatrix`         | Grid rendering of a set of tokens at all theme/mode combinations       |
| `TokenReferenceChain` | Visualizes primitive → semantic → component token resolution chain     |

All are exported from `src/components/helpers/index.ts`.

### `ThemeAndModeWrapper` (`.storybook/ThemeAndModeWrapper.tsx`)

A React decorator applied globally via `preview.tsx`. On every theme/mode change it:

1. Sets `data-theme` on `document.documentElement` (`""` for default, or the theme slug).
2. Sets `data-mode` on `document.documentElement` (`light` | `dark` | `high-contrast`).
3. Mirrors both attributes to the parent frame's `documentElement` to keep the docs tab in sync.

Wraps content in a `div` using semantic background/text CSS variables so the story container itself is always theme-aware.

### `STORY_COLORS` (`src/constants/storyColors.ts`)

A color utility object with four sub-groups:

| Key                    | Type                  | Purpose                                                         |
| ---------------------- | --------------------- | --------------------------------------------------------------- |
| `themed`               | CSS variable strings  | Story UI chrome that must adapt to light/dark/high-contrast     |
| `primary` / `extended` | Hard-coded hex values | Fixed decorative colors for examples and variant demonstrations |
| `directional`          | Per-side color map    | Top/right/bottom/left colors for margin/padding visualizers     |
| `axis`                 | X/Y color map         | Horizontal/vertical colors for axis-based props                 |
| `neutral`              | Gray-scale hex values | Legacy fallback (prefer `themed` for new code)                  |

`getColorByIndex(idx)` cycles through the `EXTENDED_PALETTE` using modulo for consistent index-based coloring.

## Stories Structure

Stories are organized into 8 numbered categories that determine sidebar order.

### `1. Architecture` — Token Architecture (`src/stories/tokens/ThemeArchitecture.stories.tsx`)

Comprehensive interactive testing environment for the three-layer token architecture. Demonstrates how primitive tokens are immutable while semantic and component tokens adapt to theme and mode.

### `2. Guides` (`src/stories/guides/`)

| Story file               | Title                                                    |
| ------------------------ | -------------------------------------------------------- |
| `TokenUsage.stories.tsx` | Developer guide for when and how to use each token layer |

### `3. Tokens` (`src/stories/tokens/`)

| Story file                      | Content                                                                   |
| ------------------------------- | ------------------------------------------------------------------------- |
| `Colors.stories.tsx`            | Full color token catalog (primitive, brand, neutral, semantic, component) |
| `Typography.stories.tsx`        | Typography tokens                                                         |
| `AlphaTokens.stories.tsx`       | Alpha/opacity token visualizations                                        |
| `TokensCatalog.stories.tsx`     | Searchable full token catalog                                             |
| `ThemeComparison.stories.tsx`   | Side-by-side theme comparison matrix                                      |
| `ThemeArchitecture.stories.tsx` | Three-layer architecture demo (also listed under Architecture)            |

### `4. Foundation` (`src/stories/foundation/`)

Layout primitive components sourced from `@grasdouble/lufa_design-system`:

| Story                     | Component                                      |
| ------------------------- | ---------------------------------------------- |
| `Box.stories.tsx`         | `Box` — universal polymorphic layout primitive |
| `Stack.stories.tsx`       | `Stack` — vertical stacking with gap           |
| `Flex.stories.tsx`        | `Flex` — flexbox container                     |
| `Grid.stories.tsx`        | `Grid` — CSS grid container                    |
| `Container.stories.tsx`   | `Container` — max-width page wrapper           |
| `Center.stories.tsx`      | `Center` — centering helper                    |
| `AspectRatio.stories.tsx` | `AspectRatio` — aspect-ratio enforcer          |
| `Bleed.stories.tsx`       | `Bleed` — negative margin overflow escape      |
| `Cluster.stories.tsx`     | `Cluster` — wrapping inline group              |
| `Divider.stories.tsx`     | `Divider` — semantic horizontal/vertical rule  |

### `5. Content` (`src/stories/content/`)

| Story               | Component                          |
| ------------------- | ---------------------------------- |
| `Text.stories.tsx`  | `Text` — typography component      |
| `Icon.stories.tsx`  | `Icon` — Lucide React icon wrapper |
| `Badge.stories.tsx` | `Badge` — status/label badge       |

### `6. Interaction` (`src/stories/interaction/`)

| Story                | Component                                                        |
| -------------------- | ---------------------------------------------------------------- |
| `Button.stories.tsx` | `Button` — two-dimensional variant system (3 types × 7 variants) |
| `Input.stories.tsx`  | `Input` — text input field                                       |
| `Label.stories.tsx`  | `Label` — accessible form label                                  |

### `7. Composition` (`src/stories/composition/`)

| Story              | Component                                                     |
| ------------------ | ------------------------------------------------------------- |
| `Card.stories.tsx` | `Card` — structured content container with header/body/footer |

### `8. Utility` (`src/stories/utility/`)

| Story                        | Component                                            |
| ---------------------------- | ---------------------------------------------------- |
| `Portal.stories.tsx`         | `Portal` — DOM portal renderer                       |
| `VisuallyHidden.stories.tsx` | `VisuallyHidden` — accessibility-only hidden content |

## Story Authoring Conventions

Each story file follows a consistent pattern:

1. **Meta object** — `title` (prefixed with numeric category), `component`, `parameters`, and `argTypes` for Controls panel.
2. **Exported named stories** — individual `Story` exports covering: `Default`, per-prop demos (`Prop: propName`), combination matrices, use-case compositions, and a `Playground` (Controls-driven).
3. **`StoryContainer` + `PropCard` + `CodeBlock`** — standard wrapper pattern keeps visual presentation consistent and pairs each demo with a copy-paste code snippet.
4. **Token education comments** — inline `/* 💡 TOKEN EDUCATION */` comment blocks in story renders teach developers which tokens are active.

Story numbering in titles enforces sidebar ordering:

```
1. Architecture  →  2. Guides  →  3. Tokens  →  4. Foundation
→  5. Content    →  6. Interaction  →  7. Composition  →  8. Utility
```

Detailed authoring rules are in `_docs/story-guide.md`, `_docs/story-rules.md`, and `_docs/story-template.md`.

## Usage Examples

### Start the development server

```bash
# From the monorepo root
pnpm ds:storybook:dev

# From this package
pnpm dev
```

Storybook starts at `http://localhost:6006`.

### Build static output

```bash
# From the monorepo root
pnpm ds:storybook:build

# From this package
pnpm build
```

Outputs to `storybook-static/`.

### Writing a new story

```tsx
// src/stories/interaction/MyComponent.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';

import { MyComponent } from '@grasdouble/lufa_design-system';

import { CodeBlock, PropCard, StoryContainer } from '../../components/helpers';

const meta = {
  title: '6. Interaction/MyComponent',
  component: MyComponent,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
  },
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

### Using theme-aware colors in a story

```tsx
import { STORY_COLORS } from '../../constants/storyColors';

// Story UI chrome — adapts to light/dark/high-contrast
<div style={{ color: STORY_COLORS.themed.text.primary }}>
  Story label
</div>

// Fixed decorative example — stays consistent
<Box style={{ backgroundColor: STORY_COLORS.primary.blue.main }}>
  Example
</Box>
```

## Dependencies

### Runtime Dependencies

| Package                                 | Version       | Role                                                         |
| --------------------------------------- | ------------- | ------------------------------------------------------------ |
| `@grasdouble/lufa_design-system`        | `workspace:^` | Source of all documented components                          |
| `@grasdouble/lufa_design-system-themes` | `workspace:^` | Theme CSS (applied via `data-theme` attribute)               |
| `@grasdouble/lufa_design-system-tokens` | `workspace:^` | Token JSON values (used in `storyColors.ts`)                 |
| `lucide-react`                          | `^0.563.0`    | Icon library (used in Icon stories and Button icon examples) |
| `react` + `react-dom`                   | `^19.2.4`     | React runtime                                                |

### Development Dependencies (key)

| Package                               | Role                                                        |
| ------------------------------------- | ----------------------------------------------------------- |
| `storybook` + `@storybook/react-vite` | Core Storybook runner                                       |
| `@storybook/addon-docs`               | MDX support and auto-docs                                   |
| `@storybook/addon-themes`             | Installed but disabled (custom implementation used instead) |
| `@vitejs/plugin-react`                | Vite React transform                                        |
| `eslint-plugin-storybook`             | Story-specific ESLint rules                                 |
| `@grasdouble/lufa_config_eslint`      | Shared monorepo ESLint config                               |
| `@grasdouble/lufa_config_prettier`    | Shared monorepo Prettier config                             |
| `@grasdouble/lufa_config_tsconfig`    | Shared monorepo TypeScript base config                      |

## Related Documentation

| Resource                  | Path                                 |
| ------------------------- | ------------------------------------ |
| Story writing guide       | `_docs/story-guide.md`               |
| Story rules reference     | `_docs/story-rules.md`               |
| Story template            | `_docs/story-template.md`            |
| Storybook conventions     | `_docs/storybook-conventions.md`     |
| Writing stories deep-dive | `_docs/writing-stories.md`           |
| Operational notes         | `_docs/operational-notes.md`         |
| Storybook patterns        | `_docs/storybook-patterns.md`        |
| Design System README      | `packages/design-system/README.md`   |
| Component library         | `packages/design-system/main/`       |
| Token package             | `packages/design-system/tokens/`     |
| Themes package            | `packages/design-system/themes/`     |
| Docusaurus docs site      | `packages/design-system/docusaurus/` |
