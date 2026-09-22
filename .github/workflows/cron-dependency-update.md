# Dependency update PRs

The weekly workflow updates dependencies, synchronizes shared agent rules, refreshes the dependency report and adds missing changeset coverage for modified workspace packages. Lockfile-only and root-only updates do not create a workspace changeset.

It validates build, lint, types, tests, formatting, documentation and changesets before creating or updating `codex/automated-dependency-updates` against the repository default branch. It never pushes updates directly to the default branch. The PR must pass the normal review and branch protection requirements before merge.

`LUFA_CI_SECRET_WRITE` must be a PAT with repository contents and pull-request write permissions and GitHub Packages read access. A PAT is used so PR creation triggers the repository's normal PR checks; the default `GITHUB_TOKEN` does not trigger those workflows. See the [action's authentication guidance](https://github.com/peter-evans/create-pull-request/blob/main/docs/concepts-guidelines.md#triggering-further-workflow-runs).

The action checks out the default branch explicitly, uses a stable update branch and serializes scheduled/manual runs. No update or PR is created if a validation command fails.

Run manually from **Actions → Cron:Dependency-Update → Run workflow**. This requires the configured secret and repository permission to create PRs. Those remote settings are not changed by local source edits.
