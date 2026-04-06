# Subagent Task: Scan Monorepo For Documentation Updates

**You are a documentation scanner subagent.**

## YOUR MISSION

Scan the Lufa monorepo to identify which packages need documentation updates.

## CONTEXT

- **Project**: Lufa - Grasdouble Design System & Microfrontend Platform
- **Documentation Path**: `_bmad-docs/`
- **Packages Path**: `packages/`

## STRUCTURE TO SCAN

```
packages/
├── apps/
│   └── microfrontend/     # Microfrontend applications (main-container, home)
├── cdn/                   # CDN tooling (autobuild-server)
├── config/                # Shared configuration (eslint, tsconfig, prettier)
├── design-system/         # Design System packages (main, tokens, themes, cli, storybook, docusaurus, playwright)
├── plugins/
│   ├── vite/              # Vite plugins (import-map-injector, react-preamble)
│   └── vscode/            # VS Code extensions (ds-preview)
└── poc/                   # Proof of concept packages
```

## YOUR TASKS

### 1. Discover All Packages

Scan `packages/` recursively to find all packages with `package.json`.

For each package, extract:

- Package name (from package.json)
- Package path (relative to project root)
- Category (apps, cdn, config, design-system, plugins, poc)
- Description (from package.json if available)
- Main technologies/dependencies

### 2. Check Existing Documentation

For each discovered package, check if documentation exists:

- `_bmad-docs/packages/{category}/{package-name}.md`
- `_bmad-docs/packages/{category}/{package-name}.context.md`

### 3. Identify Updates Needed

> **Squash Merge Strategy**: This project uses **squash and merge** exclusively. Every commit on `main` is a squash commit representing an entire PR. When interpreting commit lists, treat each commit as a full PR worth of changes.

For each package, read the `generatedAtCommit` field from the existing documentation frontmatter (if it exists), then use `git log --first-parent` to detect changes since that commit.

> **Note on `generatedAtCommit`**: This field must always store the SHA of `git rev-parse main` at the time documentation was generated — never a branch commit SHA, never `HEAD` (which may point to a branch). After squash merge, branch SHAs are gone; only `main` SHAs persist.

**Algorithm for each package:**

```bash
# Step A: Read generatedAtCommit from doc frontmatter
# (grep the first 15 lines of _bmad-docs/packages/{category}/{package-name}.md)

# Step B: Run git log to check for changes since that commit
# Compare against 'main' (not HEAD) because:
# - The project uses squash and merge → branch commits don't exist on main after merge
# - generatedAtCommit is always a main SHA → comparing to main is the only valid strategy
# --first-parent ensures only direct commits on main are listed (squash commits)
# --format="%H %s" returns the full SHA + subject line for each squash commit.
git log {generatedAtCommit}..main --first-parent --format="%H %s" -- {package_path}/

# Step C: Determine status
# - If doc does NOT exist → status: "missing"
# - If generatedAtCommit NOT found in doc → status: "needs_update" (reason: "no commit reference")
# - If git log output is EMPTY → status: "up_to_date"
# - If git log output is NON-EMPTY → status: "needs_update", include the commit list
# Each listed commit is a squash commit: it represents a full PR merged into main.
```

Flag packages where:

- Documentation doesn't exist (`missing`)
- `generatedAtCommit` field is absent from frontmatter
- Git squash commits exist in `{package_path}/` since `generatedAtCommit`

## OUTPUT FORMAT

Return a structured JSON report:

```json
{
  "scan_completed": true,
  "current_branch": "main",
  "squash_merge_strategy": true,
  "main_head_commit": "abc1234def5678",
  "total_packages": 20,
  "packages": [
    {
      "name": "@grasdouble/lufa_design-system",
      "path": "packages/design-system/main",
      "category": "design-system",
      "description": "Lufa Design System core package",
      "has_doc": true,
      "has_context": true,
      "generated_at_commit": "0294303fa311b8f78b9d319b5a721df4ec113e05",
      "status": "needs_update",
      "reason": "3 squash commits (PRs) since last generation",
      "commits_since_last": [
        "abc1234def5678901234567890123456789012ab fix: correct token exports (#42)",
        "def5678abc1234901234567890123456789012cd feat: add new component (#43)"
      ]
    }
  ],
  "packages_needing_update": ["@grasdouble/lufa_design-system", "@grasdouble/lufa_design-system-tokens"],
  "packages_up_to_date": ["@grasdouble/lufa_config_eslint"],
  "summary": {
    "total": 20,
    "up_to_date": 15,
    "needs_update": 3,
    "missing_docs": 2
  }
}
```

## TOOLS TO USE

1. `list_dir` - Navigate package directories
2. `file_search` - Find package.json files
3. `read_file` - Read package.json and doc frontmatter for metadata
4. `grep_search` - Search for `generatedAtCommit` in doc files
5. `run_in_terminal` - Run git commands to detect changes

## CONSTRAINTS

- **DO NOT modify any files** - This is a READ-ONLY scan task
- **DO NOT create documentation** - Only identify what needs updating
- Return ONLY the structured JSON report

## BEGIN SCAN

1. Run `git branch --show-current` to get the current branch name
   - Store the result as `current_branch` in your output
   - **⚠️ WARNING**: If `current_branch` is NOT `main`, print a warning: `"WARNING: Running from branch '{current_branch}'. generatedAtCommit will reference main's HEAD (via git rev-parse main), not the current branch HEAD. This is intentional — only main commits survive squash merge."` — but continue the scan anyway.
2. Run `git rev-parse main` to get the latest commit SHA on `main` (NOT the current branch HEAD)
   - Store this as `main_head_commit` — this is what will be used as `generatedAtCommit` when writing docs
   - **Why**: The project uses squash and merge. After a PR merges, branch commits disappear. Only `main` commits persist. Always reference `main` commits.
3. List `packages/` directory to discover all package categories
4. For each package: read `package.json`, check doc existence, read `generatedAtCommit`, run `git log --first-parent`
5. Return the JSON report
