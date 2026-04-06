---
name: 01-scan
description: Scan monorepo for packages needing documentation updates
nextStep: ./02-update-packages.md
nextStepContext: ./03-update-context.md
---

# Step 1: Scan Monorepo

## Goal

Identify which packages need documentation updates by delegating to a scan subagent. Present results and let the user confirm the list before proceeding.

## Subagent Prompt

Launch ONE subagent with the following mission. Wait for its JSON report before continuing.

> See `./subagent-scan.prompt.md` for the full subagent prompt.

Substitute these values before launching:
- `{project-root}` — resolved project root path

## After Scan

Parse the subagent report and extract:
- `main_head_commit` — store as `{current_commit}` for all subsequent subagents
- `packages_needing_update` — list of packages to potentially document
- Summary statistics

Present the results clearly:

```
Scan Results

{packages_up_to_date} packages up to date
{needs_update} packages needing update
{missing_docs} packages missing documentation

Packages to update:
- {package_name} ({category}) — {reason}
...

Available actions:
[A] All       — Update all identified packages
[S] Select    — Choose which packages to update
[N] New Only  — Only new packages (missing docs)
[V] Version   — Only packages with source changes
[X] Skip      — Skip to next step without package update
```

Wait for user selection.

**Selection handling:**
- A → use full `packages_needing_update` list
- S → present numbered list, let user multi-select
- N → filter to `status: "missing"` packages only
- V → filter to `status: "needs_update"` packages only
- X → set `packages_to_update` to empty
- Other input → answer and re-display menu

Store final selection as `{packages_to_update}`.

## Routing

- `packages_to_update` not empty → Load `./02-update-packages.md`
- Empty AND mode is F or S → Load `./03-update-context.md`
- Mode is P → End workflow (packages-only mode)

## Key Notes on the Squash Merge Strategy

This project uses **squash and merge** exclusively. `generatedAtCommit` in doc frontmatter always references a `main` branch SHA. The scan subagent uses `git log --first-parent` against `main` — not HEAD. This is intentional.

If running from a non-`main` branch, the scan subagent will warn but continue. `{current_commit}` is always set to `git rev-parse main`, never the current branch HEAD.
