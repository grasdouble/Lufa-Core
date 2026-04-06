---
name: 04-update-index
description: Delegate index.md generation to a dedicated subagent
subagentIndexTemplate: "assets/subagent-index.prompt.md"
indexStructureTemplate: "assets/index-structure.md"
---

Communicate with user in `{communication_language}`. Write document content in `{document_output_language}`.

# Step 4: Update Documentation Index (Subagent)

**Architecture:** Orchestrator delegates to ONE subagent for index generation.

---

## MANDATORY EXECUTION RULES (READ FIRST)

### Universal Rules

→ See `references/universal-rules.md` — applies to all steps.

### Step-Specific Rules

- 🚫 NEVER generate the index yourself — delegate to subagent
- Launch exactly ONE index subagent using `{subagentIndexTemplate}`
- Index structure guidance for the subagent: `{indexStructureTemplate}`
- ONLY save after user confirms

## EXECUTION PROTOCOLS

- Launch index subagent, wait for result
- Show preview to user
- Present confirmation menu, halt and wait
- Save and finalize

---

## ⚠️ ORCHESTRATOR ROLE

You are the **ORCHESTRATOR**. You DO NOT generate the index yourself.
You DELEGATE to a subagent.

---

## 1. ANNOUNCE STEP

Display to user:

```
📑 **Step 4/4: index.md Update**

Launching index generation subagent...
```

---

## 2. LAUNCH INDEX SUBAGENT

### 2.1 Load Template

Read the subagent prompt template: `{subagentIndexTemplate}`

### 2.2 Launch Subagent

Call `runSubagent` with:
- **description**: "Generate documentation index"
- **prompt**: Content from template

### 2.3 Wait for Result

The subagent will generate `_bmad-docs/index.md`

---

## 3. PROCESS RESULTS

### 3.1 Verify Output

Confirm that `_bmad-docs/index.md` was created/updated, then run the structural validator:

```bash
python3 scripts/validate-index.py --root .
```

The script checks required sections, internal link integrity, and package link targets. Parse the JSON output:

- **If `valid: true` and no warnings:** Proceed silently to section 4.
- **If warnings only (exit code 2):** Display them in the preview (section 4) so the user is aware.
- **If `valid: false` (exit code 1):** Show errors to the user before preview:

  ```
  ⚠️  Index validation found {count} issue(s):
  {for each error}
     • {error}
  {/for}

  [C] Continue anyway   [E] Re-edit   [A] Abort
  ```

> 📋 The index structure is defined in `{indexStructureTemplate}`. See that file for the complete structure: Quick Reference Links, Package tables, Navigation Guide, and Statistics.

### 3.2 Update Workflow State

```yaml
workflow_state:
  step4_completed: true
```

---

## 4. SHOW PREVIEW

Display preview of key sections:

```
📋 **Updated Index Preview**

Main sections:
{preview of index structure}
```

---

## 5. USER CONFIRMATION

> **Headless bypass:** If `{headless}` = true, auto-select **[Y]** (Save) and proceed without halting.

```
**Confirm update?**

[Y] Yes          — Save the updated index
[P] Preview Full — View complete index before saving
[E] Edit         — Modify specific sections
[N] No           — Cancel changes

Your choice:
```

### Menu Handling Logic

- **IF Y:** Proceed to section 6 to save the file.
- **IF P:** Display the full generated index to the user, then [redisplay this menu](#5-user-confirmation).
- **IF E:** Ask which sections to modify, re-launch subagent for those sections, then [redisplay this menu](#5-user-confirmation).
- **IF N:** Display "Changes cancelled. Index not updated." End workflow.
- **IF any other input:** Answer the user's query, then [redisplay this menu](#5-user-confirmation).

### Execution Rules

- ⏸️ ALWAYS halt and wait for user input after displaying this menu
- ONLY proceed to save after Y is selected
- After P/E/query, always return to this menu

---

## 6. SAVE AND FINALIZE

After confirmation:

```
✅ **index.md updated**

File: _bmad-docs/index.md
Referenced documents: {count}
Packages listed: {count}
Last updated: {date}
```

### Update State

```yaml
index_updated: true
```

---

## 7. WORKFLOW COMPLETE

Display:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 **Documentation Update Complete**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Steps completed:
  ✅ Step 1: Monorepo scan
  ✅ Step 2: Package documentation update
  ✅ Step 3: project-context.md update
  ✅ Step 4: index.md update

📁 Updated documentation: _bmad-docs/
```

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS

- Index subagent launched successfully
- Preview shown to user
- User confirmed before saving
- `_bmad-docs/index.md` created/updated
- Workflow completion summary displayed

### ❌ SYSTEM FAILURE

- Saving without user confirmation
- Generating index content directly (not via subagent)
- Failing to show preview before confirmation menu
