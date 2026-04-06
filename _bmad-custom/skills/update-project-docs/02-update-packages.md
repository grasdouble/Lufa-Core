---
name: 02-update-packages
description: Generate or update documentation for selected packages using BATCHED PARALLEL subagents (batch_size=2)
subagentPackageDocTemplate: "assets/subagent-package-doc.prompt.md"
nextStepContext: "03-update-context.md"
naming: "references/package-naming-conventions.md"
batch_size: 2
inter_batch_delay_seconds: 10
---

Communicate with user in `{communication_language}`. Write document content in `{document_output_language}`.

# Step 2: Update Package Documentation (BATCHED PARALLEL Subagents)

**Objective:** Generate comprehensive documentation for each package using **dedicated subagents running IN PARALLEL BATCHES** — one subagent per package, launched in groups of `{batch_size}` (default: 2) to avoid both response length limits and API rate limiting.

---

## MANDATORY EXECUTION RULES (READ FIRST)

### Universal Rules

→ See `references/universal-rules.md` — applies to all steps.

### Step-Specific Rules

- 🚚 This step auto-proceeds — no main user input menu (packages were selected in step-01)
- ⏸️ HALT and wait for user input ONLY on subagent errors
- 🚫 NEVER document packages yourself — delegate each package to a dedicated subagent
- 🚫 NEVER put multiple packages in one subagent call — 1 package = 1 subagent, always
- Load `{subagentPackageDocTemplate}`, substitute `{{variable}}` placeholders, then launch subagents
- LAUNCH SUBAGENTS IN PARALLEL **within each batch** — all calls for a batch go in the SAME function_calls block
- Process one batch fully before starting the next
- **WAIT `{inter_batch_delay_seconds}` seconds between batches** using a terminal `sleep` command to avoid API rate limiting
- For naming conventions reference: see `{naming}`

## EXECUTION PROTOCOLS

- Prepare package list from `packages_to_update`
- Split packages into batches of `{batch_size}` (default: 5)
- For each batch: load and populate prompt template, launch batch IN PARALLEL, process results
- Handle errors interactively per batch
- After all batches: run global summary and route to next step

---

## 🚨 CRITICAL: BATCHED PARALLEL SUBAGENT ARCHITECTURE

> See [references/parallel-architecture.md](references/parallel-architecture.md) for full architecture rationale and mandatory rules.

**Summary:** 1 package = 1 subagent. Subagents launch **IN PARALLEL within each batch** of `{batch_size}`. Never put multiple packages in one subagent call. Never launch all packages at once when total > `{batch_size}` (causes response length errors and/or API rate limiting).

---

## 1. ANNOUNCE STEP

Display to user:

```
📦 **Step 2/4: Package Documentation Update**

{count} packages to document — split into {total_batches} batches of {batch_size}.

🔄 Architecture: 1 package = 1 isolated subagent
   Batches run IN PARALLEL within each group of {batch_size}.
   Batches run SEQUENTIALLY with {inter_batch_delay_seconds}s delay to avoid rate limits.
```

---

## 2. PREPARE BATCHED LAUNCH

### 2.1 Build Package List and Split into Batches

Create a package list from `packages_to_update` and split into batches of `{batch_size}` (default: 5):

```yaml
batch_size: 5
total_batches: {ceil(count / batch_size)}
batches:
  - batch_index: 1
    packages:
      - package_name: "{name}"
        package_path: "{path}"
        category: "{category}"
  - batch_index: 2
    packages:
      - ...
```

### 2.2 Display Batches to User

```
📋 **{count} packages → {total_batches} batch(es) of {batch_size}**

Batch 1/{total_batches}: {pkg1}, {pkg2}, {pkg3}, {pkg4}, {pkg5}
Batch 2/{total_batches}: {pkg6}, {pkg7}, ...
...

🚀 Starting batch execution...
```

---

## 3. BATCHED PARALLEL SUBAGENT LAUNCH

### 3.1 Batch Loop

For each batch (1 to `{total_batches}`), repeat sections 3.2 → 4 before starting the next batch.

**Before each batch (except the first), insert a delay to avoid API rate limiting:**

```bash
sleep {inter_batch_delay_seconds}
```

**Then display:**
```
─────────────────────────────────────────────────
🔄 Batch {current_batch}/{total_batches} — {batch_package_names}
─────────────────────────────────────────────────
```

### 3.2 Launch Batch Subagents IN PARALLEL

**CRITICAL**: To execute in parallel, you MUST call ALL `runSubagent` invocations for the current batch in the SAME function_calls block.

Load the template from `{subagentPackageDocTemplate}` and customize for each package by substituting all `{{variable}}` placeholders with values from the package scan data.

**Example — batch of 5 packages**:

In ONE function_calls block, launch all five:

- runSubagent("Document package-a", prompt_for_package_a)
- runSubagent("Document package-b", prompt_for_package_b)
- runSubagent("Document package-c", prompt_for_package_c)
- runSubagent("Document package-d", prompt_for_package_d)
- runSubagent("Document package-e", prompt_for_package_e)

All five subagents will execute IN PARALLEL automatically.

**⚠️ NEVER launch more than `{batch_size}` subagents in one function_calls block.**
If a batch has fewer packages than `{batch_size}`, that is fine — just launch what is in it.

### 3.3 Wait for Batch Results

All subagent results for the current batch will return together. Process them (section 4) before starting the next batch.

---

## 4. PROCESS BATCH RESULTS

### 4.1 Parse Subagent Response

After ALL subagents in the current batch complete, parse each response to extract:
- Files created (names and paths)
- Line counts
- Key findings
- Any errors or warnings

### 4.2 Report Batch Progress

For each package in the current batch:
```
✅ [{index}/{total}] {package_name} - COMPLETED
   
   📄 Files created:
      • {package_name_short}.md ({lines} lines)
      • {package_name_short}.context.md ({lines} lines)
   
   🔀 Changes: {changes_summary.what_changed}
   💡 Key points: {brief_summary}
```

After reporting all packages in the batch:
```
✔ Batch {current_batch}/{total_batches} complete — {batch_success}/{batch_size} succeeded
```

Update queue:
```yaml
- index: {n}
  status: "completed"
  result:
    doc_file: "{package_name_short}.md"
    context_file: "{package_name_short}.context.md"
    changes_summary:
      what_changed: "{from subagent completion report}"
      sections_added: [{list}]
      sections_updated: [{list}]
      breaking_changes: {true/false}
```

### 4.3 Handle Subagent Errors

> **Headless bypass:** If `{headless}` = true, auto-select **[S]** (skip failed packages) and continue without halting.

#### Rate Limit Detection

Before displaying the generic error menu, check if the error message contains any of the following patterns:
- `rate-limited`
- `rate_limited`
- `exceeded your rate limits`
- `too many requests`

If a rate limit error is detected, display a **specific** rate limit message instead:

```
⏱️  [{index}/{total}] {package_name} - RATE LIMITED

   The API rate limit was hit. Wait before retrying.

   Options:
   [W] Wait & Retry - Run `sleep 30` then relaunch the subagent
   [S] Skip - Skip this package (mark as ignored)
   [A] Abort - Stop processing the queue

   Your choice:
```

- **IF W:** Run `sleep 30` in terminal, then re-invoke subagent with same parameters
- **IF S:** Mark as skipped, continue to next batch
- **IF A:** Stop processing, go to summary

> 💡 **Tip:** If rate limits are frequent, reduce `batch_size` further (e.g. to 1) or increase `inter_batch_delay_seconds` (e.g. to 30).

---

If subagent fails with a non-rate-limit error:

```
❌ [{index}/{total}] {package_name} - ERROR

   {error_description}

   Options:
   [R] Retry - Relaunch the subagent
   [S] Skip - Skip this package (mark as ignored)
   [M] Manual - Create an empty template to complete manually
   [A] Abort - Stop processing the queue

   Your choice:
```

#### Execution Rules
- ⏸️ ALWAYS halt and wait for user input on errors
- **IF R:** Re-invoke subagent with same parameters
- **IF S:** Mark as skipped, continue to next
- **IF M:** Create empty template files, continue
- **IF A:** Stop processing, go to summary
- **IF any other input:** Answer query, then redisplay error options

---

### 4.4 Post-Batch Validation

After all subagent results in the **current batch** are collected, run two checks before moving to the next batch:

#### A — Response sanity check (in-memory)

For each completed subagent result in this batch, verify:
- [ ] Response is non-empty (not `null`, not blank)
- [ ] At least one file path is mentioned (`.md` file created)
- [ ] No `ERROR:` or `FAILED:` prefix in the result

#### B — File existence check (on disk)

Run the count script for **only the packages in this batch**:

```bash
python3 scripts/count-results.py --root . --packages {comma-separated short names of THIS BATCH's packages}
```

Parse the JSON output. If `all_files_present: false`:
- Treat packages with `status: "missing"` as failed (same as response sanity failures below).
- Treat packages with `status: "partial"` as warnings (report in summary, do not block routing).

**If one or more results fail either check:**

```
⚠️  Batch {current_batch} validation: {count} result(s) look malformed or missing.

{for each invalid result}
   • {package_name}: {reason}
{/for}

Options:
[R] Retry failed packages   [S] Skip and continue to next batch   [A] Abort

Your choice:
```

- **IF R:** Re-launch only the failing subagents (in parallel if >1), then re-run both checks.
- **IF S:** Mark as failed, continue to next batch.
- **IF A:** Stop processing, go to global summary.

**If all results in the batch pass both checks:** Proceed silently to the next batch.

### 4.5 Continue to Next Batch

After validation, increment `current_batch` and return to **section 3.1** for the next batch.
When `current_batch > total_batches`, proceed to section 5.

---

## 5. SUMMARY AND CONTINUE

After all packages processed:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 **Summary - Package Documentation Update**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Packages successfully documented: {success_count}/{total}
{for each successful}
   • {package_name} → {doc_file}, {context_file}
{/for}

⏭️ Packages skipped: {skipped_count}
{if any skipped}
   • {package_name} - {reason}
{/if}

❌ Packages with errors: {error_count}
{if any errors}
   • {package_name} - {error}
{/if}

📁 Documentation stored in: {docs_output_path}/documentation/ and {docs_output_path}/context/
```

### Update Workflow State

```yaml
packages_updated: [{list of successful packages}]
packages_skipped: [{list of skipped packages}]
packages_failed: [{list of failed packages}]
```

### Routing

- **IF mode is F or S:**
  Display: "Proceeding to step 3: project-context.md update..."
  Load, read completely, and execute `{nextStepContext}`

- **IF mode is P:**
  Display: "Packages Only mode completed."
  End workflow

---

## Reference

For variable naming, file naming conventions, and directory mapping, see:
`{naming}`
