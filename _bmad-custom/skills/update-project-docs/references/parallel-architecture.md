# Parallel Subagent Architecture

**Purpose:** Architecture rationale and mandatory rules for the batched parallel subagent pattern used in `02-update-packages.md`.

---

## Why Batched Parallel Subagents?

- **Speed**: All packages in a batch documented simultaneously
- **Context Isolation**: Each package gets a fresh, clean context
- **No Cross-Contamination**: Information from one package doesn't pollute another
- **Better Quality**: Full focus on a single package
- **Error Isolation**: One failure doesn't affect other packages
- **Response Length Safety**: Batching prevents the LLM from hitting response length limits when collecting results from many subagents at once (e.g. 34 subagents returning simultaneously causes `Sorry, the response hit the length limit`)
- **Rate Limit Safety**: Each subagent triggers multiple tool calls (read_file, list_dir, grep_search…). Launching too many in parallel creates a burst of API requests that triggers rate limiting (`Sorry, you've exceeded your rate limits. Error Code: rate_limited`). Batching + inter-batch delays prevents this.

---

## One Package = One Subagent = BATCHED PARALLEL

**MANDATORY RULES**:
1. Each package MUST be processed by its own dedicated subagent
2. NEVER process multiple packages in the same subagent call
3. **LAUNCH SUBAGENTS IN PARALLEL WITHIN EACH BATCH** — call all `runSubagent` invocations for the current batch in the SAME `function_calls` block
4. **DEFAULT BATCH SIZE = 2** — never launch more than 2 subagents in one `function_calls` block
5. Each subagent receives ONLY the information about its assigned package
6. Wait for ALL subagents in the current batch to complete before starting the next batch
7. **INSERT A `sleep {inter_batch_delay_seconds}` BETWEEN BATCHES** to avoid API rate limiting

---

## How Batched Parallel Execution Works

Split packages into groups of 2. For each group, launch all subagents IN PARALLEL, then wait between batches:

**Batch 1 (2 packages) — ONE function_calls block:**
```
runSubagent("Document package-a", prompt_for_a)
runSubagent("Document package-b", prompt_for_b)
```
→ Wait for both results, process them, validate.

**Inter-batch delay:**
```bash
sleep 10
```
→ Pause to avoid API rate limit burst.

**Batch 2 (2 packages) — ONE function_calls block:**
```
runSubagent("Document package-c", prompt_for_c)
runSubagent("Document package-d", prompt_for_d)
```
→ Wait for both results, process them, validate.

Repeat until all packages are done.

---

## Why 2 as the Default Batch Size?

- Each subagent triggers **multiple tool calls** (read_file, list_dir, grep_search, semantic_search…) — typically 10–30 calls per package
- 5 subagents × ~20 tool calls = ~100 simultaneous API calls → rate limit burst
- **2 subagents × ~20 tool calls = ~40 tool calls** — well within limits
- The `sleep 10` inter-batch delay further spreads the load
- Batch size can be **reduced to 1** if rate limits persist, or **increased to 3** for well-spaced packages
- The inter-batch delay (`inter_batch_delay_seconds`) can also be increased (e.g. 30s) if rate limits are frequent

---

## Failure Handling

If one subagent fails, it does NOT affect others in the same batch or subsequent batches. Handle each failure independently — see section 4.3 in `02-update-packages.md` for the error recovery menu (R/S/M/A). Validation runs per-batch (section 4.4), not globally at the end.
