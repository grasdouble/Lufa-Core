---
name: 03-update-context
description: Update project-context.md using a dedicated subagent
nextStep: ./04-update-index.md
---

# Step 3: Update project-context.md

## Goal

Delegate the generation or update of `{project-root}/_bmad-docs/project-context.md` to a single subagent. The subagent analyzes current project state from source files — not from memory.

## User Confirmation

Present update mode options and wait:

```
Step 3/4: project-context.md Update

[F] Full Regenerate  — Completely regenerate the file
[U] Update Sections  — Only update outdated sections
[A] Add Only         — Add new rules without modifying existing
[R] Review           — Review each change individually
[S] Skip             — Skip this step
```

Wait for user selection. Answer any queries, then re-display the menu.

## Subagent Launch

Load `./subagent-context.prompt.md`. Pass the selected mode and `{current_commit}` to the subagent. The subagent will produce `{project-root}/_bmad-docs/project-context.md` following the structure in `./project-context-structure.md`.

After the subagent completes, report the result (file path, line count, sections updated).

## Routing

- Mode F or S (workflow mode) → Load `./04-update-index.md`
- Mode C (context-only) → End workflow, show summary
