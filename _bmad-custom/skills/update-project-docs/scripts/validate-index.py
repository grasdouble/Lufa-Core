#!/usr/bin/env python3
"""
validate-index.py — Structural validator for _bmad-docs/index.md.

Used by 04-update-index.md (SC-O-3) to verify the generated index before
presenting it to the user for confirmation.

Usage:
    python3 scripts/validate-index.py [--root /path/to/repo]

Output:
    JSON report to stdout.
    Exit code 0 if all checks pass, 2 if warnings only, 1 on fatal error.
"""

import argparse
import json
import re
import sys
from pathlib import Path


# ---------------------------------------------------------------------------
# Required sections (H2 headings) that must exist in index.md
# ---------------------------------------------------------------------------

REQUIRED_SECTIONS = [
    "Quick Reference Links",
    "Package Documentation",
]

RECOMMENDED_SECTIONS = [
    "Package Dependency Map",
]

# ---------------------------------------------------------------------------
# Checks
# ---------------------------------------------------------------------------

def check_required_sections(content: str) -> tuple[list, list]:
    """Return (errors, warnings) for required/recommended section headings."""
    errors, warnings = [], []
    headings = set(re.findall(r"^##\s+(.+)$", content, re.MULTILINE))

    for section in REQUIRED_SECTIONS:
        if not any(section.lower() in h.lower() for h in headings):
            errors.append(f"Missing required section: '## {section}'")

    for section in RECOMMENDED_SECTIONS:
        if not any(section.lower() in h.lower() for h in headings):
            warnings.append(f"Missing recommended section: '## {section}'")

    return errors, warnings


def check_last_updated(content: str) -> list:
    """Warn if no Last updated / last_updated date is present."""
    if not re.search(r"last.?updated", content, re.IGNORECASE):
        return ["No 'Last updated' date found in index.md"]
    return []


def check_internal_links(content: str, docs_root: Path) -> tuple[list, list]:
    """
    Find all markdown links that look like relative paths and check they exist.
    Returns (broken_links, checked_count_info).
    """
    broken = []
    # Match [text](path) where path does NOT start with http/# and ends with .md
    link_re = re.compile(r"\[([^\]]+)\]\(([^)]+\.md[^)]*)\)")
    for match in link_re.finditer(content):
        raw_path = match.group(2).split("#")[0].strip()  # strip anchors
        if raw_path.startswith("http"):
            continue
        resolved = (docs_root / raw_path).resolve()
        if not resolved.exists():
            broken.append(f"Broken link: [{match.group(1)}]({raw_path})")
    return broken


def check_package_entries(content: str, docs_root: Path) -> tuple[list, list]:
    """
    For every Doc/Context link found in the index that points to
    documentation/{category}/{name}.md or context/{category}/{name}.context.md,
    verify the file exists on disk.
    Returns (missing_files, found_count).
    """
    missing = []
    found = 0
    # Match links to documentation/ or context/ subtrees
    pkg_link_re = re.compile(r"\(((?:documentation|context)/([^/]+)/([^)]+\.md))\)")
    for match in pkg_link_re.finditer(content):
        rel_path = match.group(1)
        target = docs_root / rel_path
        if target.exists():
            found += 1
        else:
            missing.append(f"Referenced but missing: {rel_path}")
    return missing, found


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Validate structural integrity of _bmad-docs/index.md."
    )
    parser.add_argument(
        "--root", default=".",
        help="Project root directory (default: current working directory)"
    )
    args = parser.parse_args()

    repo_root = Path(args.root).resolve()
    docs_root = repo_root / "_bmad-docs"
    index_path = docs_root / "index.md"

    if not index_path.exists():
        print(json.dumps({
            "valid": False,
            "errors": [f"index.md not found at {index_path}"],
            "warnings": [],
        }))
        sys.exit(1)

    content = index_path.read_text(encoding="utf-8")

    errors: list = []
    warnings: list = []

    # Run all checks
    sec_errors, sec_warnings = check_required_sections(content)
    errors.extend(sec_errors)
    warnings.extend(sec_warnings)

    warnings.extend(check_last_updated(content))

    broken_links = check_internal_links(content, docs_root)
    warnings.extend(broken_links)

    missing_pkg, found_pkg = check_package_entries(content, docs_root)
    warnings.extend(missing_pkg)

    valid = len(errors) == 0
    report = {
        "valid": valid,
        "index_path": str(index_path.relative_to(repo_root)),
        "package_links_found": found_pkg,
        "package_links_missing": len(missing_pkg),
        "errors": errors,
        "warnings": warnings,
        "summary": (
            "✅ index.md structure is valid"
            if valid and not warnings
            else ("✅ Valid with warnings" if valid else "❌ Validation failed")
        ),
    }

    print(json.dumps(report, indent=2))
    sys.exit(0 if valid and not warnings else (2 if valid else 1))


if __name__ == "__main__":
    main()
