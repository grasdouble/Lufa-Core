---
package: '@grasdouble/lufa_design-system'
shortName: lufa_design-system
category: design-system
version: '2.0.0'
private: false
lastUpdated: '2026-02-24'
generatedAtCommit: 'd27c912328f538971b6720513be2c817c2feff15'
---

# @grasdouble/lufa_design-system

## Overview

`@grasdouble/lufa_design-system` is the primary React component library for the Lufa monorepo. It provides a comprehensive set of accessible, token-driven UI components built on top of `@grasdouble/lufa_design-system-tokens`. All components use CSS Modules and compile to a single ESM bundle (`lufa-ui.mjs`) with an accompanying stylesheet (`style.css`).

The library is built on a **semantic token architecture**: every spacing, color, border, and typography value resolves to a CSS custom property rather than a hard-coded value, enabling theme and dark/light mode switching at runtime.

## Purpose

- Provide a shared, versioned React component library consumed by all Lufa micro-frontends and applications.
- Enforce visual consistency through design token semantics (no raw hex colors or pixel values in component code).
- Deliver full WCAG 2.1 AA accessibility compliance across all interactive and content components.
- Support multi-theme (`default`, `ocean`, `forest`) and multi-mode (`light`, `dark`, `high-contrast`) rendering via HTML data attributes.

## Architecture

```
src/
├── index.ts                  # Public API entry point
│
├── foundation/               # Layout primitives (structural building blocks)
│   ├── Box/                  # Universal layout container (polymorphic)
│   ├── Stack/                # Vertical/horizontal flex layout with gap
│   ├── Cluster/              # Wrapping flex layout for tag collections
│   ├── Flex/                 # Explicit flexbox layout primitive
│   ├── Grid/                 # CSS Grid layout primitive
│   ├── Container/            # Responsive max-width page container
│   ├── Center/               # Content centering utility
│   ├── Bleed/                # Negative margin breakout component
│   ├── Divider/              # Semantic horizontal/vertical rule
│   └── AspectRatio/          # Aspect ratio enforcement wrapper
│
├── content/                  # Display components (visual/textual content)
│   ├── Text/                 # Typography primitive (polymorphic)
│   ├── Icon/                 # Lucide React icon wrapper with token sizing
│   └── Badge/                # Status and label indicator
│
├── interaction/              # Interactive form and action elements
│   ├── Button/               # Action button (polymorphic, icon support)
│   ├── Input/                # Text input field
│   └── Label/                # Form label (polymorphic)
│
├── composition/              # Complex patterns built from primitives
│   └── Card/                 # Surface container with border and shadow
│
├── utility/                  # Technical and accessibility helpers
│   ├── Portal/               # React portal (renders outside DOM hierarchy)
│   └── VisuallyHidden/       # Screen-reader-only wrapper
│
├── hooks/                    # React hooks for theme management
│   ├── useTheme.ts           # Full theme+mode control with localStorage
│   └── useThemeMode.ts       # Accessibility mode control (light/dark/high-contrast)
│
├── utils/                    # Non-component utilities
│   ├── accessibility.ts      # WCAG contrast calculation helpers
│   └── responsive-visibility.ts # Breakpoint-based show/hide logic
│
└── style.css                 # Root stylesheet (tokens + component CSS)
```

### Dependency Layers

```
@grasdouble/lufa_design-system-tokens  (CSS custom properties)
        ↓
CSS Modules (component-level scoped styles)
        ↓
React Components (utility-prop API → CSS class composition via clsx)
        ↓
Consumer Applications / Micro-frontends
```

All components translate their props into pre-generated CSS utility classes (never inline styles). The classes reference semantic CSS custom properties, which in turn reference primitive tokens — enabling theme switching by toggling `data-theme` and `data-mode` attributes on `<html>`.

## Key Components

### Foundation — Layout Primitives

#### `Box`

The universal layout primitive. Polymorphic (`as` prop, defaults to `div`). Accepts utility props for padding, margin, background, border, display, and responsive visibility. All other layout components ultimately compose Box.

| Prop                                                      | Type                        | Default | Description                                           |
| --------------------------------------------------------- | --------------------------- | ------- | ----------------------------------------------------- |
| `as`                                                      | `ElementType`               | `'div'` | Rendered HTML element                                 |
| `padding` / `paddingX` / `paddingY` / `paddingTop` / etc. | `SpacingValue`              | —       | Semantic spacing tokens                               |
| `margin` / `marginX` / etc.                               | `SpacingValue`              | —       | Semantic spacing tokens                               |
| `background`                                              | `BackgroundValue`           | —       | Semantic background color                             |
| `borderRadius`                                            | `BorderRadiusValue`         | —       | `none \| small \| default \| medium \| large \| full` |
| `borderWidth`                                             | `BorderWidthValue`          | —       | `none \| thin \| medium \| thick`                     |
| `borderColor`                                             | `BorderColorValue`          | —       | Semantic border token                                 |
| `display`                                                 | `DisplayValue`              | —       | CSS display property                                  |
| `show` / `hide` / `hideFrom` / `showFrom`                 | `ResponsiveVisibilityProps` | —       | Breakpoint-based visibility                           |

**SpacingValue**: `'none' | 'tight' | 'compact' | 'default' | 'comfortable' | 'spacious'`

#### `Stack`

Flexbox layout with automatic gap. Default direction is vertical. Recommended for most block-level stacking needs.

| Prop        | Type                                                                                  | Default      |
| ----------- | ------------------------------------------------------------------------------------- | ------------ |
| `direction` | `'vertical' \| 'horizontal'`                                                          | `'vertical'` |
| `spacing`   | `SpacingValue`                                                                        | `'default'`  |
| `align`     | `'start' \| 'center' \| 'end' \| 'stretch' \| 'baseline'`                             | `'stretch'`  |
| `justify`   | `'start' \| 'center' \| 'end' \| 'space-between' \| 'space-around' \| 'space-evenly'` | `'start'`    |
| `wrap`      | `boolean`                                                                             | `false`      |

#### `Cluster`

Wrapping flex layout for collections of small elements (badges, tags, buttons). Wraps automatically by default. Inspired by Every Layout's "Cluster" pattern.

| Prop      | Type                                                                          | Default        |
| --------- | ----------------------------------------------------------------------------- | -------------- |
| `spacing` | `SpacingValue` (excludes `'none'`)                                            | `'default'`    |
| `align`   | `'flex-start' \| 'center' \| 'flex-end' \| 'baseline' \| 'stretch'`           | `'center'`     |
| `justify` | `'flex-start' \| 'center' \| 'flex-end' \| 'space-between' \| 'space-around'` | `'flex-start'` |

#### `Flex`

Explicit flexbox layout primitive with full control over flex properties. Use when Stack/Cluster do not meet requirements.

#### `Grid`

CSS Grid layout primitive. Extends all Box props. Adds `columns` (1–6, 12), `gap`/`gapX`/`gapY`, `align`, `justify`, and `inline` props.

#### `Container`

Responsive max-width wrapper. Centers content horizontally with horizontal padding. Supports `fluid` (100% width) and `size` breakpoint constraints.

| Prop    | Type         | Default |
| ------- | ------------ | ------- |
| `fluid` | `boolean`    | `false` |
| `size`  | `Breakpoint` | —       |

**Breakpoint**: `'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'`

#### `Center`

Centers content horizontally and/or vertically within its container.

#### `Bleed`

Applies negative margins to break out of a parent Container's padding. Used for full-bleed images or sections inside constrained layouts.

#### `Divider`

Semantic `<hr>` replacement. Polymorphic (`as` prop). Supports `PolymorphicDividerProps` for orientation/decoration variants.

#### `AspectRatio`

Enforces a specific aspect ratio on its child. Accepts `AspectRatioComponentProps` for ratio configuration.

---

### Content — Display Components

#### `Text`

Typography primitive. Polymorphic (`as` prop, defaults to `p`).

| Prop        | Type                                                                                                 | Default     |
| ----------- | ---------------------------------------------------------------------------------------------------- | ----------- |
| `variant`   | `'h1'–'h6' \| 'body-large' \| 'body' \| 'body-small' \| 'caption' \| 'label'`                        | `'body'`    |
| `color`     | `'primary' \| 'secondary' \| 'tertiary' \| 'success' \| 'error' \| 'warning' \| 'info' \| 'inverse'` | `'primary'` |
| `weight`    | `'normal' \| 'medium' \| 'semibold' \| 'bold'`                                                       | `'normal'`  |
| `align`     | `'left' \| 'center' \| 'right' \| 'justify'`                                                         | `'left'`    |
| `transform` | `'none' \| 'uppercase' \| 'lowercase' \| 'capitalize'`                                               | `'none'`    |

#### `Icon`

Lucide React icon wrapper with token-based sizing and color. Uses a string name API via `IconName`.

| Prop    | Type                                                                                                   | Default                   |
| ------- | ------------------------------------------------------------------------------------------------------ | ------------------------- |
| `name`  | `IconName`                                                                                             | required                  |
| `size`  | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                                                                 | `'md'`                    |
| `color` | `'currentColor' \| 'primary' \| 'secondary' \| 'success' \| 'error' \| 'warning' \| 'info' \| 'muted'` | `'currentColor'`          |
| `title` | `string`                                                                                               | — (decorative if omitted) |

Available icon names (36 total): `user`, `home`, `settings`, `menu`, `search`, `check`, `x`, `plus`, `minus`, `edit`, `trash`, `save`, `download`, `upload`, `chevron-down`, `chevron-up`, `chevron-left`, `chevron-right`, `arrow-left`, `arrow-right`, `alert-circle`, `info`, `check-circle`, `x-circle`, `loader`, `external-link`, `eye`, `eye-off`, `heart`, `star`

#### `Badge`

Compact status/label indicator. Polymorphic (limited to `span | div | label`).

| Prop      | Type                                                       | Default     |
| --------- | ---------------------------------------------------------- | ----------- |
| `variant` | `'default' \| 'success' \| 'error' \| 'warning' \| 'info'` | `'default'` |
| `size`    | `'sm' \| 'md' \| 'lg'`                                     | `'md'`      |
| `dot`     | `boolean`                                                  | `false`     |

---

### Interaction — Form and Action Components

#### `Button`

Versatile action button. Polymorphic (`as` prop, defaults to `button`).

| Prop        | Type                                                                                    | Default     |
| ----------- | --------------------------------------------------------------------------------------- | ----------- |
| `type`      | `'solid' \| 'outline' \| 'ghost'`                                                       | `'solid'`   |
| `variant`   | `'primary' \| 'secondary' \| 'success' \| 'danger' \| 'warning' \| 'info' \| 'neutral'` | `'primary'` |
| `size`      | `'sm' \| 'md' \| 'lg'`                                                                  | `'md'`      |
| `radius`    | `'none' \| 'sm' \| 'base' \| 'md' \| 'full'`                                            | —           |
| `iconLeft`  | `IconName`                                                                              | —           |
| `iconRight` | `IconName`                                                                              | —           |
| `loading`   | `boolean`                                                                               | `false`     |
| `disabled`  | `boolean`                                                                               | `false`     |
| `fullWidth` | `boolean`                                                                               | `false`     |

When `loading` is `true`, a spinner icon replaces `iconLeft` and `aria-busy` is set. When `disabled` or `loading`, `aria-disabled` is set automatically.

#### `Input`

Standard HTML text input with error and disabled states. Not polymorphic — always renders `<input>`.

| Prop        | Type      | Default |
| ----------- | --------- | ------- |
| `error`     | `boolean` | `false` |
| `fullWidth` | `boolean` | `false` |

Extends all native `<input>` props except `size`.

#### `Label`

Form label wrapper. Polymorphic (defaults to `label`). Pass `htmlFor` to associate with an `Input`.

---

### Composition — Complex Patterns

#### `Card`

Surface container with border, background, and shadow. Polymorphic (defaults to `div`). Wraps children in a styled card surface; intended to be composed with Stack, Text, and other primitives for card content structure.

---

### Utility — Technical Helpers

#### `Portal`

Renders children into a DOM node outside the current component tree via `ReactDOM.createPortal`. Defaults to `document.body`. Accepts an optional `container` prop to target a specific DOM element. SSR-safe (returns `null` on server).

#### `VisuallyHidden`

Renders content invisible on screen but accessible to screen readers. Polymorphic (defaults to `span`). Used for accessible labels on icon-only buttons and similar patterns.

---

### Hooks

#### `useTheme`

Full theme + mode management hook with localStorage persistence.

```ts
const { theme, mode, effectiveMode, setTheme, setMode, systemPrefersDark } = useTheme(options?)
```

| Option          | Type        | Default        |
| --------------- | ----------- | -------------- |
| `defaultTheme`  | `ThemeName` | `'default'`    |
| `defaultMode`   | `ThemeMode` | `'auto'`       |
| `storageKey`    | `string`    | `'lufa-theme'` |
| `enableStorage` | `boolean`   | `true`         |

**ThemeName**: `'default' | 'ocean' | 'forest'`  
**ThemeMode**: `'light' | 'dark' | 'auto'`

Syncs to `data-theme` and `data-mode` attributes on `<html>`. When `mode='auto'`, removes `data-mode` and defers to `@media (prefers-color-scheme)`.

#### `useThemeMode`

Focused hook for accessibility color mode management, including `high-contrast` support.

```ts
const { mode, setMode, systemPrefersDark, systemPrefersContrast, systemPreference } = useThemeMode(options?)
```

| Option          | Type        | Default             |
| --------------- | ----------- | ------------------- |
| `defaultMode`   | `ThemeMode` | `'light'`           |
| `autoDetect`    | `boolean`   | `true`              |
| `storageKey`    | `string`    | `'lufa-theme-mode'` |
| `enableStorage` | `boolean`   | `true`              |

**ThemeMode** (this hook): `'light' | 'dark' | 'high-contrast'`

Detection priority: `high-contrast` > `dark` > `light`, using `prefers-contrast: more` and `prefers-color-scheme: dark`.

---

### Utility Functions

#### `accessibility.ts`

WCAG contrast calculation helpers exported from the public API.

| Export                                  | Description                           |
| --------------------------------------- | ------------------------------------- |
| `WCAG_STANDARDS`                        | Constant with AA/AAA ratio thresholds |
| `hexToRgb(hex)`                         | Convert hex to `{r,g,b}`              |
| `getRelativeLuminance(hex)`             | WCAG 2.1 relative luminance           |
| `getContrastRatio(fg, bg)`              | Contrast ratio between two hex colors |
| `meetsWCAG(fg, bg, level, isLargeText)` | Check WCAG AA or AAA compliance       |
| `meetsWCAGForUI(fg, bg)`                | Check WCAG AA for UI components (3:1) |
| `getContrastLevel(ratio)`               | Human-readable contrast level string  |
| `getSuggestedTextColor(bg)`             | Returns `'#000000'` or `'#FFFFFF'`    |
| `isValidHex(color)`                     | Validates hex color format            |

#### `responsive-visibility.ts`

Breakpoint-based show/hide class generation, used internally by layout components. Also exported for advanced use.

| Export                                  | Description                                                    |
| --------------------------------------- | -------------------------------------------------------------- |
| `Breakpoint`                            | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'`                |
| `BREAKPOINTS`                           | Pixel values per breakpoint                                    |
| `ResponsiveValue<T>`                    | Generic responsive value type                                  |
| `ResponsiveVisibilityProps`             | `show`, `hide`, `hideFrom`, `showFrom` props                   |
| `getResponsiveVisibilityClasses(props)` | Generates `lufa-hide-from-*` / `lufa-show-from-*` class arrays |
| `getAriaHiddenAttribute(props)`         | Returns `true \| undefined` for static aria-hidden             |

---

## API Reference

### Complete Public Exports

**Components (18)**

| Export                                                           | Category    | Default Element |
| ---------------------------------------------------------------- | ----------- | --------------- |
| `Box` / `BoxProps`                                               | Foundation  | `div`           |
| `Stack` / `StackProps`                                           | Foundation  | `div`           |
| `Cluster` / `ClusterProps`                                       | Foundation  | `div`           |
| `Flex` / `FlexProps`                                             | Foundation  | `div`           |
| `Grid` / `GridProps`                                             | Foundation  | `div`           |
| `Container` / `ContainerProps`                                   | Foundation  | `div`           |
| `Center` / `CenterProps`                                         | Foundation  | `div`           |
| `Bleed` / `BleedProps`                                           | Foundation  | `div`           |
| `Divider` / `DividerProps` / `PolymorphicDividerProps`           | Foundation  | `hr`            |
| `AspectRatio` / `AspectRatioProps` / `AspectRatioComponentProps` | Foundation  | `div`           |
| `Text` / `TextProps`                                             | Content     | `p`             |
| `Icon` / `IconProps` / `IconName`                                | Content     | `span`          |
| `Badge` / `BadgeProps`                                           | Content     | `span`          |
| `Button` / `ButtonProps`                                         | Interaction | `button`        |
| `Input` / `InputProps`                                           | Interaction | `input`         |
| `Label` / `LabelProps`                                           | Interaction | `label`         |
| `Card` / `CardProps`                                             | Composition | `div`           |
| `Portal` / `PortalProps`                                         | Utility     | —               |
| `VisuallyHidden` / `VisuallyHiddenProps`                         | Utility     | `span`          |

**Hooks (2)**

| Export                                                                                               | Description                   |
| ---------------------------------------------------------------------------------------------------- | ----------------------------- |
| `useTheme` / `ThemeName` / `ThemeMode` / `UseThemeReturn`                                            | Full theme + mode management  |
| `useThemeMode` / `SystemPreference` / `UseThemeModeOptions` / `UseThemeModeReturn` / `ThemeModeType` | Accessibility mode management |

**Utilities (10+ functions)**

`WCAG_STANDARDS`, `hexToRgb`, `getRelativeLuminance`, `getContrastRatio`, `meetsWCAG`, `meetsWCAGForUI`, `getContrastLevel`, `getSuggestedTextColor`, `isValidHex`, `Breakpoint`, `BREAKPOINTS`, `ResponsiveValue`, `ResponsiveVisibilityProps`, `getResponsiveVisibilityClasses`, `getAriaHiddenAttribute`

---

## Usage Examples

### Installation

```bash
pnpm add @grasdouble/lufa_design-system
```

### Required Setup

Import the stylesheet once in your application root:

```tsx
import '@grasdouble/lufa_design-system/style.css';
```

### Basic Page Layout

```tsx
import { Container, Stack, Text } from '@grasdouble/lufa_design-system';

function Page() {
  return (
    <Container size="lg">
      <Stack spacing="comfortable">
        <Text variant="h1" weight="bold">
          Page Title
        </Text>
        <Text variant="body" color="secondary">
          Body content goes here.
        </Text>
      </Stack>
    </Container>
  );
}
```

### Button with Icon

```tsx
import { Button } from '@grasdouble/lufa_design-system';

function Actions() {
  return (
    <Stack direction="horizontal" spacing="compact">
      <Button type="solid" variant="primary" iconLeft="check">
        Save
      </Button>
      <Button type="outline" variant="neutral" iconLeft="x">
        Cancel
      </Button>
      <Button type="ghost" variant="danger" loading>
        Deleting...
      </Button>
    </Stack>
  );
}
```

### Badge Cluster

```tsx
import { Badge, Cluster } from '@grasdouble/lufa_design-system';

function Tags({ tags }: { tags: string[] }) {
  return (
    <Cluster spacing="compact">
      {tags.map((tag) => (
        <Badge key={tag} variant="info" size="sm">
          {tag}
        </Badge>
      ))}
    </Cluster>
  );
}
```

### Form Group

```tsx
import { Input, Label, Stack, Text } from '@grasdouble/lufa_design-system';

function EmailField({ error }: { error?: string }) {
  return (
    <Stack spacing="tight">
      <Label htmlFor="email">Email Address</Label>
      <Input id="email" type="email" error={!!error} fullWidth />
      {error && (
        <Text variant="caption" color="error">
          {error}
        </Text>
      )}
    </Stack>
  );
}
```

### Theme Management

```tsx
import { useTheme } from '@grasdouble/lufa_design-system';

function ThemeSwitcher() {
  const { theme, mode, effectiveMode, setTheme, setMode } = useTheme();

  return (
    <Stack direction="horizontal" spacing="compact">
      <Button onClick={() => setTheme('ocean')}>Ocean</Button>
      <Button onClick={() => setTheme('forest')}>Forest</Button>
      <Button onClick={() => setMode('dark')}>Dark</Button>
      <Button onClick={() => setMode('auto')}>Auto</Button>
    </Stack>
  );
}
```

### Responsive Visibility

```tsx
import { Box, Stack } from '@grasdouble/lufa_design-system';

function ResponsiveNav() {
  return (
    <>
      {/* Mobile only */}
      <Box hideFrom="md">
        <MobileMenu />
      </Box>
      {/* Desktop only */}
      <Stack direction="horizontal" showFrom="md" spacing="default">
        <DesktopNav />
      </Stack>
    </>
  );
}
```

### Accessible Icon-Only Button

```tsx
import { Button, VisuallyHidden } from '@grasdouble/lufa_design-system';

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <Button type="ghost" variant="neutral" onClick={onClose} aria-label="Close dialog">
      <Icon name="x" />
      <VisuallyHidden>Close</VisuallyHidden>
    </Button>
  );
}
```

---

## Dependencies

### Runtime Dependencies

| Package                                 | Version       | Purpose                                                       |
| --------------------------------------- | ------------- | ------------------------------------------------------------- |
| `@grasdouble/lufa_design-system-tokens` | `workspace:^` | CSS custom property tokens (spacing, color, typography)       |
| `@headlessui/react`                     | `^2.2.9`      | Accessible headless UI primitives (available for composition) |
| `@heroicons/react`                      | `^2.2.0`      | Hero icon set (available, not currently in default ICON_MAP)  |
| `lucide-react`                          | `^0.563.0`    | Primary icon library (powers `Icon` component)                |
| `clsx`                                  | `^2.1.1`      | CSS class name composition utility                            |

### Peer Dependencies

| Package | Version   |
| ------- | --------- |
| `react` | `^19.1.0` |

### Dev Dependencies (Build)

| Package                             | Purpose                                |
| ----------------------------------- | -------------------------------------- |
| `vite` + `@vitejs/plugin-react`     | ESM bundle compilation                 |
| `vite-plugin-dts`                   | TypeScript declaration generation      |
| `vite-plugin-externalize-deps`      | Excludes peer/runtime deps from bundle |
| `@playwright/experimental-ct-react` | Component testing                      |
| `typescript`                        | Type checking                          |

---

## Related Documentation

- **Tokens**: `@grasdouble/lufa_design-system-tokens` — CSS custom properties, color scales, spacing scale, typography scale
- **Themes**: `@grasdouble/lufa_design-system-themes` — Theme variant token overrides (`ocean`, `forest`)
- **Storybook**: `packages/design-system/storybook/` — Interactive component stories
- **Docusaurus**: `packages/design-system/docusaurus/` — Published documentation site
- **Playwright Tests**: `packages/design-system/playwright/` — Component-level CT tests
- **Source tree overview**: `packages/design-system/_docs/source-tree.md`
- **Build configuration**: `packages/design-system/_docs/build-configuration.md`
- **Responsive visibility guide**: `packages/design-system/main/src/foundation/responsive-visibility.md`
