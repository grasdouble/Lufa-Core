---
package: '@grasdouble/lufa_design-system-cli'
shortName: lufa_design-system-cli
category: design-system
version: '1.0.1'
private: false
lastUpdated: '2026-02-24'
generatedAtCommit: 'd27c912328f538971b6720513be2c817c2feff15'
---

# @grasdouble/lufa_design-system-cli

## Overview

`@grasdouble/lufa_design-system-cli` is the theme validation toolchain for the Lufa Design System. It ships both a standalone CLI binary (`lufa-validate-theme`) and a programmatic API that consumers can import in TypeScript/JavaScript. Given a custom theme CSS file, the tool enforces three categories of rules: token completeness, WCAG AA colour contrast, and CSS value format correctness.

## Purpose

Custom themes in the Lufa Design System must override all 438+ CSS custom properties defined in `@grasdouble/lufa_design-system-tokens`. This package provides the automated enforcement layer that prevents incomplete, inaccessible, or malformed themes from reaching production.

Key goals:

- **Completeness** – every required token is present in the theme file.
- **Accessibility** – colour pairs meet WCAG 2.1 AA contrast ratios (4.5:1 for text, 3.0:1 for UI components).
- **Format correctness** – hex colours, dimensions, durations, font-weights, and z-indices follow expected syntaxes.
- **Template generation** – output a pre-filled 629-line starter CSS file that teams can customise.

## Architecture

```
src/
├── cli.ts              # CLI entry-point (Commander program, bin: lufa-validate-theme)
├── index.ts            # Programmatic API entry-point (public exports)
├── templates/
│   └── theme-template.css   # 629-line starter template (all 438+ tokens)
├── utils/
│   ├── parse-css.ts    # CSS parsing, property extraction, var() resolution
│   └── wcag.ts         # WCAG 2.1 luminance & contrast-ratio calculations
└── validators/
    ├── completeness.ts # Checks all required tokens are defined
    ├── contrast.ts     # Checks 55 predefined colour-pair contrast ratios
    └── format.ts       # Checks value syntax per token-name convention
```

The CLI (`cli.ts`) is a thin orchestration layer: it parses arguments with [Commander](https://github.com/tj/commander.js), calls `parseCSSFile` to extract properties, then delegates to the three validators sequentially, collecting errors and reporting results to stdout with [Chalk](https://github.com/chalk/chalk) formatting.

The programmatic API (`index.ts`) re-exports all validators, utilities, and key types so downstream tooling can call them without spawning a subprocess.

### Token-level taxonomy

CSS custom properties are categorised into four levels, identified by name prefix:

| Level         | Prefix              | Description                                     |
| ------------- | ------------------- | ----------------------------------------------- |
| 1 – Primitive | `--lufa-primitive-` | Raw values (colours, spacing sizes, durations)  |
| 2 – Core      | `--lufa-core-`      | Brand colours and neutral palette aliases       |
| 3 – Semantic  | `--lufa-semantic-`  | UI-state meanings (primary, hover, disabled, …) |
| 4 – Component | `--lufa-component-` | Per-component token overrides                   |

## Key Components

### `src/cli.ts` – CLI entry-point

Registered as the `lufa-validate-theme` binary. Accepts one positional argument (path to a theme CSS file) and three options.

Execution flow:

1. If `--template` is present, reads `dist/templates/theme-template.css` and writes it to stdout, then exits.
2. Otherwise, calls `parseCSSFile(themeFile)` to extract `CSSCustomProperty[]`.
3. Runs `validateCompleteness`, `validateContrast`, and `validateFormat` in sequence.
4. Reports each section with coloured output; exits with code `1` on any error, `2` on usage/runtime errors, `0` on success.

### `src/index.ts` – Programmatic API

Exports all three validators, all utility functions from `parse-css.ts` and `wcag.ts`, the `ValidationResult` type, and the convenience wrapper `validateTheme(themePath)`.

### `src/utils/parse-css.ts` – CSS parser

Uses a regex-based approach (no external CSS parser dependency at runtime) to extract `CSSCustomProperty` objects `{ name, value, line }`. Also provides:

- `tokenNameFromCSSVar` / `cssVarNameFromToken` – convert between `--lufa-*` CSS var names and dot-notation token names.
- `resolveCSSVarValue` – recursively follows `var(--lufa-*)` references, guarding against circular references.
- `groupPropertiesByLevel` – buckets properties into the four taxonomy levels.
- Type-check helpers: `isValidHexColor`, `isValidDimension`, `isValidDuration`.

### `src/utils/wcag.ts` – WCAG utilities

Pure functions implementing WCAG 2.1 §1.4.3 contrast calculation:

- `hexToRgb` – parses 3- and 6-digit hex strings.
- `getRelativeLuminance` – applies gamma correction per W3C spec.
- `getContrastRatio` – returns the (L1 + 0.05) / (L2 + 0.05) ratio.
- `WCAG_LEVELS` – typed constant object with AA/AAA thresholds for normal text, large text, and UI components.
- `meetsWCAG_AA_Text`, `meetsWCAG_AA_UI`, `meetsWCAG_AAA`, `getWCAGLevel` – conformance predicates and labels.

### `src/validators/completeness.ts`

Reads `tokens-metadata.json` from `@grasdouble/lufa_design-system-tokens` at runtime, extracts every token that has a `value` property (via recursive traversal), and compares the resulting list against the properties found in the theme. Returns `CompletenessResult` with lists of missing and extra tokens. Extra tokens are non-fatal (returned as warnings in the programmatic API).

### `src/validators/contrast.ts`

Hard-codes 55 foreground/background token-suffix pairs covering: text on page and surface backgrounds, status colours (success/error/warning/info), borders, interactive elements, buttons (primary, secondary, ghost, danger), badges (6 variants), inputs (4 states), tooltips, popovers, alerts, and cards. For each pair it resolves `var()` references, calculates the contrast ratio, and compares against 4.5:1 (text) or 3.0:1 (UI). Returns `ContrastResult`.

### `src/validators/format.ts`

Infers the expected value format from the token name suffix:

| Token suffix contains                                    | Expected format                                     |
| -------------------------------------------------------- | --------------------------------------------------- |
| `-color-`                                                | hex `#RGB`/`#RRGGBB`, `rgb()`, `rgba()`, or `var()` |
| `-spacing-`, `-radius-`, `-font-size-`                   | CSS dimension with unit                             |
| `-duration-`                                             | CSS duration (`ms` or `s`)                          |
| `-font-weight-`                                          | integer 100–900                                     |
| `-z-index-`                                              | integer                                             |
| `-shadow-`, `-font-family-`, `-easing-`, `-line-height-` | lenient (any value accepted)                        |

Returns `FormatResult` with per-token `FormatError` objects including token name, invalid value, expected format description, and source line number.

### `src/templates/theme-template.css`

A 629-line CSS file containing all 438+ tokens as editable custom properties. Included in the published package under the sub-path export `./templates/theme-template.css`. Consumed by the `--template` CLI option to give developers a starting point.

## CLI Commands

### `lufa-validate-theme`

Binary registered in `package.json#bin`.

#### Synopsis

```
lufa-validate-theme [options] [theme-file]
```

#### Arguments

| Argument       | Description                                                             |
| -------------- | ----------------------------------------------------------------------- |
| `[theme-file]` | Path to the CSS file to validate. Required unless `--template` is used. |

#### Options

| Option           | Description                                                                       |
| ---------------- | --------------------------------------------------------------------------------- |
| `-t, --template` | Output the starter theme template to stdout instead of validating.                |
| `-v, --verbose`  | Show all errors/violations even when the list is long (default shows first 5–10). |
| `--no-color`     | Disable Chalk colour output (useful for CI log files that do not support ANSI).   |
| `-V, --version`  | Print CLI version.                                                                |
| `-h, --help`     | Show help text.                                                                   |

#### Exit codes

| Code | Meaning                                                                                     |
| ---- | ------------------------------------------------------------------------------------------- |
| `0`  | Theme passed all validations.                                                               |
| `1`  | One or more validation failures (completeness, contrast, or format).                        |
| `2`  | Usage error (missing argument) or runtime error (file not found, tokens package not built). |

## Usage Examples

### CLI – validate a theme

```bash
# Basic validation
lufa-validate-theme ./my-brand-theme.css

# Verbose: show every error
lufa-validate-theme --verbose ./my-brand-theme.css

# Disable colour for CI log capture
lufa-validate-theme --no-color ./my-brand-theme.css

# Generate a starter template
lufa-validate-theme --template > my-brand-theme.css
```

### CLI – typical validation output

```
🔍 Validating theme: ./my-brand-theme.css

Found 438 custom properties

1. Completeness Check
✓ All 438 required tokens are defined

2. Contrast Check (WCAG AA)
✗ 2 contrast violations found
  Violations:
    - --lufa-semantic-ui-text-secondary on --lufa-semantic-ui-background-page: 3.8:1 (needs 4.5:1 for text)
    - --lufa-component-badge-warning-text on --lufa-component-badge-warning-background: 2.1:1 (needs 4.5:1 for text)

3. Format Check
✓ All 438 token values have valid formats

❌ Theme validation failed

Run with --verbose to see all errors
```

### Programmatic API – basic usage

```typescript
import { validateTheme } from '@grasdouble/lufa_design-system-cli';

const result = await validateTheme('./my-brand-theme.css');

if (result.valid) {
  console.log('Theme is valid!');
} else {
  console.error('Errors:', result.errors);
  if (result.warnings) {
    console.warn('Warnings:', result.warnings);
  }
}
```

### Programmatic API – individual validators

```typescript
import {
  parseCSSFile,
  validateCompleteness,
  validateContrast,
  validateFormat,
} from '@grasdouble/lufa_design-system-cli';

const properties = await parseCSSFile('./my-brand-theme.css');

const completeness = await validateCompleteness(properties);
// { valid: true, totalRequired: 438, totalDefined: 442, missingTokens: [], extraTokens: [...] }

const contrast = validateContrast(properties);
// { valid: false, violations: [...], totalChecks: 55 }

const format = validateFormat(properties);
// { valid: true, errors: [], totalChecked: 442 }
```

### Programmatic API – WCAG utilities

```typescript
import { getContrastRatio, getWCAGLevel, WCAG_LEVELS } from '@grasdouble/lufa_design-system-cli';

const ratio = getContrastRatio('#1E293B', '#F8FAFC');
// 14.12

console.log(getWCAGLevel(ratio ?? 0));
// 'AAA (Normal Text)'

console.log(ratio !== null && ratio >= WCAG_LEVELS.AA_NORMAL_TEXT);
// true
```

### CSS variable name conversion

```typescript
import { cssVarNameFromToken, tokenNameFromCSSVar } from '@grasdouble/lufa_design-system-cli';

tokenNameFromCSSVar('--lufa-primitive-color-blue-500');
// 'primitive.color.blue.500'

cssVarNameFromToken('primitive.color.blue.500');
// '--lufa-primitive-color-blue-500'
```

### Template sub-path import (CSS)

The theme template CSS file is exposed as a sub-path export and can be referenced directly in build tooling:

```javascript
// In a bundler config / PostCSS pipeline:
import templateUrl from '@grasdouble/lufa_design-system-cli/templates/theme-template.css';
```

### CI/CD integration (GitHub Actions example)

```yaml
- name: Validate design system theme
  run: npx lufa-validate-theme --no-color ./src/themes/brand.css
```

## Dependencies

### Runtime dependencies

| Package                                 | Version       | Role                                                                                              |
| --------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------- |
| `@grasdouble/lufa_design-system-tokens` | `workspace:^` | Source of truth for all required token names (loaded from `dist/tokens-metadata.json` at runtime) |
| `chalk`                                 | `^5.6.2`      | Coloured terminal output in the CLI                                                               |
| `commander`                             | `^14.0.2`     | CLI argument parsing and help generation                                                          |
| `postcss`                               | `^8.5.6`      | Listed as a dependency (available for future CSS parsing expansion)                               |
| `postcss-value-parser`                  | `^4.2.0`      | Listed as a dependency (available for future value parsing expansion)                             |

> Note: the current CSS parser in `parse-css.ts` is regex-based and does not invoke `postcss` or `postcss-value-parser` at runtime. They are available for future use or extension.

### Dev dependencies (key)

| Package               | Role                                        |
| --------------------- | ------------------------------------------- |
| `vitest`              | Unit test runner                            |
| `tsx`                 | Run TypeScript source directly (`pnpm dev`) |
| `typescript`          | Type-checking and compilation               |
| `eslint` / `prettier` | Code quality via shared config packages     |

### Engine requirement

Node.js **≥ 20** is required (uses `fs/promises`, `import.meta.url`, ESM).

## Related Documentation

Internal package documentation (relative to the source tree):

- `packages/design-system/cli/_docs/usage.md`
- `packages/design-system/cli/_docs/validation-checks.md`
- `packages/design-system/cli/_docs/examples.md`
- `packages/design-system/cli/_docs/cli-options.md`
- `packages/design-system/cli/_docs/ci-cd-integration.md`
- `packages/design-system/cli/_docs/development.md`
- `packages/design-system/cli/_docs/token-role-metadata.md`

Related packages:

- `@grasdouble/lufa_design-system-tokens` – defines the 438+ tokens this CLI validates against
- `@grasdouble/lufa_design-system-themes` – pre-built theme CSS files that pass this validator
- `@grasdouble/lufa_design-system-main` – React component library that consumes the validated tokens
