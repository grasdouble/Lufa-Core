#!/usr/bin/env python3
"""
scan-packages.py — Deterministic monorepo package scanner for update-project-docs skill.

Replaces the LLM scan subagent (~600-1000 tokens/call) with a pure Python
implementation. All decisions are rule-based: no LLM calls, no ambiguity.

Usage:
    python scripts/scan-packages.py [--root /path/to/repo] [--merge-strategy merge|squash]

Merge strategy:
    merge  (default) — standard git merge. Compares generatedAtCommit..HEAD.
    squash           — squash-merge workflow (each PR lands as one commit on main).
                       Compares generatedAtCommit..main using --first-parent.
                       generatedAtCommit values stored in frontmatter MUST be main-branch
                       SHAs (never feature-branch SHAs) for this to work correctly.

Output:
    JSON report to stdout — same schema as legacy subagent output.
    Exit code 0 on success, 1 on fatal error.
"""

import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path


# ---------------------------------------------------------------------------
# Git helpers
# ---------------------------------------------------------------------------

def run_git(args: list, cwd: Path) -> str:
    """Run a git command and return stdout stripped. Returns '' on any error."""
    try:
        result = subprocess.run(
            ["git"] + args,
            cwd=str(cwd),
            capture_output=True,
            text=True,
            timeout=30,
            check=False,
        )
        return result.stdout.strip()
    except (subprocess.TimeoutExpired, FileNotFoundError, OSError):
        return ""


def get_head_commit(root: Path, strategy: str) -> str:
    """Return the commit SHA to store as generatedAtCommit.
    - merge:  HEAD (current branch)
    - squash: tip of main (feature-branch SHAs disappear after squash-merge)
    """
    if strategy == "squash":
        sha = run_git(["rev-parse", "main"], root)
        if not sha:
            # Fallback: main may be named differently; try HEAD with a warning
            sha = run_git(["log", "-1", "--format=%H"], root)
        return sha
    return run_git(["log", "-1", "--format=%H"], root)


def get_commits_since(commit: str, pkg_path: str, root: Path, strategy: str) -> list:
    """Return commit onelines in pkg_path since commit. Empty list if none or on error.

    - merge:  git log {commit}..HEAD
    - squash: git log {commit}..main --first-parent
              (only counts squash commits that landed on main, ignoring feature-branch history)
    """
    if strategy == "squash":
        output = run_git(
            ["log", f"{commit}..main", "--first-parent", "--oneline", "--", pkg_path + "/"],
            root,
        )
    else:
        output = run_git(
            ["log", f"{commit}..HEAD", "--oneline", "--", pkg_path + "/"],
            root,
        )
    if not output:
        return []
    return output.splitlines()


# ---------------------------------------------------------------------------
# Package discovery
# ---------------------------------------------------------------------------

_SKIP_DIRS = frozenset({"node_modules", "dist", ".git", "__pycache__", ".cache", "coverage"})


def find_package_jsons(packages_dir: Path) -> list:
    """Recursively find package.json files under packages_dir, skipping build artifacts."""
    results = []
    for root_dir, dirs, files in os.walk(packages_dir):
        # Prune directories in-place to avoid descending into them
        dirs[:] = [d for d in dirs if d not in _SKIP_DIRS]
        if "package.json" in files:
            results.append(Path(root_dir) / "package.json")
    return sorted(results)


def parse_package_json(pkg_json: Path, repo_root: Path) -> dict | None:
    """
    Extract metadata from a package.json.
    Returns None for workspace-root entries (depth < 3 parts) or parse errors.
    """
    try:
        with open(pkg_json, encoding="utf-8") as fh:
            data = json.load(fh)
    except (json.JSONDecodeError, OSError):
        return None

    pkg_path = pkg_json.parent.relative_to(repo_root)
    parts = pkg_path.parts  # e.g. ('packages', 'core', 'my-api')

    if len(parts) < 3:
        return None

    category = parts[1]
    raw_name = data.get("name", pkg_json.parent.name)
    # Strip @scope/ prefix for doc file naming (e.g. @scope/my-api → my-api)
    short_name = raw_name.split("/")[-1] if "/" in raw_name else raw_name

    return {
        "name": raw_name,
        "_short_name": short_name,  # internal — stripped before output
        "path": str(pkg_path),
        "category": category,
        "description": data.get("description", ""),
    }


# ---------------------------------------------------------------------------
# Documentation status
# ---------------------------------------------------------------------------

_COMMIT_RE = re.compile(r'generatedAtCommit:\s*["\']?([a-f0-9]{7,40})["\']?')


def read_generated_at_commit(doc_path: Path) -> str | None:
    """Read the generatedAtCommit value from the YAML frontmatter (first 20 lines)."""
    if not doc_path.exists():
        return None
    try:
        with open(doc_path, encoding="utf-8") as fh:
            for i, line in enumerate(fh):
                if i >= 20:
                    break
                match = _COMMIT_RE.search(line)
                if match:
                    return match.group(1)
    except OSError:
        pass
    return None


def assess_package(meta: dict, repo_root: Path, docs_root: Path, strategy: str) -> dict:
    """Return a full status record for one package."""
    category = meta["category"]
    short_name = meta["_short_name"]

    doc_path = docs_root / "documentation" / category / f"{short_name}.md"
    context_path = docs_root / "context" / category / f"{short_name}.context.md"

    has_doc = doc_path.exists()
    has_context = context_path.exists()

    base = {
        "name": meta["name"],
        "path": meta["path"],
        "category": category,
        "description": meta["description"],
        "has_doc": has_doc,
        "has_context": has_context,
    }

    if not has_doc:
        return {**base, "generated_at_commit": None,
                "status": "missing", "reason": "No documentation found",
                "commits_since_last": []}

    generated_at = read_generated_at_commit(doc_path)
    if not generated_at:
        return {**base, "generated_at_commit": None,
                "status": "needs_update", "reason": "No commit reference in frontmatter",
                "commits_since_last": []}

    commits = get_commits_since(generated_at, meta["path"], repo_root, strategy)
    if commits:
        return {**base, "generated_at_commit": generated_at,
                "status": "needs_update",
                "reason": f"{len(commits)} commit(s) since last generation",
                "commits_since_last": commits}

    return {**base, "generated_at_commit": generated_at,
            "status": "up_to_date", "reason": "No changes since last generation",
            "commits_since_last": []}


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Scan monorepo packages for documentation updates."
    )
    parser.add_argument(
        "--root", default=".",
        help="Project root directory (default: current working directory)"
    )
    parser.add_argument(
        "--packages-root", default="packages",
        help="Relative path from project root to the packages directory (default: packages)"
    )
    parser.add_argument(
        "--merge-strategy", default="merge", choices=["merge", "squash"],
        help="Git merge strategy: 'merge' (default) or 'squash'. "
             "Use 'squash' for repos where PRs land as single squash commits on main."
    )
    parser.add_argument(
        "--last-run", action="store_true",
        help="Quick mode: output last-run summary only (no git analysis, very fast)"
    )
    args = parser.parse_args()

    repo_root = Path(args.root).resolve()
    packages_dir = repo_root / args.packages_root
    docs_root = repo_root / "_bmad-docs"
    strategy = args.merge_strategy

    # --last-run: fast summary from frontmatter only, no git calls
    if args.last_run:
        pkg_json_files = find_package_jsons(packages_dir) if packages_dir.exists() else []
        dates = []
        total = 0
        for pkg_json in pkg_json_files:
            meta = parse_package_json(pkg_json, repo_root)
            if meta is None:
                continue
            total += 1
            doc_path = docs_root / "documentation" / meta["category"] / f"{meta['_short_name']}.md"
            if doc_path.exists():
                try:
                    with open(doc_path, encoding="utf-8") as fh:
                        for i, line in enumerate(fh):
                            if i >= 20:
                                break
                            m = re.search(r'lastUpdated:\s*["\']?([\d]{4}-[\d]{2}-[\d]{2})["\']?', line)
                            if m:
                                dates.append(m.group(1))
                                break
                except OSError:
                    pass

        from datetime import date
        most_recent = max(dates) if dates else None
        days_ago = None
        if most_recent:
            try:
                d = date.fromisoformat(most_recent)
                days_ago = (date.today() - d).days
            except ValueError:
                pass

        print(json.dumps({
            "last_run_date": most_recent,
            "days_since_last_run": days_ago,
            "total_packages": total,
            "packages_documented": len(dates),
            "packages_undocumented": total - len(dates),
        }))
        return

    if not packages_dir.exists():
        print(json.dumps({"error": f"{packages_dir.name}/ directory not found at {packages_dir}"}),
              file=sys.stdout)
        sys.exit(1)

    head_commit = get_head_commit(repo_root, strategy)
    pkg_json_files = find_package_jsons(packages_dir)

    packages = []
    for pkg_json in pkg_json_files:
        meta = parse_package_json(pkg_json, repo_root)
        if meta is None:
            continue
        record = assess_package(meta, repo_root, docs_root, strategy)
        packages.append(record)

    needs_update = [p["name"] for p in packages if p["status"] != "up_to_date"]
    up_to_date = [p["name"] for p in packages if p["status"] == "up_to_date"]

    report = {
        "scan_completed": True,
        "merge_strategy": strategy,
        "current_head_commit": head_commit,
        "total_packages": len(packages),
        "packages": packages,
        "packages_needing_update": needs_update,
        "packages_up_to_date": up_to_date,
        "summary": {
            "total": len(packages),
            "up_to_date": len(up_to_date),
            "needs_update": len([p for p in packages if p["status"] == "needs_update"]),
            "missing_docs": len([p for p in packages if p["status"] == "missing"]),
        },
    }

    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
