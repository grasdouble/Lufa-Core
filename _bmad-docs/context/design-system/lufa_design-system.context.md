---
package: '@grasdouble/lufa_design-system'
shortName: lufa_design-system
category: design-system
type: context
lastUpdated: '2026-02-24'
generatedAtCommit: 'd27c912328f538971b6720513be2c817c2feff15'
---

# lufa_design-system — AI Context File

## Package Info

| Field               | Value                                          |
| ------------------- | ---------------------------------------------- |
| **npm name**        | `@grasdouble/lufa_design-system`               |
| **Version**         | `2.0.0`                                        |
| **Private**         | No (published to GitHub Package Registry)      |
| **License**         | MIT                                            |
| **Module format**   | ESM only (`type: "module"`)                    |
| **Bundle**          | `dist/lufa-ui.mjs`                             |
| **Types**           | `dist/index.d.ts`                              |
| **Stylesheet**      | `dist/style.css` (must be imported separately) |
| **Peer dependency** | `react ^19.1.0`                                |
| **Source root**     | `packages/design-system/main/src/`             |

---

## Critical Rules

1. **Always import the stylesheet** — `import '@grasdouble/lufa_design-system/style.css'` must appear once in the application entry. Without it, no tokens or component styles will be applied.

2. **Never use raw color/spacing values** — All visual values come from semantic tokens (`--lufa-semantic-*`). Never pass inline `style={{ color: '#...' }}` — use component props (`color="error"`, `background="surface"`, etc.).

3. **Polymorphic `as` prop** — Most components accept an `as` prop. When you change `as`, the TypeScript type of all remaining props narrows to that element. Always type the component correctly:

   ```tsx
   // Correct: link-typed props become available
   <Button as="a" href="/home" type="ghost" variant="neutral">Home</Button>

   // Wrong: passing href to a <button> element
   <Button href="/home">Home</Button>
   ```

4. **Icon-only buttons need accessible labels** — Either use `aria-label` directly on the button, or wrap the text content in `<VisuallyHidden>`. The `Icon` component renders `aria-hidden="true"` when no `title` prop is supplied.

5. **Do not import from sub-paths** — Only `@grasdouble/lufa_design-system` (components/hooks/utils) and `@grasdouble/lufa_design-system/style.css` (stylesheet) are valid import paths. There are no deep sub-path exports.

6. **Theme attributes live on `<html>`** — `useTheme` and `useThemeMode` sync to `document.documentElement`. A single call at the application root suffices; do not call these hooks deep in the tree.

7. **CSS Modules are internal** — Component `.module.css` files are implementation details and must never be imported directly by consumers.

8. **No `size` prop on Input** — `InputProps` explicitly omits the native `size` attribute to avoid conflicts. Use `fullWidth` or CSS for sizing.

---

## Import Pattern

```tsx
// Named imports — all from the same entry point

// Type-only imports (no runtime cost)
import type {
  AspectRatioComponentProps,
  AspectRatioProps,
  BadgeProps,
  BleedProps,
  BoxProps,
  Breakpoint,
  ButtonProps,
  CardProps,
  CenterProps,
  ClusterProps,
  ContainerProps,
  DividerProps,
  FlexProps,
  GridProps,
  IconName,
  IconProps,
  InputProps,
  LabelProps,
  PolymorphicDividerProps,
  PortalProps,
  ResponsiveValue,
  ResponsiveVisibilityProps,
  StackProps,
  SystemPreference,
  TextProps,
  ThemeMode,
  ThemeModeType,
  ThemeName,
  UseThemeModeOptions,
  UseThemeModeReturn,
  UseThemeReturn,
  VisuallyHiddenProps,
} from '@grasdouble/lufa_design-system';
import {
  AspectRatio,
  Badge,
  Bleed,
  // Foundation
  Box,
  // Interaction
  Button,
  // Composition
  Card,
  Center,
  Cluster,
  Container,
  Divider,
  Flex,
  getContrastRatio,
  getResponsiveVisibilityClasses,
  Grid,
  Icon,
  Input,
  Label,
  meetsWCAG,
  // Utility
  Portal,
  Stack,
  // Content
  Text,
  // Hooks
  useTheme,
  useThemeMode,
  VisuallyHidden,
  // Utilities
  WCAG_STANDARDS,
} from '@grasdouble/lufa_design-system';

// Stylesheet (once per application)
import '@grasdouble/lufa_design-system/style.css';
```

---

## Key Types

### SpacingValue

```ts
type SpacingValue = 'none' | 'tight' | 'compact' | 'default' | 'comfortable' | 'spacious';
```

Used by: `Box` (padding/margin), `Stack` (spacing), `Grid` (gap), `Cluster` (spacing — excludes `'none'`).

### Breakpoint

```ts
type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
// px values:      320    640   768   1024  1280  1536
```

Used by: `Container` (size), `ResponsiveVisibilityProps` (hideFrom/showFrom).

### ResponsiveVisibilityProps

```ts
type ResponsiveVisibilityProps = {
  show?: ResponsiveValue<boolean>; // show at breakpoints
  hide?: ResponsiveValue<boolean>; // hide at breakpoints
  hideFrom?: Breakpoint; // hide from bp and up
  showFrom?: Breakpoint; // show from bp and up (hidden below)
};
```

Available on: `Box`, `Stack`, `Flex`, `Grid`, `Container`.

### ThemeName / ThemeMode (useTheme)

```ts
type ThemeName = 'default' | 'ocean' | 'forest';
type ThemeMode = 'light' | 'dark' | 'auto'; // 'auto' defers to OS preference
```

### ThemeMode (useThemeMode)

```ts
type ThemeMode = 'light' | 'dark' | 'high-contrast';
```

Note: `useThemeMode` and `useTheme` export `ThemeMode` with different values. The context file re-exports `useThemeMode`'s version as `ThemeModeType` to avoid name collision.

### IconName

```ts
// 30 string literals
type IconName =
  | 'user'
  | 'home'
  | 'settings'
  | 'menu'
  | 'search'
  | 'check'
  | 'x'
  | 'plus'
  | 'minus'
  | 'edit'
  | 'trash'
  | 'save'
  | 'download'
  | 'upload'
  | 'chevron-down'
  | 'chevron-up'
  | 'chevron-left'
  | 'chevron-right'
  | 'arrow-left'
  | 'arrow-right'
  | 'alert-circle'
  | 'info'
  | 'check-circle'
  | 'x-circle'
  | 'loader'
  | 'external-link'
  | 'eye'
  | 'eye-off'
  | 'heart'
  | 'star';
```

---

## Common Patterns

### Page skeleton

```tsx
import '@grasdouble/lufa_design-system/style.css';

import { Container, Stack, Text } from '@grasdouble/lufa_design-system';

export default function App() {
  return (
    <Container size="xl">
      <Stack spacing="spacious">
        <Text variant="h1">Title</Text>
        <Text variant="body" color="secondary">
          Description
        </Text>
      </Stack>
    </Container>
  );
}
```

### Horizontal action row

```tsx
<Stack direction="horizontal" spacing="compact" align="center" justify="end">
  <Button type="outline" variant="neutral">
    Cancel
  </Button>
  <Button type="solid" variant="primary" iconLeft="check">
    Submit
  </Button>
</Stack>
```

### Status badge list

```tsx
<Cluster spacing="compact">
  <Badge variant="success">Active</Badge>
  <Badge variant="warning" dot>
    3 pending
  </Badge>
  <Badge variant="error">Failed</Badge>
</Cluster>
```

### Form field

```tsx
<Stack spacing="tight">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" fullWidth error={hasError} />
  {hasError && (
    <Text variant="caption" color="error">
      Invalid email address
    </Text>
  )}
</Stack>
```

### Card composition

```tsx
<Card>
  <Stack spacing="default" padding="comfortable">
    {' '}
    {/* Box props on Stack */}
    <Text variant="h3" weight="semibold">
      Card Title
    </Text>
    <Text variant="body" color="secondary">
      Card body text.
    </Text>
    <Button type="outline" variant="primary" fullWidth>
      Action
    </Button>
  </Stack>
</Card>
```

### Theme initialization (app root)

```tsx
function App() {
  const { theme, mode } = useTheme({ defaultTheme: 'default', defaultMode: 'auto' });
  // theme/mode synced to <html data-theme="..." data-mode="..."> automatically
  return <RouterProvider router={router} />;
}
```

### Responsive show/hide

```tsx
// Simple breakpoint cutoffs
<Box hideFrom="md">Mobile only</Box>
<Stack showFrom="lg" direction="horizontal">Desktop nav</Stack>

// Fine-grained responsive object
<Box show={{ base: true, md: false, lg: true }}>
  Hidden only on tablet (md breakpoint)
</Box>
```

### Modal via Portal

```tsx
import { Box, Portal } from '@grasdouble/lufa_design-system';

function Modal({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <Portal>
      <Box background="overlay" className="modal-backdrop">
        <Box background="surface" borderRadius="large" padding="spacious">
          {children}
        </Box>
      </Box>
    </Portal>
  );
}
```

### WCAG contrast check (development)

```tsx
import { getContrastRatio, meetsWCAG } from '@grasdouble/lufa_design-system';

const ratio = getContrastRatio('#1a1a1a', '#ffffff'); // → 18.1
const passes = meetsWCAG('#1a1a1a', '#ffffff', 'AAA'); // → true
```

---

## Anti-patterns

```tsx
// BAD: Raw color in inline style — bypasses token system
<Box style={{ color: '#ff0000' }}>Error</Box>
// GOOD:
<Text color="error">Error</Text>

// BAD: Deep sub-path import
import { Button } from '@grasdouble/lufa_design-system/interaction/Button';
// GOOD:
import { Button } from '@grasdouble/lufa_design-system';

// BAD: Forgetting stylesheet import
// (components render but have no visual styling)
// GOOD: In app root
import '@grasdouble/lufa_design-system/style.css';

// BAD: Icon-only button without accessible label
<Button type="ghost" variant="neutral">
  <Icon name="trash" />
</Button>
// GOOD: Either approach
<Button type="ghost" variant="neutral" aria-label="Delete item">
  <Icon name="trash" />
</Button>
// Or:
<Button type="ghost" variant="neutral">
  <Icon name="trash" />
  <VisuallyHidden>Delete item</VisuallyHidden>
</Button>

// BAD: Using <a> styling for navigation without the `as` prop
<Button href="/page">Link</Button>  // href not valid on <button>
// GOOD:
<Button as="a" href="/page" type="ghost" variant="neutral">Link</Button>

// BAD: Calling useTheme inside deeply nested components when already called at root
// (causes duplicate localStorage reads and competing data-attribute writes)
// GOOD: Call once at app root, pass theme state via context

// BAD: Using non-existent icon names (causes runtime console.warn + null render)
<Icon name="fire" />  // 'fire' is not in ICON_MAP
// GOOD: Use only names from IconName type

// BAD: SpacingValue 'none' on Cluster spacing
<Cluster spacing="none">  // TypeScript error — Cluster excludes 'none'
// GOOD:
<Cluster spacing="tight">
```

---

## Dependencies Context

### `@grasdouble/lufa_design-system-tokens` (workspace)

Provides all CSS custom properties as the design token layer:

- `--lufa-semantic-ui-spacing-*` → spacing values
- `--lufa-semantic-ui-color-*` → semantic colors (surface, page, success, error, etc.)
- `--lufa-semantic-ui-border-*` → border colors
- `--lufa-semantic-ui-radius-*` → border radius values
- `--lufa-semantic-typography-*` → font size, weight, line-height per variant

This token package is not a peer dependency — it is bundled via the workspace and its CSS is included in `style.css`.

### `lucide-react`

The `Icon` component maps 30 named icons from this library. New icons must be added to `ICON_MAP` in `src/content/Icon/Icon.tsx` and re-built.

### `@headlessui/react`

Listed as a dependency but not currently used in the default component set. Available for internal use when building accessible overlay patterns (dialogs, dropdowns).

### `clsx`

Used internally by all components to compose CSS class strings from utility props. Not re-exported.

### `react` (peer)

Requires React 19.1+. All components use `forwardRef` and support ref forwarding. Hooks use `useState`, `useEffect`, `useCallback`.

---

## Build & Distribution Notes

- The package ships as a single ESM file (`lufa-ui.mjs`) produced by Vite.
- CSS utilities are pre-generated at build time via `scripts/generate-utilities.cjs` (run before `vite build`).
- TypeScript declarations are emitted separately via `tsc` and collected by `vite-plugin-dts`.
- `react` and `react-dom` are externalized (not included in the bundle).
- Published to GitHub Package Registry (`https://npm.pkg.github.com`) with public access.
- Consumers must configure their package manager to resolve `@grasdouble/*` packages from the GitHub registry.
