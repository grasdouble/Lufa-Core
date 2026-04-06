---
name: 04-update-index
description: Regenerate _bmad-docs/index.md using a dedicated subagent
---

# Step 4: Update index.md

## Goal

Delegate generation of `{project-root}/_bmad-docs/index.md` to a single subagent that inventories all existing documentation files and builds a clean navigation index.

## Subagent Launch

Load `./subagent-index.prompt.md`. Pass `{current_commit}`. The subagent will scan `{project-root}/_bmad-docs/packages/` and produce a complete `index.md` following the structure in `./index-structure.md`.

After the subagent returns its draft, show the user a preview of key sections (Quick Links, package counts, categories present).

## User Confirmation

```
Confirm update?

[Y] Yes          — Save the updated index
[P] Preview Full — View complete index before saving
[E] Edit         — Modify specific sections
[N] No           — Cancel changes
```

Wait for user selection. Only save after Y is confirmed.

- P → Display full generated content, then re-display menu
- E → Ask which sections to modify, re-launch subagent for those sections, then re-display menu
- N → Cancel, end workflow without saving index

## Workflow Completion

After saving, display final summary:

```
Workflow Complete

| Step       | Result                                    |
|------------|-------------------------------------------|
| 1. Scan    | {count} packages analysed                 |
| 2. Packages| {count} packages documented               |
| 3. Context | project-context.md updated                |
| 4. Index   | index.md regenerated                      |

Suggested next step:
git add _bmad-docs && git commit -m "docs: update project documentation"
```
