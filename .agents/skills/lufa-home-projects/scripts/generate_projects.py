#!/usr/bin/env python3
"""
Generate the PROJECTS TypeScript constant for the Lufa home landing page.

Fetches public repos from grasdouble org + noofreuuuh account via GitHub CLI,
filters excluded repos, sorts by creation date (newest first), active before archived,
and prints the PROJECTS const ready to paste into App.tsx.

Usage (from repo root):
    python3 .agents/skills/lufa-home-projects/scripts/generate_projects.py

Requirements: gh CLI authenticated.
"""

import json
import subprocess
import sys

# ── Config ──────────────────────────────────────────────────────────────────

SOURCES = [
    ("orgs/grasdouble/repos", "grasdouble"),
    ("users/noofreuuuh/repos", "noofreuuuh"),
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

# Short descriptions per repo (auto-generated repos often have empty descriptions)
DESCRIPTIONS: dict[str, str] = {
    "Lufa": "Le monorepo open-source qui héberge le workspace Lufa : microfrontends, design system, plugins Vite et configs partagées.",
    "Lufa-Design-System": "Un design system React avec tokens sémantiques, compatible dark/light mode. Inclut une documentation Storybook interactive.",
    "Lufa-Lab": "Terrain d'expérimentation pour les nouvelles idées du workspace Lufa.",
    "Leetcode": "Mes solutions aux exercices LeetCode — pratique algorithmique en JavaScript.",
    "Dotfiles": "Configuration personnelle : terminal, aliases et environnement de développement.",
    "bmad-manager": "Gestionnaire d'agents BMad pour automatiser les workflows de développement.",
    "AnnuaireMusees_Front": "Annuaire de musées (backend PHP + frontend JavaScript) — l'un de mes premiers projets web.",
    "Dashboard": "Dashboard pour gérer GitHub, Jira et d'autres outils depuis une interface unique.",
    "Model_PassportJS-Init": "Template SailJS avec PassportJS pour l'authentification — référence d'architecture MVC.",
    "POC_Bot_Discord-Grabot": "Bot Discord expérimental (Grabot) — proof of concept JavaScript.",
    "POC_Phaser": "Proof of concept jeu en Vue.js avec le moteur Phaser.",
    "git-dashboard": "Dashboard de visualisation des dépôts et activités Git.",
    "github-package-visualizer": "Visualisateur de dépendances entre packages GitHub.",
    "spark-ai-app-generator": "Générateur d'applications IA — expérimentation Spark en TypeScript.",
    "spark-pixel-art-converter": "Convertisseur de pixel art — expérimentation Spark en TypeScript.",
    "spark-token-dependency-vis": "Visualisateur de dépendances de design tokens — expérimentation Spark en TypeScript.",
}


# ── Fetch ────────────────────────────────────────────────────────────────────

def fetch_repos(endpoint: str) -> list[dict]:
    result = subprocess.run(
        ["gh", "api", f"{endpoint}?per_page=100&type=public"],
        capture_output=True, text=True, check=True,
    )
    return json.loads(result.stdout)


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
    description = DESCRIPTIONS.get(name) or repo.get("description") or ""
    display_name = DISPLAY_NAMES.get(name, name)
    return {
        "title": display_name,
        "description": description,
        "links": build_links(name, repo["html_url"]),
        "archived": repo["archived"],
        "created_at": repo["created_at"],
    }


# ── Format TypeScript ─────────────────────────────────────────────────────────

def format_link(link: dict, indent: str) -> str:
    return (
        f'{indent}{{ href: \'{link["href"]}\', label: \'{link["label"]}\', '
        f'type: \'{link["type"]}\', variant: \'{link["variant"]}\' }},'
    )


def format_project(proj: dict) -> str:
    title = proj["title"].replace("'", "\\'")
    desc = proj["description"].replace("'", "\\'")
    archived_str = "true" if proj["archived"] else "false"

    links_lines = []
    for link in proj["links"]:
        links_lines.append(format_link(link, "      "))

    if len(proj["links"]) == 1:
        links_block = f"    links: [\n{links_lines[0]}\n    ],"
    else:
        links_block = "    links: [\n" + "\n".join(links_lines) + "\n    ],"

    return (
        f"  {{\n"
        f"    title: '{title}',\n"
        f"    description:\n"
        f"      '{desc}',\n"
        f"{links_block}\n"
        f"    archived: {archived_str},\n"
        f"  }},"
    )


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    all_repos = []
    seen = set()

    for endpoint, _ in SOURCES:
        try:
            repos = fetch_repos(endpoint)
        except subprocess.CalledProcessError as e:
            print(f"Error fetching {endpoint}: {e.stderr}", file=sys.stderr)
            sys.exit(1)

        for repo in repos:
            name = repo["name"]
            if name in EXCLUDED or name in seen or repo.get("private"):
                continue
            seen.add(name)
            all_repos.append(repo)

    projects = [repo_to_project(r) for r in all_repos]

    active = sorted([p for p in projects if not p["archived"]], key=lambda p: p["created_at"], reverse=True)
    archived = sorted([p for p in projects if p["archived"]], key=lambda p: p["created_at"], reverse=True)

    lines = ["const PROJECTS = ["]
    if active:
        lines.append("  // ── Actifs — du plus récent au plus ancien ──")
        for p in active:
            lines.append(format_project(p))
    if archived:
        lines.append("  // ── Archivés — du plus récent au plus ancien ──")
        for p in archived:
            lines.append(format_project(p))
    lines.append("] as const;")

    print("\n".join(lines))


if __name__ == "__main__":
    main()
