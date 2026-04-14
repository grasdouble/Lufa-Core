# @grasdouble/lufa_plugin_vscode_lufa-ds-preview

## 0.4.7

### Patch Changes

- d90bfed: chore: update dependencies
- Updated dependencies [d90bfed]
  - @grasdouble/lufa_design-system-tokens@1.2.2

## 0.4.6

### Patch Changes

- 9f95f14: Update Dependency
- Updated dependencies [9f95f14]
  - @grasdouble/lufa_design-system-tokens@1.2.1

## 0.4.5

### Patch Changes

- 3d8eea0: Add TypeScript typecheck step to lint-staged configuration and add `.prettierignore` to exclude `dist/` from Prettier formatting
- Updated dependencies [feab2a5]
- Updated dependencies [d27c912]
- Updated dependencies [3d8eea0]
  - @grasdouble/lufa_design-system-tokens@1.2.0

## 0.4.4

### Patch Changes

- 03e75af: Fix tokens and their usage
- 18d206b: fix(design-system): token usage corrections and component enhancements

  ## Token System Fixes

  ### Correct Token Usage
  - **Text Component**: Use typography font-weight tokens instead of hardcoded values (400, 500, 600, 700)
  - **Button Component**: Use semantic UI radius tokens instead of primitive radius scale
  - **Input Component**: Use component-specific tokens for all properties (padding, font-size, colors, borders)
  - **Label Component**: Use component-specific tokens for font-size, color, spacing, and line-height
  - **Card Component**: Add proper color token for text color

  ### Removed Deprecated Theme File
  - Removed all `--lufa-token-*` custom properties from `theme.css`
  - Theme-specific overrides now properly use the standard token hierarchy (`--lufa-core-*`, `--lufa-semantic-*`, `--lufa-component-*`)
  - Theme file is now intentionally empty with documentation explaining the new approach

  ## Component Enhancements

  ### New Features
  - **Flex Component**: Added `gap="none"` prop for zero gap spacing
  - **Grid Component**: Added `gap="none"`, `gapX="none"`, and `gapY="none"` props for zero gap spacing
  - **Stack Component**: Fixed `spacing="none"` to use 0 instead of tight spacing

  ### CSS Improvements
  - Improved CSS formatting and readability across components
  - Better use of CSS custom properties
  - Consistent multi-line gradient declarations in Divider component

  ## Visual Regression Tests
  - Added comprehensive Playwright visual snapshots for all components in both light and dark modes
  - Snapshots cover: Badge, Box, Button, Card, Center, Container, Divider, Flex, Grid, Icon, Input, Label, Stack, Text

  ## Type Safety
  - Improved TypeScript types with proper interface formatting
  - Better type consistency across hook definitions

  ## Breaking Changes

  None - All changes maintain backward compatibility

  ## Migration

  No action required - Changes are either internal or additive features

- 976a5f8: Fix vscode extension to match changes made recentrly
- Updated dependencies [03e75af]
- Updated dependencies [18d206b]
- Updated dependencies [4f51c98]
- Updated dependencies [976a5f8]
  - @grasdouble/lufa_design-system-tokens@1.1.0

## 0.4.3

### Patch Changes

- Updated dependencies [728be92]
  - @grasdouble/lufa_design-system-tokens@1.0.0

## 0.4.2

### Patch Changes

- 07b892b: Add typecheck scripts and align docs/test fixtures after stricter TypeScript checks.
- Updated dependencies [07b892b]
  - @grasdouble/lufa_design-system-tokens@0.6.1

## 0.4.1

### Patch Changes

- Updated dependencies [3b444f4]
- Updated dependencies [ceeaacc]
- Updated dependencies [058d6d6]
- Updated dependencies [e3380ec]
- Updated dependencies [e3380ec]
  - @grasdouble/lufa_design-system-tokens@0.6.0

## 0.4.0

### Minor Changes

- ea09e6a: ## Summary
  Complete design system rebuild spanning token architecture modernization (Phases 0-4), utilities-based component system (Phase 5A), and CLI tooling (Phase 7A).

  ## Token System (Phases 0-4)

  **DTCG Migration**
  - 440 tokens migrated to Design Tokens Community Group standard with `$extensions.lufa` metadata
  - Added `lufa-` prefix to all CSS variables for namespacing
  - **Breaking**: Removed JS/TS token exports - tokens now CSS-only via variables

  ```css
  /* Before */
  import { spacing } from '@grasdouble/lufa_design-system-tokens';

  /* After */
  .component {
    padding: var(--lufa-spacing-md);
  }
  ```

  **Token Architecture**
  - Phase 1-2: Foundation and semantic layers
  - Phase 3: 78 semantic tokens added
  - Phase 4: Eliminated token collision warnings
  - Added `tokens-metadata.json` for documentation tooling

  ## Component System (Phase 5A)

  **New Utilities Generator**
  - CSS utilities system for consistent component styling
  - Replaces per-component CSS with composable utilities

  **Primitive Components**
  - `Box`: Foundation component with full utilities support
  - `Stack`: Layout component (vertical/horizontal)
  - `Text`: Typography with semantic variants
  - `Icon`: Lucide React integration

  **Display & Form Components**
  - `Badge`: Status indicators with semantic variants
  - `Divider`: Separator with emphasis patterns
  - `Button`: Refactored to two-dimensional architecture (variant × size)

  ## Developer Tools (Phase 7A)

  **CLI Theme Validator**

  ```bash
  pnpm ds:cli validate-theme path/to/theme.css
  ```

  - Format validation (CSS variable syntax)
  - Completeness checking (required tokens present)
  - WCAG contrast validation (AA/AAA)
  - Full Vitest coverage

  ## Documentation & Testing
  - Architecture docs: token architecture, component inventory, development guide
  - Storybook stories for all components with strict pattern compliance
  - Docusaurus API docs with live examples
  - Playwright component tests with visual regression
  - 256 VSCode token snippets

  ## Repository Organization
  - Archived legacy packages (storybook, playwright, docusaurus v1)
  - Consolidated BMAD analysis artifacts
  - Reorganized documentation hierarchy

  ## Breaking Changes
  - Token consumption: CSS variables only, no JS/TS imports
  - Button API: new two-dimensional architecture
  - Package structure: utilities-based approach replaces legacy pattern

  ## Migration

  See `packages/design-system/docusaurus/docs/migration-guide.md`

  ## Stats
  - 174 files added
  - 388 files deleted (legacy archived)
  - 47 files modified

### Patch Changes

- Updated dependencies [445737d]
- Updated dependencies [445737d]
- Updated dependencies [ea09e6a]
- Updated dependencies [445737d]
- Updated dependencies [445737d]
  - @grasdouble/lufa_design-system-tokens@0.5.0

## 0.3.0

### Minor Changes

- fef8ae4: Remove Tailwind CSS and migrate all components to vanilla CSS with design tokens

  BREAKING CHANGE: This package no longer includes Tailwind CSS. All styling now uses vanilla CSS with design token CSS custom properties.

  Migration completed:
  - 30 components migrated from Tailwind @apply to vanilla CSS
  - 570+ @apply directives converted
  - 159 theme() calls converted
  - All styling uses var(--lufa-token-\*) design tokens
  - Zero breaking changes to component APIs
  - Build size reduced, performance improved

  If you were importing Tailwind CSS from this package, you'll need to update your imports to use the new vanilla CSS entry point (style.css), which is automatically handled if you import from the main package export.

## 0.2.0

### Minor Changes

- 8ae7e61: Add support of completion and improve code

### Patch Changes

- Updated dependencies [8ae7e61]
- Updated dependencies [509bb8e]
  - @grasdouble/lufa_design-system-tokens@0.4.0
  - @grasdouble/lufa_design-system-primitives@0.4.0

## 0.1.0

### Minor Changes

- 0194d3d: Create a vscode extension to display value of primitives and tokens + fix usage of primitive and tokens

### Patch Changes

- Updated dependencies [6c972e8]
- Updated dependencies [2d37fc0]
- Updated dependencies [4d0893b]
- Updated dependencies [57df928]
- Updated dependencies [0194d3d]
- Updated dependencies [412c362]
- Updated dependencies [b101244]
  - @grasdouble/lufa_design-system-primitives@0.3.0
  - @grasdouble/lufa_design-system-tokens@0.3.0
