---
name: 01-scan
description: Run deterministic scan script to identify packages needing documentation updates
scanScript: "scripts/scan-packages.py"
nextStepPackages: "02-update-packages.md"
nextStepContext: "03-update-context.md"
---

Communicate with user in `{communication_language}`. Write document content in `{document_output_language}`.

# Step 1: Scan Monorepo (Script)

**Architecture:** Orchestrator runs a deterministic Python script via terminal — no subagent, no LLM tokens consumed for scanning.

---

## MANDATORY EXECUTION RULES (READ FIRST)

### Universal Rules

→ See `references/universal-rules.md` — applies to all steps.

### Step-Specific Rules

- Run `{scanScript}` via terminal — pure Python, no LLM involved
- Parse the JSON output before presenting results to user
- ONLY proceed after user selects a valid option

## EXECUTION PROTOCOLS

- Launch scan subagent, wait for result
- Present results with selection menu
- Halt and wait for user input
- Store selection, route to next step

---

## ⚠️ ORCHESTRATOR ROLE

You are the **ORCHESTRATOR**. You DO NOT scan the monorepo yourself.
You DELEGATE to a subagent.

---

## 1. ANNOUNCE STEP

Display to user:

```
📊 **Step 1/4: Monorepo Analysis**

Running scan script...
```

---

## 2. RUN SCAN SCRIPT

### ⚡ PRE-RUN CHECK

**If `scan_pre_run == true`** (scan was already executed in step 0):
- Skip sections 2.1 and 2.2 entirely.
- The workflow state already contains `packages_to_update`, `scan_summary`, and `current_head_commit`.
- Display: `"✅ Scan already completed in step 0 — reusing results."`
- Jump directly to **section 4** (PRESENT RESULTS TO USER).

---

### 2.1 Execute Script

Run via terminal from the project root:

```bash
python3 {scanScript}
```

If `python3` is not available, try `python {scanScript}`.

### 2.2 Parse Result

Capture stdout. The script outputs ONLY a valid JSON object. Assert the output is parseable JSON before proceeding to section 3. If the exit code is non-zero or the output is not valid JSON (only reached if `scan_pre_run == false`):

```
❌ Scan script failed.

Exit code: {code}
Output: {output}

Options:
[R] Retry   [A] Abort
```

Expected JSON shape:
- `current_head_commit` — HEAD SHA to use as `{{current_commit}}` in package doc subagents
- `packages` — full list with `status`, `reason`, `commits_since_last`
- `packages_needing_update` — names of packages with status `needs_update` or `missing`
- `summary` — statistics

---

## 3. PROCESS RESULTS

### 3.1 Parse Subagent Response

Extract from subagent result:
- `packages_needing_update[]` - List of packages
- `summary` - Statistics

### 3.2 Store in Workflow State

```yaml
workflow_state:
  step1_completed: true
  packages_to_update: [list from subagent]
  scan_summary: {summary from subagent}
```

---

## 4. PRESENT RESULTS TO USER

### 4.1 Compute Smart Mode Suggestion

Before displaying the menu, compute the update ratio and derive a suggested action:

```
ratio = packages_needing_update / total_packages

IF ratio > 0.5  → suggest [A] (All)
IF ratio > 0.2  → suggest [S] (Select)
IF ratio <= 0.2 → suggest [S] (Select) or [N] (New Only)
```

### 4.2 Display Summary with Suggestion

Display summary:

```
📋 **Scan Results**

{Scan Report}

💡 Suggested action: [{suggested_action}] — {ratio_percent}% of packages need update
   ({packages_needing_update}/{total_packages} packages)

---

**Available actions:**

[A] All    - Update all identified packages
[S] Select - Choose which packages to update
[N] New Only     - Only new packages
[V] Version Only - Only version changes
[X] Skip   - Skip to next step without package update

Your choice:
```

---

## 5. PROCESS USER SELECTION

> **Headless bypass:** If `{headless}` = true, auto-select **[A]** and proceed without halting.

Based on selection:

- **IF A:** Add all packages needing updates to `packages_to_update`
- **IF S:** Present numbered list, let user multi-select
- **IF N:** Add only NEW packages to `packages_to_update`
- **IF V:** Add only VERSION_CHANGED packages to `packages_to_update`
- **IF X:** Set `packages_to_update` to empty, skip to step 3
- **IF any other input or question:** Answer the user's query, then [redisplay the Scan Results menu](#4-present-results-to-user)

---

## 6. SAVE STATE AND CONTINUE

Update workflow state:

```yaml
scan_completed: true
packages_scanned: [{all packages found}]
packages_to_update: [{selected packages}]
```

### Routing

- **IF packages_to_update is not empty:** 
  Display: "Proceeding to step 2: Package documentation update..."
  Load, read completely, and execute `{nextStepPackages}`

- **IF packages_to_update is empty AND mode is F or S:**
  Display: "No packages to update. Proceeding to step 3..."
  Load, read completely, and execute `{nextStepContext}`

- **IF mode is P:**
  Display: "Packages Only mode completed."
  End workflow

---

## Stage Progression

- Advance to `{nextStepPackages}` when scan is complete, package list presented, and user confirms selection (non-empty `packages_to_update`).
- Advance to `{nextStepContext}` when scan is complete and `packages_to_update` is empty (or mode is F/S with no changes).
- End workflow when mode is P and `packages_to_update` is empty.
