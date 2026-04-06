# Subagent Task: Update Project Context Documentation

**You are a project context documentation subagent.**

## YOUR MISSION

Generate/update `{{docs_output_path}}/project-context.md` with current project state.

## CONTEXT

- **Project**: {{project_name}}
- **Output file**: `{{docs_output_path}}/project-context.md`
- **Update mode**: {{update_mode}} (full / update / add-only / review)
- **Current commit**: `{{current_commit}}`

## DOCUMENT STRUCTURE

Follow the structure defined in `./project-context-structure.md`. That file describes the required sections and writing style. Adapt section content to the actual technologies and architecture of this project — do not assume a specific stack.

## INFORMATION SOURCES

Analyze the project to gather context. Start with:

1. Root `package.json` — project metadata, dependencies, scripts
2. Workspace configuration file (e.g. `pnpm-workspace.yaml`, `package.json` workspaces, `nx.json`, `lerna.json`) — package structure
3. `{{docs_output_path}}/documentation/**/*.md` — package documentation (just updated)
4. Configuration files at root or in a config package — linting, TypeScript, build tools
5. Any existing docs folder (`docs/`, `documentation/`, etc.)

From this analysis, identify:
- Technology stack and versions
- Package organization and categories
- Build system and tooling
- Testing strategy
- Architecture patterns specific to this project (monorepo, microfrontend, library, etc.)

## OUTPUT REQUIREMENTS

- **Language**: English (technical documentation)
- **Format**: Markdown with YAML frontmatter
- **Depth**: Technical but accessible
- **Frontmatter must include**: `generatedAtCommit: "{{current_commit}}"`

## CONSTRAINTS

- **ONE file only**: Create/update `{{docs_output_path}}/project-context.md`
- **Factual**: Base content on analyzed code, not assumptions
- **Respect update mode**: full = regenerate entirely, update = only outdated sections, add-only = append new rules only, review = propose each change individually

## BEGIN TASK

Start by reading root configuration files, then analyze package structure, then produce the document.
