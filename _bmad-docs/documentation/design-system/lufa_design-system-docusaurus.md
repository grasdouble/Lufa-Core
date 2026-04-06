---
package: '@grasdouble/lufa_design-system-docusaurus'
shortName: lufa_design-system-docusaurus
category: design-system
version: '1.1.0'
private: true
lastUpdated: '2026-02-24'
generatedAtCommit: 'd27c912328f538971b6720513be2c817c2feff15'
---

# @grasdouble/lufa_design-system-docusaurus

## Overview

`@grasdouble/lufa_design-system-docusaurus` is the official documentation website for the Lufa Design System, built with [Docusaurus 3](https://docusaurus.io/). It is a private, non-published package that serves as a static site generator for the comprehensive reference documentation of all Lufa Design System components, design tokens, theming, and contributing guides.

The site is deployed to `https://lufa-ds.grasdouble.com` and serves as the primary learning and reference resource for consumers and contributors of the design system.

## Purpose

- Provide comprehensive, searchable reference documentation for all design system components
- Embed interactive live code blocks that execute actual design system components in the browser
- Expose an interactive playground for testing components across all available themes and color modes
- Centralize design token documentation (colors, typography, spacing, shadows)
- Host getting-started guides, migration guides, accessibility documentation, and contributing instructions

## Architecture

### Technology Stack

| Layer            | Technology                            |
| ---------------- | ------------------------------------- |
| Site Framework   | Docusaurus 3.9.2                      |
| Bundler          | Rspack (via `@docusaurus/faster`)     |
| React            | 19.x                                  |
| TypeScript       | 5.x                                   |
| Live Code Blocks | `@docusaurus/theme-live-codeblock`    |
| Local Search     | `@easyops-cn/docusaurus-search-local` |

### Directory Structure

```
packages/design-system/docusaurus/
├── docusaurus.config.ts          # Main site configuration
├── sidebars.ts                   # Sidebar navigation structure
├── docs/                         # MDX/Markdown documentation pages
│   ├── intro.md                  # Introduction page
│   ├── accessibility.md          # Accessibility guidance
│   ├── changelog.md              # Changelog reference page
│   ├── components/               # Component overview
│   ├── foundation/               # Layout primitive docs (Box, Stack, Grid, etc.)
│   ├── content/                  # Content component docs (Badge, Icon, Text)
│   ├── interaction/              # Interaction component docs (Button, Input, Label)
│   ├── composition/              # Composition component docs (Card)
│   ├── utility/                  # Utility component docs (Portal, VisuallyHidden)
│   ├── tokens/                   # Design token reference (colors, typography, spacing, shadows)
│   ├── getting-started/          # Installation, usage, and theming guides
│   └── guides/                   # Contributing, migration, component template guides
├── src/
│   ├── components/               # Custom React components used within docs/pages
│   ├── pages/                    # Custom Docusaurus pages (homepage, playground)
│   ├── css/custom.css            # Global CSS overrides + theme imports
│   ├── theme/ReactLiveScope/     # Injects design system into live code blocks
│   ├── clientModules/            # Client-side modules (color mode sync)
│   └── dsExamples/               # Reusable component examples consumed by MDX docs
├── plugins/
│   └── rspack-disable-minimizers.js  # Rspack optimization override
├── scripts/
│   └── update-changelog.js       # Script to sync CHANGELOG.md into docs
├── blog/                         # (disabled in config)
├── static/                       # Static assets (images, favicon)
└── build/                        # Production build output (gitignored)
```

### Documentation Categories

The sidebar is organized into the following sections (defined in `sidebars.ts`):

| Category        | Components Documented                                                           |
| --------------- | ------------------------------------------------------------------------------- |
| **Foundation**  | Box, Center, Container, Flex, Grid, Stack, Divider, AspectRatio, Cluster, Bleed |
| **Content**     | Badge, Icon, Text                                                               |
| **Interaction** | Button, Input, Label                                                            |
| **Composition** | Card                                                                            |
| **Utility**     | Portal, VisuallyHidden                                                          |

### Color Mode Synchronization

The site bridges Docusaurus's `data-theme` attribute (set on `<html>`) to the design system's `data-mode` attribute using a client module at `src/clientModules/colorModeSync.ts`. A `MutationObserver` monitors `data-theme` changes and writes `data-mode="dark"` or `data-mode="light"` accordingly, ensuring design system components inside live demos respond to Docusaurus's dark mode toggle.

## Key Components

### `src/components/DarkModeCompatible.tsx`

A small badge component used within MDX documentation pages to visually indicate that a component supports dark mode. Renders an inline badge styled with Infima CSS variables.

```tsx
import { DarkModeCompatible } from '@site/src/components/DarkModeCompatible';

<DarkModeCompatible />;
// Renders: 🌓 Dark Mode Compatible
```

### `src/components/LiveDemoSection.tsx`

An interactive section wrapper used within MDX documentation pages. Supports an optional tabbed interface for showcasing multiple demo variants of a component. Reads `colorMode` from Docusaurus and sets `data-mode` on its container so that design system tokens render correctly in isolation.

**Props:**

| Prop           | Type            | Default       | Description                                        |
| -------------- | --------------- | ------------- | -------------------------------------------------- |
| `title`        | `string`        | `'Live demo'` | Section eyebrow label                              |
| `children`     | `ReactNode`     | —             | Content for the tab-less variant                   |
| `tabs`         | `LiveDemoTab[]` | —             | Array of tab definitions `{ id?, label, content }` |
| `defaultTabId` | `string`        | —             | Initial active tab by id                           |

### `src/components/HomepageFeatures/index.tsx`

Renders the three feature cards on the homepage: "Built with React", "Design Tokens", and "Accessible by Default". Static presentational component with no props.

### `src/pages/index.tsx`

The homepage of the documentation site. Composed of:

- `HomepageHeader` — hero banner with title, tagline, and CTA buttons
- `HomepageFeatures` — three-column feature section
- `HomepageStatistics` — four-stat grid (50+ Components, WCAG AA, TypeScript First, Tree Shakeable)
- `HomepageQuickStart` — embedded install and usage code blocks

The homepage imports `@grasdouble/lufa_design-system-tokens/values` directly to use spacing primitives for inline layout (`tokens.primitive.spacing['16']`).

### `src/pages/playground/index.tsx`

A full-page interactive playground (`/playground`) with two switchable views:

- **Demo Site** — rendered by `_DemoSite.tsx`, shows a realistic application using the design system
- **Component Library** — `ComponentShowcase` renders every major component category side by side

Features a sticky sub-header with `PlaygroundThemeSwitcher` that applies `data-theme` and `data-mode` attributes directly to the playground container element, allowing isolated theme switching without affecting the rest of the Docusaurus UI.

### `src/pages/playground/_PlaygroundThemeSwitcher.tsx`

A dropdown theme switcher supporting 11 built-in themes. Theme changes are applied by setting `data-theme` on a forwarded `containerRef`. Color mode (light/dark) is always delegated to Docusaurus's global toggle.

**Available themes:** default, ocean, forest, matrix, cyberpunk, sunset, nordic, volcano, coffee, volt, steampunk

### `src/theme/ReactLiveScope/index.ts`

Overrides Docusaurus's `ReactLiveScope` theme component to inject all exports from `@grasdouble/lufa_design-system` into the scope of live code blocks. This means every MDX page with a `live` code fence can use any design system component without import statements.

```ts
const ReactLiveScope = {
  React,
  ...React,
  ...DesignSystem, // All @grasdouble/lufa_design-system exports
};
```

### `src/dsExamples/`

Reusable TypeScript/TSX example files for each component, organized by category. These are imported by MDX documentation pages to keep example code DRY and type-safe.

```
dsExamples/
├── foundation/   # aspectRatio, bleed, box, center, cluster, container, divider, flex, grid, stack
├── content/      # badge, icon, text
├── interaction/  # button, input, label
├── composition/  # card
└── utility/      # portal, visually-hidden
```

### `plugins/rspack-disable-minimizers.js`

A local Docusaurus plugin that disables Rspack's code minimization (`minimize: false, minimizer: []`). This works around a compatibility issue between `@docusaurus/faster` (Rspack bundler) and certain output formats.

### `scripts/update-changelog.js`

A Node.js script invoked via `pnpm update-changelog` that syncs the root `CHANGELOG.md` file into the `docs/` directory as a documentation page, ensuring the changelog is always visible in the site navigation.

## API Reference

This package is a documentation site — it does not export any public API. There are no npm exports. All source code is consumed only by the Docusaurus build pipeline.

### Available Scripts

| Script                              | Description                                                   |
| ----------------------------------- | ------------------------------------------------------------- |
| `pnpm dev`                          | Clears cache and starts the Docusaurus dev server (port 3000) |
| `pnpm build`                        | Clears cache and produces a production build in `./build/`    |
| `pnpm serve`                        | Serves the production build locally                           |
| `pnpm clear`                        | Clears the `.docusaurus/` cache and `build/` directories      |
| `pnpm deploy`                       | Deploys to GitHub Pages                                       |
| `pnpm lint`                         | Runs ESLint across the package                                |
| `pnpm typecheck`                    | Runs `tsc` type checking                                      |
| `pnpm prettier:check`               | Checks formatting with Prettier                               |
| `pnpm prettier:write`               | Formats files with Prettier                                   |
| `pnpm update-changelog`             | Syncs CHANGELOG.md into the docs                              |
| `pnpm validate:token-usage`         | Validates that only defined tokens are used in `src/`         |
| `pnpm validate:token-usage:unused`  | Reports unused tokens in `src/`                               |
| `pnpm validate:token-usage:verbose` | Verbose token usage report                                    |

### Token Validation Scripts

Token validation is delegated to `@grasdouble/lufa_design-system-tokens`'s `validate:token-usage` command, scanning `src/` for `.css`, `.tsx`, `.ts`, and `.mdx` files.

## Usage Examples

### Running the Documentation Site Locally

```bash
# From the monorepo root
pnpm ds:documentation:dev

# Or from the package directory
cd packages/design-system/docusaurus
pnpm dev
```

The dev server starts on `http://localhost:3000`.

### Writing a Component Documentation Page

Create an MDX file in the appropriate `docs/` subdirectory. Use the `LiveDemoSection` and `DarkModeCompatible` components:

```mdx
---
id: button
title: Button
---

import { DarkModeCompatible } from '@site/src/components/DarkModeCompatible';
import { LiveDemoSection } from '@site/src/components/LiveDemoSection';
import ButtonExamples from '@site/src/dsExamples/interaction/button';

<DarkModeCompatible />

The Button component supports three style types and five semantic variants.

<LiveDemoSection title="Interactive Demo">
  <ButtonExamples />
</LiveDemoSection>
```

### Using Live Code Blocks

Any MDX page can use an interactive live code block. All design system components are pre-injected into scope:

````mdx
```tsx live
function Demo() {
  return (
    <Stack direction="vertical" spacing="default">
      <Button type="solid" variant="primary">
        Primary
      </Button>
      <Button type="outline" variant="secondary">
        Secondary
      </Button>
    </Stack>
  );
}
```
````

### Registering a New Theme in the Playground

1. Add the theme CSS import to `src/css/custom.css`:
   ```css
   @import '@grasdouble/lufa_design-system-themes/my-theme.css';
   ```
2. Add the theme entry to the `THEMES` array in `src/pages/playground/_PlaygroundThemeSwitcher.tsx`:
   ```ts
   { name: 'my-theme', label: 'My Theme', icon: '🎨', description: 'Custom theme' },
   ```

## Dependencies

### Runtime Dependencies

| Package                                 | Version       | Role                                        |
| --------------------------------------- | ------------- | ------------------------------------------- |
| `@docusaurus/core`                      | 3.9.2         | Core Docusaurus framework                   |
| `@docusaurus/faster`                    | 3.9.2         | Rspack bundler integration                  |
| `@docusaurus/preset-classic`            | 3.9.2         | Standard docs/blog/theme preset             |
| `@docusaurus/theme-common`              | ^3.9.2        | Shared theme utilities (useColorMode, etc.) |
| `@docusaurus/theme-live-codeblock`      | ^3.9.2        | Interactive live code block theme           |
| `@easyops-cn/docusaurus-search-local`   | ^0.52.3       | Local full-text search (no server required) |
| `@grasdouble/lufa_design-system`        | `workspace:^` | All design system components                |
| `@grasdouble/lufa_design-system-themes` | `workspace:^` | All theme CSS variants                      |
| `@grasdouble/lufa_design-system-tokens` | `workspace:^` | Design token values and validation          |
| `@mdx-js/react`                         | ^3.1.1        | MDX React provider                          |
| `clsx`                                  | ^2.1.1        | Conditional CSS class helper                |
| `lucide-react`                          | ^0.563.0      | Icon library                                |
| `prism-react-renderer`                  | ^2.4.1        | Syntax highlighting                         |
| `react` / `react-dom`                   | ^19.2.4       | React runtime                               |

### Dev Dependencies

| Package                            | Role                                           |
| ---------------------------------- | ---------------------------------------------- |
| `@docusaurus/module-type-aliases`  | TypeScript path aliases for Docusaurus modules |
| `@docusaurus/tsconfig`             | Base TypeScript config for Docusaurus          |
| `@docusaurus/types`                | Docusaurus TypeScript type definitions         |
| `@grasdouble/lufa_config_eslint`   | Shared ESLint configuration                    |
| `@grasdouble/lufa_config_prettier` | Shared Prettier configuration                  |
| `@grasdouble/lufa_config_tsconfig` | Shared TypeScript base configuration           |
| `tsx`                              | TypeScript execution for scripts               |
| `typescript`                       | TypeScript compiler                            |

## Configuration Details

### `docusaurus.config.ts`

Key configuration values:

| Setting            | Value                                                       |
| ------------------ | ----------------------------------------------------------- |
| Production URL     | `https://lufa-ds.grasdouble.com`                            |
| Base URL           | `/`                                                         |
| Default locale     | `en`                                                        |
| Blog               | Disabled                                                    |
| Color mode default | `light` (user can switch)                                   |
| Broken links       | `throw` (build fails on broken links)                       |
| Versioning         | Single `current` version labeled "Development (Unreleased)" |
| Sitemap            | Weekly changefreq, excludes `/tags/**`                      |

### Search Configuration

Search is provided offline via `@easyops-cn/docusaurus-search-local`:

- Hashed index for cache busting
- English language tokenization
- Highlights search terms on result pages
- Explicit search result paths enabled
- Docs route: `/docs`

### Rspack / Build Performance

The `experimental_faster.rspackBundler: true` flag activates Rspack as the bundler instead of Webpack. The local `rspack-disable-minimizers` plugin disables minification to work around a known incompatibility. CSS cascade layers are disabled via `future.v4.useCssCascadeLayers: false`.

## Related Documentation

| Resource                 | Location                            |
| ------------------------ | ----------------------------------- |
| Design System components | `packages/design-system/main/`      |
| Design tokens            | `packages/design-system/tokens/`    |
| Theme CSS variants       | `packages/design-system/themes/`    |
| Storybook                | `packages/design-system/storybook/` |
| Contributing guide       | `CONTRIBUTING.md` (monorepo root)   |
| Live documentation site  | https://lufa-ds.grasdouble.com      |
| GitHub repository        | https://github.com/grasdouble/Lufa  |
