---
generatedAtCommit: "ab53a003edb177c2298250479fbe4465ee920bc3"
lastUpdated: "2026-04-07"
package: "@grasdouble/lufa_design-system-cli"
version: "1.1.1"
---

# @grasdouble/lufa_design-system-cli

## Overview

`@grasdouble/lufa_design-system-cli` is a Node.js command-line tool that validates custom theme CSS files against the Lufa Design System requirements. It provides two commands: `theme-validate` for checking theme correctness and `theme-template` for generating starter theme files.

The CLI is distributed as a binary (`lufa-ds-cli`) and requires Node.js 20 or later. It is ESM-only (`"type": "module"`).

## Purpose

Custom themes in the Lufa Design System override core CSS custom properties (CSS variables). This package provides automated quality gates ensuring that themes:

- Use valid CSS value formats for each token category (hex colors, dimensions, durations, font weights, etc.)
- Meet WCAG 2.2 AA contrast ratios across all theme modes (`light`, `dark`, `high-contrast`)
- Can be validated in CI/CD pipelines, pre-commit hooks, or as npm scripts

It also scaffolds new theme files from the official Lufa token templates at three complexity levels: **starter**, **extended**, and **advanced**.

## Architecture

```
src/
├── cli.ts                  Entry point — Commander program, sub-commands, output logic
├── utils/
│   ├── parse-css.ts        CSS file parsing, custom property extraction, var() resolution
│   ├── contrast.ts         Color pair provider — derives fg/bg pairs from token metadata
│   └── wcag.ts             WCAG 2.1/2.2 contrast ratio math and level constants
└── validators/
    ├── a11y.ts             Accessibility validator — WCAG AA per theme mode
    └── format.ts           Format validator — token value syntax checking
```

### Data Flow

```
theme.css
    │
    ▼
parseThemeFileByMode()          (a11y path — per data-mode block)
parseCSSFile()                  (format path — flat property list)
    │
    ▼
┌──────────────────────────────────────────────┐
│  validateFormat(CSSCustomProperty[])         │
│  • token name → expected format rule         │
│  • returns FormatResult                      │
└──────────────────────────────────────────────┘
┌──────────────────────────────────────────────┐
│  validateA11y(themePath)                     │
│  1. Load tokens.css from tokens package      │
│  2. Parse theme file per mode                │
│  3. Merge base + theme overrides             │
│  4. Resolve var() chains → hex               │
│  5. Check contrast vs WCAG AA thresholds     │
│  • returns A11yResult                        │
└──────────────────────────────────────────────┘
    │
    ▼
console output + process.exit(0 | 1 | 2)
```

### Color Pair Discovery

The accessibility validator derives all foreground/background color pairs from token metadata — no hardcoded pairs. `contrast.ts` reads `@grasdouble/lufa_design-system-tokens/metadata` and builds pairs from two complementary sources:

1. **Explicit annotations** — tokens with `extensions.lufa.contrastWith` (array of dot-notation token paths) and `extensions.lufa.contrastType` (`"text"` | `"ui"`). Used for cross-namespace pairs that cannot be inferred automatically.
2. **Sibling inference** — for every `-text` or `-border` token, attempts to find a corresponding `-background` sibling in the same path. A skip-pattern list prevents false positives (disabled states, overlays, focus rings, dividers, etc.).

Explicit pairs take precedence; sibling-inferred pairs fill the rest. The two sets are deduplicated by `fg|bg` key.

### Token Taxonomy (recognized by format validator)

| Level | CSS prefix | Description |
|-------|-----------|-------------|
| Primitive | `--lufa-primitive-` | Raw values — colors, spacing, durations |
| Core | `--lufa-core-` | Brand palette and neutral aliases |
| Semantic | `--lufa-semantic-` | UI-state meanings (primary, hover, disabled) |
| Component | `--lufa-component-` | Per-component token overrides |

## Key Components

### `src/cli.ts` — Entry Point

The Commander-based CLI binary. Defines two sub-commands (`theme-validate`, `theme-template`), handles argument parsing, orchestrates runs across single files or directories, and controls console output with Chalk.

**Types defined:**

| Type | Definition |
|------|-----------|
| `TemplateLevel` | `'starter' \| 'extended' \| 'advanced'` |
| `ValidateOptions` | `{ a11y?: boolean; format?: boolean; dir?: string }` |

**Key helpers:**

| Function | Description |
|----------|-------------|
| `resolveFiles(themeFile, dir)` | Returns CSS file paths from a single file arg or a directory scan (`*.css`) |
| `selectCheck(options)` | Returns the appropriate check function based on `--a11y` / `--format` flags |
| `runCheckAll(file)` | Runs format + a11y, reports combined output |
| `runCheckA11y(file)` | Runs a11y check only |
| `runCheckFormat(file)` | Runs format check only |
| `runTemplate(level, outputName)` | Copies template CSS from tokens package to CWD |
| `handleFatalError(error)` | Prints error, exits with code 2 |

**Template source map:**

| Level | Tokens package export |
|-------|-----------------------|
| `starter` | `@grasdouble/lufa_design-system-tokens/themeable-starter` |
| `extended` | `@grasdouble/lufa_design-system-tokens/themeable-extended` |
| `advanced` | `@grasdouble/lufa_design-system-tokens/themeable-advanced` |

---

### `src/utils/parse-css.ts` — CSS Parsing

Parses CSS files and provides utilities for working with CSS custom properties.

**Exported type:**

```typescript
type CSSCustomProperty = {
  name: string;   // e.g. '--lufa-primitive-color-blue-500'
  value: string;  // e.g. '#3B82F6' or 'var(--lufa-core-brand-primary)'
  line: number;   // 1-based line number in source CSS
};
```

**Exported functions:**

| Function | Signature | Description |
|----------|-----------|-------------|
| `parseCSSFile` | `(filePath: string) => Promise<CSSCustomProperty[]>` | Reads and parses a CSS file |
| `parseCSSContent` | `(content: string) => CSSCustomProperty[]` | Parses CSS string |
| `tokenNameFromCSSVar` | `(cssVarName: string) => string` | `--lufa-foo-bar-500` → `foo.bar.500` |
| `cssVarNameFromToken` | `(tokenName: string) => string` | `foo.bar.500` → `--lufa-foo-bar-500` |
| `isCSSVarReference` | `(value: string) => boolean` | `true` if value matches `var(--.*)` |
| `extractCSSVarName` | `(varReference: string) => string \| null` | Extracts `--varName` from `var(--varName)` |
| `resolveCSSVarValue` | `(value, properties: Map<string,string>, visitedVars?) => string \| null` | Follows `var()` chains to a concrete value; detects circular references |
| `isValidHexColor` | `(value: string) => boolean` | Validates 3- or 6-digit hex colors |
| `isValidDimension` | `(value: string) => boolean` | Validates `px`, `rem`, `em`, `%`, `vh`, `vw`, `vmin`, `vmax`, or bare `0` |
| `isValidDuration` | `(value: string) => boolean` | Validates `ms` or `s` durations |
| `groupPropertiesByLevel` | `(properties: CSSCustomProperty[]) => Record<string, CSSCustomProperty[]>` | Groups by `primitive`, `core`, `semantic`, `component`, `unknown` |

---

### `src/utils/contrast.ts` — Color Pair Provider

Derives the list of foreground/background color pairs to check from the design system token metadata.

**Exported function:**

```typescript
// Returns [fgCssSuffix, bgCssSuffix, 'text' | 'ui'][]
export async function getColorPairsToCheck(): Promise<ColorPair[]>
```

The function reads `@grasdouble/lufa_design-system-tokens/metadata`, walks the token tree recursively to collect all color token paths and explicit `contrastWith` annotations, then runs the sibling-inference algorithm to fill in pairs not covered by annotations.

**Skip patterns** (tokens excluded from inference): `primitive`, `core`, `-disabled`, `overlay`, `backdrop`, `scrim`, `focus-ring`, `focus-background`, `focus-outline`, `-placeholder`, `-label`, `helper-text`, `divider`, `close-button`, `shared-`, `-modal-backdrop`, `modal-close`.

---

### `src/utils/wcag.ts` — WCAG Math

Pure utility functions implementing WCAG 2.1 contrast ratio calculations.

**Exported constant:**

```typescript
const WCAG_LEVELS = {
  AA_NORMAL_TEXT: 4.5,   // normal text
  AA_LARGE_TEXT: 3.0,    // large text (≥18pt or ≥14pt bold)
  AAA_NORMAL_TEXT: 7.0,  // AAA normal text
  AAA_LARGE_TEXT: 4.5,   // AAA large text
  UI_COMPONENTS: 3.0,    // UI components and graphics
} as const;
```

**Exported functions:**

| Function | Signature | Description |
|----------|-----------|-------------|
| `hexToRgb` | `(hex: string) => {r, g, b} \| null` | Parses 3- or 6-digit hex to RGB |
| `getRelativeLuminance` | `(rgb: {r, g, b}) => number` | WCAG relative luminance with gamma correction |
| `getContrastRatio` | `(color1, color2: string) => number \| null` | `(L1 + 0.05) / (L2 + 0.05)` ratio |
| `meetsWCAG_AA_Text` | `(ratio: number) => boolean` | `ratio >= 4.5` |
| `meetsWCAG_AA_UI` | `(ratio: number) => boolean` | `ratio >= 3.0` |
| `meetsWCAG_AAA` | `(ratio: number) => boolean` | `ratio >= 7.0` |
| `getWCAGLevel` | `(ratio: number) => string` | Human-readable conformance level string |

---

### `src/validators/a11y.ts` — Accessibility Validator

Validates WCAG 2.2 AA contrast requirements across all modes (`light`, `dark`, `high-contrast`) found in a theme file.

**Exported types:**

```typescript
type A11yMode = 'light' | 'dark' | 'high-contrast';

type A11yViolation = {
  foreground: string;   // CSS var name, e.g. '--lufa-semantic-ui-text-primary'
  background: string;   // CSS var name
  ratio: number;        // actual ratio, rounded to 2 decimal places
  required: number;     // 4.5 (text) or 3.0 (ui)
  type: 'text' | 'ui';
  mode: A11yMode;
};

type A11yModeResult = {
  mode: A11yMode;
  valid: boolean;
  violations: A11yViolation[];
  totalChecks: number;
  skipped: number;       // pairs skipped because a token was missing
};

type A11yResult = {
  valid: boolean;        // true only when ALL modes pass
  modes: A11yModeResult[];
  totalViolations: number;
};
```

**Exported function:**

```typescript
export async function validateA11y(themePath: string): Promise<A11yResult>
```

**Resolution strategy** (mirrors browser cascade):
1. Load `tokens.css` from `@grasdouble/lufa_design-system-tokens` — flat map of all `--lufa-*` vars (cached after first load).
2. Parse theme file into per-mode token maps (by `data-mode` selector attribute).
3. Merge: `new Map([...baseTokens, ...themeTokens])` — theme overrides win.
4. For each color pair, resolve `var()` chains to hex values.
5. Compute contrast ratio and check against WCAG AA threshold for the pair type.

---

### `src/validators/format.ts` — Format Validator

Validates CSS custom property values conform to expected formats inferred from token name patterns.

**Exported types:**

```typescript
type FormatError = {
  token: string;           // CSS var name
  value: string;           // the invalid value
  expectedFormat: string;  // human-readable description
  line: number;            // 1-based line in CSS file
};

type FormatResult = {
  valid: boolean;
  errors: FormatError[];
  totalChecked: number;
};
```

**Exported function:**

```typescript
export function validateFormat(properties: CSSCustomProperty[]): FormatResult
```

**Format rules by token name pattern:**

| Pattern | Expected format |
|---------|----------------|
| `-color-` | `#RGB`, `#RRGGBB`, `rgb()`, `rgba()`, or `var(--lufa-*)` |
| `-spacing-`, `-radius-` | CSS dimension (`px`, `rem`, `em`, `%`, `vh`, `vw`) or `var()` |
| `-font-size-` | Dimension, `clamp()`, or `var()` |
| `-duration-` | `ms` or `s` duration, or `var()` |
| `-font-weight-` | Integer 100–900 or `var()` |
| `-z-index-` | Integer or `var()` |
| `-shadow-`, `-font-family-`, `-easing-`, `-line-height-` | Lenient (any value accepted) |
| Other | No constraint |

CSS variable references (`var(--lufa-*)`) are always accepted for any token type.

## API Reference

This package exposes a **CLI binary only**. There is no programmatic Node.js API for external consumers. All utilities are internal to the binary runtime.

### Binary: `lufa-ds-cli`

### Sub-command: `theme-validate [theme-file] [options]`

Validate a theme CSS file against Lufa Design System requirements.

| Argument / Option | Description |
|-------------------|-------------|
| `[theme-file]` | Path to the theme CSS file to validate |
| `--a11y` | Run WCAG AA contrast check only |
| `--format` | Run format check only |
| `-d, --dir <directory>` | Validate all `*.css` files in a directory |
| `-h, --help` | Display help |

When no flag is given, all checks run (format + a11y). `--a11y` and `--format` are mutually exclusive.

**Exit codes:**

| Code | Meaning |
|------|---------|
| `0` | All checks passed |
| `1` | One or more validation errors found |
| `2` | CLI error (invalid arguments, file not found, unexpected error) |

### Sub-command: `theme-template [level] [options]`

Create a theme CSS starter file in the current working directory.

| Argument / Option | Description |
|-------------------|-------------|
| `[level]` | `starter` (default), `extended`, or `advanced` |
| `-o, --output-name <name>` | Output filename without `.css`; prompted interactively if omitted |
| `-h, --help` | Display help |

## Usage Examples

### Validate a single file (all checks)

```bash
lufa-ds-cli theme-validate ./my-theme.css
```

### Run only the a11y check

```bash
lufa-ds-cli theme-validate ./my-theme.css --a11y
```

### Run only the format check

```bash
lufa-ds-cli theme-validate ./my-theme.css --format
```

### Validate all CSS files in a directory

```bash
lufa-ds-cli theme-validate --dir ./themes/src

# A11y only across all files in a directory
lufa-ds-cli theme-validate --a11y --dir ./themes/src
```

### Generate a theme template

```bash
# Interactive (prompts for file name)
lufa-ds-cli theme-template

# Explicit level and name
lufa-ds-cli theme-template extended --output-name my-brand
lufa-ds-cli theme-template advanced -o my-brand
```

### Expected output — all passing

```
🔍 my-theme.css

  ✓ Format — all token values are valid

  A11y (WCAG AA):
  ✓ [light] 102 checks passed
  ✓ [dark] 102 checks passed
  ✓ [high-contrast] 102 checks passed

✅ All checks passed!
```

### Expected output — with failures

```
🔍 my-theme.css

  ✗ --lufa-core-color-brand-primary-default (line 12): Invalid format — hex color (e.g., #3B82F6) or CSS variable reference (e.g., var(--lufa-...))

  A11y (WCAG AA):
  ✗ [dark] 1 violation(s) (102 checks, 0 skipped)
      --lufa-semantic-ui-text-primary on --lufa-semantic-ui-background-page — 3.1:1 (needs 4.5:1 WCAG AA Text)
  ✓ [light] 102 checks passed (3 skipped)
  ✓ [high-contrast] 102 checks passed

❌ Validation failed
```

### Theme CSS structure expected by the validator

```css
[data-theme='my-brand'][data-mode='light'] {
  --lufa-core-color-brand-primary-default: #0e7490;
  /* ... more core token overrides ... */
}

[data-theme='my-brand'][data-mode='dark'] {
  --lufa-core-color-brand-primary-default: #22d3ee;
}

[data-theme='my-brand'][data-mode='high-contrast'] {
  --lufa-core-color-brand-primary-default: #ffffff;
}
```

### CI/CD — GitHub Actions

```yaml
name: Validate Theme
on:
  push:
    paths: ['src/theme.css']
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install -g @grasdouble/lufa_design-system-cli
      - run: lufa-ds-cli theme-validate src/theme.css
```

### CI/CD — NPM script

```json
{
  "scripts": {
    "validate-theme": "lufa-ds-cli theme-validate src/theme.css",
    "prebuild": "npm run validate-theme"
  }
}
```

### CI/CD — Pre-commit hook (Husky)

```bash
# .husky/pre-commit
npx lufa-ds-cli theme-validate src/theme.css || exit 1
```

### Usage inside the monorepo (`themes` package)

```json
{
  "scripts": {
    "validate:theme:all": "lufa-ds-cli theme-validate --dir src",
    "validate:theme:ocean": "lufa-ds-cli theme-validate src/ocean.css"
  }
}
```

## Dependencies

### Runtime Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@grasdouble/lufa_design-system-tokens` | `workspace:^` | Provides `tokens.css` (base token var() scaffolding), `metadata` (color pair discovery), and `themeable-*` template CSS files |
| `chalk` | `^5.6.2` | Colored terminal output (ESM-only, v5) |
| `commander` | `^14.0.3` | CLI argument parsing and sub-command structure |
| `postcss` | `^8.5.8` | Available as dependency; not currently invoked by source code |
| `postcss-value-parser` | `^4.2.0` | Available as dependency; not currently invoked by source code |

### Key Dev Dependencies

| Package | Purpose |
|---------|---------|
| `tsx` | TypeScript execution for `pnpm dev` |
| `vitest` | Test runner |
| `typescript` | `^5.9.3` |

### Implicit Requirements

- **Node.js ≥ 20** — required by `engines` field and use of `import.meta.resolve`
- `@grasdouble/lufa_design-system-tokens` must be **built** before running this CLI — the validator reads compiled `tokens.css` and `metadata` files from the tokens package's `dist/`

Build order in the monorepo: `tokens` → `cli`.

## Configuration

No user-facing configuration file. All behavior is controlled via CLI flags.

### Build

```bash
pnpm build        # pnpm clean && tsc → dist/
pnpm build:watch  # tsc --watch
pnpm clean        # rm -rf dist
```

### TypeScript

Extends `@grasdouble/lufa_config_tsconfig/node.json`. Output: `./dist`, source root: `./src`. Emits declarations and declaration maps.

### Tests

```bash
pnpm test           # vitest (watch mode)
pnpm test:run       # vitest run (CI-friendly, single pass)
pnpm test:coverage  # vitest --coverage
pnpm test:ui        # vitest --ui
```

Test files are in `src/utils/__tests__/` and `src/validators/__tests__/`.

### Lint / Format

```bash
pnpm lint               # eslint
pnpm prettier:check     # check formatting
pnpm prettier:write     # auto-fix formatting
pnpm typecheck          # tsc --noEmit
```
