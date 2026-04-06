---
package: '@grasdouble/lufa_microfrontend_home'
shortName: lufa_microfrontend_home
category: apps
type: context
lastUpdated: '2026-02-24'
generatedAtCommit: 'd27c912328f538971b6720513be2c817c2feff15'
---

# Context: @grasdouble/lufa_microfrontend_home

## Package Info

| Field        | Value                                  |
| ------------ | -------------------------------------- |
| Name         | `@grasdouble/lufa_microfrontend_home`  |
| Version      | `0.3.5`                                |
| Type         | `"module"` (ESM)                       |
| Private      | `false` (published to GitHub Packages) |
| Output       | `dist/home.mjs`                        |
| Dev port     | `4101`                                 |
| Mount DOM ID | `lufa-container`                       |
| Active route | `location.pathname === '/'`            |

---

## Critical Rules

1. **Do NOT import from this package as a regular NPM dependency.** It is loaded at runtime via an import map by the Single-SPA main container. Never add it to another package's `dependencies`.

2. **The host application must provide `<div id="lufa-container"></div>`.** The `mount` lifecycle will reject its Promise if this element does not exist.

3. **`bootstrap`, `mount`, and `unmount` must all be exported** from the entry point. Removing or renaming any of them will break Single-SPA registration.

4. **Do not add `react` or `react-dom` to the bundle.** They are externalized. The host container is responsible for providing them. Adding them to the bundle would cause multiple React instances and hook errors.

5. **Do not add `@grasdouble/lufa_design-system` to the bundle.** It is also externalized. The CSS is imported once via `parcel.tsx`; bundling the design system would duplicate it.

6. **`clsx` is the only bundled dependency.** All other dependencies in `package.json` are externalized by `vite-plugin-externalize-deps`.

7. **CSS is injected into the JS bundle** by `vite-plugin-css-injected-by-js`. There is no separate `.css` output file. Do not expect or import a `.css` file from the dist.

---

## Import Pattern

### In Single-SPA container (the only valid consumer)

```ts
// main-container/src/main.ts
registerApplication({
  name: '@grasdouble/lufa_microfrontend_home',
  app: () => import('@grasdouble/lufa_microfrontend_home'), // resolved via import map
  activeWhen: (location) => location.pathname === '/',
});
```

### Import map entries

Development (`importMap.dev.json`):

```json
{
  "imports": {
    "@grasdouble/lufa_microfrontend_home": "http://localhost:4101/home.mjs"
  }
}
```

Production (`importMap.json`):

```json
{
  "imports": {
    "@grasdouble/lufa_microfrontend_home": "https://cdn.sebastien-lemouillour.fr/gh/@grasdouble/lufa_microfrontend_home@0.1.2"
  }
}
```

---

## Key Types

The package does not export any TypeScript types. The lifecycle functions conform to the `single-spa` `LifeCycles` type (from the `single-spa` package, used in the main container):

```ts
// Implicit contract — not re-exported by this package
type Lifecycle = () => Promise<void>;

interface LifeCycles {
  bootstrap: Lifecycle;
  mount: Lifecycle;
  unmount: Lifecycle;
}
```

---

## Common Patterns

### Adding a new section to the home page

Edit `src/App.tsx`. Use components from `@grasdouble/lufa_design-system` for layout:

```tsx
import { Stack } from '@grasdouble/lufa_design-system';

// Add a new Stack child or additional element inside the existing vertical Stack
```

### Adding a new image asset

1. Place the `.webp` file in `src/assets/`.
2. Use `getImageUrl('filename')` (without extension) to get the resolved URL:

```tsx
import { getImageUrl } from './getImageUrl';

<img src={getImageUrl('MyImage')} alt="description" />;
```

### Adding styles using design tokens

Reference tokens as CSS custom properties in `App.module.css`:

```css
.my-element {
  color: var(--lufa-semantic-ui-background-on-primary);
  padding: var(--lufa-semantic-ui-spacing-comfortable);
  font-size: var(--lufa-primitive-typography-font-size-lg);
  transition: var(--lufa-semantic-ui-transition-fast);
}
```

Token categories available:

- `--lufa-primitive-*` — raw primitive values (spacing scale, font sizes, font weights, radius)
- `--lufa-semantic-ui-*` — semantic/contextual values (backgrounds, spacing roles, transitions)

### Running the microfrontend in isolation

```bash
pnpm --filter @grasdouble/lufa_microfrontend_home dev
# Open http://localhost:4101
```

Note: When running in isolation, the Single-SPA lifecycle is not active. The dev server will serve the module file but not automatically render it — you need either a host or to test the parcel integration via `pnpm app:mf:dev`.

---

## Anti-patterns

### Do NOT do this — storing root reference

The current `unmount` implementation has a known issue: it creates a new `createRoot` instead of reusing the existing root instance. Do not copy this pattern:

```ts
// WRONG — creates a new root instead of reusing the existing one
export const unmount = () => {
  return new Promise((resolve) => {
    const container = document.getElementById('lufa-container');
    if (container) {
      const root = createRoot(container); // Bug: should reuse existing root
      root.unmount();
    }
    resolve(void 0);
  });
};

// CORRECT — store root reference at module level
let root: ReturnType<typeof createRoot> | null = null;

export const mount = () =>
  new Promise((resolve, reject) => {
    const container = document.getElementById('lufa-container');
    if (!container) return reject(new Error('Container not found'));
    root = createRoot(container);
    root.render(<App />);
    resolve(void 0);
  });

export const unmount = () =>
  new Promise<void>((resolve) => {
    root?.unmount();
    root = null;
    resolve();
  });
```

### Do NOT import this package statically in another package

```ts
// WRONG — this package is not a library; it's a runtime-loaded microfrontend
import { mount } from '@grasdouble/lufa_microfrontend_home';
```

### Do NOT add Tailwind CSS

Tailwind was removed in `v0.3.0`. All styling must use vanilla CSS with design tokens.

### Do NOT import CSS directly from this package

There is no CSS file in `dist/`. CSS is bundled into `home.mjs` via `vite-plugin-css-injected-by-js`.

---

## Dependencies Context

| Package                            | Role                              | Notes                                                       |
| ---------------------------------- | --------------------------------- | ----------------------------------------------------------- |
| `@grasdouble/lufa_design-system`   | Layout components + design tokens | Externalized from bundle; CSS imported once in `parcel.tsx` |
| `react` / `react-dom`              | UI framework                      | Externalized; must be provided by host at runtime           |
| `clsx`                             | Class name merging                | **Bundled inline** (only bundled dependency)                |
| `vite-plugin-css-injected-by-js`   | CSS bundling                      | Makes CSS part of the JS output — no separate CSS file      |
| `vite-plugin-externalize-deps`     | Prevents duplicate deps           | All `dependencies` externalized except `clsx`               |
| `@grasdouble/lufa_config_tsconfig` | TypeScript config                 | Extends `react-app.json`                                    |
| `@grasdouble/lufa_config_eslint`   | Linting config                    | Shared ESLint rules                                         |
| `@grasdouble/lufa_config_prettier` | Formatting config                 | Shared Prettier rules                                       |
