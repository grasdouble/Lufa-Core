# Subagent Task: Update Documentation Index

**You are a documentation index subagent.**

## YOUR MISSION

Generate/update the `_bmad-docs/index.md` file as a navigation hub for all documentation.

## TARGET FILE

**Output**: `_bmad-docs/index.md`

## DOCUMENT STRUCTURE

```markdown
---
name: index
type: documentation-index
project: lufa
lastUpdated: { current_date }
generatedAtCommit: '{{current_commit}}'
---

# Lufa Documentation

## Quick Links

[Links to key documents]

## Project Context

[Link to project-context.md with brief description]

## Package Documentation

### Applications (`packages/apps/`)

- [lufa_microfrontend_main-container](packages/apps/lufa_microfrontend_main-container.md) - Main microfrontend container
- [lufa_microfrontend_home](packages/apps/lufa_microfrontend_home.md) - Home microfrontend

### CDN (`packages/cdn/`)

- [cdn_autobuild-server](packages/cdn/cdn_autobuild-server.md) - CDN autobuild server

### Configuration (`packages/config/`)

- [lufa_config_eslint](packages/config/lufa_config_eslint.md) - Shared ESLint configuration
- [lufa_config_tsconfig](packages/config/lufa_config_tsconfig.md) - Shared TypeScript configuration
- [lufa_config_prettier](packages/config/lufa_config_prettier.md) - Shared Prettier configuration

### Design System (`packages/design-system/`)

- [lufa_design-system](packages/design-system/lufa_design-system.md) - Core Design System
- [lufa_design-system-tokens](packages/design-system/lufa_design-system-tokens.md) - Design tokens
- [lufa_design-system-themes](packages/design-system/lufa_design-system-themes.md) - Design themes
- [lufa_design-system-cli](packages/design-system/lufa_design-system-cli.md) - CLI tooling
- [lufa_design-system-storybook](packages/design-system/lufa_design-system-storybook.md) - Storybook setup
- [lufa_design-system-docusaurus](packages/design-system/lufa_design-system-docusaurus.md) - Docusaurus docs site
- [lufa_design-system-playwright](packages/design-system/lufa_design-system-playwright.md) - Playwright tests

### Plugins (`packages/plugins/`)

- [lufa_plugin_vite_import-map-injector](packages/plugins/lufa_plugin_vite_import-map-injector.md) - Vite import map injector plugin
- [lufa_plugin_vite_react-preamble](packages/plugins/lufa_plugin_vite_react-preamble.md) - Vite React preamble plugin
- [lufa_plugin_vscode_ds-preview](packages/plugins/lufa_plugin_vscode_ds-preview.md) - VS Code Design System preview extension

### Proof of Concept (`packages/poc/`)

- ... (poc packages)

## Context Files

[List of all .context.md files for AI assistance]

## Guidelines

[Links to guidelines in docs/ folder if available]
```

## YOUR TASKS

### 1. Inventory Documentation

Scan `_bmad-docs/` to find all:

- `*.md` files (documentation)
- `*.context.md` files (AI context)
- Subdirectory structure

### 2. Organize by Category

Group packages by their category:

- apps
- cdn
- config
- design-system
- plugins
- poc

### 3. Generate index.md

Create navigation index with:

- Links to all package docs
- Links to context files
- Links to guidelines (if any exist)
- Proper categorization

## OUTPUT REQUIREMENTS

- **Language**: English
- **Format**: Markdown with YAML frontmatter
- **Style**: Clean navigation document
- **Links**: Relative paths from `_bmad-docs/`

## CONSTRAINTS

- **ONE file only**: Create/update `_bmad-docs/index.md`
- **Auto-generated links**: Base on actual existing files
- **No broken links**: Only link to files that exist
- **Commit tracking**: Always write `generatedAtCommit: "{{current_commit}}"` in frontmatter

## BEGIN TASK

Start by scanning `_bmad-docs/packages/` to inventory all documentation files.
