# @grasdouble/lufa_design-system

## 2.1.3

### Patch Changes

- 7c889d3: Upgrade deps
- 5192d9e: fix: upgrade deps
- 50d07a6: fix: upgrade deps
- e9b1f1f: Update deps
- Updated dependencies [7c889d3]
- Updated dependencies [5192d9e]
- Updated dependencies [50d07a6]
- Updated dependencies [e9b1f1f]
  - @grasdouble/lufa_design-system-tokens@1.2.3

## 2.1.2

### Patch Changes

- d90bfed: chore: update dependencies
- Updated dependencies [d90bfed]
  - @grasdouble/lufa_design-system-tokens@1.2.2

## 2.1.1

### Patch Changes

- 9f95f14: Update Dependency
- Updated dependencies [9f95f14]
  - @grasdouble/lufa_design-system-tokens@1.2.1

## 2.1.0

### Minor Changes

- 3d8eea0: Add Label and Input utility configs, update Button and Badge tokens, improve component styling

  **New components:**
  - **Label** - New `label.utilities.config.cjs` and `Label.module.css` with token-based styling
  - **Input** - New `input.utilities.config.cjs` with block/inline padding token support

  **Updated components:**
  - **Button** - Restructured CSS and utilities config to use new `type-solid`/`type-ghost`/`type-outline` token naming convention; added full variant coverage (primary, secondary, destructive, success, warning, info, neutral) with explicit `active` states
  - **Badge** - Updated to use new `compact/default/large` padding tokens with block/inline axis
  - **Box** - Minor CSS updates following token renaming
  - **Center, Container, Flex, Grid** - CSS updated to use new token references

### Patch Changes

- feab2a5: improve component tokens
- Updated dependencies [feab2a5]
- Updated dependencies [d27c912]
- Updated dependencies [3d8eea0]
  - @grasdouble/lufa_design-system-tokens@1.2.0

## 2.0.0

### Major Changes

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

### Minor Changes

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

- Updated dependencies [03e75af]
- Updated dependencies [18d206b]
- Updated dependencies [4f51c98]
- Updated dependencies [976a5f8]
  - @grasdouble/lufa_design-system-tokens@1.1.0

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

### Patch Changes

- Updated dependencies [728be92]
  - @grasdouble/lufa_design-system-tokens@1.0.0

## 0.10.1

### Patch Changes

- c13bb5e: Improve quality
- Updated dependencies [c13bb5e]
  - @grasdouble/lufa_design-system-tokens@0.6.2

## 0.10.0

### Minor Changes

- 07b892b: Add layout primitives (Center, Container, Flex, Grid, Portal, VisuallyHidden) and align supporting docs and tests.

### Patch Changes

- Updated dependencies [07b892b]
  - @grasdouble/lufa_design-system-tokens@0.6.1

## 0.9.0

### Minor Changes

- ceeaacc: feat(tokens): complete ADR-004 alpha opacity rollout
  - add black/white alpha 5/12/15 tokens and migrate shadow references
  - align theme shadow variables and button disabled opacity to semantic tokens
  - add alpha token usage documentation and Storybook showcase

### Patch Changes

- e3380ec: fix(components): implement type-safe polymorphic ref forwarding

  Fix TypeScript errors in 6 polymorphic components using proper type-safe patterns instead of `any`.

  **Problem:**
  - 9 TypeScript errors: `Type 'Ref<Element>' not assignable to specific element refs`
  - Polymorphic components (Box, Button, Icon, Stack, Text, Divider) had incorrect ref typing
  - Need proper pattern that maintains type safety and autocompletion

  **Solution:**
  Implement architect-approved pattern using `React.ComponentRef<T>`:
  1. **Component implementation:**
     - Use `ForwardedRef<Element>` parameter (generic Element type)
     - Cast ref as `React.Ref<never>` when passing to dynamic component
     - Minimal internal casting only where necessary
  2. **Component export:**
     - Use `React.ComponentRef<T>` to extract correct ref type for each element
     - Type-safe public API: `ref?: React.Ref<React.ComponentRef<T>>`
     - Maintains full IDE autocompletion and type checking

  **Components Fixed:**
  - **Box**: `HTMLDivElement` (default) | custom element via `as` prop
  - **Button**: `HTMLButtonElement` (default) | `HTMLAnchorElement` (as="a")
  - **Icon**: `HTMLSpanElement` (default) | custom element
  - **Stack**: `HTMLDivElement` (default) | custom element
  - **Text**: `HTMLParagraphElement` (default) | heading/span elements
  - **Divider**: `HTMLHRElement` (default) | `HTMLDivElement` (as="div")

  **Benefits:**
  - ✅ Zero `any` in public API - fully type-safe
  - ✅ `ComponentRef<T>` extracts correct ref types automatically
  - ✅ Full IDE autocompletion preserved
  - ✅ Compile-time validation catches type mismatches
  - ✅ Type-safe for all component consumers

  **Type Tests:**
  - Add `__type-tests__/polymorphic-refs.test.tsx`
  - Validates ref types for all 6 components
  - Documents expected usage patterns
  - Ensures type inference works correctly

  **Verification:**
  - TypeScript: 0 errors (was 9 errors) ✅
  - Build: successful ✅
  - Bundle: 44.42 kB (stable, no regression) ✅

  **Impact:**
  - Files changed: 7 (+241, -60 lines)
  - No runtime changes - pure TypeScript type improvements
  - No breaking changes for consumers
  - Improved developer experience with better type safety

  **Architect Review:** Winston (approved type-safe polymorphic pattern)

- 058d6d6: # Icon Size Token Alignment & Story Token Compliance

  ## Design System Tokens (@grasdouble/lufa_design-system-tokens)

  **Icon Size Token Alignment**: Updated `component.shared.icon.size-*` tokens to align with Icon component implementation and added missing `xl` size.

  ### What Changed

  | Token                           | Previous Value | New Value   |
  | ------------------------------- | -------------- | ----------- |
  | `component.shared.icon.size-xs` | 12px           | 16px        |
  | `component.shared.icon.size-sm` | 16px           | 20px        |
  | `component.shared.icon.size-md` | 20px           | 24px        |
  | `component.shared.icon.size-lg` | 24px           | 32px        |
  | `component.shared.icon.size-xl` | _(none)_       | 40px ✨ NEW |

  ### Impact

  No breaking changes to component APIs. The Icon component was already using these values (16/20/24/32/40px), so this update aligns the tokens with actual implementation. Visual appearance remains unchanged.

  ### CSS Variables Updated

  ```css
  --lufa-component-shared-icon-size-xs: 16px; /* was 12px */
  --lufa-component-shared-icon-size-sm: 20px; /* was 16px */
  --lufa-component-shared-icon-size-md: 24px; /* was 20px */
  --lufa-component-shared-icon-size-lg: 32px; /* was 24px */
  --lufa-component-shared-icon-size-xl: 40px; /* NEW */
  ```

  ## Design System Main (@grasdouble/lufa_design-system)

  **Icon Component Token Integration**: Icon component now uses design token CSS variables instead of hardcoded pixel values.

  ### What Changed
  - Updated `icon.utilities.config.cjs` to reference `--lufa-component-shared-icon-size-*` tokens
  - Regenerated `Icon.module.css` with token-based classes
  - No visual changes - maintains existing size values (16/20/24/32/40px)

  ### Benefits
  - Icon sizes now centrally managed through design tokens
  - Easier to maintain and scale
  - Consistent with other component configurations

  ### Affected Components
  - Icon component configuration now uses CSS variable references
  - Generated `Icon.module.css` uses token-based classes

  ## Storybook (@grasdouble/lufa_design-system-storybook)

  **Story Token Compliance**: All Storybook stories now use design tokens exclusively.

  ### What Changed
  - Replaced 130+ hardcoded color values with `STORY_COLORS` constants across all stories
  - Updated stories: Typography, Colors, TokenUsage, Box, Text, Stack, Divider, Icon, Badge, Button
  - All colors now properly adapt to theme changes (light/dark/high-contrast)

  ### Impact
  - Stories now demonstrate proper token usage patterns
  - Improved theme switching experience
  - Better consistency across documentation

- 3b444f4: # Storybook Theme Adaptation & Color API Improvements

  Comprehensive fixes for Storybook theme switching, deprecated token migration, and STORY_COLORS API refactoring.

  ## Storybook (@grasdouble/lufa_design-system-storybook)

  ### Theme Infrastructure Fixes
  - **Deprecated Token Migration**: Replaced 50+ deprecated `--lufa-token-color-*` tokens with current semantic UI tokens across 6 files
    - `.storybook/preview.tsx` - Theme wrapper
    - Helper components: `PlaygroundContainer`, `PropCard`, `MarginVisualizer`, `PaddingVisualizer`
    - `style.css` - Form overrides

  ### Story Fixes
  - **Hardcoded Colors**: Replaced 126 hardcoded color values with theme-aware CSS variables
    - 26 `background: 'white'` instances → `var(--lufa-semantic-ui-background-surface)`
    - 111 hardcoded colors in Typography stories
    - 15 color references in Typography tips/code snippets
  - **Missing STORY_COLORS Properties**: Added missing color properties referenced in stories
    - `STORY_COLORS.neutral.text` (80+ usages)
    - `STORY_COLORS.neutral.bgGray` (2 usages)
    - `STORY_COLORS.primary.red` (4 usages in Icon delete button examples)
  - **Type Safety**: Fixed PropPadding story color type error
    - Updated to use `.main` property: `STORY_COLORS.primary.cyan.main`
    - Added type guards in visualizer components

  ### STORY_COLORS API Refactoring
  - **New `STORY_COLORS.themed.*` API**: Added dedicated section for theme-aware colors
    - `text.*` - Primary, secondary, tertiary, success, inverse text colors
    - `background.*` - Page, surface, semantic (success/error/warning/info) colors
    - `border.*` - Default and subtle border colors
    - `shadow.*` - Small and medium shadow tokens
    - `overlay.*` - Backdrop overlay token
  - **Complete Migration**: Replaced 164 direct CSS variable calls with `STORY_COLORS.themed.*` across all stories
    - Typography: 128 replacements
    - Icon: 18 replacements
    - Text: 8 replacements
    - Divider: 5 replacements
    - Stack: 3 replacements
    - Box: 3 replacements
    - Colors: 1 replacement

  ### Linting & Type Fixes
  - Fixed TypeScript unsafe argument type in ThemeSwitcher
  - Removed redundant type union in PaddingVisualizer
  - Cleaned up unused imports across 4 story files

  ## Design System Main (@grasdouble/lufa_design-system)

  ### Box Component Border Utility Fix
  - **borderWidth Utility**: Fixed invisible borders by setting both `border-width` and `border-style`
    - Previous: Only set `border-width` (borders defaulted to `none`)
    - Now: Sets both properties together (e.g., `['1px', 'solid']`)
    - Regenerated `Box.module.css` with 119 updated utility classes

  ## Impact

  ✅ Theme switching (Light/Dark/High-Contrast) now works properly across all stories
  ✅ All story content is readable and properly contrasted in all themes
  ✅ Box component borders display correctly with `borderWidth` prop
  ✅ Type-safe color API with clear semantic distinction (164 CSS variables → STORY_COLORS.themed)
  ✅ Consistent API usage across entire Storybook codebase
  ✅ Zero linting errors or warnings

  ## Files Modified (18 files)
  - `.storybook/preview.tsx`
  - `src/components/helpers/*.tsx` (4 files)
  - `src/stories/primitives/*.stories.tsx` (7 files)
  - `src/stories/tokens/Typography.stories.tsx`
  - `src/constants/storyColors.ts`
  - `packages/design-system/main/src/components/Box/box.utilities.config.cjs`
  - `packages/design-system/main/src/components/Box/Box.module.css` (generated)

- Updated dependencies [3b444f4]
- Updated dependencies [ceeaacc]
- Updated dependencies [058d6d6]
- Updated dependencies [e3380ec]
- Updated dependencies [e3380ec]
  - @grasdouble/lufa_design-system-tokens@0.6.0

## 0.8.0

### Minor Changes

- 445737d: # Phase 2A: Theme System Integration

  Implement proper separation between accessibility modes and brand themes following BMad architecture decisions.

  ## Breaking Changes

  ### Token CSS Selectors

  **BREAKING:** Token CSS now uses `[data-mode]` instead of `[data-theme]` for accessibility modes.

  **Before:**

  ```css
  [data-mode='dark'] {
    /* dark mode styles */
  }
  [data-mode='high-contrast'] {
    /* high-contrast styles */
  }
  ```

  **After:**

  ```css
  [data-mode='dark'] {
    /* dark mode styles */
  }
  [data-mode='high-contrast'] {
    /* high-contrast styles */
  }
  ```

  **Migration:** Update your HTML attributes from `data-theme` to `data-mode` for light/dark/high-contrast modes.

  ## Features

  ### @grasdouble/lufa_design-system
  - **New Hook:** `useThemeMode` for managing accessibility modes
    - Supports 3 modes: light, dark, high-contrast
    - System preference detection (`prefers-color-scheme`, `prefers-contrast`)
    - localStorage persistence
    - SSR-safe

  ```typescript
  import { useThemeMode } from '@grasdouble/lufa_design-system';

  function App() {
    const { mode, setMode, systemPreference } = useThemeMode();

    return (
      <button onClick={() => setMode('dark')}>
        Switch to Dark Mode
      </button>
    );
  }
  ```

  ### @grasdouble/lufa_design-system-tokens
  - Updated CSS selectors: `[data-theme]` → `[data-mode]`
  - Support for 3 accessibility modes: light, dark, high-contrast
  - 31 mode-aware tokens with proper overrides

  ### @grasdouble/lufa_design-system-storybook
  - Updated ThemeSwitcher component to use `useThemeMode`
  - Added high-contrast mode to toolbar
  - Improved mode selector UI

  ### @grasdouble/lufa_design-system-themes
  - Added Phase 6 placeholders for ocean/forest themes
  - Documented `data-theme` attribute usage
  - Prepared architecture for brand theme variants

  ## Architecture Decisions
  - **ADR-001:** Modes vs Themes Separation - Separate accessibility from branding
  - **ADR-002:** HTML Attributes Naming - Use `data-mode` + `data-theme`

  ## Documentation

  Full BMad Method documentation available in `_bmad-output/subjects/theme-integration/`:
  - Analysis report (26 pages)
  - Technical specification (1,835 lines)
  - Implementation report (2,800+ lines)
  - 2 Architecture Decision Records

  ## Migration Guide

  ### Updating HTML Attributes

  ```html
  <!-- Before -->
  <html data-theme="dark">
    <!-- After -->
    <html data-mode="dark"></html>
  </html>
  ```

  ### Using the New Hook

  If you were using `useTheme` for mode management:

  ```typescript
  // Before
  const { mode, setMode } = useTheme();

  // After
  const { mode, setMode } = useThemeMode();
  ```

  ### CSS Selectors

  If you have custom CSS using the old selectors:

  ```css
  /* Before */
  [data-mode='dark'] {
    /* ... */
  }

  /* After */
  [data-mode='dark'] {
    /* ... */
  }
  ```

  ## Future Work (Phase 6)
  - Implement ocean/forest brand themes
  - Re-enable theme selector in Storybook
  - Support all 9 combinations (3 modes × 3 themes)

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

- 445737d: # Spacing & Layout Tokens - Responsive Foundation System

  This release introduces a comprehensive spacing and layout token system with responsive breakpoints, height tokens, grid system, and automatic media query support.

  ## ⚠️ Breaking Changes

  ### 1. Box Component Padding/Margin "none" Bug Fix

  **FIXED:** `padding="none"` and `margin="none"` now correctly apply `0px` instead of the buggy `4px`.

  **Impact:** Components using `padding="none"` or `margin="none"` will change from 4px to 0px.

  **Migration Required:**

  If you need 4px spacing explicitly, use `padding="tight"` instead:

  ```diff
  # Components that need zero spacing (correct behavior)
  - <Box padding="none">  {/* Was incorrectly 4px */}
  + <Box padding="none">  {/* Now correctly 0px */}

  # Components that actually need 4px
  - <Box padding="none">  {/* Was incorrectly 4px */}
  + <Box padding="tight"> {/* Explicitly 4px */}
  ```

  **Root Cause:** `spacing-none` token was incorrectly defined as `4px`. Now fixed to `0px`.

  **Files Changed:**
  - `packages/design-system/main/src/components/Box/box.utilities.config.cjs`
  - CSS utilities regenerated (119 classes updated)

  ***

  ### 2. Storybook Breakpoint Change

  **CHANGED:** Storybook "small" viewport changed from `576px` to `640px` to align with new `breakpoint.sm` token.

  **Impact:** Storybook viewport presets only (no production code impact).

  **Action Required:** Review stories that explicitly target the "small" viewport.

  ***

  ## ✨ Features

  ### Breakpoint Tokens (6 new primitive tokens)

  Mobile-first, Tailwind-aligned breakpoint system:
  - `primitive.breakpoint.xs` - 320px (small mobile)
  - `primitive.breakpoint.sm` - 640px (large mobile)
  - `primitive.breakpoint.md` - 768px (tablet)
  - `primitive.breakpoint.lg` - 1024px (desktop)
  - `primitive.breakpoint.xl` - 1280px (large desktop)
  - `primitive.breakpoint.2xl` - 1536px (extra large)

  **Usage:**

  ```css
  /* CSS custom properties available */
  @media (min-width: 640px) {
    /* breakpoint.sm */
    .container {
      padding: var(--lufa-core-layout-page-padding);
    }
  }
  ```

  ***

  ### Height Tokens (8 new primitive tokens)

  Standardized heights for buttons, inputs, headers, and UI elements:
  - `primitive.height.24` - 24px (small chips, badges)
  - `primitive.height.32` - 32px (small buttons, inputs)
  - `primitive.height.40` - 40px (default buttons, inputs)
  - `primitive.height.48` - 48px (large buttons, headers)
  - `primitive.height.56` - 56px (hero buttons, mobile headers)
  - `primitive.height.64` - 64px (extra large buttons, desktop headers)
  - `primitive.height.80` - 80px (marketing sections)
  - `primitive.height.96` - 96px (hero sections)

  **Button Component Integration:**

  ```json
  {
    "component.button.height.sm": "{primitive.height.32}",
    "component.button.height.md": "{primitive.height.40}",
    "component.button.height.lg": "{primitive.height.48}"
  }
  ```

  ***

  ### Responsive Layout Tokens (18 new core tokens)

  Tokens that automatically adapt to viewport size via media queries:

  #### Page Padding (responsive)
  - `core.layout.page-padding.base` - 16px (mobile)
  - `core.layout.page-padding.md` - 24px (tablet, ≥768px)
  - `core.layout.page-padding.lg` - 32px (desktop, ≥1024px)

  #### Section Gap (responsive)
  - `core.layout.section-gap.base` - 48px (mobile)
  - `core.layout.section-gap.md` - 64px (tablet, ≥768px)
  - `core.layout.section-gap.lg` - 80px (desktop, ≥1024px)

  #### Container Gutter (responsive)
  - `core.layout.container-gutter.base` - 16px (mobile)
  - `core.layout.container-gutter.md` - 24px (tablet, ≥768px)
  - `core.layout.container-gutter.lg` - 32px (desktop, ≥1024px)

  #### Grid Gap (responsive)
  - `core.layout.grid-gap.base` - 16px (mobile)
  - `core.layout.grid-gap.md` - 24px (tablet, ≥768px)
  - `core.layout.grid-gap.lg` - 32px (desktop, ≥1024px)

  #### Header Height (responsive)
  - `core.layout.header-height.base` - 56px (mobile)
  - `core.layout.header-height.md` - 64px (tablet, ≥768px)
  - `core.layout.header-height.lg` - 64px (desktop, ≥1024px)

  #### Modal Padding (responsive)
  - `core.layout.modal-padding.base` - 24px (mobile)
  - `core.layout.modal-padding.md` - 32px (tablet, ≥768px)
  - `core.layout.modal-padding.lg` - 40px (desktop, ≥1024px)

  **Automatic Media Query Generation:**

  ```css
  /* Generated CSS output (mobile-first) */
  :root {
    --lufa-core-layout-page-padding: 16px; /* base (mobile) */
  }

  @media (min-width: 768px) {
    :root {
      --lufa-core-layout-page-padding: 24px; /* tablet */
    }
  }

  @media (min-width: 1024px) {
    :root {
      --lufa-core-layout-page-padding: 32px; /* desktop */
    }
  }
  ```

  ***

  ### Grid System Tokens (6 new core tokens)

  12-column grid system with semantic gap variants:
  - `core.layout.grid.columns` - 12 columns
  - `core.layout.grid.gap.tight` - 8px
  - `core.layout.grid.gap.default` - 16px
  - `core.layout.grid.gap.comfortable` - 24px
  - `core.layout.grid.gap.spacious` - 32px
  - `core.layout.grid.min-column-width` - 280px

  **Usage:**

  ```css
  .grid-container {
    display: grid;
    grid-template-columns: repeat(var(--lufa-core-layout-grid-columns), 1fr);
    gap: var(--lufa-core-layout-grid-gap-default);
  }
  ```

  ***

  ### Container Tokens (5 new core tokens)

  Max-width containers aligned with breakpoints:
  - `core.layout.container.sm` - 640px
  - `core.layout.container.md` - 768px
  - `core.layout.container.lg` - 1024px
  - `core.layout.container.xl` - 1280px
  - `core.layout.container.2xl` - 1536px

  **Usage:**

  ```css
  .container {
    max-width: var(--lufa-core-layout-container-lg);
    margin-inline: auto;
  }
  ```

  ***

  ### Fluid Spacing Tokens (4 new core tokens)

  CSS `clamp()` based tokens for smooth viewport scaling:
  - `core.layout.section-gap-fluid` - `clamp(48px, 8vw, 96px)`
  - `core.layout.hero-padding-fluid` - `clamp(32px, 6vw, 80px)`
  - `core.layout.container-gutter-fluid` - `clamp(16px, 4vw, 48px)`
  - `core.layout.page-margin-fluid` - `clamp(16px, 3vw, 32px)`

  **Usage:**

  ```css
  .hero-section {
    padding-block: var(--lufa-core-layout-hero-padding-fluid);
    /* Smoothly scales between 32px and 80px based on viewport */
  }
  ```

  ***

  ## 🔧 Build System Enhancements

  ### Custom Style Dictionary Transform: `attribute/responsive`

  Automatically detects responsive tokens and adds metadata for media query generation.

  **File:** `packages/design-system/tokens/build/transforms/responsive.js`

  ### Custom Style Dictionary Format: `css/variables-with-media-queries`

  Generates mobile-first CSS with automatic `@media` query overrides for responsive tokens.

  **File:** `packages/design-system/tokens/build/formats/css-with-media-queries.js`

  **Features:**
  - Mobile-first approach (base → md → lg)
  - Maintains theme mode support (light, dark, high-contrast)
  - Automatic breakpoint mapping
  - Clean, optimized CSS output

  ***

  ## 🗑️ Deprecations

  **3 tokens deprecated** (will be removed in v0.9.0):

  | Deprecated Token      | Replacement         | Migration          |
  | --------------------- | ------------------- | ------------------ |
  | `page-padding-mobile` | `page-padding.base` | Direct replacement |
  | `section-gap-mobile`  | `section-gap.base`  | Direct replacement |
  | `container-max-width` | `container.xl`      | Direct replacement |

  **Migration Commands:**

  ```bash
  # Find deprecated token usage
  grep -r "page-padding-mobile\|section-gap-mobile\|container-max-width" . --include="*.{css,json}"

  # Replace in CSS files
  find . -name "*.css" -exec sed -i '' 's/--lufa-core-layout-page-padding-mobile/--lufa-core-layout-page-padding/g' {} +
  find . -name "*.css" -exec sed -i '' 's/--lufa-core-layout-section-gap-mobile/--lufa-core-layout-section-gap/g' {} +
  find . -name "*.css" -exec sed -i '' 's/--lufa-core-layout-container-max-width/--lufa-core-layout-container-xl/g' {} +
  ```

  ***

  ## 📊 Metrics
  - **New tokens added:** 47 (14 primitive + 33 core layout)
  - **Tokens deprecated:** 3
  - **Components updated:** 2 (Box, Button)
  - **CSS file size:** 61.84 KB → 66.71 KB (+4.87 KB, +7.9%)
  - **Build system:** 2 custom transforms/formats added
  - **Responsive token groups:** 6 (18 variants total)

  ***

  ## 🔄 Migration Guide

  ### For Box Component Users

  **If using `padding="none"` or `margin="none"`:**
  1. **Test your components** - Spacing will change from 4px to 0px (correct behavior)
  2. **If you need 4px explicitly**, use `padding="tight"` instead
  3. **This is a bug fix** - 0px is the correct behavior for "none"

  **Example:**

  ```tsx
  // Before (buggy behavior)
  <Box padding="none"> {/* Was incorrectly 4px */}
    Content with unintended padding
  </Box>

  // After (correct behavior)
  <Box padding="none"> {/* Now correctly 0px */}
    Content with no padding
  </Box>

  // If you need 4px
  <Box padding="tight"> {/* Explicitly 4px */}
    Content with 4px padding
  </Box>
  ```

  ### For Custom Component Developers

  **Use new height tokens:**

  ```diff
  # Before
  .my-button {
  -  height: 40px;
  +  height: var(--lufa-primitive-height-40);
  }
  ```

  **Use responsive layout tokens:**

  ```diff
  # Before
  .my-container {
  -  padding: 16px;
  +  padding: var(--lufa-core-layout-page-padding);
    /* Automatically 16px → 24px → 32px */
  }
  ```

  **Use breakpoint tokens:**

  ```diff
  # Before
  -@media (min-width: 768px) {
  +@media (min-width: 768px) { /* breakpoint.md */
    .my-component {
      /* tablet styles */
    }
  }
  ```

  ### For Storybook Story Authors

  **Update viewport references:**

  ```diff
  # Before
  -parameters: {
  -  viewport: { defaultViewport: 'small' } // 576px
  -}

  # After
  +parameters: {
  +  viewport: { defaultViewport: 'small' } // 640px (breakpoint.sm)
  +}
  ```

  ***

  ## 🎯 Best Practices

  ### 1. Use Responsive Tokens for Layout

  ```css
  /* Good: Responsive token adapts automatically */
  .page-wrapper {
    padding: var(--lufa-core-layout-page-padding);
    /* Mobile: 16px, Tablet: 24px, Desktop: 32px */
  }

  /* Avoid: Manual media queries for standard layouts */
  .page-wrapper {
    padding: 16px;
  }
  @media (min-width: 768px) {
    .page-wrapper {
      padding: 24px;
    }
  }
  ```

  ### 2. Use Fluid Tokens for Hero Sections

  ```css
  /* Good: Smooth scaling for marketing content */
  .hero {
    padding-block: var(--lufa-core-layout-hero-padding-fluid);
    /* Smoothly scales 32px → 80px */
  }
  ```

  ### 3. Use Height Tokens for UI Components

  ```css
  /* Good: Standardized heights */
  .custom-button {
    height: var(--lufa-primitive-height-40);
  }

  /* Avoid: Hard-coded heights */
  .custom-button {
    height: 40px;
  }
  ```

  ***

  ## 📚 Documentation

  Comprehensive guides available:
  - **Token Usage Guide:** `_bmad-output/subjects/spacing-layout-tokens/docs/token-usage-guide.md`
  - **Migration Guide:** `_bmad-output/subjects/spacing-layout-tokens/docs/migration-guide.md`
  - **Responsive Design Guide:** `_bmad-output/subjects/spacing-layout-tokens/docs/responsive-design-guide.md`
  - **Implementation Reports:**
    - Sprint 1: `_bmad-output/subjects/spacing-layout-tokens/implementation/sprint-1-report.md`
    - Sprint 2: `_bmad-output/subjects/spacing-layout-tokens/implementation/sprint-2-report.md`
    - Sprint 3: `_bmad-output/subjects/spacing-layout-tokens/implementation/sprint-3-testing-report.md`

  ***

  ## 🔗 Related ADRs
  - [ADR-005: Breakpoint Token Strategy](../_docs/adrs/ADR-005-IMPLEMENTED-breakpoint-token-strategy.md)
  - [ADR-006: Responsive Spacing Architecture](../_docs/adrs/ADR-006-IMPLEMENTED-responsive-spacing-architecture.md)
  - [ADR-007: Zero-Value Token Handling](../_docs/adrs/ADR-007-IMPLEMENTED-zero-value-token-handling.md)

  ***

  ## 🎉 What's Next

  **Phase 2D: Typography Tokens** (Coming next)
  - Responsive typography system
  - Letter-spacing tokens
  - Line-height refinements
  - Extended type scale (6xl-8xl)

  ***

  **Date:** 2026-01-26
  **Status:** Ready for Testing

### Patch Changes

- Updated dependencies [445737d]
- Updated dependencies [445737d]
- Updated dependencies [ea09e6a]
- Updated dependencies [445737d]
- Updated dependencies [445737d]
  - @grasdouble/lufa_design-system-tokens@0.5.0

## 0.7.1

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

- Updated dependencies [fb79222]
  - @grasdouble/lufa_design-system-primitives@0.4.1
  - @grasdouble/lufa_design-system-tokens@0.4.1

## 0.7.0

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

## 0.6.0

### Minor Changes

- 509bb8e: tokens and primitives are no more exposed

### Patch Changes

- 8ae7e61: change how css variable for token is generated. now there is the prefix --lufa-token
- 603f643: Button: fix css and split it in multiple file
  Avatar: fix role
- Updated dependencies [8ae7e61]
- Updated dependencies [509bb8e]
  - @grasdouble/lufa_design-system-tokens@0.4.0
  - @grasdouble/lufa_design-system-primitives@0.4.0

## 0.5.1

### Patch Changes

- 6c972e8: fix: prettier config
- 2d37fc0: Update dependencies
- 4d0893b: Update scripts and README files
- 57df928: chore: update lint and tsconfig
- 412c362: fix(chore): add missing prettier and eslint config + add a script prettier in package.json
- b101244: fix(chore): eslint config + fix new issues
- Updated dependencies [6c972e8]
- Updated dependencies [2d37fc0]
- Updated dependencies [4d0893b]
- Updated dependencies [57df928]
- Updated dependencies [0194d3d]
- Updated dependencies [412c362]
- Updated dependencies [b101244]
  - @grasdouble/lufa_design-system-primitives@0.3.0
  - @grasdouble/lufa_design-system-tokens@0.3.0

## 0.5.0

### Minor Changes

- 1f24429: Add navigation components and improve documentation

## 0.4.0

### Minor Changes

- 48c857f: Add missing layout components with documentation

## 0.3.1

### Patch Changes

- 93819d3: fix how to manage color on primitive
- Updated dependencies [93819d3]
  - @grasdouble/lufa_design-system-primitives@0.2.1
  - @grasdouble/lufa_design-system-tokens@0.2.1

## 0.3.0

### Minor Changes

- 501cf5f: Rework how primitive, tokens and ds is working + align storybook and docusaurus

### Patch Changes

- Updated dependencies [501cf5f]
  - @grasdouble/lufa_design-system-primitives@0.2.0
  - @grasdouble/lufa_design-system-tokens@0.2.0

## 0.2.0

### Minor Changes

- 6af7149: reorganize design-system splitting prmitive, tokens and the design system
- dba64f6: Add token, implement tailwind theme, update and add components
  _Note: Tailwind was later replaced with vanilla CSS tokens in January 2026_
- 6c4eb34: Add colors and improve placeholder component
- 1d9de21: Add divider component

### Patch Changes

- d4b9e09: Clean and fix storybook
- Updated dependencies [6af7149]
- Updated dependencies [d4b9e09]
  - @grasdouble/lufa_design-system-primitives@0.1.0
  - @grasdouble/lufa_design-system-tokens@0.1.0

## 0.1.2

### Patch Changes

- dceff77: Upgrade deps

## 0.1.1

### Patch Changes

- d4b3d7e: Add missing type for Spinner
  Fix peer dependencies

## 0.1.0

### Minor Changes

- 078d452: Add the spinner component

## 0.0.5

### Patch Changes

- cddcb85: Restart the DS using as a reference the DS shared by Github (Primer)
  First components added:
  - Placeholder
  - Stack

- 263a062: Add StackItem

## 0.0.4

### Patch Changes

- 10a531a: Storybook: Fix dark mode in Stories and Docs
  Design-System: Fix components following migration guide (v3 to v4)
  Both: Clean code

## 0.0.3

### Patch Changes

- b893e5b: Update publishConfig

## 0.0.2

### Patch Changes

- 7f3f723: Improve shared config (eslint and typescript) and apply change in packages
