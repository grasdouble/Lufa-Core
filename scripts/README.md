# Repository scripts

- `pnpm validate:docs`: verifies the shared AGENTS block, required Core documentation, local README/AGENTS links and pnpm version consistency. Does not require obsolete design-system or CLAUDE files.
- `pnpm test:tools`: runs regression tests for documentation validation and dependency changeset selection.
- `node scripts/dependency-changeset.mjs`: used by dependency maintenance after updates. Adds patch coverage for changed workspace packages not already covered by a changeset; excludes the monorepo root.

`validate-ai-docs.sh` is a compatibility wrapper for the Node validator. All scripts run from the repository root. Dependency changeset generation reads Git status/diffs but never stages, commits or pushes changes.
