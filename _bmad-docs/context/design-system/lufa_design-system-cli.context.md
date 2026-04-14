---
generatedAtCommit: "ab53a003edb177c2298250479fbe4465ee920bc3"
lastUpdated: "2026-04-07"
package: "@grasdouble/lufa_design-system-cli"
---

# Context: @grasdouble/lufa_design-system-cli

## Package Info

| Field | Value |
|-------|-------|
| Name | `@grasdouble/lufa_design-system-cli` |
| Version | `1.1.1` |
| Module type | ESM (`"type": "module"`) |
| Binary | `lufa-ds-cli` → `dist/cli.js` |
| Programmatic API | None — CLI binary only |
| Node requirement | `>=20` |
| Registry | `https://npm.pkg.github.com` |

## Critical Rules

1. **ESM only** — `"type": "module"`. All internal imports use `.js` extensions (e.g. `./utils/parse-css.js`). Do not use `require()`.

2. **No programmatic API** — this package exports only a CLI binary. There is no `index.ts` or public import surface for consumers. Do not try to `import` from `@grasdouble/lufa_design-system-cli` in application code.

3. **Binary name changed** — the binary is `lufa-ds-cli`, **not** `lufa-validate-theme` (the old name from v1.0.x). Update any scripts or CI configs that reference the old name.

4. **`@grasdouble/lufa_design-system-tokens` must be built first** — both `validateA11y` and `getColorPairsToCheck` resolve paths via `import.meta.resolve()` at runtime. If the tokens package is not built, the CLI will throw at startup. Build order: `tokens` → `cli`.

5. **No `completeness` check in this version** — `completeness.ts` and `validateCompleteness` no longer exist (removed after v1.0.x). The `theme-validate` command runs only **format** and **a11y** checks. The `--completeness` flag shown in older docs is not implemented in the current binary.

6. **Color pairs are metadata-driven** — `contrast.ts` derives all fg/bg pairs from `@grasdouble/lufa_design-system-tokens/metadata`. There are no hardcoded pairs. Pair logic lives in the token metadata (`extensions.lufa.contrastWith`), not in the CLI source.

7. **Circular `var()` references resolve to `null`** — `resolveCSSVarValue` tracks visited variable names and returns `null` on a cycle. The a11y validator skips those pairs (increments `skipped`, does not flag a violation).

8. **Base tokens are loaded once and cached** — `loadBaseTokens()` in `a11y.ts` uses a module-level cache (`_baseTokensCache`). Repeated calls to `validateA11y` in the same process do not re-read `tokens.css` from disk.

9. **Theme modes are discovered dynamically** — the validator only checks modes that are present in the theme file (`data-mode='light'`, `data-mode='dark'`, `data-mode='high-contrast'`). A missing mode is silently skipped, not an error.

10. **`postcss` and `postcss-value-parser` are declared but unused** — current CSS parsing is regex-based (`parse-css.ts`). Do not rely on these packages being invoked internally.

## Import Pattern

### CLI (binary — the only supported usage)

```bash
# After install or via npx:
npx lufa-ds-cli theme-validate ./my-theme.css
npx lufa-ds-cli theme-template extended -o my-theme
```

```bash
# Global install:
npm install -g @grasdouble/lufa_design-system-cli
lufa-ds-cli theme-validate ./my-theme.css
```

```bash
# As an npm script (with the package in devDependencies):
# package.json:
# "validate-theme": "lufa-ds-cli theme-validate src/theme.css"
pnpm validate-theme
```

There is no programmatic import API.

## Key Types

```typescript
// src/cli.ts
type TemplateLevel = 'starter' | 'extended' | 'advanced';

type ValidateOptions = {
  a11y?: boolean;
  format?: boolean;
  dir?: string;
};

// src/utils/parse-css.ts
type CSSCustomProperty = {
  name: string;   // e.g. '--lufa-core-color-brand-primary-default'
  value: string;  // e.g. '#0e7490' or 'var(--lufa-primitive-color-cyan-600)'
  line: number;   // 1-based
};

// src/validators/a11y.ts
type A11yMode = 'light' | 'dark' | 'high-contrast';

type A11yViolation = {
  foreground: string;   // CSS var name
  background: string;   // CSS var name
  ratio: number;        // actual ratio (2 decimal places)
  required: number;     // 4.5 for text, 3.0 for ui
  type: 'text' | 'ui';
  mode: A11yMode;
};

type A11yModeResult = {
  mode: A11yMode;
  valid: boolean;
  violations: A11yViolation[];
  totalChecks: number;
  skipped: number;
};

type A11yResult = {
  valid: boolean;           // true only if ALL modes pass
  modes: A11yModeResult[];
  totalViolations: number;
};

// src/validators/format.ts
type FormatError = {
  token: string;
  value: string;
  expectedFormat: string;
  line: number;
};

type FormatResult = {
  valid: boolean;
  errors: FormatError[];
  totalChecked: number;
};

// src/utils/contrast.ts (internal)
type ColorPair = [string, string, 'text' | 'ui'];
// [fgCssSuffix, bgCssSuffix, contrastType]
// e.g. ['semantic-ui-text-primary', 'semantic-ui-background-page', 'text']
```

## Common Patterns

### Validate a theme in CI (all checks)

```bash
lufa-ds-cli theme-validate ./src/theme.css
# exit 0 = pass, exit 1 = validation errors, exit 2 = fatal error
```

### Validate only a11y (contrast) in CI

```bash
lufa-ds-cli theme-validate --a11y ./src/theme.css
```

### Validate every theme in a directory

```bash
lufa-ds-cli theme-validate --dir ./themes/src
```

### Generate a starter theme and customize it

```bash
lufa-ds-cli theme-template starter -o my-brand
# → creates my-brand.css in CWD with all core token overrides pre-filled
# Edit my-brand.css, then:
lufa-ds-cli theme-validate ./my-brand.css
```

### Use in a pre-commit hook

```bash
# .husky/pre-commit
npx lufa-ds-cli theme-validate src/theme.css || exit 1
```

### Use in a GitHub Actions workflow

```yaml
- run: npm install -g @grasdouble/lufa_design-system-cli
- run: lufa-ds-cli theme-validate src/theme.css
```

### Validate themes from the `@grasdouble/lufa_design-system-themes` package

```bash
# The themes package uses this pattern in its own scripts:
lufa-ds-cli theme-validate --dir src
lufa-ds-cli theme-validate src/ocean.css
```

## Anti-patterns

### Using the old binary name

```bash
# WRONG — binary was renamed in v1.1.x
lufa-validate-theme ./my-theme.css

# CORRECT
lufa-ds-cli theme-validate ./my-theme.css
```

### Expecting a programmatic import API

```typescript
// WRONG — there is no public module export
import { validateTheme } from '@grasdouble/lufa_design-system-cli';
import { validateFormat } from '@grasdouble/lufa_design-system-cli';

// CORRECT — use the CLI binary only
// $ lufa-ds-cli theme-validate ./my-theme.css
```

### Expecting a `--completeness` flag

```bash
# WRONG — completeness check was removed; this flag does nothing
lufa-ds-cli theme-validate --completeness ./my-theme.css

# CORRECT — use the default (all checks) which runs format + a11y
lufa-ds-cli theme-validate ./my-theme.css
```

### Passing a directory path as the theme-file argument

```bash
# WRONG — the positional arg is a file, not a directory
lufa-ds-cli theme-validate ./themes/src

# CORRECT — use the --dir flag for directories
lufa-ds-cli theme-validate --dir ./themes/src
```

### Running without building the tokens package first

```bash
# WRONG — will throw at runtime if tokens/dist is missing
lufa-ds-cli theme-validate ./my-theme.css

# CORRECT — build tokens first
pnpm --filter @grasdouble/lufa_design-system-tokens build
lufa-ds-cli theme-validate ./my-theme.css
```

### Treating skipped checks as failures

Skipped pairs (counted in `A11yModeResult.skipped`) occur when one of the two tokens in a pair is absent from the theme. This is not an error — the pair simply cannot be evaluated. Missing tokens are expected for partial themes or themes that only define a subset of modes.

## Dependencies Context

### `@grasdouble/lufa_design-system-tokens` (`workspace:^`)

The most critical runtime dependency. The CLI reads two artifacts from this package at runtime:

- **`tokens.css`** — loaded by `a11y.ts:loadBaseTokens()` via `import.meta.resolve('@grasdouble/lufa_design-system-tokens/tokens.css')`. Provides the full var() chain scaffolding (semantic → core → primitive).
- **`metadata`** — loaded by `contrast.ts:getColorPairsToCheck()` via `import.meta.resolve('@grasdouble/lufa_design-system-tokens/metadata')`. Contains token tree with `extensions.lufa.contrastWith` annotations.
- **`themeable-starter`, `themeable-extended`, `themeable-advanced`** — loaded by `cli.ts:runTemplate()`. Template CSS files written to CWD.

If the tokens package is not built, all three fail with a descriptive error message.

### `chalk` (`^5.6.2`)

Used exclusively in `cli.ts` for terminal color output. Chalk v5 is ESM-only — consistent with this package's module type. Not used in validators or utils.

### `commander` (`^14.0.3`)

Used exclusively in `cli.ts` for argument parsing, sub-command definitions, and `--help` generation. Not used in validators or utils.

### `postcss` / `postcss-value-parser`

Declared as runtime dependencies. **Not invoked by any current source file.** Available for future extension of the CSS parsing layer without a new dependency install.

## Quick Reference

| Goal | Command |
|------|---------|
| Validate all checks | `lufa-ds-cli theme-validate ./my-theme.css` |
| Validate a11y only | `lufa-ds-cli theme-validate --a11y ./my-theme.css` |
| Validate format only | `lufa-ds-cli theme-validate --format ./my-theme.css` |
| Validate all files in dir | `lufa-ds-cli theme-validate --dir ./themes/src` |
| Generate starter template | `lufa-ds-cli theme-template -o my-brand` |
| Generate extended template | `lufa-ds-cli theme-template extended -o my-brand` |
| Generate advanced template | `lufa-ds-cli theme-template advanced -o my-brand` |
| Show help | `lufa-ds-cli --help` |
| Show sub-command help | `lufa-ds-cli theme-validate --help` |

**Exit codes:** `0` = pass, `1` = validation errors, `2` = fatal/usage error.

## See Also

- [`@grasdouble/lufa_design-system-tokens`](./lufa_design-system-tokens.context.md) — defines the token structure and metadata this CLI reads
- [`@grasdouble/lufa_design-system-themes`](./lufa_design-system-themes.context.md) — pre-built themes that are validated using this CLI in their build pipeline
- `packages/design-system/cli/_docs/usage.md` — full CLI usage reference
- `packages/design-system/cli/_docs/validation-checks.md` — detailed description of each check
- `packages/design-system/cli/_docs/examples.md` — example terminal output
- `packages/design-system/cli/_docs/ci-cd-integration.md` — CI/CD integration patterns
- `packages/design-system/cli/_docs/development.md` — development workflow
