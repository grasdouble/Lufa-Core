---
name: lufa-home-projects
description: Regenerate the PROJECTS TypeScript constant in the Lufa home landing page (App.tsx). Use when the user asks to refresh, update, or regenerate the projects list — e.g. "regenerate the projects list", "mets à jour la liste des projets", "ajoute les nouveaux repos".
---

# Lufa Home Projects

## Workflow

1. Run the generation script from the repo root:

   ```bash
   python3 .agents/skills/lufa-home-projects/scripts/generate_projects.py
   ```

   The script fetches public repos from `grasdouble` org + `noofreuuuh` account via `gh` CLI, filters excluded repos, sorts by creation date (newest first, active then archived), and outputs a `PROJECTS` TypeScript const.

2. Replace the existing `const PROJECTS = [` block in `packages/apps/microfrontend/home/src/App.tsx` with the script output.

3. Run `pnpm typecheck && pnpm all:lint` to verify.

## Customization

All config lives at the top of the script:

| Dict            | Purpose                                                                                      |
| --------------- | -------------------------------------------------------------------------------------------- |
| `EXCLUDED`      | Repo names to skip (profile repos, test repos, etc.)                                         |
| `LIVE_LINKS`    | Maps repo name → list of `{href, label}` for live/demo links (auto-typed as `solid success`) |
| `DISPLAY_NAMES` | Human-friendly title overrides for repos with underscores/hyphens                            |
| `DESCRIPTIONS`  | Custom French descriptions per repo (fallback: GitHub description)                           |

To add a new live URL for a repo, add an entry to `LIVE_LINKS` in the script.

## Link conventions

- Live/demo links → `type: 'solid', variant: 'success'` — listed first
- GitHub link → `type: 'outline', variant: 'neutral'` — always last

## Requirements

- `gh` CLI authenticated (`gh auth status`)
