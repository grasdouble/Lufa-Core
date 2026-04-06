---
name: update-project-docs
description: Maintains up-to-date documentation for a monorepo using parallel subagents. Use when user says "update project docs", "update documentation", or "doc update".
---

# Update Project Docs

## Overview

Orchestrates documentation maintenance for a monorepo. Scans packages for changes since last doc generation, dispatches parallel subagents to document each stale package, then updates `project-context.md` and `index.md`. Acts as pure coordinator — all analysis and writing is delegated.

**Modes:**
- **Full** — Scan + packages (parallel) + context + index
- **Selective** — User picks which steps to include
- **Packages Only** — Scan + parallel package docs
- **Context Only** — Update `project-context.md` only

## On Activation

Load config from `{project-root}/_bmad/config.yaml` and `{project-root}/_bmad/config.user.yaml` if present.

Resolve these variables (with defaults):

| Variable                  | Default              | Description                                      |
|---------------------------|----------------------|--------------------------------------------------|
| `{user_name}`             | —                    | Address user by name                             |
| `{communication_language}`| English              | All communications                               |
| `{document_output_language}` | English           | Generated doc content                            |
| `{project_name}`          | infer from `package.json` | Project name used in doc titles            |
| `{packages_root}`         | `packages`           | Root folder containing packages (relative to project-root) |
| `{docs_output_path}`      | `_bmad-docs`         | Output folder for generated docs (relative to project-root) |
| `{package_scope}`         | infer from packages  | npm scope prefix (e.g. `@myorg`), empty if none |
| `{git_merge_strategy}`    | `squash`             | `squash` or `merge` — affects change detection logic |

If config is missing or incomplete, infer values from the project at runtime (read root `package.json`, scan `{packages_root}/`). Only ask the user if inference is impossible.

Then greet the user and present the mode selection:

```
Update Project Documentation — {project_name}

Select update mode:
[F] Full Update    — Scan + packages (parallel) + context + index
[S] Selective      — Choose which steps to include
[P] Packages Only  — Scan + packages only (parallel)
[C] Context Only   — Update project-context.md only
```

Wait for user selection before proceeding.

**Routing:**
- F → Load `./references/01-scan.md`
- S → Ask which steps to include, then load `./references/01-scan.md`
- P → Load `./references/01-scan.md`
- C → Load `./references/03-update-context.md`
- Any other input → Answer the question, then re-display the menu

Store the selected `{mode}` (F/S/P/C) — it drives routing decisions throughout the workflow.

## Critical Orchestrator Rule

You are the **orchestrator**. You do not scan, document, or write files yourself. Every task is delegated to subagents. Your role is to coordinate, collect results, handle errors, and report progress.
