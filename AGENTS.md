# ⚠️ Agent — Read this entire file before acting

These rules apply to every session, including after a compact or checkpoint.

---

<!-- BEGIN:AGENTS.shared -->
<!-- source: @grasdouble/lufa_config_agents@local — DO NOT EDIT this block manually, run `pnpm sync:agents` -->

# Shared Agent Rules — Grasdouble Ecosystem

These rules apply to **every repo** in the Grasdouble ecosystem. They are maintained in `@grasdouble/lufa_config_agents` and referenced from each repo's `AGENTS.md`.

After reading this file, read the repo-specific `AGENTS.md` for rules that apply only to the current repository.

---

## Self-improvement — Update AGENTS.md when a mistake is identified

When the user points out a mistake or a recurring problem, **always update the repo's `AGENTS.md`** to prevent it from happening again — in the same response, before moving on.

- Identify the root cause, not just the symptom
- Write a rule specific enough to prevent the exact mistake
- Do not add vague rules ("be careful with X") — write actionable rules with ✅/❌ examples
- Check that a similar rule doesn't already exist before adding

**Rule template:**

```markdown
## Rule title — short imperative

One sentence explaining why this matters.

- ✅ Correct example
- ❌ Wrong example (with consequence if useful)
```

This applies to any type of mistake: tooling, workflow, code quality, file management, etc.

**✅ Update AGENTS.md when:**

- The user explicitly asks to add or change a rule
- A recurring mistake is identified (same error happened twice or more)
- A new validated pattern emerges that applies to any future session in this repo

**❌ Do NOT update AGENTS.md when:**

- The instruction is session-specific ("for this task, skip lint")
- The user qualified it with "for now", "just this time", "temporarily"
- The fact is already captured by a stored memory
- The rule would duplicate or contradict an existing section

**Agent memories vs AGENTS.md:**

- Use your agent's memory system (if available) for facts that could apply across multiple repos (user preferences, general conventions)
- Use AGENTS.md for rules that are **specific to this repo** (tooling, architecture, workflow)
- Use this shared file for rules that apply across **all** Grasdouble repos
- When in doubt: if it references a specific file, command, or package in this repo → AGENTS.md

---

## Critical thinking — Always challenge requests

Before implementing anything, evaluate the request critically:

- If the approach has flaws, better alternatives, or architectural concerns, **say so first** before executing
- Don't just implement what is asked — ask yourself if it's the right solution
- If you disagree, explain why clearly and propose an alternative
- Only proceed once the approach is validated (either confirmed by the user or after proposing a better option)

**Non-trivial = anything involving:** architecture decisions, API design, technology or library choices, naming that will be hard to change, security-sensitive code, or changes that affect more than one package.

- ✅ "You asked to add Redux here, but the app already uses Zustand — should I use Zustand instead for consistency?"
- ✅ "Splitting this into two components makes sense, but it will require changing the parent interface — is that acceptable?"
- ❌ Silently implementing a pattern that conflicts with the existing codebase
- ❌ Asking for validation on every trivial decision (adding a CSS class, fixing a typo)

---

## Git — No commits, no staging, no destructive operations

Never create git commits and never stage files. Leave all git operations to the user. **This rule also applies to any sub-agent or background agent you launch — always instruct sub-agents explicitly to never run `git commit` or `git add`.**

- ✅ `git diff`, `git status`, `git log`, `git stash`
- ❌ `git add` — never; staging is the user's responsibility
- ❌ `git commit` — never, even when asked to "save" or "apply" changes
- ❌ Launching a sub-agent without explicitly telling it "never run git commit or git add"
- ❌ `git rebase` — rewrites history
- ❌ `git reset --hard` — destroys uncommitted work
- ❌ `git push --force` / `git push --force-with-lease` — overwrites remote
- ❌ `git clean -fd` — permanently deletes untracked files

---

## Package Manager — Always use pnpm

This repo uses **pnpm** exclusively. Never use `npm` or `yarn`.

- ✅ `pnpm install`, `pnpm add <pkg>`, `pnpm run <script>`, `pnpm dlx <cmd>`
- ❌ `npm install`, `yarn add`
- ❌ `npx <cmd>` — bypasses pnpm, can silently pull packages from the npm registry; use `pnpm dlx` instead

---

## RTK — Token-Optimized CLI

**rtk** is a CLI proxy that filters and compresses command outputs, saving 60-90% tokens.

### Rule

Always prefix **bash/shell** commands with `rtk` (not tool calls like `ide-get_diagnostics`):

```bash
# Instead of:              Use:
git status                 rtk git status
git log -10                rtk git log -10
pnpm lint                  rtk pnpm lint
pnpm build                 rtk pnpm build
```

### Native rtk commands (run as-is, no prefix needed)

```bash
rtk gain              # Token savings dashboard
rtk gain --history    # Per-command savings history
rtk discover          # Find missed rtk opportunities
rtk proxy <cmd>       # Run raw (no filtering) but track usage
```

---

## TypeScript — Never call `tsc` directly

The `tsconfig` files in Grasdouble repos have `declaration: true` and `sourceMap: true`. **Running `tsc` without `--noEmit` emits `.js`, `.d.ts`, and `.map` files into `src/`. Always use the project scripts which set the correct flags.**

### Allowed — type checking

- ✅ `ide-get_diagnostics` tool — preferred, zero risk of file emission
- ✅ `pnpm typecheck` from a specific package folder
- ✅ `pnpm all:typecheck` from the root (runs all packages)

### Forbidden — always

- ❌ `tsc` — direct binary call
- ❌ `pnpm tsc` — still calls the binary directly, bypasses the script
- ❌ `tsc -p tsconfig.json` with any flags, including `--noEmit` or `--listEmittedFiles`

If stray generated files appear in `src/` (`.js`, `.js.map`, `.d.ts`, `.d.ts.map`), delete them immediately.

---

## Workflow — No planning files in the repository

Never create markdown files in the repository for planning, notes, or tracking.

- ✅ Use in-memory notes, session workspace files (e.g. `~/.copilot/session-state/*/plan.md`)
- ❌ `PLAN.md`, `TODO.md`, `NOTES.md`, or any tracking file committed to the repo
- ❌ Creating a markdown file "temporarily" — even temporary files pollute git history

This applies to sub-agents you launch: always instruct them not to create planning files in the repo.

---

## Accessibility — Non-negotiable

Every UI change must consider accessibility. This is not optional and must never be skipped during review or implementation.

Checklist to apply systematically:

- **Decorative elements** (svg, images without meaning) → `aria-hidden="true"`
- **Interactive elements** → keyboard accessible, `role` and `aria-*` attributes correct
- **Images** → `alt` attribute always present (empty string `""` if decorative)
- **Form fields** → associated `<label>` or `aria-label`
- **Color** → never the only means of conveying information
- **Focus** → visible focus indicator, logical tab order
- **Animations** → always respect `prefers-reduced-motion: reduce` — pause or skip any motion when active
- **Contrast** → WCAG AA minimum: 4.5:1 for text, 3:1 for large text and UI components
- **Semantic HTML** → use the right element first (`<button>`, `<nav>`, `<main>`…) before reaching for ARIA roles
- **Heading hierarchy** → logical `h1 → h2 → h3` structure, never skip levels
- **Live regions** → use `aria-live` for content that updates dynamically without a page reload

When writing or reviewing code, if an accessibility issue is found, fix it in the same task — never defer it.

---

## Changesets — Naming and content

When creating a changeset file manually in `.changeset/`, always use a **descriptive kebab-case name** — never a random hex ID.

- ✅ `.changeset/add-hero-animation.md`
- ✅ `.changeset/happy-lions-sing.md` (auto-generated by the CLI — acceptable)
- ❌ `.changeset/6197e9-63944d-6768e0.md`

**Content rules:**

- Always check `rtk git diff main --name-only` first to identify **all** changed packages before writing changesets (assumes `main` is the default branch — adjust if different)
- **Every package with changed files must be covered** — no exception, including private packages (`"private": true`), tests, storybook, docs…
  - ✅ All packages with file changes → changeset entry required
  - ❌ Never skip a package, regardless of its `private` field or purpose
- **Exception: the root `package.json` of a monorepo** — it is not a workspace package and does not need a changeset entry (changes to it, e.g. root devDependencies, are not tracked by changesets)
- Use `patch` for fixes/refactors, `minor` for new user-visible features, `major` for breaking changes
- **Always prefix the description** with a conventional commit type: `feat:`, `fix:`, `chore:`, `refactor:`, `perf:`, `docs:`, `style:`, `test:`
- **Always verify** the changeset after creation: `rtk pnpm changeset status`

**Consolidate before creating** — always check for existing changesets first:

Before creating a new changeset, run:

```bash
rtk git status --short .changeset/   # untracked / staged files
rtk git diff main --name-only -- .changeset/  # committed but not merged
```

- ✅ If an existing changeset targets the **exact same set of packages** you modified → **add your description to it** (same bump type or escalate)
- ✅ If an existing changeset covers some of your packages but also covers **packages you did not modify** → **create a new file** covering only the packages you changed
- ✅ Create a new file only when no existing changeset covers the package
- ❌ Never create a second changeset for the same package in the same branch

**Atomic vs independent — choose the right grouping:**

When multiple packages change together, decide before creating any file:

- ✅ **One shared file** when all packages changed as part of the **same atomic feature or fix** (e.g. a new component + its tests + its stories)
- ✅ **One file per package** when packages changed for **unrelated reasons** in the same branch
- ❌ One file per package when the changes are atomic — this creates unnecessary noise and splits a single story across multiple entries
- ❌ One shared file listing packages with unrelated changes — misleads readers about what changed and why

Prefix guide:

- `feat:` — new user-visible feature
- `fix:` — bug fix
- `chore:` — maintenance, config, tooling, dependency update
- `refactor:` — code restructuring without behavior change
- `perf:` — performance improvement
- `docs:` — documentation only
- `style:` — visual/CSS change with no logic change
- `test:` — test additions or changes

<!-- END:AGENTS.shared -->

---

## Build & Validation

Run these commands to validate your changes. **Always prefix with `rtk`** (e.g. `rtk pnpm all:lint`).

| Scope                      | Command              | From           |
| -------------------------- | -------------------- | -------------- |
| All packages — lint        | `pnpm all:lint`      | root           |
| All packages — build       | `pnpm all:build`     | root           |
| All packages — typecheck   | `pnpm all:typecheck` | root           |
| Single package — lint      | `pnpm lint`          | package folder |
| Single package — build     | `pnpm build`         | package folder |
| Single package — typecheck | `pnpm typecheck`     | package folder |

**On failure:** Stop. Fix the error. Re-run. Do not stage with `git add` or report to the user until commands pass.

> The repo is a monorepo. Explore `packages/` to discover available packages — never assume their paths.

---

## ESLint — TypeScript project configuration

When setting `parserOptions.project` in a package's `eslint.config.mjs`, always scope it to TypeScript files only using the `files` property. This prevents the TypeScript parser from being incorrectly applied to JavaScript/MJS config files.

- ✅ Scope TypeScript parser to `.ts` and `.tsx` files:
  ```js
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  }
  ```
- ❌ Apply TypeScript parser globally without file restriction:
  ```js
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',  // Applied to ALL files including .mjs configs
      },
    },
  }
  ```
  This causes lint errors like: `"parserOptions.project" has been provided for @typescript-eslint/parser. The file was not found in any of the provided project(s): eslint.config.mjs`
