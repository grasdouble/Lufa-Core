---
name: 03-update-context
description: Delegate project-context.md update to a dedicated subagent
subagentContextTemplate: "assets/subagent-context.prompt.md"
contextStructureTemplate: "assets/project-context-structure.md"
nextStepIndex: "04-update-index.md"
---

Communicate with user in `{communication_language}`. Write document content in `{document_output_language}`.

# Step 3: Update Project Context (Subagent)

**Architecture:** Orchestrator delegates to ONE subagent for context generation.

---

## MANDATORY EXECUTION RULES (READ FIRST)

### Universal Rules

→ See `references/universal-rules.md` — applies to all steps.

### Step-Specific Rules

- 🚫 NEVER generate context yourself — delegate to subagent
- Launch exactly ONE context subagent using `{subagentContextTemplate}`
- Context structure guidance: see `{contextStructureTemplate}`
- ONLY proceed after user confirms or selects a valid option

## EXECUTION PROTOCOLS

- Present user confirmation menu
- Halt and wait for user input
- Launch context subagent based on selected mode
- Report result and route to next step

---

## ⚠️ ORCHESTRATOR ROLE

You are the **ORCHESTRATOR**. You DO NOT generate the context yourself.
You DELEGATE to a subagent.

---

## 1. ANNOUNCE STEP

Display to user:

```
📄 **Step 3/4: project-context.md Update**

Select update mode for project-context.md:
```

---

## 2. USER CONFIRMATION

> **Headless bypass:** If `{headless}` = true, auto-select **[F]** (Full Regenerate) and proceed without halting.

```
**Update options:**

[F] Full Regenerate - Completely regenerate the file
[U] Update Sections - Only update outdated sections
[A] Add Only - Add new rules without modifying existing
[R] Review - Review each change individually
[B] Batch Review - Show all proposed changes at once, then confirm
[S] Skip - Skip this step

Your choice:
```

### Menu Handling Logic

- **IF F:** Set `context_update_mode` = "full". Proceed to section 3 with full regeneration.
- **IF U:** Set `context_update_mode` = "update". Proceed to section 3 targeting outdated sections.
- **IF A:** Set `context_update_mode` = "add-only". Proceed to section 3 adding new rules only.
- **IF R:** Set `context_update_mode` = "review". Proceed to section 3 reviewing each change.
- **IF B:** Set `context_update_mode` = "batch-review". Proceed to section 3 showing all changes at once.
- **IF S:** Skip subagent launch. Update state: `step3_completed: true`. Route per section 5.
- **IF any other input:** Answer the user's query, then [redisplay this menu](#2-user-confirmation).

### Execution Rules

- ⏸️ ALWAYS halt and wait for user input after displaying this menu
- ONLY proceed after a valid option (F/U/A/R/B/S) is selected
- After answering any query, return to menu display

---

## 3. GENERATE/UPDATE CONTEXT

Launch the context subagent with:
- **description**: "Generate project-context.md"
- **prompt**: Content from `{subagentContextTemplate}`, passing `context_update_mode` and `{contextStructureTemplate}` path

The subagent will follow the structure defined in `{contextStructureTemplate}` to generate/update `_bmad-docs/project-context.md`.

### Review Mode (R) — Change-by-Change Flow

When `context_update_mode = "review"`:

1. **Subagent returns a structured diff** — a list of proposed changes, one per section, in this format:

   ```
   --- CHANGE 1/N ---
   Section: {section title}
   Action: [ADD | MODIFY | DELETE]
   Before: {current content, or "(empty)" if new}
   After:  {proposed content}
   Reason: {brief justification}
   ```

2. **Orchestrator presents each change individually** and halts after each one:

   ```
   Change 1/{total}: {section title} [{action}]
   {diff preview}

   [A] Accept   [R] Reject   [E] Edit   [Q] Stop reviewing
   ```

3. **Per-change handling:**
   - **A (Accept):** Mark change as accepted. Show next change.
   - **R (Reject):** Mark change as rejected. Show next change.
   - **E (Edit):** Prompt user for replacement content. Replace proposed "After" with user input. Mark as accepted.
   - **Q (Stop):** Apply all accepted changes so far. Skip remaining.

4. **After all changes reviewed (or Q pressed):** Apply only accepted changes to `_bmad-docs/project-context.md`. Report summary.

   ```
   ✅ Review complete: {accepted}/{total} changes applied.
   ```

> **Note:** If the subagent does not return a structured diff, the orchestrator MUST re-launch it with explicit instruction to produce the diff format above before proceeding.

### Batch Review Mode (B) — All-Changes-at-Once Flow

When `context_update_mode = "batch-review"`:

1. **Subagent returns the same structured diff** as Review mode (same `--- CHANGE N/N ---` format).

2. **Orchestrator displays ALL changes in one block**, then halts:

   ```
   📝 **{total} proposed changes to project-context.md**

   --- CHANGE 1/{total} ---
   Section: {section title}
   Action:  {ADD | MODIFY | DELETE}
   Before:  {current content}
   After:   {proposed content}

   --- CHANGE 2/{total} ---
   ...

   Options:
   [Y] Apply all   [N] Discard all   [R] Switch to change-by-change review
   ```

3. **Handling:**
   - **Y (Apply all):** Write all proposed changes to `_bmad-docs/project-context.md`. Report summary.
   - **N (Discard all):** No file written. Report: "No changes applied."
   - **R (Switch to review):** Set `context_update_mode` = `"review"` and re-enter the Review Mode (R) flow above — reusing the diff already returned by the subagent (no re-launch needed).

---

## 4. SAVE AND REPORT

After updating:

```
✅ **project-context.md updated**

File: _bmad-docs/project-context.md
Size: {lines} lines
Sections: {count}
Last updated: {date}

Changes made:
- {summary of changes}
```

### Update State

```yaml
context_updated: true
```

---

## 5. CONTINUE TO NEXT STEP

- **IF workflow_mode is F or S:**
  Display: "Proceeding to step 4: index.md update..."
  Load, read completely, and execute `{nextStepIndex}`

- **IF workflow_mode is C:**
  Display: "Context update completed successfully."
  End workflow

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS

- User confirmation received before launching subagent
- Context subagent launched with correct mode and template reference
- `_bmad-docs/project-context.md` created/updated
- State updated and routed to next step

### ❌ SYSTEM FAILURE

- Proceeding without user input
- Generating context content directly (not via subagent)
- Routing to wrong step based on mode
