# @grasdouble/lufa_design-system-playwright

## 1.2.2

### Patch Changes

- d90bfed: chore: update dependencies

## 1.2.1

### Patch Changes

- 9f95f14: Update Dependency

## 1.2.0

### Minor Changes

- 3d8eea0: Update component tests to cover new token-based styles and snapshot baselines
  - Updated visual snapshot baselines for all affected components following the token architecture changes: Badge, Button, Text, Box, Bleed, Center, Cluster, Divider, Flex, Grid, Stack, Input, Label
  - Updated spec files for foundation components (Bleed, Box, Center, Cluster, Divider, Flex, Grid, Stack) to reflect new layout token references
  - Updated Button spec to cover new type/variant combinations
  - Updated Text spec for new typography token references
  - Refreshed Linux snapshot baselines (automated)

## 1.1.0

### Minor Changes

- 4f51c98: refactor(design-system): migrate to 5-category structure and eliminate token warnings

  BREAKING CHANGE: Component organization changed from 3-layer to 5-category structure

  ## Component Migration (3-layer → 5-category)

  Migrated 16 components to new semantic categories:
  - **Foundation** (6): Box, Stack, Flex, Grid, Container, Center
  - **Content** (4): Text, Icon, Badge, Divider
  - **Interaction** (3): Button, Input, Label
  - **Composition** (1): Card
  - **Utility** (2): Portal, VisuallyHidden

  **Note**: Public API unchanged - imports from `@grasdouble/lufa_design-system` work as before.

  ## Token System Improvements
  - Created custom `size/rem/fluid` transform for fluid typography
  - Created custom `shadow/css/shorthand-custom` transform
  - Eliminated all 22 transformation warnings (now 0 warnings)
  - Updated style-dictionary config with explicit transform order
  - Fixed value resolution order in CSS and JSON formats

  ## Documentation Updates
  - Updated 17 Storybook story titles to reflect new categories
  - Fixed component count in READMEs (16/16 complete)
  - Updated 15 internal documentation files
  - Replaced deprecated primitives package reference with tokens

  ## Testing Infrastructure
  - Migrated 16 Playwright tests + 28 snapshots
  - Migrated 23 Storybook stories
  - Migrated 16 Docusaurus examples

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

- 4d7849f: feat(design-system): implement ADR-012 Foundation components documentation

  ## New Foundation Components

  Added 3 new foundation layout components with comprehensive documentation, tests, and Storybook stories:
  - **AspectRatio** - Maintains consistent aspect ratios for media and containers (28 tests)
  - **Bleed** - Breaks out of container constraints for full-width content (23 tests)
  - **Cluster** - Wrapping layout for collections with intelligent spacing (67 tests)

  ## Component Reclassification
  - **Divider** moved from Content → Foundation category (maintains backward compatibility)

  ## Documentation
  - Complete MDX documentation for all 3 new components following official template
  - Interactive live demos with LiveDemoSection tabs
  - Updated component overview with 10 Foundation components total

  ## Architecture

  Foundation components now total 10 as per ADR-012:
  1. Box, Stack, Flex, Grid, Container, Center (existing)
  2. Divider (reclassified from Content)
  3. AspectRatio, Cluster, Bleed (new)

  All components include:
  - Full TypeScript support with polymorphic APIs
  - Accessibility compliance (WCAG 2.1 AA)
  - Design token integration
  - Visual regression tests
  - Storybook stories

## 1.0.0

### Major Changes

- 728be92: ### Added

  #### Design Tokens (453 total)
  - **Primitive Tokens (111)**: Foundation tokens including spacing, colors, typography, borders, shadows, and opacity
    - 30+ color primitives with systematic naming
    - 8 spacing values (4px - 64px)
    - 10 font size values (12px - 64px)
    - 6 font weight values (300 - 900)
    - 3 line height values (tight, normal, relaxed)
    - 5 border radius values (2px - 24px + full)
    - 3 border width values (1px - 4px)
    - 6 shadow definitions
    - 10 opacity values (0% - 100%)
  - **Core Tokens (58)**: Intent-based tokens for common UI patterns
    - Text colors (body, subtle, placeholder, disabled, inverse)
    - Background colors (page, canvas, surface, overlay, hover, active)
    - Border colors (default, subtle, strong, focus)
    - State colors (success, error, warning, info - backgrounds and text)
    - Interactive states (hover, active, focus, disabled)
  - **Semantic Tokens (103)**: Context-aware tokens for specific use cases
    - Action colors (primary, secondary, tertiary + states)
    - Feedback colors (success, error, warning, info + variants)
    - Content colors (headings, body, secondary, disabled, inverse)
    - Surface colors (page, canvas, panel, elevated)
    - Interactive colors (interactive-primary, interactive-secondary, link + states)
    - Border styles (default, subtle, strong, error, success, warning, info)
  - **Component Tokens (181)**: Component-specific design decisions
    - Button tokens (solid, outline, ghost variants × 7 semantic colors)
    - Badge tokens (5 variants × 3 sizes)
    - Divider tokens (3 emphasis levels, 2 line styles, 5 spacings)
    - Text tokens (11 variants + sizes)
    - Stack tokens (5 gap sizes + 4 alignment options)
    - Icon tokens (5 sizes + 3 color variants)
    - Input tokens (default, error, focus, disabled states)

  #### React Components (7 total)
  - **Box**: Foundational layout primitive with 119 utility classes
    - Padding/margin props (all, X, Y, top, right, bottom, left)
    - Background colors (15 variants)
    - Border props (radius, width, color)
    - Display props (block, inline-block, flex, inline-flex, grid, none)
    - Polymorphic rendering (div, section, article, header, footer, main, nav, aside)
  - **Stack**: Vertical/horizontal layout with intelligent spacing
    - Gap props (5 sizes: tight to spacious)
    - Alignment props (start, center, end, stretch)
    - Direction props (vertical, horizontal)
    - 22 utility classes
  - **Text**: Typography component with semantic variants
    - 11 variants (display-lg/md/sm, heading-h1/h2/h3/h4, body-lg/md/sm, label)
    - Color props (body, subtle, disabled, inverse, error, success, warning, info)
    - Weight props (normal, medium, semibold, bold)
    - Polymorphic rendering (p, span, h1-h6, label, div)
    - 31 utility classes
  - **Icon**: SVG icon system with 30+ icons
    - 5 sizes (xs: 12px, sm: 16px, md: 20px, lg: 24px, xl: 32px)
    - 3 color variants (current, primary, subtle)
    - Icons: user, settings, home, menu, search, check, x, plus, minus, chevron-_, arrow-_, info, alert-\*, calendar, mail, phone, external-link, download, upload
    - 13 utility classes
  - **Button**: Interactive button with multiple variants
    - 3 types (solid, outline, ghost)
    - 7 semantic variants (primary, secondary, success, danger, warning, info, neutral)
    - 3 sizes (sm, md, lg)
    - 5 radius options (none, sm, base, md, full)
    - States (default, hover, active, focus, disabled, loading)
    - Icon support (iconLeft, iconRight, icon-only)
    - Polymorphic rendering (button, a)
    - 21 utility classes
  - **Badge**: Status indicator with semantic colors
    - 5 variants (default, success, error, warning, info)
    - 3 sizes (sm, md, lg)
    - Dot indicator support
    - Polymorphic rendering (span, div, label)
    - 8 utility classes
  - **Divider**: Horizontal/vertical separator
    - 2 orientations (horizontal, vertical)
    - 3 emphasis levels (subtle, default, bold)
    - 2 line styles (solid, dashed)
    - 5 spacing variants (compact to spacious)
    - Polymorphic rendering (hr, div)
    - 12 utility classes

  #### Testing Infrastructure (657 tests)
  - **Playwright Component Tests**: 599 tests with 100% pass rate
    - Badge: 40 tests (variants, sizes, dot indicator, accessibility, visual regression)
    - Button: 108 tests (types, variants, sizes, states, interactions, accessibility, visual regression)
    - Box: 240+ tests (padding, margin, background, border, display, polymorphism, accessibility)
    - Stack: 45 tests (direction, gap, alignment, wrapping)
    - Text: 95+ tests (variants, colors, weights, polymorphism, accessibility)
    - Icon: 50+ tests (sizes, colors, variants, accessibility, visual regression)
    - Divider: 25 tests (orientations, emphasis, styles, spacing)
    - Visual regression tests in light + dark mode
  - **Accessibility Testing**: axe-core integration
    - WCAG 2.1 AA compliance checks
    - Color contrast validation
    - Semantic HTML verification
    - Keyboard navigation testing

  #### CLI Validation Tool
  - **Component Validation**: Detects hard-coded values, validates props
  - **Token Validation**: Ensures token consistency and DTCG compliance
  - **Performance Budgets**: Monitors bundle size, build time, CSS cascade
  - **WCAG Checks**: Color contrast analysis, accessibility validation
  - **Token Usage Reporting**: Tracks token adoption across components

  #### CI/CD Integration
  - **Component Validation Workflow**: Runs on every PR
    - Code quality checks
    - 657 tests execution
    - ESLint compliance
    - TypeScript type checking
    - Prettier formatting
    - Detailed PR comments with results
  - **Visual Regression Workflow**: Chromium-based screenshot comparison
    - 657 visual tests in light + dark mode
    - Diff image generation
    - Artifact uploads (screenshots, diffs, reports)
    - PR review instructions
  - **Performance Budgets Workflow**: Performance monitoring
    - Bundle size (<200KB target, 145KB actual)
    - Gzipped size (<50KB target, 43KB actual)
    - Build time (<30s target, 18s actual)
    - Test time (<120s target, 95s actual)
    - CSS cascade (<20ms warning, 8ms actual)

  #### Documentation
  - **Architecture Documentation**: Complete system design docs
    - 4-level token architecture explanation
    - Component composition patterns
    - CSS cascade optimization strategy
    - Theme system architecture
  - **Component Documentation**: Comprehensive API docs for all 7 components
    - Props tables with types and descriptions
    - Usage examples
    - Best practices
    - Accessibility guidelines
  - **Storybook Stories**: 54+ interactive stories
    - Component examples
    - Token catalog
    - Theme comparison
    - Usage demonstrations
  - **API Documentation**: Docusaurus-powered docs
    - TypeScript API reference
    - Token documentation
    - Component inventory
    - Migration guides (prepared for future versions)

  #### Themes
  - **9 Pre-built Themes**: Production-ready color schemes
    - Ocean (default)
    - Forest
    - Matrix
    - Cyberpunk
    - Sunset
    - Nordic
    - Volcano
    - Coffee
    - Volt
  - **Dark Mode Support**: All themes work in light + dark mode
  - **Theme Switching**: Runtime theme changes without page reload

  #### Build & Tooling
  - **Vite Build**: Fast, optimized production builds
    - ESM + CJS outputs
    - TypeScript declarations
    - CSS Modules
    - Tree-shaking support
  - **Style Dictionary**: Token transformation pipeline
    - DTCG format compliance
    - Multiple output formats (CSS, JSON)
    - Token validation
    - Size checking
  - **Monorepo Structure**: Organized package architecture
    - `@grasdouble/lufa_design-system`: Main component library
    - `@grasdouble/lufa_design-system-tokens`: Design tokens package
    - `@grasdouble/lufa_design-system-cli`: CLI validation tool
    - `@grasdouble/lufa_design-system-themes`: Theme configurations
    - `@grasdouble/lufa_design-system-storybook`: Interactive documentation
    - `@grasdouble/lufa_design-system-docusaurus`: API documentation
    - `@grasdouble/lufa_design-system-playwright`: Testing infrastructure

  ### Performance Metrics
  - **Bundle Size**: 145KB uncompressed, 43KB gzipped
  - **Build Time**: 18 seconds (all packages)
  - **Test Time**: 95 seconds (599 tests)
  - **CSS Cascade**: 8ms average (excellent performance)
  - **Token Count**: 453 tokens across 4 levels
  - **Component Count**: 7 production-ready components
  - **Test Coverage**: 599 comprehensive tests
  - **Visual Regression**: 657 screenshot comparisons

  ### Developer Experience
  - **TypeScript Support**: Full type safety with exported types
  - **Polymorphic Components**: Type-safe "as" prop for all components
  - **Utility-First CSS**: Generated CSS Modules for optimal performance
  - **Token Autocomplete**: IDE support for all token values
  - **Comprehensive Testing**: High confidence in component behavior
  - **Documentation**: 20,000+ lines of docs and examples
  - **Storybook**: Interactive component playground
  - **CLI Tools**: Automated validation and quality checks

  ### Technical Highlights
  - **4-Level Token Architecture**: Primitive → Core → Semantic → Component
  - **CSS Cascade Optimization**: 8ms cascade time (target: <16ms)
  - **DTCG Compliance**: W3C Design Tokens Community Group format
  - **Accessibility First**: WCAG 2.1 AA compliant
  - **Dark Mode Native**: All components support dark mode
  - **Zero Runtime**: CSS Modules compiled at build time
  - **Tree-Shakeable**: Import only what you need
  - **Framework Agnostic**: React implementation with portable tokens

  ### Project Timeline
  - **Phase 0**: Actions Critiques (foundation planning)
  - **Phase 1**: Primitive Tokens (111 tokens)
  - **Phase 2**: Core Tokens (58 tokens)
  - **Phase 3**: Semantic Tokens (103 tokens)
  - **Phase 4**: Component Tokens (181 tokens)
  - **Phase 5P**: Preparation (6 on-X tokens)
  - **Phase 5A**: React Components (7 components)
  - **Phase 7a**: CLI Validation Tool
  - **Phase 7b**: Storybook TokensCatalog
  - **Phase 7c**: CI/CD Integration
  - **Phase 8**: Production Release (current)

  ### Breaking Changes

  None - this is the first production release.

  ### Deprecations

  None - this is the first production release.

  ### Known Issues
  - Minor visual regression differences (< 0.01%) in some tests due to font rendering variations
  - Storybook bundle size warnings (>500KB) for documentation assets - does not affect production bundle

  ### Migration Guide

  This is the first production release. No migration required.

  ### Installation

  ```bash
  # Using pnpm (recommended)
  pnpm add @grasdouble/lufa_design-system @grasdouble/lufa_design-system-tokens @grasdouble/lufa_design-system-themes

  # Using npm
  npm install @grasdouble/lufa_design-system @grasdouble/lufa_design-system-tokens @grasdouble/lufa_design-system-themes

  # Using yarn
  yarn add @grasdouble/lufa_design-system @grasdouble/lufa_design-system-tokens @grasdouble/lufa_design-system-themes
  ```

  ### Usage Example

  ```tsx
  import { Badge, Button, Stack, Text } from '@grasdouble/lufa_design-system';

  import '@grasdouble/lufa_design-system-themes/dist/ocean.css';

  function App() {
    return (
      <Stack gap="comfortable" align="center">
        <Text variant="heading-h2">Welcome to Lufa Design System</Text>
        <Stack direction="horizontal" gap="compact">
          <Button variant="primary" size="md">
            Get Started
          </Button>
          <Button variant="secondary" size="md" type="outline">
            Learn More
          </Button>
        </Stack>
        <Badge variant="success">v0.11.0</Badge>
      </Stack>
    );
  }
  ```

## 0.2.1

### Patch Changes

- 07b892b: Add typecheck scripts and align docs/test fixtures after stricter TypeScript checks.

## 0.2.0

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

- 445737d: # Dependency Updates & Documentation Improvements

  ## CLI Package

  ### Documentation Enhancements
  - **README.md expanded** (+370 lines)
    - Comprehensive validation checks explanation (completeness, contrast, format)
    - Multi-mode theme validation examples (light, dark, high-contrast)
    - CI/CD integration guides (GitHub Actions, pre-commit hooks, NPM scripts)
    - CLI options reference with examples
    - Token role metadata documentation
    - Customization patterns and best practices
  - **Theme template enhanced** (`src/templates/theme-template.css`)
    - Added 3 customization patterns with code examples
    - Added 5 best practices for theme development
    - Added 3 practical examples (brand colors, warm palette, high-contrast)
    - Improved inline documentation for developers

  ### Dependency Updates
  - `chalk`: 5.4.1 → 5.6.2 (terminal color output)
  - `postcss`: 8.5.1 → 8.5.6 (CSS parsing)
  - `@types/node`: 25.0.9 → 25.0.10
  - `@vitest/coverage-v8`: 4.0.17 → 4.0.18
  - `vitest`: 4.0.17 → 4.0.18 (test framework)
  - `prettier`: 3.8.0 → 3.8.1

  ## Playwright Package

  ### Token Reference Updates
  - Updated Box component spec to use new semantic overlay token:
    - `--lufa-token-color-background-overlay` → `--lufa-semantic-ui-overlay-backdrop`
    - Aligns with Phase 2A semantic token architecture
    - Maintains test compatibility

  ### Dependency Updates
  - `@playwright/experimental-ct-react`: 1.57.0 → 1.58.0 (Playwright component testing)
  - `@types/node`: 25.0.9 → 25.0.10
  - `@types/react`: 19.2.8 → 19.2.9
  - `eslint`: 9.22.0 → 9.39.2

  ## Themes Package

  ### Theme Placeholder Documentation
  - **Forest theme** (`src/forest.css`)
    - Enhanced documentation for Phase 6 implementation
    - Added usage example with data attributes
    - Added example token overrides structure (brand colors)
    - Clarified implementation roadmap
  - **Ocean theme** (`src/ocean.css`)
    - Enhanced documentation for Phase 6 implementation
    - Added usage example with data attributes
    - Added example token overrides structure (brand colors)
    - Clarified implementation roadmap

  ### Dependency Updates
  - `@types/node`: 25.0.9 → 25.0.10
  - `prettier`: 3.8.0 → 3.8.1

  ## Impact

  **CLI**: Significantly improved developer experience with comprehensive documentation and examples
  **Playwright**: Maintained test suite compatibility with Phase 2A token architecture
  **Themes**: Clearer Phase 6 implementation guidance for theme developers

  **Breaking Changes**: None

## 0.1.1

### Patch Changes

- fb79222: Replace TypeScript token imports with CSS custom properties in component stories

  This change refactors 21 component story files to use CSS custom properties (CSS variables) instead of TypeScript token imports. This makes the Storybook more flexible and reduces build-time dependencies on the tokens package.

  **Files updated:**
  - Layout stories (10 files): AspectRatio, Center, Container, Divider, Flex, Grid, Layout, Placeholder, Space, Stack
  - Display stories (6 files): Avatar, AvatarGroup, Badge, Card, Kbd, Paper
  - Feedback stories (1 file): Alert
  - Forms stories (2 files): Button, Input
  - Navigation stories (2 files): Breadcrumb, Steps

  **Changes:**
  - Removed `import tokens from '@grasdouble/lufa_design-system-tokens'` from all story files
  - Replaced all token references (e.g., `tokens.color.text.primary`) with CSS custom properties (e.g., `'var(--lufa-token-color-text-primary)'`)
  - Maintained identical visual appearance and functionality

  **Benefits:**
  - Enables runtime theme switching through CSS custom properties
  - Reduces TypeScript compilation overhead in Storybook
  - Makes stories more aligned with modern CSS practices
  - Simplifies build dependencies

## 0.1.0

### Minor Changes

- fef8ae4: Add CI/CD integration and cross-browser testing for Playwright component tests

  Infrastructure improvements:
  - Add GitHub Actions workflow for automated testing on PRs and main branch
  - Enable cross-browser testing: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
  - Add root-level test scripts: `pnpm ds:test`, `pnpm ds:test:ui`, `pnpm all:test`
  - Generate 166 visual regression snapshots across all browsers
  - Fix Pagination keyboard navigation test for WebKit/mobile browsers
  - Update AGENTS.md with comprehensive testing documentation
  - CI runs Chromium tests only for optimal build speed

  Test results:
  - 3222 passing tests (645 tests × 5 browsers)
  - 8 skipped tests (browser-specific limitations)
  - 0 failed tests
  - Test execution time: ~1.5 minutes for all browsers

## 0.0.1

### Patch Changes

- 603f643: Init playwright package
