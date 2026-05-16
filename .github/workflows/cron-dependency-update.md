# Cron:Dependency-Update

Automatically updates npm dependencies to the latest minor/patch versions each week and refreshes the outdated dependencies report.

## Overview

Runs on a weekly cron or on demand to bump dependencies with pnpm, regenerate `_docs/reports/OUTDATED_DEPENDENCIES.report`, and push a `chore: update dependencies` commit when changes are detected. Keeps the monorepo aligned with the latest safe versions and surfaces remaining outdated packages in the job summary.

### Purpose

- Keep dependencies current within the allowed update range (minor/patch)
- Produce an up-to-date outdated dependencies report for visibility
- Commit and push dependency bumps without manual intervention
- Provide a job summary highlighting remaining outdated packages

## Trigger

This workflow runs on the following events:

```yaml
on:
  schedule:
    - cron: '0 0 * * 1' # Run every Monday at midnight
  workflow_dispatch:
```

**When it runs:**

- Every Monday at 00:00 UTC via the cron schedule
- Manually through the **Run workflow** button in GitHub Actions
- Immediately when manually dispatched, regardless of schedule

## Input Parameters

This workflow has no input parameters. It reads the repository secret `LUFA_CI_SECRET_READ` and uses `.tool-versions` to set the Node.js version for pnpm.

## Permissions

| Permission            | Access Level | Purpose                                                            |
| --------------------- | ------------ | ------------------------------------------------------------------ |
| `contents`            | write        | Commit and push dependency updates and the regenerated report      |
| `packages`            | read         | Authenticate against GitHub Packages while installing dependencies |
| `actions`             | none         | Not required; explicitly disabled                                  |
| `checks`              | none         | Not required; explicitly disabled                                  |
| `deployments`         | none         | Not required; explicitly disabled                                  |
| `issues`              | none         | Not required; explicitly disabled                                  |
| `pull-requests`       | none         | Not required; explicitly disabled                                  |
| `repository-projects` | none         | Not required; explicitly disabled                                  |
| `security-events`     | none         | Not required; explicitly disabled                                  |
| `statuses`            | none         | Not required; explicitly disabled                                  |

## Workflow Steps

### 1. Checkout repository

```yaml
- name: Checkout repository
  uses: actions/checkout@v6
```

Checks out the repository to make workflow files available for subsequent steps.

### 2. Update dependencies

```yaml
- name: Update dependencies
  uses: ./.github/actions/dependency-update
  with:
    PAT_DEPENDENCY_CHECK_UPDATE: ${{ secrets.LUFA_CI_SECRET_READ }}
    SETUP_VERSION_FILE: '.tool-versions'
```

Runs the composite action to:

- Re-checkout with the provided PAT and configure `.npmrc` for GitHub Packages
- Install pnpm and set up Node.js from `.tool-versions` with pnpm caching
- Install dependencies, update all packages to latest minor/patch (`pnpm update -r`)
- Generate `_docs/reports/OUTDATED_DEPENDENCIES.report` via `pnpm exec node generateOutdatedReport.js`
- Commit and push changes as `chore: update dependencies` when diffs are present
- Append the outdated dependencies table to the job summary

## Runner Configuration

```yaml
runs-on: ubuntu-latest
```

Uses the GitHub-hosted Ubuntu runner; no custom labels required.

## Usage

### Scheduled maintenance

1. Allow the Monday 00:00 UTC cron to run.
2. Review the job summary in GitHub Actions for the outdated dependencies table.
3. Verify the pushed `chore: update dependencies` commit if changes were applied.
4. Merge or cherry-pick as needed if working on a protected branch model.

### Manual dispatch

1. Go to **Actions → Cron:Dependency-Update → Run workflow**.
2. Select the target branch (defaults to default branch) and run.
3. Monitor the run; check the summary and the generated `_docs/reports/OUTDATED_DEPENDENCIES.report`.
4. Confirm the pushed commit if updates were made.

## Expected Output

### Successful update with changes

Dependencies are bumped to the latest minor/patch versions, the outdated report is regenerated, and a commit is pushed. The report appended to the summary mirrors `_docs/reports/OUTDATED_DEPENDENCIES.report`, for example:

```
# Outdated Dependencies Report

┌───────────────────────────────┬─────────┬────────┬────────────────────────────────┐
│ Package                       │ Current │ Latest │ Dependents                     │
├───────────────────────────────┼─────────┼────────┼────────────────────────────────┤
│ eslint-plugin-storybook (dev) │ 10.1.2  │ 10.1.4 │ @grasdouble/lufa_design-       │
│                               │         │        │ system-storybook               │
├───────────────────────────────┼─────────┼────────┼────────────────────────────────┤
│ typescript (dev)              │ 5.6.3   │ 5.9.3  │ @grasdouble/lufa_design-       │
│                               │         │        │ system-documentation           │
└───────────────────────────────┴─────────┴────────┴────────────────────────────────┘
```

### Successful run with no changes

No commit is created when `git status` is clean; the summary still includes the current outdated report (or notes “No outdated dependency”).

### Failure scenario

Missing or insufficient `LUFA_CI_SECRET_READ` permissions cause authentication failures during checkout or dependency install (HTTP 401/403), and the job stops before committing.

## What Happens Next

1. The repository receives a `chore: update dependencies` commit when updates exist.
2. `pnpm-lock.yaml`, package versions, and `_docs/reports/OUTDATED_DEPENDENCIES.report` reflect the latest state.
3. The job summary highlights remaining outdated packages for follow-up decisions (e.g., major upgrades).
4. Downstream pipelines use the updated dependencies on subsequent runs.

## Related Actions

- `.github/actions/dependency-update` – Composite action that performs the dependency update and report generation
- `.github/workflows/cron-dependency-update.yml` – Source workflow definition

## Troubleshooting

### Authentication failures

**Problem**: Checkout or install fails with 401/403 errors.

**Solution**:

- Ensure `secrets.LUFA_CI_SECRET_READ` is set and has `contents: write` and `packages: read` scopes.
- Re-run the workflow after rotating the PAT if it expired or was revoked.

### Node version lookup fails

**Problem**: `actions/setup-node` cannot resolve the Node version.

**Solution**:

- Confirm `.tool-versions` exists on the target branch and contains a valid Node version.
- If using another version file, update `SETUP_VERSION_FILE` in the workflow and composite action call to match.

### No commit created

**Problem**: The run completes without pushing changes.

**Solution**:

- Check the job summary: if the outdated report shows “No outdated dependency”, there were no updates to commit.
- If updates should have occurred, verify branch protection rules aren’t blocking pushes and that pnpm has access to all registries.

## Best Practices

1. **Maintain PAT scope** – Keep `LUFA_CI_SECRET_READ` limited to `contents: write` and `packages: read`; rotate it regularly.
2. **Review summaries** – Scan the appended outdated report after each run to plan major-version upgrades separately.
3. **Keep version files authoritative** – Ensure `.tool-versions` reflects the intended Node version so pnpm caches remain consistent.
4. **Monitor cron timing** – Expect runs at 00:00 UTC Monday; adjust expectations for local time zones.
5. **Validate after pushes** – When a commit is created, let CI run to confirm the updated dependencies don’t introduce regressions.

## Maintenance

- **Dependencies**:
  - `actions/checkout@v6` – Repository checkout
  - `pnpm/action-setup@v6` – pnpm installation
  - `actions/setup-node@v6` – Node.js setup with pnpm cache
  - `.github/actions/dependency-update` – Composite action encapsulating pnpm update and reporting
- **Update Strategy**: Bump action versions periodically, and adjust the cron schedule or runner image if project requirements change.
- **Testing**: For workflow changes, run `workflow_dispatch` on a feature branch to verify the report generation and commit behavior before merging.
