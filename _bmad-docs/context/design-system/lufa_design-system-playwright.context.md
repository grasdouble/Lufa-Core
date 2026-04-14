---
package: '@grasdouble/lufa_design-system-playwright'
shortName: lufa_design-system-playwright
category: design-system
type: context
lastUpdated: '2026-04-07'
generatedAtCommit: 'ab53a003edb177c2298250479fbe4465ee920bc3'
---

# Context: @grasdouble/lufa_design-system-playwright

## What this package is

A private Playwright Component Testing (CT) package that acts as the quality gate for `@grasdouble/lufa_design-system`. It mounts design system components inside a real browser (Chromium via Vite) and verifies behavioral correctness, accessibility compliance, and visual appearance. Nothing in this package is shipped or published.

---

## What this package is NOT

- It is **not** a Storybook or documentation site.
- It is **not** an end-to-end test suite targeting a running application.
- It does **not** export any utilities, helpers, or fixtures for other packages to consume.
- It is **not** a unit test suite — tests require a browser via `@playwright/experimental-ct-react`.

---

## Relationship to other packages

```
@grasdouble/lufa_design-system   ← the component library being tested
        ↑  (devDependency)
@grasdouble/lufa_design-system-playwright   ← this package
        ↑  (devDependencies)
@grasdouble/lufa_config_eslint
@grasdouble/lufa_config_tsconfig
@grasdouble/lufa_config_prettier
```

All imports in spec files come from `@grasdouble/lufa_design-system`. The tests never import from this package's own source.

---

## Test file layout

```
src/
├── foundation/     11 spec files   Box, Stack, Flex, Grid, Container, Center,
│                                   Cluster, Bleed, Divider, AspectRatio,
│                                   ResponsiveVisibility
├── content/         3 spec files   Badge, Icon, Text
├── interaction/     3 spec files   Button, Input, Label
├── composition/     1 spec file    Card
├── utility/         2 spec files   Portal, VisuallyHidden
└── components/      (empty, reserved)
```

Total: **20 spec files** across 5 categories.

---

## Test categories (applied to every spec file)

Every spec file follows this structure:

```
1. Basic Rendering      → visibility, tag name, children, className, style
2. Variants             → all documented prop values, combinations, edge cases
3. User Interactions    → click, focus, keyboard (Enter, Space), mouse events
4. Accessibility        → axe-core scan, ARIA attributes, toMatchAriaSnapshot
5. Visual Regression    → single composite screenshot of all variants
```

Dark-mode visual regression runs only for tests matching `/Visual Regression/` using the `chromium-dark` project (colorScheme: dark).

---

## Browser configuration

| Project name     | Browser        | Color scheme | Scope                  |
| ---------------- | -------------- | ------------ | ---------------------- |
| `chromium-light` | Desktop Chrome | light        | All tests              |
| `chromium-dark`  | Desktop Chrome | dark         | Visual Regression only |

Firefox and WebKit projects are defined but commented out. Mobile viewports are commented out.

---

## Snapshot system at a glance

Snapshots are PNG files stored under `__snapshots__/src/<category>/`. The directory mirrors the `src/` test layout — each category subdirectory holds the baseline images for that component group. There is a single snapshot set (no separate `darwin/` or `linux/` directories on disk); platform differences are handled by the snapshot update workflow described below.

### Three update methods

| Method               | Command                                              | When to use                               |
| -------------------- | ---------------------------------------------------- | ----------------------------------------- |
| Local (macOS)        | `pnpm ds:playwright:update-snapshots`                | After intentional visual changes          |
| Docker (Linux local) | `pnpm ds:playwright:docker:update-snapshots-linux`   | When CI parity is needed offline          |
| GitHub Actions       | `gh pr edit --add-label snapshot-update`             | Standard team workflow (no Docker needed) |

### Compression

All snapshots are compressed with `oxipng` (lossless PNG optimizer):

- **Pre-commit**: level 3 (~1 s/file, 20–40% reduction) — automatic via lint-staged
- **Manual/CI**: level 6 (~3–6 s/file, maximum compression) — run after bulk updates

`oxipng` must be installed locally (`brew install oxipng` on macOS).

---

## Key configuration facts

| Setting                        | Value                          |
| ------------------------------ | ------------------------------ |
| `testDir`                      | `./` (entire package)          |
| `snapshotDir`                  | `./__snapshots__`              |
| Per-test timeout               | 10 000 ms                      |
| Parallel execution             | Yes (dev) / single worker (CI) |
| CT port                        | 3100                           |
| Screenshot `maxDiffPixelRatio` | 0.02 (2%)                      |
| Screenshot `threshold`         | 0.2                            |
| CI retries                     | 2                              |
| CI reporters                   | line, html, json, junit        |

---

## Accessibility testing pattern

Every spec file includes at minimum one axe-core scan. Three rules are globally disabled because they require page-level structure that CT mount points do not provide:

```typescript
await new AxeBuilder({ page }).disableRules(['page-has-heading-one', 'landmark-one-main', 'region']).analyze();
```

All other axe-core rules run with default severity. A non-empty `violations` array fails the test.

---

## Visual regression composite pattern

Each component has exactly one visual regression test. It mounts a single wide `<div>` (typically 900–1200 px) containing labeled sections for every prop variant, then takes one screenshot:

```typescript
test.describe('Visual Regression', () => {
  test('should match snapshot for all variants', async ({ mount }) => {
    const component = await mount(/* wide composite render */);
    await component.page().waitForTimeout(100); // rendering stabilization
    await expect(component).toHaveScreenshot('component-all-variants.png');
  });
});
```

This approach minimizes snapshot file count while maximizing coverage in a single review diff.

---

## How to add a test for a new component

1. Identify the component's category (`foundation`, `content`, `interaction`, `composition`, `utility`).
2. Create `src/<category>/ComponentName.spec.tsx`.
3. Follow the five-category structure.
4. Import exclusively from `@grasdouble/lufa_design-system`.
5. Use semantic CSS variable names for visual regression scaffolding (e.g., `var(--lufa-semantic-ui-background-page)`).
6. Run `pnpm test-ct:update-snapshots` to generate initial baselines.
7. Push and add the `snapshot-update` GitHub label to generate Linux baselines.

---

## Known constraints

- Tests run in Chromium only (Firefox/WebKit are disabled to reduce CI time).
- `@playwright/experimental-ct-react` is experimental; API may change between Playwright releases.
- Snapshot comparison is pixel-based; font rendering differences between macOS and Linux necessitate separate snapshot sets.
- `oxipng` is a required external tool that must be installed by each developer manually.
- Visual regression dark-mode tests use a regex grep (`/Visual Regression/`) to scope the `chromium-dark` project — test names must contain the literal string "Visual Regression".

---

## Common commands

```bash
# Run all tests (from package root)
pnpm test-ct

# Open interactive UI to inspect diffs
pnpm test-ct:ui

# Update local (macOS) snapshots
pnpm test-ct:update-snapshots

# Compress all snapshots manually
pnpm compress-snapshots

# Generate Linux snapshots via Docker
pnpm docker:update-snapshots-linux

# Type check
pnpm typecheck

# Lint
pnpm lint

# Format check / write
pnpm prettier:check
pnpm prettier:write

# Validate design token usage in test files
pnpm validate:token-usage

# Validate entire snapshot system health
pnpm validate-system
```

Root-level monorepo shortcuts (from repo root, via `pnpm ds:playwright:*`):

```bash
pnpm ds:playwright:ci                         # Run tests in CI mode
pnpm ds:playwright:ui                         # Open Playwright UI
pnpm ds:playwright:update-snapshots           # Update macOS baselines
pnpm ds:playwright:docker:update-snapshots-linux  # Update Linux baselines via Docker
```

---

## Files that AI agents should read when working on this package

| File                                  | Why                                                   |
| ------------------------------------- | ----------------------------------------------------- |
| `playwright-ct.config.ts`             | Browser projects, timeouts, snapshot settings         |
| `src/interaction/Button.spec.tsx`     | Canonical example of a full-coverage interaction spec |
| `src/foundation/Box.spec.tsx`         | Canonical example of a full-coverage layout spec      |
| `src/content/Badge.spec.tsx`          | Canonical example of a content component spec         |
| `scripts/README.md`                   | Compression scripts documentation                     |
| `_docs/snapshot-management-system.md` | Complete snapshot lifecycle guide                     |
| `package.json`                        | Scripts, lint-staged config, dependency versions      |
