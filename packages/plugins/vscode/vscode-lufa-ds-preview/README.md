# Lufa DS Preview (VSCode Extension)

This extension shows color decorators for Lufa tokens in TypeScript and CSS files, plus hover previews for non-color tokens. It ships with **packaged maps** copied from the primitives and tokens packages at build time, so it works out of the box without any extra configuration!

## Features

- **Packaged maps**: The extension bundles map JSON files from `@grasdouble/lufa_design-system-primitives` and `@grasdouble/lufa_design-system-tokens`
- **Separate data sources**: Primitive and token maps from their respective design-system packages
- **CSS support**: Shows colors for `--lufa-*-color-*` variables (both in `var()` usage and declarations)
- **TypeScript support**: Shows colors for `tokens.color.*` and `primitives.color.*` references
- **Token value hovers**: Shows values for `--lufa-primitive-*`, `--lufa-core-*`, `--lufa-semantic-*`, `--lufa-component-*`, `tokens.*`, and `primitives.*` references
- **Autocomplete details**: Shows token values (plus color swatches for color tokens) in the suggestion list for `--lufa-*`, `tokens.*`, and `primitives.*`
- **Literal OKLCH preview**: Shows color decorators for raw `oklch(...)` values in CSS/SCSS/PostCSS
- **Custom maps**: Optionally use custom maps from your workspace
- **Auto-reload**: Automatically detects and reloads when custom maps change
- **Security**: Validates custom file paths to ensure they're within workspace
- **Debug mode**: Comprehensive logging for troubleshooting

## Quick Start

1. Open this folder in VSCode
2. Press `F5` to launch an Extension Development Host
3. Open a file that uses Lufa color tokens:
   - CSS: `var(--lufa-core-color-brand-500)` or `--lufa-primitive-color-neutral-neutral-900: oklch(...)`
   - TypeScript: `primitives.color.chromatic.red[500]` or `primitives.color.neutral.neutral[900]`
4. See colored squares next to your tokens! 🎨

## Build the Extension

From this folder:

```bash
pnpm install
pnpm run build
```

## Package and Install Locally

The extension can be packaged using the unified `package.sh` script:

```bash
# Build and package only (no installation)
pnpm run build-and-no-install
# or directly:
pnpm run build && ./scripts/package.sh

# Build, package, and install in one command
pnpm run build-and-install
# or directly:
pnpm run build && ./scripts/package.sh --install
```

**Note:** The packaging script temporarily renames the package for VS Code compatibility while keeping your scoped npm package name (`@grasdouble/lufa_plugin_vscode_lufa-ds-preview`). The build step copies the design-system map files into `dist/maps`, and they are included in the VSIX.

## Update the Packaged Maps

The extension bundles map files into `dist/maps` during its build, using the design-system packages as the source.

To update them locally in this monorepo:

```bash
# From repo root, build both packages
pnpm --filter @grasdouble/lufa_design-system-primitives build
pnpm --filter @grasdouble/lufa_design-system-tokens build

# Rebuild the extension (copies map files into dist/maps)
pnpm run build
```

If you publish a VSIX, rebuild the extension after updating the design-system packages so the bundled maps are current.

## Configuration

### Custom Maps (Optional)

The extension supports separate primitive and token maps:

```json
{
  "lufaDsPreview": {
    "primitivesMapPath": "packages/design-system/primitives/dist/primitives.map.json",
    "tokensMapPath": "packages/design-system/tokens/dist/tokens.map.json"
  }
}
```

The path can be:

- Relative to workspace root: `"packages/design-system/tokens/dist/tokens.map.json"`
- Absolute: `"/Users/you/project/tokens.map.json"`

If custom maps are not found, the extension falls back to the packaged maps.

**Note:** The extension will automatically watch the custom map files for changes and reload when files are updated.

### Debug Mode

Enable debug logging to troubleshoot issues:

```json
{
  "lufaDsPreview": {
    "debug": true
  }
}
```

Then check the "Lufa DS Preview" output channel: View → Output → Select "Lufa DS Preview" from the dropdown.

## How It Works

1. The extension registers a `DocumentColorProvider` for CSS, SCSS, PostCSS, TypeScript, and TypeScript React files
2. It uses regex patterns to find Lufa color tokens in your code
3. For each token, it looks up the OKLCH color value in the map
4. It converts OKLCH to RGB and displays a color decorator in the editor
5. It registers a `HoverProvider` to show values for `--lufa-*`, `tokens.*`, and `primitives.*` references

## Supported Token Formats

### CSS/SCSS/PostCSS

```css
/* Variable usage */
color: var(--lufa-core-color-brand-500);
background: var(--lufa-semantic-ui-background-primary, #fallback);

/* Variable declarations */
--lufa-core-color-brand-500: oklch(90% 0.05 200);
--lufa-primitive-color-neutral-neutral-900: oklch(20% 0.1 180 / 0.5);

/* Literal OKLCH values */
border-color: oklch(70% 0.1 200 / 0.5);
```

### TypeScript/TSX

```typescript
// Primitive color references (3-level paths)
const color1 = primitives.color.chromatic.red[500];
const color2 = primitives.color.neutral.neutral[900];
const color3 = primitives.color.chromatic.blue[100];
```

### Hover Value Examples (Any Token Type)

```css
/* CSS variables */
padding: var(--lufa-semantic-ui-spacing-default);
border-radius: var(--lufa-primitive-radius-scale-md);
```

```typescript
// Tokens namespace
const gap = tokens.spacing.base;
const compact = tokens.spacing['sm-md'];
const border = tokens.borderWidth.thin;

// Primitives namespace
const scale = primitives.spacing[16];
const opacity = primitives.opacity[50];
```

## Troubleshooting

**No colors showing up?**

1. Make sure you're in the Extension Development Host (launched with F5), not the main VSCode window
2. Enable debug mode and check the Output panel for "Lufa DS Preview"
3. Verify your token syntax matches the supported formats above
4. Check that the packaged maps exist under `dist/maps/*.map.json` (or the fallback `node_modules/@grasdouble/lufa_design-system-*/dist`)

**Colors are outdated?**

1. Build the design system packages: `pnpm --filter @grasdouble/lufa_design-system-{primitives,tokens} build`
2. Rebuild the extension: `pnpm run build`
3. Reload the Extension Development Host
4. If using custom map paths, the extension automatically reloads when files change

**Missing maps?**

- Build the design system packages so `dist/*.map.json` exists
- Or point the extension at a custom map path via settings

**Custom map not loading?**

1. Check the file path in settings is correct (relative to workspace root or absolute)
2. Enable debug mode to see detailed error messages
3. Verify the map has the correct JSON structure (see How It Works section)
4. Ensure the path is within your workspace for security reasons

## Development

### Running Tests

```bash
# Run tests once
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Type check
pnpm typecheck

# Lint and format
pnpm lint
pnpm format
```

### Build Configuration

- **Source**: `src/index.ts`
- **Packaged maps**: `dist/maps/primitives.map.json`, `dist/maps/tokens.map.json` (fallback: `node_modules/@grasdouble/lufa_design-system-*/dist/*.map.json`)
- **Build output**: `dist/extension.js`
- **TypeScript**: 5.9.3, targeting ES2020
- **Packaging**: vsce 3.7.1
