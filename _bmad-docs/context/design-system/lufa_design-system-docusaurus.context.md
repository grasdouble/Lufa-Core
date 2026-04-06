---
package: '@grasdouble/lufa_design-system-docusaurus'
shortName: lufa_design-system-docusaurus
category: design-system
type: context
lastUpdated: '2026-02-24'
generatedAtCommit: 'd27c912328f538971b6720513be2c817c2feff15'
---

# Context: @grasdouble/lufa_design-system-docusaurus

## Quick Identity

- **Type**: Private Docusaurus 3 documentation site — not an npm-published library
- **Role in monorepo**: Documentation and learning hub for the Lufa Design System
- **Deployed URL**: `https://lufa-ds.grasdouble.com`
- **Dev server**: `http://localhost:3000` (via `pnpm dev` or `pnpm ds:documentation:dev` from root)
- **Build output**: `packages/design-system/docusaurus/build/`

## Critical Relationships

```
@grasdouble/lufa_design-system-docusaurus
  ├── CONSUMES (workspace) → @grasdouble/lufa_design-system        (all component exports)
  ├── CONSUMES (workspace) → @grasdouble/lufa_design-system-themes (10 theme CSS files)
  ├── CONSUMES (workspace) → @grasdouble/lufa_design-system-tokens (token values + validate:token-usage script)
  ├── USES CONFIG (workspace) → @grasdouble/lufa_config_eslint
  ├── USES CONFIG (workspace) → @grasdouble/lufa_config_prettier
  └── USES CONFIG (workspace) → @grasdouble/lufa_config_tsconfig
```

## Key Files at a Glance

| File                                                | What it does                                                                         |
| --------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `docusaurus.config.ts`                              | Site metadata, plugins, theme config, deployment settings                            |
| `sidebars.ts`                                       | Navigation tree for the `/docs` section                                              |
| `src/css/custom.css`                                | Global CSS: Infima overrides + imports all design system and theme CSS               |
| `src/clientModules/colorModeSync.ts`                | Bridges `data-theme` (Docusaurus) → `data-mode` (design system) via MutationObserver |
| `src/theme/ReactLiveScope/index.ts`                 | Injects all `@grasdouble/lufa_design-system` exports into live code block scope      |
| `src/pages/index.tsx`                               | Homepage with hero, features, statistics, and quick-start code samples               |
| `src/pages/playground/index.tsx`                    | Interactive playground page with theme switcher and component showcase               |
| `src/pages/playground/_PlaygroundThemeSwitcher.tsx` | Dropdown UI for switching among 11 themes; applies `data-theme` to a container ref   |
| `src/components/LiveDemoSection.tsx`                | Tabbed demo wrapper used in MDX pages; sets `data-mode` for isolated demos           |
| `src/components/DarkModeCompatible.tsx`             | Badge indicating a component supports dark mode                                      |
| `src/components/HomepageFeatures/index.tsx`         | Three-column feature section on homepage                                             |
| `src/dsExamples/**`                                 | Typed TSX example files imported by MDX documentation pages                          |
| `plugins/rspack-disable-minimizers.js`              | Disables Rspack minification to work around `@docusaurus/faster` incompatibility     |
| `scripts/update-changelog.js`                       | Syncs root CHANGELOG.md into `docs/` for in-site display                             |

## Data Flow: Color Mode

```
Docusaurus toggle
      │  sets
      ▼
<html data-theme="dark|light">
      │  observed by colorModeSync.ts (MutationObserver)
      ▼
<html data-mode="dark|light">        ← design system reads this
      │  also synced by
      ▼
LiveDemoSection (via useColorMode)   ← sets data-mode on its own container
PlaygroundThemeSwitcher (via useColorMode) ← sets data-mode on playground container ref
```

## Data Flow: Live Code Blocks

````
MDX page with ```tsx live fence
      │
      ▼
@docusaurus/theme-live-codeblock
      │  reads scope from
      ▼
src/theme/ReactLiveScope/index.ts
      │  exports { React, ...React, ...DesignSystem }
      ▼
All components from @grasdouble/lufa_design-system
available in the live editor without imports
````

## Data Flow: Theme Playground

```
User selects theme in PlaygroundThemeSwitcher dropdown
      │  calls applyTheme(themeName)
      ▼
containerRef.current.setAttribute('data-theme', 'ocean'|'forest'|...|'')
      │
      ▼
CSS file for that theme is already loaded globally in custom.css
(@import '@grasdouble/lufa_design-system-themes/ocean.css' etc.)
      │
      ▼
CSS custom properties cascade into scoped container
      │
      ▼
All design system components within the playground re-render with new theme tokens
```

## Component Category → File Mapping

| Sidebar Category | Docs directory      | dsExamples directory          |
| ---------------- | ------------------- | ----------------------------- |
| Foundation       | `docs/foundation/`  | `src/dsExamples/foundation/`  |
| Content          | `docs/content/`     | `src/dsExamples/content/`     |
| Interaction      | `docs/interaction/` | `src/dsExamples/interaction/` |
| Composition      | `docs/composition/` | `src/dsExamples/composition/` |
| Utility          | `docs/utility/`     | `src/dsExamples/utility/`     |

**Components documented (16 total):**

- Foundation: Box, Center, Container, Flex, Grid, Stack, Divider, AspectRatio, Cluster, Bleed
- Content: Badge, Icon, Text
- Interaction: Button, Input, Label
- Composition: Card
- Utility: Portal, VisuallyHidden

## Available Themes (Playground)

| Theme name  | Label     | Icon |
| ----------- | --------- | ---- |
| `default`   | Default   | 📘   |
| `ocean`     | Ocean     | 🌊   |
| `forest`    | Forest    | 🌲   |
| `matrix`    | Matrix    | 💾   |
| `cyberpunk` | Cyberpunk | 🎆   |
| `sunset`    | Sunset    | 🌅   |
| `nordic`    | Nordic    | ❄️   |
| `volcano`   | Volcano   | 🌋   |
| `coffee`    | Coffee    | ☕   |
| `volt`      | Volt      | ⚡   |
| `steampunk` | Steampunk | ⚙️   |

## Build Configuration Notes

- **Bundler**: Rspack (enabled via `experimental_faster.rspackBundler: true`)
- **Minification**: Disabled by `plugins/rspack-disable-minimizers.js` (compatibility workaround)
- **CSS cascade layers**: Disabled (`future.v4.useCssCascadeLayers: false`)
- **Broken links**: Build throws on broken links (`onBrokenLinks: 'throw'`)
- **Versioning**: Single `current` version; future versioning planned for v1.0.0 release

## Common Development Patterns

### Adding a new component documentation page

1. Create `docs/<category>/<component>.md` or `.mdx`
2. Create `src/dsExamples/<category>/<component>.tsx` with example code
3. Add the page id to the appropriate sidebar category in `sidebars.ts`
4. Import `LiveDemoSection` and `DarkModeCompatible` in the MDX page as needed

### Adding a new theme

1. Ensure the theme CSS file exists in `@grasdouble/lufa_design-system-themes`
2. Add `@import '@grasdouble/lufa_design-system-themes/<theme>.css';` to `src/css/custom.css`
3. Add the theme entry to `THEMES` array in `src/pages/playground/_PlaygroundThemeSwitcher.tsx`

### Updating the changelog page

```bash
pnpm update-changelog
```

This runs `scripts/update-changelog.js` to sync `CHANGELOG.md` into `docs/changelog.md`.

### Validating token usage

```bash
# Check that all used tokens are defined
pnpm validate:token-usage

# Find unused tokens
pnpm validate:token-usage:unused

# Verbose output
pnpm validate:token-usage:verbose
```

## Deployment

- **Automatic**: GitHub Actions deploys to production on push to `main`
- **Manual build**: `pnpm build` → upload `./build/` to hosting
- **GitHub Pages**: configured with `organizationName: 'grasdouble'`, `projectName: 'Lufa'`
- **Deploy command**: `pnpm deploy` (runs `docusaurus deploy`)

## Lint-staged Hooks

| File pattern                | Actions                    |
| --------------------------- | -------------------------- |
| `*.{js,jsx,ts,tsx,mjs,cjs}` | ESLint fix, Prettier write |
| `*.{ts,tsx}`                | `pnpm typecheck`           |
| `*.{json,md,css,html}`      | Prettier write             |

## Browser Targets

- **Production**: >0.5% usage, not dead, not op_mini all
- **Development**: Last 3 Chrome, last 3 Firefox, last 5 Safari
- **Node.js runtime**: >=20.0
