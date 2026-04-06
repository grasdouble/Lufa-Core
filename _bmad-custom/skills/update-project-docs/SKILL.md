---
name: update-project-docs
description: Maintains up-to-date documentation in _bmad-docs/ using parallel subagents. Use when user says "update project docs", "update documentation", or "doc update".
---

# Update Project Docs

## Overview

Orchestrates documentation maintenance for the Lufa monorepo. Scans packages for changes since last doc generation, dispatches parallel subagents to document each stale package, then updates `project-context.md` and `index.md`. Acts as pure coordinator — all analysis and writing is delegated.

**Modes:**
- **Full** — Scan + packages (parallel) + context + index
- **Selective** — User picks which steps to include
- **Packages Only** — Scan + parallel package docs
- **Context Only** — Update `project-context.md` only

## On Activation

Load config from `{project-root}/_bmad/config.yaml` and `{project-root}/_bmad/config.user.yaml` if present.

Key variables to resolve (with defaults):
- `{user_name}` — address user by name
- `{communication_language}` — all communications
- `{document_output_language}` — generated doc content (default: English)
- `{docsPath}` → `{project-root}/_bmad-docs`

Then greet the user and present the mode selection:

```
Update Project Documentation

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
