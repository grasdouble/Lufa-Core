#!/usr/bin/env python3
"""
Generate the PROJECTS TypeScript constant for the Lufa home landing page.

Fetches public repos from grasdouble org + noofreuuuh account via GitHub CLI,
filters excluded repos, sorts by creation date (newest first, active then archived),
fetches archivedAt year via GraphQL for archived repos,
and prints the PROJECTS const ready to paste into src/data/projects.ts.

Usage (from repo root):
    python3 .agents/skills/lufa-home-projects/scripts/generate_projects.py

Requirements: gh CLI authenticated.
"""

import json
import re
import subprocess
import sys

# ── Config ──────────────────────────────────────────────────────────────────

SOURCES = [
    ("orgs/grasdouble/repos", "grasdouble", "org"),
    ("users/noofreuuuh/repos", "noofreuuuh", "user"),
]

# Repos to skip (not meaningful for the landing page)
EXCLUDED = {
    "test",
    ".github",
    "github-action",
    "github-action-tester",
    "AnnuaireMusees_Back",
    "noofreuuuh",  # profile repo
}

# Known live links per repo name: list of {href, label}
# GitHub link is always added automatically at the end.
LIVE_LINKS: dict[str, list[dict]] = {
    "Lufa-Design-System": [
        {"href": "https://lufa-design.sebastien-lemouillour.fr", "label": "Design System"},
        {"href": "https://lufa-storybook.sebastien-lemouillour.fr", "label": "Storybook"},
    ],
}

# Friendly display names (optional override of repo name)
DISPLAY_NAMES: dict[str, str] = {
    "Lufa-Design-System": "Lufa Design System",
    "Lufa-Lab": "Lufa Lab",
    "AnnuaireMusees_Front": "AnnuaireMusees",
    "POC_Bot_Discord-Grabot": "POC Bot Discord",
    "POC_Phaser": "POC Phaser",
    "Model_PassportJS-Init": "Model PassportJS Init",
}

# Explicit key overrides when to_key(display_name) doesn't produce the right i18n key
KEY_OVERRIDES: dict[str, str] = {
    "AnnuaireMusees_Front": "annuaire-musees",
}


# ── Helpers ───────────────────────────────────────────────────────────────────

def to_key(display_name: str) -> str:
    """Convert display name to kebab-case key (used for i18n lookup)."""
    return re.sub(r"[^a-z0-9]+", "-", display_name.lower()).strip("-")


# ── Fetch ────────────────────────────────────────────────────────────────────

def fetch_repos(endpoint: str, endpoint_type: str) -> list[dict]:
    """Fetch all repos using gh CLI pagination."""
    # The org endpoint accepts type=public; the user endpoint does not support type filtering
    query_params = "per_page=100&type=public" if endpoint_type == "org" else "per_page=100"
    result = subprocess.run(
        ["gh", "api", "--paginate", f"{endpoint}?{query_params}"],
        capture_output=True, text=True, check=True,
    )
    # --paginate returns one JSON array per page concatenated; parse each separately
    repos: list[dict] = []
    for line in result.stdout.splitlines():
        line = line.strip()
        if line.startswith('['):
            repos.extend(json.loads(line))
    return repos


def fetch_archived_years(owner: str, repo_names: list[str]) -> dict[str, int]:
    """Return {repo_name: year} for archived repos using GraphQL archivedAt field."""
    if not repo_names:
        return {}

    aliases = " ".join(
        f'r{i}: repository(owner: "{owner}", name: "{name}") {{ archivedAt }}'
        for i, name in enumerate(repo_names)
    )
    query = f"{{ {aliases} }}"
    try:
        result = subprocess.run(
            ["gh", "api", "graphql", "-f", f"query={query}"],
            capture_output=True, text=True, check=True,
        )
        data = json.loads(result.stdout).get("data", {})
        return {
            repo_names[int(k[1:])]: int(v["archivedAt"][:4])
            for k, v in data.items()
            if v and v.get("archivedAt")
        }
    except subprocess.CalledProcessError as e:
        print(f"Warning: could not fetch archivedAt for {owner}: {e.stderr}", file=sys.stderr)
        return {}


# ── Build project entry ───────────────────────────────────────────────────────

def build_links(repo_name: str, repo_html_url: str) -> list[dict]:
    links = []
    for live in LIVE_LINKS.get(repo_name, []):
        links.append({
            "href": live["href"],
            "label": live["label"],
            "type": "solid",
            "variant": "success",
        })
    links.append({
        "href": repo_html_url,
        "label": "GitHub",
        "type": "outline",
        "variant": "neutral",
    })
    return links


def repo_to_project(repo: dict) -> dict:
    name = repo["name"]
    display_name = DISPLAY_NAMES.get(name, name)
    key = KEY_OVERRIDES.get(name) or to_key(display_name)
    return {
        "title": display_name,
        "key": key,
        "repo_name": name,
        "owner": repo["_owner"],
        "links": build_links(name, repo["html_url"]),
        "archived": repo["archived"],
        "created_at": repo["created_at"],
    }


# ── Format TypeScript ─────────────────────────────────────────────────────────

def format_link(link: dict) -> str:
    return (
        f'{{ href: \'{link["href"]}\', label: \'{link["label"]}\', '
        f'type: \'{link["type"]}\', variant: \'{link["variant"]}\' }}'
    )


def format_project(proj: dict, archived_years: dict[str, int]) -> str:
    title = proj["title"].replace("'", "\\'")
    key = proj["key"]
    archived_str = "true" if proj["archived"] else "false"
    archived_year = archived_years.get(proj["repo_name"])

    if len(proj["links"]) == 1:
        links_block = f"    links: [{format_link(proj['links'][0])}],"
    else:
        inner = "\n".join(f"      {format_link(lnk)}," for lnk in proj["links"])
        links_block = f"    links: [\n{inner}\n    ],"

    parts = [
        f"  {{",
        f"    title: '{title}',",
        f"    key: '{key}',",
        links_block,
        f"    archived: {archived_str},",
    ]
    if archived_year:
        parts.append(f"    archivedYear: {archived_year},")
    parts.append(f"  }},")
    return "\n".join(parts)


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    all_repos: list[dict] = []
    seen: set[str] = set()
    archived_by_owner: dict[str, list[str]] = {}

    for endpoint, owner, endpoint_type in SOURCES:
        try:
            repos = fetch_repos(endpoint, endpoint_type)
        except subprocess.CalledProcessError as e:
            print(f"Error fetching {endpoint}: {e.stderr}", file=sys.stderr)
            sys.exit(1)

        for repo in repos:
            name = repo["name"]
            if name in EXCLUDED or name in seen or repo.get("private"):
                continue
            seen.add(name)
            repo["_owner"] = owner
            all_repos.append(repo)
            if repo["archived"]:
                archived_by_owner.setdefault(owner, []).append(name)

    # Fetch archivedAt year per owner in a single batched GraphQL call
    archived_years: dict[str, int] = {}
    for owner, names in archived_by_owner.items():
        archived_years.update(fetch_archived_years(owner, names))

    projects = [repo_to_project(r) for r in all_repos]
    active = sorted([p for p in projects if not p["archived"]], key=lambda p: p["created_at"], reverse=True)
    archived = sorted([p for p in projects if p["archived"]], key=lambda p: p["created_at"], reverse=True)

    lines = ["export const PROJECTS: readonly Project[] = ["]
    if active:
        lines.append("  // ── Active — most recent first ──")
        for p in active:
            lines.append(format_project(p, archived_years))
    if archived:
        lines.append("  // ── Archived — most recent first ──")
        for p in archived:
            lines.append(format_project(p, archived_years))
    lines.append("];")

    print("\n".join(lines))


if __name__ == "__main__":
    main()
