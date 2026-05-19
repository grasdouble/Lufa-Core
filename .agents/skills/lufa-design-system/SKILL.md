---
name: lufa-design-system
description: Guide for using the @grasdouble/lufa_design-system component library in the Lufa monorepo. Use this skill when writing or reviewing UI code in any package of this repo, especially before writing custom CSS, to discover which components are available and how to use them correctly.
---

# Lufa Design System

## Core rule

**Always prefer DS components over custom CSS.** Only write custom CSS for things the DS genuinely cannot do (e.g. `min-height`, responsive `auto-fit` grids, raw `<img>` sizing, border using a design token value).

## Discover available components

Before writing any UI code that uses DS components, run the following script from the repo root to get the current list of components **with their valid prop values**:

```bash
python3 .agents/skills/lufa-design-system/scripts/list_components.py
```

**Always use the script output as the source of truth for prop values.** Never guess variant names, sizes, or other union props from memory — the script shows exact valid values (e.g. `Badge variant: default | success | danger | warning | info`).

## Common substitutions

| Instead of custom CSS…                               | Use DS component                           |
| ---------------------------------------------------- | ------------------------------------------ |
| `max-width` + `margin: auto`                         | `<Container size="sm / md / lg / xl">`     |
| `display: flex; flex-wrap: wrap; gap: …`             | `<Cluster spacing="…">`                    |
| `display: flex; flex-direction: column; gap: …`      | `<Stack direction="vertical" spacing="…">` |
| `display: grid; grid-template-columns: repeat(N, …)` | `<Grid columns={N} gap="…">`               |
| Surface with background / border / shadow            | `<Card>`                                   |

## Design tokens in CSS

When custom CSS is unavoidable, always use semantic tokens instead of raw values:

```css
var(--lufa-semantic-ui-background-page)
var(--lufa-semantic-ui-text-primary)
var(--lufa-semantic-ui-border-default)
```

## Spacing scale

`none` | `tight` | `compact` | `default` | `comfortable` | `spacious`

Used for `spacing` / `gap` props on `Stack`, `Cluster`, `Grid`.
