# @grasdouble/lufa_microfrontend_home

## 0.3.10

### Patch Changes

- a864f44: Fix: use correct version of design-system since it has been moved to Lufa-Design-System repository
- a864f44: fix: add missing field repository in package.json

## 0.3.9

### Patch Changes

- 7c889d3: Upgrade deps
- 5192d9e: fix: upgrade deps
- 50d07a6: fix: upgrade deps
- e9b1f1f: Update deps
- Updated dependencies [7c889d3]
- Updated dependencies [5192d9e]
- Updated dependencies [50d07a6]
- Updated dependencies [e9b1f1f]
  - @grasdouble/lufa_design-system@2.1.3

## 0.3.8

### Patch Changes

- d90bfed: chore: update dependencies
- Updated dependencies [d90bfed]
  - @grasdouble/lufa_design-system@2.1.2

## 0.3.7

### Patch Changes

- 9f95f14: Update Dependency
- Updated dependencies [9f95f14]
  - @grasdouble/lufa_design-system@2.1.1

## 0.3.6

### Patch Changes

- 3d8eea0: Add `.prettierignore` to exclude `dist/` from Prettier formatting
- Updated dependencies [feab2a5]
- Updated dependencies [3d8eea0]
  - @grasdouble/lufa_design-system@2.1.0

## 0.3.5

### Patch Changes

- 03e75af: Fix tokens and their usage
- Updated dependencies [03e75af]
- Updated dependencies [18d206b]
- Updated dependencies [4d7849f]
- Updated dependencies [4f51c98]
  - @grasdouble/lufa_design-system@2.0.0

## 0.3.4

### Patch Changes

- Updated dependencies [728be92]
  - @grasdouble/lufa_design-system@1.0.0

## 0.3.3

### Patch Changes

- 07b892b: Add typecheck scripts and align docs/test fixtures after stricter TypeScript checks.
- Updated dependencies [07b892b]
  - @grasdouble/lufa_design-system@0.10.0

## 0.3.2

### Patch Changes

- Updated dependencies [ceeaacc]
- Updated dependencies [e3380ec]
- Updated dependencies [058d6d6]
- Updated dependencies [3b444f4]
  - @grasdouble/lufa_design-system@0.9.0

## 0.3.1

### Patch Changes

- Updated dependencies [445737d]
- Updated dependencies [ea09e6a]
- Updated dependencies [445737d]
  - @grasdouble/lufa_design-system@0.8.0

## 0.3.0

### Minor Changes

- fef8ae4: Remove Tailwind CSS and migrate all components to vanilla CSS with design tokens

  BREAKING CHANGE: This package no longer includes Tailwind CSS. All styling now uses vanilla CSS with design token CSS custom properties.

  Migration completed:
  - 30 components migrated from Tailwind @apply to vanilla CSS
  - 570+ @apply directives converted
  - 159 theme() calls converted
  - All styling uses var(--lufa-token-\*) design tokens
  - Zero breaking changes to component APIs
  - Build size reduced, performance improved

  If you were importing Tailwind CSS from this package, you'll need to update your imports to use the new vanilla CSS entry point (style.css), which is automatically handled if you import from the main package export.

### Patch Changes

- Updated dependencies [fef8ae4]
  - @grasdouble/lufa_design-system@0.7.0

## 0.2.8

### Patch Changes

- Updated dependencies [8ae7e61]
- Updated dependencies [603f643]
- Updated dependencies [509bb8e]
  - @grasdouble/lufa_design-system@0.6.0

## 0.2.7

### Patch Changes

- 6c972e8: fix: prettier config
- 2d37fc0: Update dependencies
- 4d0893b: Update scripts and README files
- 412c362: fix(chore): add missing prettier and eslint config + add a script prettier in package.json
- b101244: fix(chore): eslint config + fix new issues
- Updated dependencies [6c972e8]
- Updated dependencies [2d37fc0]
- Updated dependencies [4d0893b]
- Updated dependencies [57df928]
- Updated dependencies [412c362]
- Updated dependencies [b101244]
  - @grasdouble/lufa_design-system@0.5.1

## 0.2.6

### Patch Changes

- Updated dependencies [1f24429]
  - @grasdouble/lufa_design-system@0.5.0

## 0.2.5

### Patch Changes

- Updated dependencies [48c857f]
  - @grasdouble/lufa_design-system@0.4.0

## 0.2.4

### Patch Changes

- 501cf5f: small fixes
- Updated dependencies [501cf5f]
  - @grasdouble/lufa_design-system@0.3.0

## 0.2.3

### Patch Changes

- 925f313: Update link to storybook and add link to lufa doc
- Updated dependencies [6af7149]
- Updated dependencies [dba64f6]
- Updated dependencies [6c4eb34]
- Updated dependencies [1d9de21]
- Updated dependencies [d4b9e09]
  - @grasdouble/lufa_design-system@0.2.0

## 0.2.2

### Patch Changes

- dceff77: Upgrade deps
- Updated dependencies [dceff77]
  - @grasdouble/lufa_design-system@0.1.2

## 0.2.1

### Patch Changes

- 079827f: chore: change way to manage images in the repository

## 0.2.0

### Minor Changes

- d4b3d7e: Start to use components from DS and Tailwindcss

### Patch Changes

- Updated dependencies [d4b3d7e]
  - @grasdouble/lufa_design-system@0.1.1

## 0.1.2

### Patch Changes

- 66ed8fa: Fix export in package.json

## 0.1.1

### Patch Changes

- 58ccad9: Remove test button

## 0.1.0

### Minor Changes

- 7cbeef0: Fix usage of assets (no more base64) and remove usage of single-spa-react in home

## 0.0.3

### Patch Changes

- b893e5b: Update publishConfig

## 0.0.2

### Patch Changes

- 7f3f723: Improve shared config (eslint and typescript) and apply change in packages
