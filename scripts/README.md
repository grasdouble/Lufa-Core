# Repository scripts

- `pnpm validate:docs`: verifies the shared AGENTS block, required Core documentation, local README/AGENTS links and pnpm version consistency. Does not require obsolete design-system or CLAUDE files.
- `pnpm test:tools`: runs regression tests for documentation validation.

`validate-ai-docs.sh` is a compatibility wrapper for the Node validator. All scripts run from the repository root.
