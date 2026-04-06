---
package: '@grasdouble/lufa_design-system-cli'
shortName: lufa_design-system-cli
category: design-system
type: context
lastUpdated: '2026-02-24'
generatedAtCommit: 'd27c912328f538971b6720513be2c817c2feff15'
---

# Context: @grasdouble/lufa_design-system-cli

## Package Info

| Field            | Value                                 |
| ---------------- | ------------------------------------- |
| Name             | `@grasdouble/lufa_design-system-cli`  |
| Version          | `1.0.1`                               |
| Module type      | ESM (`"type": "module"`)              |
| Binary           | `lufa-validate-theme` → `dist/cli.js` |
| Main export      | `dist/index.js`                       |
| Types            | `dist/index.d.ts`                     |
| Sub-path export  | `./templates/theme-template.css`      |
| Node requirement | `>=20`                                |
| Registry         | `https://npm.pkg.github.com`          |

## Critical Rules

1. **ESM only** – the package sets `"type": "module"`. All imports must use `.js` extensions (even when the source file is `.ts`). Do not use `require()`.
2. **`@grasdouble/lufa_design-system-tokens` must be built before this package** – the completeness validator reads `../../../tokens/dist/tokens-metadata.json` at runtime (relative to the compiled `dist/` output). If the tokens package has not been built, every call to `validateCompleteness` will throw.
3. **Template file requires a post-build copy step** – `src/templates/theme-template.css` is a static asset. The build script runs `cp src/templates/*.css dist/templates/` after `tsc`. If you add new template files, the `copy:templates` npm script must cover them.
4. **All internal imports use `.js` extension** – e.g. `import { parseCSSFile } from './utils/parse-css.js'`. This is required for Node ESM resolution. Do not change these to `.ts`.
5. **The CSS regex parser is intentionally simple** – `parseCSSContent` uses a single regex and does not depend on `postcss` at runtime. `postcss` and `postcss-value-parser` are listed as dependencies for potential future use; do not assume they are invoked.
6. **`validateContrast` is synchronous; `validateCompleteness` is async** – `validateContrast` and `validateFormat` both accept an already-parsed `CSSCustomProperty[]` array and are pure/sync. `validateCompleteness` also accepts the same array but is `async` because it reads the tokens metadata file from disk.
7. **Extra tokens are non-errors** – properties defined in a theme file that are not in the required tokens list are surfaced as `warnings` (programmatic API) or shown as informational output (CLI). They do not set `valid: false`.
8. **Circular `var()` references resolve to `null`** – `resolveCSSVarValue` tracks visited variable names and returns `null` if a cycle is detected. The contrast validator then skips those pairs (does not report a violation).
9. **`--no-color` is a Commander negated boolean** – the CLI option is `--no-color`; in code it is `options.color === false`. Chalk's `enabled` flag is controlled automatically by Commander via `--no-color`.

## Import Pattern

### CLI (binary)

```bash
# After global install or via npx:
lufa-validate-theme [options] [theme-file]
npx lufa-validate-theme --template > my-theme.css
```

### Programmatic – convenience wrapper

```typescript
import { validateTheme } from '@grasdouble/lufa_design-system-cli';

const result = await validateTheme('./theme.css');
// result: ValidationResult { valid: boolean; errors: string[]; warnings?: string[] }
```

### Programmatic – individual validators

```typescript
import {
  parseCSSFile,
  validateCompleteness, // async
  validateContrast, // sync
  validateFormat, // sync
} from '@grasdouble/lufa_design-system-cli';

const props = await parseCSSFile('./theme.css');
const completeness = await validateCompleteness(props);
const contrast = validateContrast(props);
const format = validateFormat(props);
```

### Programmatic – WCAG utilities

```typescript
import {
  getContrastRatio,
  getRelativeLuminance,
  getWCAGLevel,
  hexToRgb,
  meetsWCAG_AA_Text,
  meetsWCAG_AA_UI,
  meetsWCAG_AAA,
  WCAG_LEVELS,
} from '@grasdouble/lufa_design-system-cli';
```

### Programmatic – CSS parsing utilities

```typescript
import {
  cssVarNameFromToken, // 'foo.bar' → '--lufa-foo-bar'
  parseCSSFile, // async, reads from filesystem
  tokenNameFromCSSVar, // '--lufa-foo-bar' → 'foo.bar'
} from '@grasdouble/lufa_design-system-cli';
```

### Template CSS sub-path

```javascript
// Available via the package.json sub-path export:
'@grasdouble/lufa_design-system-cli/templates/theme-template.css';
```

## Key Types

```typescript
// src/utils/parse-css.ts
type CSSCustomProperty = {
  name: string; // e.g. '--lufa-primitive-color-blue-500'
  value: string; // e.g. '#3B82F6' or 'var(--lufa-core-brand-primary)'
  line: number; // 1-based line number in the source CSS file
};

// src/validators/completeness.ts
type CompletenessResult = {
  valid: boolean;
  totalRequired: number; // always = number of tokens in tokens-metadata.json
  totalDefined: number; // number of properties found in the theme file
  missingTokens: string[]; // CSS var names absent from the theme (errors)
  extraTokens: string[]; // CSS var names in theme but not in design system (warnings)
};

// src/validators/contrast.ts
type ContrastViolation = {
  foreground: string; // CSS var name, e.g. '--lufa-semantic-ui-text-primary'
  background: string; // CSS var name
  ratio: number; // actual contrast ratio, rounded to 2 decimal places
  required: number; // 4.5 for text, 3.0 for UI components
  type: 'text' | 'ui';
};

type ContrastResult = {
  valid: boolean;
  violations: ContrastViolation[];
  totalChecks: number; // always 55 (size of COLOR_PAIRS_TO_CHECK)
};

// src/validators/format.ts
type FormatError = {
  token: string; // CSS var name
  value: string; // the invalid value
  expectedFormat: string; // human-readable description of the expected format
  line: number; // 1-based line in the theme file
};

type FormatResult = {
  valid: boolean;
  errors: FormatError[];
  totalChecked: number;
};

// src/index.ts (public)
type ValidationResult = {
  valid: boolean;
  errors: string[]; // flattened error strings from all three validators
  warnings?: string[]; // extra tokens (defined but not in design system)
};
```

## Common Patterns

### Parse once, validate multiple times

```typescript
// Avoid reading the file multiple times
const properties = await parseCSSFile(themePath);

const [completeness, contrast, format] = await Promise.all([
  validateCompleteness(properties),
  Promise.resolve(validateContrast(properties)),
  Promise.resolve(validateFormat(properties)),
]);
```

### Resolve a CSS variable chain

```typescript
import { parseCSSFile, resolveCSSVarValue } from '@grasdouble/lufa_design-system-cli';

const props = await parseCSSFile('./theme.css');
const map = new Map(props.map((p) => [p.name, p.value]));

// Follows var() references until a raw value is reached
const resolved = resolveCSSVarValue('var(--lufa-core-brand-primary)', map);
// e.g. '#2563eb'
```

### Group properties by token level for reporting

```typescript
import { groupPropertiesByLevel, parseCSSFile } from '@grasdouble/lufa_design-system-cli';

const props = await parseCSSFile('./theme.css');
const grouped = groupPropertiesByLevel(props);

console.log(`Primitive tokens: ${grouped.primitive.length}`);
console.log(`Core tokens:      ${grouped.core.length}`);
console.log(`Semantic tokens:  ${grouped.semantic.length}`);
console.log(`Component tokens: ${grouped.component.length}`);
console.log(`Unknown tokens:   ${grouped.unknown.length}`);
```

### Fail fast in a build pipeline

```typescript
import { validateTheme } from '@grasdouble/lufa_design-system-cli';

const result = await validateTheme(process.argv[2]);
if (!result.valid) {
  process.stderr.write(result.errors.join('\n') + '\n');
  process.exit(1);
}
```

### CI with no colour and captured output

```yaml
- run: lufa-validate-theme --no-color ${{ env.THEME_FILE }} 2>&1 | tee theme-validation.log
```

## Anti-patterns

### Do not call validators before parsing

```typescript
// WRONG – validators expect CSSCustomProperty[], not a file path
const result = validateFormat('./theme.css');

// CORRECT
const props = await parseCSSFile('./theme.css');
const result = validateFormat(props);
```

### Do not await validateContrast or validateFormat

```typescript
// WRONG – these are synchronous; awaiting works but is misleading
const contrast = await validateContrast(properties);

// CORRECT
const contrast = validateContrast(properties);
const format = validateFormat(properties);
```

### Do not treat extra tokens as errors

```typescript
// WRONG – extra tokens are NOT a validation failure
const result = await validateCompleteness(properties);
if (result.extraTokens.length > 0) {
  throw new Error('Invalid theme'); // incorrect
}

// CORRECT – only missingTokens determines validity
if (!result.valid) {
  throw new Error(`Missing tokens: ${result.missingTokens.join(', ')}`);
}
```

### Do not access the template via filesystem path in code

```typescript
// WRONG – brittle, path is build-output relative

// CORRECT – use the declared sub-path export
import templateUrl from '@grasdouble/lufa_design-system-cli/templates/theme-template.css';

import template from '../../dist/templates/theme-template.css';

// or via CLI:
// lufa-validate-theme --template > my-theme.css
```

### Do not use CommonJS require

```typescript
// CORRECT
import { validateTheme } from '@grasdouble/lufa_design-system-cli';

// WRONG – package is ESM-only
const { validateTheme } = require('@grasdouble/lufa_design-system-cli');
```

### Do not omit .js extensions in internal imports

```typescript
// WRONG – Node ESM requires explicit extensions
import { parseCSSFile } from './utils/parse-css';
// CORRECT
import { parseCSSFile } from './utils/parse-css.js';
```

## Dependencies Context

### `@grasdouble/lufa_design-system-tokens` (workspace:^)

The single most critical runtime dependency. The completeness validator (`src/validators/completeness.ts:36`) reads:

```
dist/tokens-metadata.json   (relative to the compiled dist/ output)
```

This is resolved at runtime as:

```typescript
join(__dirname, '../../../tokens/dist/tokens-metadata.json');
```

**If this file does not exist** (tokens package not built), every call to `validateCompleteness` or `validateTheme` will throw with:

> `Failed to load required tokens from @grasdouble/lufa_design-system-tokens. Make sure the package is installed and built.`

Build order in the monorepo must therefore be: `tokens` → `cli`.

### `chalk` (^5.6.2)

Used only in `cli.ts` for coloured terminal output. Chalk v5 is ESM-only, consistent with this package's ESM-only stance. Not used in `index.ts` or any validator.

### `commander` (^14.0.2)

Used only in `cli.ts`. Handles argument parsing, `--help` generation, and the `--no-color` negated boolean flag. Not used in the programmatic API.

### `postcss` / `postcss-value-parser`

Declared as runtime dependencies but **not used by any current source file**. They are available for future extension of the CSS parsing layer without a new dependency install. The current parser (`src/utils/parse-css.ts`) is regex-based.
