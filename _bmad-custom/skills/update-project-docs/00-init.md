---
name: 00-init
description: Run scan first, display results, then capture update mode selection from user
nextStepScan: "01-scan.md"
nextStepContext: "03-update-context.md"
nextStepPackages: "02-update-packages.md"
scanScript: "scripts/scan-packages.py"
---

Communicate with user in `{communication_language}`. Write document content in `{document_output_language}`.

# Step 0: Scan & Mode Selection

## MANDATORY EXECUTION RULES (READ FIRST)

### Universal Rules

→ See `references/universal-rules.md` — applies to all steps.

### Step-Specific Rules

- 🎯 Run scan FIRST (deterministic script) before presenting the mode menu — gives user context about impacted packages
- 🎯 This step captures the mode — no analysis, no LLM subagents (only the scan script)
- FORBIDDEN to proceed without user selecting a valid mode (unless headless)
- Route to the correct step based on mode selection

## EXECUTION PROTOCOLS

- Run scan script (always, before mode selection)
- Check for headless mode — auto-proceed if active
- Display scan results + mode selection menu
- Halt and wait for user selection
- Execute routing based on choice

---

## 0. RUN SCAN

Run the full scan script before presenting anything to the user (non-blocking — if it fails, continue to section 1 without scan results):

```bash
python3 {scanScript} --root . --packages-root {packages_root} --merge-strategy {git_merge_strategy}
```

If `python3` is not available, try `python {scanScript}`.

If the script succeeds and output is valid JSON:
- Store `scan_pre_run = true` in workflow state
- Store `packages_to_update`, `scan_summary`, and `current_head_commit` from JSON output
- Continue to section 1

If the script fails or output is not valid JSON:
- Set `scan_pre_run = false`
- Continue to section 1 (the menu will still be shown, but without scan context)

---

## 1. DISPLAY WELCOME + SCAN RESULTS

### 1.1 Welcome Banner

Display:

```
🔄 **Update Project Documentation Workflow v2.0**

This workflow uses parallel subagents to update documentation efficiently.

Architecture:
  • Step 1 — Scan monorepo (deterministic script)
  • Step 2 — Package docs (N subagents IN PARALLEL, 1 per package)
  • Step 3 — project-context.md (1 subagent)
  • Step 4 — index.md (1 subagent)
```

### 1.2 Scan Results (if available)

If `scan_pre_run = true`, compute counts from scan JSON:

```
count_total        = total number of packages in monorepo
count_needing      = number of packages with status needs_update or missing
count_new          = number of packages with status missing (no doc yet)
count_version      = number of packages with status needs_update (version changed)
ratio              = count_needing / count_total
```

Derive smart suggestion:

```
IF ratio > 0.5  → suggest [A]
IF ratio > 0.2  → suggest [S]
IF ratio <= 0.2 → suggest [N] or [S]
```

Display the scan summary (package-by-package table or list):

```
📊 **Scan Results**

{Scan Report — package table from JSON, with status column}

💡 Suggestion: [{suggested_option}] — {count_needing}/{count_total} packages need update
```

If `scan_pre_run = false`, display:

```
⚠️  Scan could not run automatically. Options [A], [S], [N], [V] will trigger the scan on the next step.
```

---

## 2. PRESENT PACKAGE SELECTION MENU

### 2.0 HEADLESS MODE CHECK

If `{headless}` = true:
- Set `{mode}` = A. Set `packages_to_update` = all identified packages from scan.
- Display: `"🤖 Headless mode active: All packages auto-selected."`
- Load, read completely, and execute `{nextStepPackages}` immediately. **Skip all remaining sections in this file.**

### 2.1 Display Menu

If `scan_pre_run = true`, display (substituting real counts):

```
**Select update scope:**

[A] All          — Update all {count_needing} identified packages
[S] Select       — Choose which packages to update
[N] New Only     — Only new packages ({count_new})
[V] Version Only — Only version-changed packages ({count_version})
[X] Skip         — Skip to context update without packages

Your choice:
```

If `scan_pre_run = false`, display the same menu but without the counts in parentheses, and replace `{count_needing}` with `all detected packages`.

### 2.2 Menu Handling Logic

**When `scan_pre_run = true`** (scan results available — route directly to packages step):

- **IF A:** Set `{mode}` = A. `packages_to_update` = all packages from scan with `needs_update` or `missing` status. Load, read completely, and execute `{nextStepPackages}`.
- **IF S:** Show numbered list of all identified packages. Wait for user to pick by number(s) or name(s). Store selection in `packages_to_update`. Load, read completely, and execute `{nextStepPackages}`.
- **IF N:** Set `{mode}` = N. `packages_to_update` = packages with status `missing` only. Load, read completely, and execute `{nextStepPackages}`.
- **IF V:** Set `{mode}` = V. `packages_to_update` = packages with status `needs_update` only. Load, read completely, and execute `{nextStepPackages}`.
- **IF X:** Set `{mode}` = X. Display "Skipping packages — proceeding to context update.". Load, read completely, and execute `{nextStepContext}`.

**When `scan_pre_run = false`** (no scan results — must scan first):

- **IF A, S, N, or V:** Load, read completely, and execute `{nextStepScan}` (will run scan then present package selection).
- **IF X:** Load, read completely, and execute `{nextStepContext}`.

**IF any other input or question:** Answer the user's query, then redisplay this menu.

### 2.3 Execution Rules

- ⏸️ ALWAYS halt and wait for user selection after displaying the menu
- ONLY proceed after a valid option (A/S/N/V/X) is selected
- After answering any query or comment, return to the menu display

---

## Stage Progression

- `{nextStepPackages}` (`02-update-packages.md`) — when A/S/N/V selected and scan results are available
- `{nextStepScan}` (`01-scan.md`) — when A/S/N/V selected but scan failed (fallback)
- `{nextStepContext}` (`03-update-context.md`) — when X selected

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS

- Scan executed (or gracefully skipped on failure)
- Welcome message + scan results displayed
- Package selection menu presented with real counts
- Valid user selection captured
- Correct step routed and loaded

### ❌ SYSTEM FAILURE

- Displaying mode menu before scan runs
- Proceeding without user input
- Routing to wrong step for selected option
- Failing to redisplay menu after non-mode input

**Master Rule:** This step captures mode only. No work is done here.
