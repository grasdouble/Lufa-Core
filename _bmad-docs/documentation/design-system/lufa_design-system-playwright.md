---
package: '@grasdouble/lufa_design-system-playwright'
shortName: lufa_design-system-playwright
category: design-system
version: '1.1.0'
private: true
lastUpdated: '2026-02-24'
generatedAtCommit: 'd27c912328f538971b6720513be2c817c2feff15'
---

# @grasdouble/lufa_design-system-playwright

## Overview

`@grasdouble/lufa_design-system-playwright` is the component testing package for the Lufa Design System. It provides comprehensive behavioral, accessibility, and visual regression tests for every component in `@grasdouble/lufa_design-system`, using Playwright Component Testing (`@playwright/experimental-ct-react`) with a React/Vite rendering stack.

This package is private and is never published. It exists solely as a quality gate — verifying that each design system component renders correctly, responds to props, is accessible, and looks right in both light and dark themes across macOS and Linux platforms.

---

## Purpose

- **Behavioral testing**: Validate that component props, states, and events work as specified.
- **Accessibility auditing**: Run automated axe-core scans against every rendered component.
- **Visual regression**: Capture pixel-level screenshots for all component variants and alert on unintended changes.
- **Cross-platform snapshot management**: Maintain separate snapshot sets for macOS (darwin) and Linux CI environments.

---

## Architecture

```
packages/design-system/playwright/
├── src/                            # Test suites, organized by design system category
│   ├── components/                 # Reserved for future composite tests (currently empty)
│   ├── composition/                # Composition-layer components (e.g. Card)
│   ├── content/                    # Content components (Badge, Icon, Text)
│   ├── foundation/                 # Primitive layout components (Box, Stack, Flex, Grid, …)
│   ├── interaction/                # Interactive components (Button, Input, Label)
│   └── utility/                    # Utility components (Portal, VisuallyHidden)
├── __snapshots__/                  # Visual regression baseline images
│   ├── darwin/chromium/            # macOS-generated snapshots
│   └── linux/chromium/             # Linux-generated snapshots (for CI parity)
├── scripts/                        # Snapshot lifecycle scripts
│   ├── compress-snapshots-manual.sh
│   ├── compress-snapshots-precommit.sh
│   ├── docker-update-snapshots-linux.sh
│   └── validate-snapshot-system.sh
├── _docs/                          # Internal documentation
├── playwright-ct.config.ts         # Playwright CT configuration
├── playwright-ct.vite.config.ts    # Vite bundler config for CT
└── package.json
```

### Testing stack

| Layer                 | Technology                          |
| --------------------- | ----------------------------------- |
| Test runner           | `@playwright/experimental-ct-react` |
| Component renderer    | React 19 + Vite                     |
| Accessibility scanner | `@axe-core/playwright`              |
| Snapshot compression  | `oxipng` (external CLI tool)        |
| TypeScript            | `typescript ^5.9.3`                 |

---

## Key Components

### Test suites (`src/`)

Each spec file follows a strict five-category structure:

1. **Basic Rendering** — default props, element tag, children, className forwarding.
2. **Variants** — exhaustive prop combinations (padding, size, color, type, state, …).
3. **User Interactions** — click, focus, keyboard events.
4. **Accessibility** — `AxeBuilder` scan + ARIA attribute assertions + `toMatchAriaSnapshot`.
5. **Visual Regression** — a single `toHaveScreenshot()` test per component that renders every variant in one composite screenshot.

#### Foundation layer (`src/foundation/`)

| Spec file                       | Component tested       | Notes                                                               |
| ------------------------------- | ---------------------- | ------------------------------------------------------------------- |
| `Box.spec.tsx`                  | `Box`                  | Padding, margin, background, border, display, polymorphic `as` prop |
| `Stack.spec.tsx`                | `Stack`                | Direction, spacing, align, justify, wrap                            |
| `Flex.spec.tsx`                 | `Flex`                 | Flex-specific layout primitives                                     |
| `Grid.spec.tsx`                 | `Grid`                 | Grid column/row variants                                            |
| `Container.spec.tsx`            | `Container`            | Max-width centering container                                       |
| `Center.spec.tsx`               | `Center`               | Centering utility                                                   |
| `Cluster.spec.tsx`              | `Cluster`              | Inline wrapping cluster                                             |
| `Bleed.spec.tsx`                | `Bleed`                | Negative-margin bleed                                               |
| `Divider.spec.tsx`              | `Divider`              | Horizontal/vertical rule                                            |
| `AspectRatio.spec.tsx`          | `AspectRatio`          | Constrained aspect boxes                                            |
| `ResponsiveVisibility.spec.tsx` | `ResponsiveVisibility` | Breakpoint-driven show/hide                                         |

#### Content layer (`src/content/`)

| Spec file        | Component tested | Key coverage                                                           |
| ---------------- | ---------------- | ---------------------------------------------------------------------- |
| `Badge.spec.tsx` | `Badge`          | Variant colors, sizes (sm/md/lg), dot indicator, polymorphic rendering |
| `Icon.spec.tsx`  | `Icon`           | Icon name resolution, size, color                                      |
| `Text.spec.tsx`  | `Text`           | Typography variants, truncation, semantic elements                     |

#### Interaction layer (`src/interaction/`)

| Spec file         | Component tested | Key coverage                                                                                     |
| ----------------- | ---------------- | ------------------------------------------------------------------------------------------------ |
| `Button.spec.tsx` | `Button`         | Type × variant matrix (3×7), sizes, radius, icons, loading/disabled states, polymorphic `as="a"` |
| `Input.spec.tsx`  | `Input`          | Text input variants, states, validation feedback                                                 |
| `Label.spec.tsx`  | `Label`          | Form label associations                                                                          |

#### Composition layer (`src/composition/`)

| Spec file       | Component tested | Key coverage                          |
| --------------- | ---------------- | ------------------------------------- |
| `Card.spec.tsx` | `Card`           | Surface styles, polymorphic rendering |

#### Utility layer (`src/utility/`)

| Spec file                 | Component tested | Key coverage               |
| ------------------------- | ---------------- | -------------------------- |
| `Portal.spec.tsx`         | `Portal`         | DOM portal mounting        |
| `VisuallyHidden.spec.tsx` | `VisuallyHidden` | Screen-reader-only content |

---

### Configuration files

#### `playwright-ct.config.ts`

Defines the Playwright CT configuration:

- `testDir`: `./ ` (all spec files in the package)
- `snapshotDir`: `./__snapshots__`
- Timeout: 10 000 ms per test
- Fully parallel in development; single worker on CI
- **Browsers**:
  - `chromium-light` — Desktop Chrome, default color scheme (all tests)
  - `chromium-dark` — Desktop Chrome, `colorScheme: 'dark'` (Visual Regression tests only, via `grep: /Visual Regression/`)
- **Screenshot tolerance**: `maxDiffPixelRatio: 0.02`, `threshold: 0.2`
- **CI reporters**: `line`, `html`, `json`, `junit`
- CT port: `3100`

#### `playwright-ct.vite.config.ts`

Vite configuration used by Playwright to bundle components during testing. Uses `@vitejs/plugin-react` and ensures `lucide-react` resolves correctly for icon rendering.

#### `tsconfig.json`

Extends `@grasdouble/lufa_config_tsconfig/react-app.json`. Targets ES2020, includes strict unused-variable and side-effect import checks. Only `src/` and `playwright-ct.config.ts` are included.

---

### Snapshot management system

The package ships a complete three-method system for keeping visual regression baselines correct across platforms:

#### Method 1 — Automatic pre-commit compression

Triggered automatically via `lint-staged` + Husky on every commit that stages PNG snapshots.

- Uses `compress-snapshots-precommit.sh`
- Compression: `oxipng -o 3` (level 3, ~1 s/file, lossless)
- Result: 20–40% smaller PNGs without quality loss

#### Method 2 — Docker Linux snapshot generation

```bash
pnpm docker:update-snapshots-linux
# or from root:
pnpm ds:test:docker:update-snapshots-linux
```

- Builds a Node.js + pnpm Linux container
- Installs all dependencies inside (Linux binaries, no macOS conflicts)
- Runs Playwright CT with `--update-snapshots`
- Compresses output with `oxipng -o 6` (maximum)
- Writes snapshots back to host filesystem
- Time: ~4–6 minutes

#### Method 3 — GitHub Actions automated update

```bash
gh pr edit --add-label snapshot-update
```

- CI workflow detects the `snapshot-update` label on a PR
- Generates Linux snapshots on `ubuntu-latest`
- Compresses with `oxipng -o 6`
- Commits with message `test: update Linux snapshots (automated)`
- Posts a comment on the PR, then removes the label
- Time: ~5–7 minutes

#### Validate system health

```bash
pnpm validate-system
# or from root:
pnpm ds:test:validate-system
```

Checks: oxipng installation, Docker availability, pre-commit hook wiring, lint-staged configuration, GitHub Actions workflow, label existence, documentation presence.

---

## API Reference

This package does not export a public API. All surface area consists of Playwright test files.

### Shared test patterns

#### Standard test category template

```typescript
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/experimental-ct-react';
import { ComponentName } from '@grasdouble/lufa_design-system';

test.describe('ComponentName Component', () => {

  test.describe('Basic Rendering', () => { /* ... */ });

  test.describe('Variants', () => { /* ... */ });

  test.describe('User Interactions', () => { /* ... */ });

  test.describe('Accessibility', () => {
    test('should pass a11y checks', async ({ mount, page }) => {
      await mount(<ComponentName />);
      const results = await new AxeBuilder({ page })
        .disableRules(['page-has-heading-one', 'landmark-one-main', 'region'])
        .analyze();
      expect(results.violations).toEqual([]);
    });
  });

  test.describe('Visual Regression', () => {
    test('should match snapshot for all variants', async ({ mount }) => {
      const component = await mount(/* composite render of all variants */);
      await component.page().waitForTimeout(100);
      await expect(component).toHaveScreenshot('component-all-variants.png');
    });
  });
});
```

#### Accessibility ARIA snapshot

```typescript
test('should have accessible structure', async ({ mount }) => {
  const component = await mount(
    <Box as="nav" role="navigation" aria-label="Test navigation">
      Navigation content
    </Box>
  );
  await expect(component).toMatchAriaSnapshot(`
    - navigation "Test navigation":
      - text: Navigation content
  `);
});
```

#### Visual regression screenshot

```typescript
// All variants rendered in a single 900–1200 px wide composite
await expect(component).toHaveScreenshot('badge-all-variants.png');
// Tolerance: maxDiffPixelRatio=0.02, threshold=0.2
```

---

## NPM Scripts

| Script                          | Description                                        |
| ------------------------------- | -------------------------------------------------- |
| `test` / `test-ct`              | Run all Playwright CT tests                        |
| `test-ct:ui`                    | Open Playwright UI mode for interactive inspection |
| `test-ct:update-snapshots`      | Update baselines + compress snapshots              |
| `compress-snapshots`            | Manually compress all snapshots (oxipng level 6)   |
| `docker:update-snapshots-linux` | Generate Linux snapshots via Docker                |
| `lint`                          | ESLint check                                       |
| `lint:fix`                      | ESLint auto-fix                                    |
| `typecheck`                     | TypeScript type check (no emit)                    |
| `validate-system`               | Validate snapshot management system health         |

### Root-level shortcuts

```bash
pnpm ds:test                               # Run all CT tests
pnpm ds:test:ui                            # UI mode
pnpm ds:test:update-snapshots              # Update + compress
pnpm ds:playwright:compress-snapshots            # Manual compress only
pnpm ds:test:docker:update-snapshots-linux # Docker Linux snapshots
```

---

## Usage Examples

### Running tests locally

```bash
# Standard test run
pnpm test-ct

# Interactive UI — inspect diffs side-by-side
pnpm test-ct:ui

# Update baselines after intentional design changes
pnpm test-ct:update-snapshots
```

### Writing a new component test

```typescript
// src/content/MyComponent.spec.tsx
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/experimental-ct-react';
import { MyComponent } from '@grasdouble/lufa_design-system';

test.describe('MyComponent Component', () => {
  test.describe('Basic Rendering', () => {
    test('should render with default props', async ({ mount }) => {
      const component = await mount(<MyComponent>Hello</MyComponent>);
      await expect(component).toBeVisible();
      await expect(component).toContainText('Hello');
    });
  });

  test.describe('Accessibility', () => {
    test('should pass a11y checks', async ({ mount, page }) => {
      await mount(<MyComponent>Hello</MyComponent>);
      const results = await new AxeBuilder({ page })
        .disableRules(['page-has-heading-one', 'landmark-one-main', 'region'])
        .analyze();
      expect(results.violations).toEqual([]);
    });
  });

  test.describe('Visual Regression', () => {
    test('should match snapshot for all variants', async ({ mount }) => {
      const component = await mount(
        <div style={{ padding: '32px', background: 'var(--lufa-semantic-ui-background-page)', width: '900px' }}>
          <MyComponent variant="default">Default</MyComponent>
          <MyComponent variant="success">Success</MyComponent>
        </div>
      );
      await component.page().waitForTimeout(100);
      await expect(component).toHaveScreenshot('mycomponent-all-variants.png');
    });
  });
});
```

### Updating snapshots after a design change

```bash
# 1. Run tests to see what changed
pnpm ds:test:ui

# 2. Accept new baselines
pnpm ds:test:update-snapshots

# 3. Commit (pre-commit hook compresses PNGs automatically)
git add .
git commit -m "test: update snapshots for new Button design"

# 4. Push and update Linux baselines via CI
gh pr edit --add-label snapshot-update
git pull  # after CI completes
```

### Installing prerequisites for snapshot compression

```bash
# macOS
brew install oxipng

# Verify
oxipng --version

# Check full system health
pnpm ds:test:validate-system
```

---

## Dependencies

### Runtime devDependencies (all)

| Package                             | Version       | Purpose                                  |
| ----------------------------------- | ------------- | ---------------------------------------- |
| `@playwright/experimental-ct-react` | `^1.58.2`     | Core CT framework                        |
| `@axe-core/playwright`              | `^4.11.0`     | Accessibility auditing                   |
| `react` / `react-dom`               | `^19.2.4`     | Component rendering                      |
| `@types/react` / `@types/react-dom` | `^19.2.x`     | TypeScript types                         |
| `typescript`                        | `^5.9.3`      | Type checking                            |
| `lucide-react`                      | `^0.563.0`    | Icon library (required by design system) |
| `@grasdouble/lufa_design-system`    | `workspace:^` | The component library under test         |
| `@grasdouble/lufa_config_eslint`    | `workspace:^` | Shared ESLint config                     |
| `@grasdouble/lufa_config_tsconfig`  | `workspace:^` | Shared TypeScript config                 |
| `@types/node`                       | `^25.1.0`     | Node.js type definitions                 |

### External tools (not installed via pnpm)

| Tool     | Version  | Purpose                                |
| -------- | -------- | -------------------------------------- |
| `oxipng` | ≥ 10.0.0 | Lossless PNG compression for snapshots |
| `docker` | any      | Linux snapshot generation              |

---

## Related Documentation

| Document                           | Location                              |
| ---------------------------------- | ------------------------------------- |
| Snapshot management system         | `_docs/snapshot-management-system.md` |
| Docker Linux snapshots guide       | `_docs/docker-linux-snapshots.md`     |
| Snapshot update via GitHub Actions | `_docs/snapshot-update.md`            |
| Compression scripts reference      | `scripts/README.md`                   |
| Snapshot compression overview      | `_docs/snapshot-compression.md`       |
| Test structure                     | `_docs/test-structure.md`             |
| Configuration details              | `_docs/configuration.md`              |
| Writing tests guide                | `_docs/writing-tests.md`              |
| CI/CD integration                  | `_docs/ci-cd.md`                      |
| Troubleshooting                    | `_docs/troubleshooting.md`            |
| Design system package              | `@grasdouble/lufa_design-system`      |
