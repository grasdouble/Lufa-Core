# Changelog

## 1.1.3

### Patch Changes

- 813286e: fix: Improve AGENTS

## 1.1.2

### Patch Changes

- 3e75a9b: docs: clarify changeset coverage rules — all packages with file changes require a changeset entry, with an explicit exception for the monorepo root `package.json`

## 1.1.1

### Patch Changes

- 34bf3c2: docs: clarify git rule — never stage files (`git add`) either, not just commits. Staging is the user's responsibility.

## 1.1.0

### Minor Changes

- 3868139: feat: add `--local <path>` flag to `lufa-agents-sync` for local iteration

  When developing changes to `AGENTS.shared.md`, you can now point the CLI at a
  local clone of Lufa-Core instead of the published npm version:

  ```bash
  pnpm sync:agents --local ../Lufa-Core
  # or with an absolute path
  lufa-agents-sync --local /path/to/Lufa-Core
  ```

  The injected block will be annotated with `local@<version>` so it's clear the
  content comes from an unpublished local source.

  ***

  docs: clarify changeset grouping rules — atomic vs independent changes

  Replaces the "one changeset per package" rule with a clearer decision model:
  use a shared file when changes are part of the same atomic feature/fix,
  use separate files when packages changed for unrelated reasons.
  Also adds a rule requiring every package with changed files to be covered.

## 1.0.1

### Patch Changes

- dd6bc77: fix: `lufa-agents-sync` failed silently and showed wrong version label

  Two issues fixed in the bin script:
  1. **Silent no-op via pnpm shims** — the guard condition `import.meta.url === resolve(process.argv[1])` always failed because Node resolves `import.meta.url` through symlinks (real path) while `process.argv[1]` keeps the shim path. Fixed using `realpathSync` on both sides.
  2. **Version always showed "local"** — `PACKAGE_DIR.startsWith(process.cwd())` was always `true` because pnpm installs packages inside `node_modules/.pnpm/` which is under `process.cwd()`. Fixed using `!PACKAGE_DIR.includes('node_modules')`.

## 1.0.0

### Major Changes

- ca4c11d: feat: add shared AI agent rules and `lufa-agents-sync` CLI for the Grasdouble ecosystem

  Introduces `@grasdouble/lufa_config_agents`, a package that ships shared AI agent
  rules (`AGENTS.shared.md`) and a `lufa-agents-sync` bin to embed those rules into
  any consuming repo's `AGENTS.md`.

  **Usage in consuming repos:**

  ```json
  // package.json
  {
    "scripts": {
      "sync:agents": "lufa-agents-sync"
    }
  }
  ```

  ```bash
  pnpm sync:agents
  ```

  The command replaces the content between `<!-- BEGIN:AGENTS.shared -->` and
  `<!-- END:AGENTS.shared -->` markers in `AGENTS.md` with the current version of
  `AGENTS.shared.md`, and annotates the block with the package version for traceability.
