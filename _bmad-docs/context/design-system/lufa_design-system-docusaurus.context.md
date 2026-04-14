---
generatedAtCommit: "ab53a003edb177c2298250479fbe4465ee920bc3"
lastUpdated: "2026-04-07"
package: "@grasdouble/lufa_design-system-docusaurus"
---

# Context: @grasdouble/lufa_design-system-docusaurus

## Package Info

- **Type**: Private Docusaurus 3 documentation site — not an npm-published library
- **Version**: 1.2.1
- **Role in monorepo**: Documentation and learning hub for the Lufa Design System
- **Deployed URL**: `https://lufa-ds.grasdouble.com`
- **Dev server**: `http://localhost:3000` (via `pnpm dev` or `pnpm ds:documentation:dev` from root)
- **Build output**: `packages/design-system/docusaurus/build/`

## Critical Rules

- **No public exports** — this package exposes no npm API; it is a static site only
- **Never override primitive tokens** — use semantic tokens (`--lufa-semantic-*`) everywhere in source
- **`data-mode` not `data-theme`** — design system reads `data-mode` for light/dark; `colorModeSync.ts` bridges the gap from Docusaurus's `data-theme`
- **Live code blocks need no imports** — `ReactLiveScope` injects all `@grasdouble/lufa_design-system` exports; do not add import statements inside ` ```tsx live ` fences
- **Build throws on broken links** — `onBrokenLinks: 'throw'`; fix broken links before merging
- **Theme CSS must be imported in `custom.css`** before a theme name can be used in the playground switcher
- **Rspack minification disabled** — the `rspack-disable-minimizers` plugin sets `minimize: false`; this is intentional and must not be removed

## Import Pattern

This package does not export anything. Internal source files use `@site/` alias:

```ts
// Custom components in MDX pages
import { DarkModeCompatible } from '@site/src/components/DarkModeCompatible';
import { LiveDemoSection } from '@site/src/components/LiveDemoSection';

// Example files in MDX pages
import * as ButtonExamples from '@site/src/dsExamples/interaction/button';

// Design system in playground / examples
import { Button, Stack } from '@grasdouble/lufa_design-system';

// Token values on homepage
import tokens from '@grasdouble/lufa_design-system-tokens/values';
```

## Key Types

### `LiveDemoTab` (`src/components/LiveDemoSection.tsx`)

```ts
type LiveDemoTab = {
  id?: string;       // Optional stable identifier for tab
  label: string;     // Tab button label text
  content: ReactNode; // Tab panel content
};
```

### `LiveDemoSectionProps` (`src/components/LiveDemoSection.tsx`)

```ts
type LiveDemoSectionProps = {
  title?: string;        // Section eyebrow label (default: 'Live demo')
  children?: ReactNode;  // Used when no tabs are provided
  tabs?: LiveDemoTab[];  // When provided, renders a tabbed interface
  defaultTabId?: string; // Tab id to activate initially
};
```

### `ThemeName` (`src/pages/playground/_PlaygroundThemeSwitcher.tsx`)

```ts
type ThemeName =
  | 'default' | 'ocean' | 'forest' | 'matrix' | 'cyberpunk'
  | 'sunset'  | 'nordic' | 'volcano' | 'coffee' | 'volt' | 'steampunk';
```

## Common Patterns

### Adding a new component documentation page

1. Create `docs/<category>/<component>.mdx`
2. Create `src/dsExamples/<category>/<component>.tsx` with typed named exports
3. Add the page id to the appropriate sidebar category in `sidebars.ts`
4. Use `DarkModeCompatible` badge and `LiveDemoSection` wrapper in the MDX page

```mdx
import { DarkModeCompatible } from '@site/src/components/DarkModeCompatible';
import { LiveDemoSection } from '@site/src/components/LiveDemoSection';
import * as Examples from '@site/src/dsExamples/<category>/<component>';

<DarkModeCompatible />

<LiveDemoSection title="Live demo">
  <Examples.LiveDemo />
</LiveDemoSection>
```

### Writing a live code block (components auto-injected)

```mdx
```tsx live
function Demo() {
  return <Button type="solid" variant="primary">Hello</Button>;
}
```
```

No imports needed — all `@grasdouble/lufa_design-system` exports are available.

### Adding a new theme to the playground

```css
/* src/css/custom.css */
@import '@grasdouble/lufa_design-system-themes/my-theme.css';
```

```ts
// src/pages/playground/_PlaygroundThemeSwitcher.tsx — THEMES array
{ name: 'my-theme', label: 'My Theme', icon: '🎨', description: 'Brief description' },
```

### Updating the changelog page

```bash
pnpm update-changelog
# Syncs root CHANGELOG.md → docs/changelog.md
```

### Validating token usage

```bash
pnpm validate:token-usage           # Check all used tokens are defined
pnpm validate:token-usage:unused    # Report tokens defined but not used
pnpm validate:token-usage:verbose   # Full verbose output
```

## Anti-patterns

| Anti-pattern | Correct approach |
| --- | --- |
| Importing design system components in a ` ```tsx live ` block | Omit imports — all exports are pre-injected via `ReactLiveScope` |
| Using `data-theme` for mode switching in app code | Use `data-mode="dark\|light\|high-contrast"` |
| Overriding `--lufa-primitive-*` tokens in CSS | Override `--lufa-semantic-*` or `--lufa-component-*` tokens instead |
| Adding a theme name to `THEMES` without importing its CSS | Add `@import` to `src/css/custom.css` first |
| Hardcoding hex colors in `dsExamples/` or playground | Use semantic CSS custom properties (e.g. `var(--lufa-semantic-ui-background-surface)`) |
| Using `data-theme` for the playground and forgetting `data-mode` | `PlaygroundThemeSwitcher` sets both — `data-theme` for color theme, `data-mode` from Docusaurus color mode |

## Dependencies Context

```
@grasdouble/lufa_design-system-docusaurus
  ├── CONSUMES (workspace) → @grasdouble/lufa_design-system        (all component exports, style.css)
  ├── CONSUMES (workspace) → @grasdouble/lufa_design-system-themes (10 named theme CSS files)
  ├── CONSUMES (workspace) → @grasdouble/lufa_design-system-tokens (token JS values + validate:token-usage script)
  ├── USES CONFIG (workspace) → @grasdouble/lufa_config_eslint
  ├── USES CONFIG (workspace) → @grasdouble/lufa_config_prettier
  └── USES CONFIG (workspace) → @grasdouble/lufa_config_tsconfig
```

## Quick Reference

### Data Flow: Color Mode

```
Docusaurus navbar toggle
      │  sets
      ▼
<html data-theme="dark|light">
      │  observed by colorModeSync.ts (MutationObserver on attributeFilter: ['data-theme'])
      ▼
<html data-mode="dark|light">        ← design system tokens read this
      │  also synced by
      ▼
LiveDemoSection (via useColorMode)         ← sets data-mode on its own container div
PlaygroundThemeSwitcher (via useColorMode) ← sets data-mode on playground containerRef
```

### Data Flow: Live Code Blocks

```
MDX page with ```tsx live fence
      │
      ▼
@docusaurus/theme-live-codeblock
      │  reads scope from
      ▼
src/theme/ReactLiveScope/index.ts
      │  exports { React, ...React, ...DesignSystem }
      ▼
All components from @grasdouble/lufa_design-system available without imports
```

### Data Flow: Theme Playground

```
User selects theme in PlaygroundThemeSwitcher
      │  applyTheme(name) → containerRef.current.setAttribute('data-theme', name)
      ▼
Theme CSS already loaded globally via custom.css @import
      │
      ▼
CSS custom properties cascade into scoped playground container
      │
      ▼
All design system components re-render with new theme tokens
```

### Component Category → File Mapping

| Sidebar Category | Docs directory      | dsExamples directory          |
| ---------------- | ------------------- | ----------------------------- |
| Foundation       | `docs/foundation/`  | `src/dsExamples/foundation/`  |
| Content          | `docs/content/`     | `src/dsExamples/content/`     |
| Interaction      | `docs/interaction/` | `src/dsExamples/interaction/` |
| Composition      | `docs/composition/` | `src/dsExamples/composition/` |
| Utility          | `docs/utility/`     | `src/dsExamples/utility/`     |

**Components documented (19 total):**

- Foundation: Box, Center, Container, Flex, Grid, Stack, Divider, AspectRatio, Cluster, Bleed
- Content: Badge, Icon, Text
- Interaction: Button, Input, Label
- Composition: Card
- Utility: Portal, VisuallyHidden

### Available Themes (Playground)

| Theme name  | Label     | Icon | Description          |
| ----------- | --------- | ---- | -------------------- |
| `default`   | Default   | 📘   | Clean blue theme     |
| `ocean`     | Ocean     | 🌊   | Marine-inspired      |
| `forest`    | Forest    | 🌲   | Organic natural      |
| `matrix`    | Matrix    | 💾   | Digital cyber        |
| `cyberpunk` | Cyberpunk | 🎆   | Futuristic neon      |
| `sunset`    | Sunset    | 🌅   | Warm elegant         |
| `nordic`    | Nordic    | ❄️   | Minimalist arctic    |
| `volcano`   | Volcano   | 🌋   | Powerful intense     |
| `coffee`    | Coffee    | ☕   | Retro vintage        |
| `volt`      | Volt      | ⚡   | Industrial high-vis  |
| `steampunk` | Steampunk | ⚙️   | Victorian industrial |

### Build Configuration Notes

- **Bundler**: Rspack (enabled via `experimental_faster.rspackBundler: true`)
- **Minification**: Disabled by `plugins/rspack-disable-minimizers.js` (compatibility workaround)
- **CSS cascade layers**: Disabled (`future.v4.useCssCascadeLayers: false`)
- **Broken links**: Build throws on broken links (`onBrokenLinks: 'throw'`)
- **Versioning**: Single `current` version; future versioning planned for v1.0.0 release
- **Playground theme persistence**: `localStorage` key `lufa-playground-theme`

### Lint-staged Hooks

| File pattern                | Actions                    |
| --------------------------- | -------------------------- |
| `*.{js,jsx,ts,tsx,mjs,cjs}` | ESLint fix, Prettier write |
| `*.{ts,tsx}`                | `pnpm typecheck`           |
| `*.{json,md,css,html}`      | Prettier write             |

### Browser Targets

- **Production**: >0.5% usage, not dead, not op_mini all
- **Development**: Last 3 Chrome, last 3 Firefox, last 5 Safari
- **Node.js runtime**: >=20.0

## See Also

| Resource                                      | Location                                                           |
| --------------------------------------------- | ------------------------------------------------------------------ |
| Design System components doc                  | `_bmad-docs/documentation/design-system/lufa_design-system.md`    |
| Design tokens doc                             | `_bmad-docs/documentation/design-system/lufa_design-system-tokens.md` |
| Themes doc                                    | `_bmad-docs/documentation/design-system/lufa_design-system-themes.md` |
| Storybook doc                                 | `_bmad-docs/documentation/design-system/lufa_design-system-storybook.md` |
| Source package                                | `packages/design-system/docusaurus/`                               |
| Live site                                     | https://lufa-ds.grasdouble.com                                     |
| GitHub repository                             | https://github.com/grasdouble/Lufa                                 |
