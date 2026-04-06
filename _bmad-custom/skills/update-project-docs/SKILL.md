---
name: update-project-docs
description: Maintains up-to-date documentation using parallel subagents. Use when the user says 'update project docs', 'update documentation', 'mise à jour la doc' or 'mettre à jour la documentation'.
---

# update-project-docs

## Overview

This skill maintains up-to-date documentation in `{docs_output_path}/` by orchestrating parallel subagents across the monorepo. Act as a **documentation orchestrator** — you coordinate and delegate, never doing analysis yourself. Subagents scan the monorepo, document packages in parallel, then update the project context and navigation index. Your output is a fully refreshed `{docs_output_path}/` reflecting the current state of the codebase.

**Why orchestrate instead of doing it directly?** Each package gets a fresh, isolated context — no cross-contamination, better quality, and all packages run simultaneously for maximum efficiency.

## On Activation

1. **Load config via bmad-init skill** — Use module `bmm`:
   ```
   Use bmad-init skill:
   - module: bmm
   ```
   Store all returned vars for use throughout the skill:
    - `{user_name}` — for greeting
    - `{communication_language}` — for all communications
    - `{document_output_language}` — for generated docs
    - `{project_name}` — project identifier
    - `{packages_root}` — root folder containing packages (e.g. `packages`)
    - `{docs_output_path}` — docs output folder (e.g. `_bmad-docs`)
    - `{git_merge_strategy}` — `merge` (default) or `squash`. Use `squash` for repos where PRs land as single squash commits on main. Affects how the scan script detects changes since last doc generation.

2. **Greet** `{user_name}` in `{communication_language}`, briefly explain the workflow.

3. **Route to stage** `00-init.md` to begin — load and execute it.

   If config is missing or incomplete, infer values from the project at runtime (read root `package.json`, scan `{packages_root}/`). Only ask the user if inference is impossible.

## Stages

| # | Stage | Purpose | Prompt |
|---|-------|---------|--------|
| 0 | init | **Run scan first**, then package selection (All/Select/New/Version/Skip) | `00-init.md` |
| 1 | scan | Fallback scan if step 0 scan failed — then package selection (A/S/N/V/X) | `01-scan.md` |
| 2 | update-packages | Document packages in parallel (1 subagent/package) | `02-update-packages.md` |
| 3 | update-context | Update `_bmad-docs/project-context.md` | `03-update-context.md` |
| 4 | update-index | Update `_bmad-docs/index.md` | `04-update-index.md` |

## Reference

- `references/parallel-architecture.md` — Architecture rationale for parallel subagent pattern
- `references/package-naming-conventions.md` — Variable names, file naming, directory mapping

## Assets

- `assets/subagent-package-doc.prompt.md` — Subagent prompt template: package documentation (with `{{variable}}` substitution)
- `assets/subagent-context.prompt.md` — Subagent prompt: project-context.md update
- `assets/subagent-index.prompt.md` — Subagent prompt: index.md update
- `assets/index-structure.md` — Structure template for index.md
- `assets/project-context-structure.md` — Structure template for project-context.md
- `assets/package-doc.template.md` — Output template for package docs
- `assets/package-context.template.md` — Output template for package context files

## Scripts

- `scripts/scan-packages.py` — Deterministic monorepo scanner. Replaces the scan subagent (~600-1000 tokens saved per run). Run from project root via `python3 scripts/scan-packages.py [--root /path/to/repo] [--merge-strategy merge|squash]`. Outputs JSON to stdout.
- `scripts/validate-index.py` — Structural validator for `{docs_output_path}/index.md`. Checks required sections, internal link integrity, and package link targets. Used by `04-update-index.md` before user confirmation. Exit 0 = OK, 2 = warnings, 1 = errors.
- `scripts/count-results.py` — File-existence audit after parallel subagent run. Verifies doc + context files were actually written to disk. Used by `02-update-packages.md` section 4.4. Usage: `python3 scripts/count-results.py --packages pkg1,pkg2 [--root /path/to/repo]`.

## Constraints

- **Single-session only:** All workflow state (`{mode}`, `packages_to_update`, stage results) is held in the LLM’s context memory. There is no persistence between sessions. If the conversation resets or the context window is exceeded, the skill must be restarted from `00-init.md`.
- **No partial resume:** There is no checkpoint or resume mechanism — interrupted runs cannot be continued in a new session. Plan for full runs in one uninterrupted conversation.
- **Context window budget:** Each parallel subagent returns a large result. For monorepos with many packages (>10), consider using **Selective (S)** or **Packages Only (P)** mode to stay within the context limit.

## Advanced Usage

### Headless Mode (CI/CD)

Set `{headless}` = true in the skill config vars to skip all 4 HITL confirmation points:

```
Use bmad-init skill:
- module: bmm
- vars: ...,headless:true
```

Headless auto-decisions:
- `00-init.md` — runs scan, auto-selects **A** (all identified packages), routes to `02-update-packages.md`
- `01-scan.md` — fallback only; if reached, auto-selects **A** (all packages) after scan
- `02-update-packages.md` — auto-skips failed packages ([S])
- `03-update-context.md` — auto-selects **F** (Full regenerate)
- `04-update-index.md` — auto-confirms **Y** (Save)

### Manual Mode (Specify Packages Directly)

Select **[S]** in `00-init.md` to pick individual packages from the list. If you already know the exact package names, you can also type them directly when prompted. Context (project-context.md) and index (index.md) will still be updated after packages. Useful when you know precisely which packages changed.

### Last Run Summary

Get a quick stats snapshot without running a full scan:

```bash
python3 scripts/scan-packages.py --last-run --root .
```

This reads only doc frontmatter (no git calls) and returns `last_run_date`, `days_since_last_run`, and package coverage stats. Also displayed automatically in the `00-init.md` welcome screen.
