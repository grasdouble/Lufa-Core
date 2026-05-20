---
name: lufa-home-projects
description: Regenerate the PROJECTS TypeScript constant in the Lufa home landing page (src/data/projects.ts). Use when the user asks to refresh, update, or regenerate the projects list — e.g. "regenerate the projects list", "mets à jour la liste des projets", "ajoute les nouveaux repos".
---

# Lufa Home Projects

## Workflow

1. Run the generation script from the repo root:

   ```bash
   python3 .agents/skills/lufa-home-projects/scripts/generate_projects.py
   ```

   The script fetches public repos from `grasdouble` org + `noofreuuuh` account via `gh` CLI, filters excluded repos, sorts by creation date (newest first, active then archived), fetches `archivedAt` year via GraphQL for archived repos, and outputs a `PROJECTS` TypeScript const.

2. Replace the existing `export const PROJECTS` block in `packages/apps/microfrontend/home/src/data/projects.ts` with the script output.

3. Run `pnpm all:typecheck && pnpm all:lint` to verify.

> **Note:** Descriptions are stored in the i18n files (`src/i18n/locales/fr.json` and `en.json`), not in `projects.ts`. After adding a new repo, add its description under the key `projects.<key>` in both locale files.

## Customization

All config lives at the top of the script:

| Dict            | Purpose                                                                                      |
| --------------- | -------------------------------------------------------------------------------------------- |
| `EXCLUDED`      | Repo names to skip (profile repos, test repos, etc.)                                         |
| `LIVE_LINKS`    | Maps repo name → list of `{href, label}` for live/demo links (auto-typed as `solid success`) |
| `DISPLAY_NAMES` | Human-friendly title overrides for repos with underscores/hyphens                            |
| `KEY_OVERRIDES` | Explicit i18n key overrides when `to_key(display_name)` doesn't match the expected key       |

To add a new live URL for a repo, add an entry to `LIVE_LINKS` in the script.

## Generated fields

| Field          | Source                                                           |
| -------------- | ---------------------------------------------------------------- |
| `title`        | `DISPLAY_NAMES[repo]` or repo name                               |
| `key`          | kebab-case of `title` — used for i18n lookup (`projects.<key>`)  |
| `links`        | live links from `LIVE_LINKS` + GitHub link                       |
| `archived`     | `repo.archived` from GitHub API                                  |
| `archivedYear` | `archivedAt` year from GitHub GraphQL (only present if archived) |

## Link conventions

- Live/demo links → `type: 'solid', variant: 'success'` — listed first
- GitHub link → `type: 'outline', variant: 'neutral'` — always last

## Requirements

- `gh` CLI authenticated (`gh auth status`)
