---
name: 02-update-packages
description: Generate or update documentation for selected packages using parallel subagents
nextStep: ./03-update-context.md
---

# Step 2: Update Package Documentation

## Goal

Document every package in `{packages_to_update}` by launching **one subagent per package, all in parallel**. Each subagent is fully isolated and writes only its assigned files to `{project-root}/_bmad-docs/packages/{category}/`.

## Naming Reference

See `./package-naming-conventions.md` for variable definitions, scope stripping, output file names, and directory mapping.

## Parallel Launch

Load `./subagent-package-doc.prompt.md`. For each package in `{packages_to_update}`, substitute all `{{variable}}` placeholders with values from the scan report:

| Placeholder              | Value source                          |
|--------------------------|---------------------------------------|
| `{{package_name}}`       | `name` from scan report               |
| `{{package_name_short}}` | `name` stripped of `@scope/` prefix   |
| `{{package_path}}`       | `path` from scan report               |
| `{{category}}`           | `category` from scan report           |
| `{{project_root}}`       | resolved `{project-root}`             |
| `{{current_commit}}`     | `{current_commit}` from Step 1        |
| `{{commits_since_last}}` | `commits_since_last` from scan report |

**Critical:** Launch ALL subagents in a single `function_calls` block so they execute in parallel. One package = one subagent. Never batch multiple packages in one call.

Announce before launching:

```
Step 2/4: Package Documentation Update
{count} packages — launching {count} subagents in parallel...
```

## Collecting Results

After all subagents complete, report each outcome:

```
✅ {package_name} — {doc_file}, {context_file}
❌ {package_name} — {error}
```

**On failure**, present options and wait for user input:
- R — Retry the failed subagent
- S — Skip this package
- M — Create empty template files for manual completion
- A — Abort remaining queue

## Routing After Completion

- Mode F or S → Load `./03-update-context.md`
- Mode P → End workflow, show summary
