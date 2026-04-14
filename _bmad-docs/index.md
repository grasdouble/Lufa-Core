---
name: index
type: documentation-index
project: lufa
lastUpdated: '2026-04-07'
generatedAtCommit: "ab53a003edb177c2298250479fbe4465ee920bc3"
---

# Lufa Documentation Index

> Central navigation for all project documentation.
> Last updated: 2026-04-07

---

## Quick Reference Links

### Critical Reading (MUST READ FIRST)

| Document                              | Purpose                                  |
| ------------------------------------- | ---------------------------------------- |
| [Project Context](project-context.md) | **CRITICAL** rules AI agents must follow |

### Architecture Documentation

| Document                                                                  | Purpose                                                                       |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| [Main Container](documentation/apps/lufa_microfrontend_main-container.md) | Single-SPA root config — platform entry point and microfrontend orchestration |
| [Design System](documentation/design-system/lufa_design-system.md)        | Primary React component library — token-driven, accessible UI components      |
| [Design Tokens](documentation/design-system/lufa_design-system-tokens.md) | 698-token DTCG hierarchy — foundation of the entire styling system            |
| [Themes](documentation/design-system/lufa_design-system-themes.md)        | 10 pre-built CSS theme variants with light/dark/high-contrast support         |

---

## Package Dependency Map

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Configuration Layer                          │
│  lufa_config_eslint  lufa_config_prettier  lufa_config_tsconfig     │
│            (consumed by every package in the monorepo)              │
└────────────────────────────┬────────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────────┐
│                     Design System Layer                             │
│                                                                     │
│   lufa_design-system-tokens  ──►  lufa_design-system-themes         │
│              │                                                      │
│              ▼                                                      │
│       lufa_design-system  (main component library)                  │
│              │                                                      │
│    ┌─────────┼──────────────────────────────┐                       │
│    ▼         ▼                              ▼                       │
│  lufa_design-system-storybook  lufa_design-system-playwright        │
│  lufa_design-system-docusaurus  lufa_design-system-cli              │
│  lufa_plugin_vscode_lufa-ds-preview                                 │
└────────────────────────────┬────────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────────┐
│                      Applications Layer                             │
│                                                                     │
│          Vite Plugins (inject import maps & React preamble)         │
│    lufa_plugin_vite_vite-plugin-import-map-injector                 │
│    lufa_plugin_vite_vite-plugin-react-preamble                      │
│                          │                                          │
│                          ▼                                          │
│  lufa_microfrontend_main-container  ◄──  lufa_microfrontend_home    │
│       (Single-SPA root config)           (/ route parcel)          │
│                          │                                          │
│                          ▼                                          │
│                   cdn_autobuild-server                              │
│           (serves ESM assets at runtime via CDN)                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Package Documentation

### Applications

| Package | Description | Docs |
| ------- | ----------- | ---- |
| `@grasdouble/lufa_microfrontend_main-container` | Single-SPA root container — orchestrates loading, routing, and lifecycle of all microfrontends | [Doc](documentation/apps/lufa_microfrontend_main-container.md) \| [Context](context/apps/lufa_microfrontend_main-container.context.md) |
| `@grasdouble/lufa_microfrontend_home` | Home page microfrontend — implements Single-SPA parcel lifecycle for the root (`/`) route | [Doc](documentation/apps/lufa_microfrontend_home.md) \| [Context](context/apps/lufa_microfrontend_home.context.md) |

### CDN

| Package | Description | Docs |
| ------- | ----------- | ---- |
| `@grasdouble/cdn_autobuild-server` | Self-fed CDN HTTP server — fetches, caches, and serves ESM-only npm/GitHub package assets on demand | [Doc](documentation/cdn/cdn_autobuild-server.md) \| [Context](context/cdn/cdn_autobuild-server.context.md) |

### Configuration

| Package | Description | Docs |
| ------- | ----------- | ---- |
| `@grasdouble/lufa_config_eslint` | Shared ESLint flat-config presets — four composable profiles for JS, TypeScript, Node.js, and React | [Doc](documentation/config/lufa_config_eslint.md) \| [Context](context/config/lufa_config_eslint.context.md) |
| `@grasdouble/lufa_config_prettier` | Shared Prettier configuration — opinionated formatting baseline with import sorting and cross-platform line endings | [Doc](documentation/config/lufa_config_prettier.md) \| [Context](context/config/lufa_config_prettier.context.md) |
| `@grasdouble/lufa_config_tsconfig` | Shared TypeScript config presets — four archetypes (base, Node, React lib, React app) for consistent compiler options | [Doc](documentation/config/lufa_config_tsconfig.md) \| [Context](context/config/lufa_config_tsconfig.context.md) |

### Design System

| Package | Description | Docs |
| ------- | ----------- | ---- |
| `@grasdouble/lufa_design-system` | Primary React component library — accessible, token-driven UI components compiled to a single ESM bundle | [Doc](documentation/design-system/lufa_design-system.md) \| [Context](context/design-system/lufa_design-system.context.md) |
| `@grasdouble/lufa_design-system-tokens` | Design token foundation — 698 DTCG tokens across a 4-level hierarchy, emitting 1025 CSS custom properties | [Doc](documentation/design-system/lufa_design-system-tokens.md) \| [Context](context/design-system/lufa_design-system-tokens.context.md) |
| `@grasdouble/lufa_design-system-themes` | Pre-built CSS theme variants — 10 themes overriding the full adaptive token set across light/dark/high-contrast modes | [Doc](documentation/design-system/lufa_design-system-themes.md) \| [Context](context/design-system/lufa_design-system-themes.context.md) |
| `@grasdouble/lufa_design-system-cli` | Theme validation toolchain — enforces token completeness, WCAG AA contrast, and CSS value correctness for custom themes | [Doc](documentation/design-system/lufa_design-system-cli.md) \| [Context](context/design-system/lufa_design-system-cli.context.md) |
| `@grasdouble/lufa_design-system-docusaurus` | Official documentation website — Docusaurus 3 static site deployed to `lufa-ds.grasdouble.com` | [Doc](documentation/design-system/lufa_design-system-docusaurus.md) \| [Context](context/design-system/lufa_design-system-docusaurus.context.md) |
| `@grasdouble/lufa_design-system-playwright` | Component test suite — behavioral, accessibility, and visual regression tests via Playwright CT | [Doc](documentation/design-system/lufa_design-system-playwright.md) \| [Context](context/design-system/lufa_design-system-playwright.context.md) |
| `@grasdouble/lufa_design-system-storybook` | Interactive component explorer — Storybook 10 instance for live component catalog and token visualization | [Doc](documentation/design-system/lufa_design-system-storybook.md) \| [Context](context/design-system/lufa_design-system-storybook.context.md) |

### Plugins

| Package | Description | Docs |
| ------- | ----------- | ---- |
| `@grasdouble/lufa_plugin_vite_vite-plugin-import-map-injector` | Vite plugin — injects Import Map `<script>` tags into `index.html` for Single-SPA microfrontend module resolution | [Doc](documentation/plugins/lufa_plugin_vite_vite-plugin-import-map-injector.md) \| [Context](context/plugins/lufa_plugin_vite_vite-plugin-import-map-injector.context.md) |
| `@grasdouble/lufa_plugin_vite_vite-plugin-react-preamble` | Vite plugin — injects React Fast Refresh preamble into `<head>` to enable HMR in remote Single-SPA dev setups | [Doc](documentation/plugins/lufa_plugin_vite_vite-plugin-react-preamble.md) \| [Context](context/plugins/lufa_plugin_vite_vite-plugin-react-preamble.context.md) |
| `@grasdouble/lufa_plugin_vscode_lufa-ds-preview` | VS Code extension — inline color decorators, hover previews, and autocomplete for Lufa design tokens | [Doc](documentation/plugins/lufa_plugin_vscode_lufa-ds-preview.md) \| [Context](context/plugins/lufa_plugin_vscode_lufa-ds-preview.context.md) |

---

## Navigation Guide

### For New Developers

1. Read [Project Context](project-context.md)
2. Explore the [Design System](documentation/design-system/lufa_design-system.md) core package
3. Understand the [Microfrontend Architecture](documentation/apps/lufa_microfrontend_main-container.md)
4. Review [Design System Tokens](documentation/design-system/lufa_design-system-tokens.md) and [Themes](documentation/design-system/lufa_design-system-themes.md)

### For AI Agents

1. **ALWAYS** start with [Project Context](project-context.md)
2. Check relevant package `.context.md` files in `context/` before making changes
3. Refer to package documentation in `documentation/` for API details

### For Feature Development

1. Check Design System component guidelines
2. Review existing microfrontend patterns
3. Follow Playwright test strategy

---

## Documentation Statistics

| Category            | Count | Last Updated |
| ------------------- | ----- | ------------ |
| Packages Documented | 16    | 2026-04-07   |
| Context Files       | 16    | 2026-04-07   |
| Architecture Docs   | 1     | —            |
