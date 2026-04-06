# Subagent Task: Update Project Context Documentation

**You are a project context documentation subagent.**

## YOUR MISSION

Generate/update the `_bmad-docs/project-context.md` file with current project state.

## TARGET FILE

**Output**: `_bmad-docs/project-context.md`

## DOCUMENT STRUCTURE

```markdown
---
name: project-context
type: context-document
project: lufa
lastUpdated: { current_date }
generatedAtCommit: '{{current_commit}}'
---

# Lufa Project Context

## Project Overview

[High-level description of the Lufa monorepo: Design System + Microfrontend Platform]

## Architecture

[Current architecture: monorepo, microfrontend, packages structure, import maps]

## Technology Stack

[Current stack: React, TypeScript, Vite, Storybook, Docusaurus, Playwright, pnpm, Design System]

## Package Organization

[High-level package categories and their roles: apps, cdn, config, design-system, plugins, poc]

## Design System Patterns

[Key patterns: tokens, themes, component structure, Storybook stories]

## Build System

[Vite, pnpm workspace configuration, plugin architecture]

## Testing Strategy

[Playwright tests, Storybook visual tests, unit tests]

## Microfrontend Architecture

[Import maps, main-container, home microfrontend, runtime composition]

## External Dependencies

[Key external dependencies and integrations]

## Current State

[Development status, active work, known issues]
```

## INFORMATION SOURCES

Analyze these files for context:

1. `package.json` - Root package configuration
2. `pnpm-workspace.yaml` - Workspace structure
3. `docs/**/*.md` - Existing documentation (if any)
4. `_bmad-docs/packages/**/*.md` - Package documentation (just updated)
5. `packages/design-system/main/package.json` - Design System metadata
6. `packages/apps/microfrontend/*/package.json` - Microfrontend apps metadata

## YOUR TASKS

### 1. Gather Project Information

Read and analyze:

- Root `package.json` for project metadata
- `pnpm-workspace.yaml` for package structure
- Key configuration files in `packages/config/`
- Key docs in `docs/` folder (if present)

### 2. Analyze Current State

Identify:

- Active technologies and versions
- Package organization (apps, cdn, config, design-system, plugins, poc)
- Development patterns (Design System tokens/themes, Storybook, Playwright)
- Build process (Vite, pnpm workspaces)
- Microfrontend architecture (import maps, runtime composition)

### 3. Generate project-context.md

Create comprehensive context document following the structure above.

## OUTPUT REQUIREMENTS

- **Language**: English (technical documentation)
- **Format**: Markdown with YAML frontmatter
- **Depth**: Technical but accessible
- **Length**: ~500-800 lines comprehensive overview

## CONSTRAINTS

- **ONE file only**: Create/update `_bmad-docs/project-context.md`
- **Factual**: Base content on analyzed code, not assumptions
- **Current**: Reflect actual current state of the project
- **Commit tracking**: Always write `generatedAtCommit: "{{current_commit}}"` in frontmatter

## BEGIN TASK

Start by reading root configuration files, then analyze package structure.
