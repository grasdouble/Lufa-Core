#!/usr/bin/env python3
"""
count-results.py — Count and verify package documentation results after parallel subagent run.

Used by 02-update-packages.md (SC-O-4) to produce a quick audit of what was
actually written to disk vs. what was expected.

Usage:
    python3 scripts/count-results.py --packages pkg1,pkg2,pkg3 [--root /path/to/repo]

    --packages  Comma-separated list of package SHORT names (e.g. my-api,my-lib)
                as they appear in _bmad-docs/documentation/{category}/{name}.md

Output:
    JSON report to stdout.
    Exit code 0 if all expected files exist, 2 if some missing, 1 on fatal error.
"""

import argparse
import json
import sys
from pathlib import Path


def discover_categories(docs_root: Path) -> list:
    """Discover categories from the documentation/ tree (or context/ as fallback)."""
    doc_tree = docs_root / "documentation"
    if doc_tree.exists():
        return sorted(p.name for p in doc_tree.iterdir() if p.is_dir())
    ctx_tree = docs_root / "context"
    if ctx_tree.exists():
        return sorted(p.name for p in ctx_tree.iterdir() if p.is_dir())
    return []


def find_doc_file(docs_root: Path, short_name: str, categories: list) -> tuple:
    """Search all category subdirs for {short_name}.md (documentation/) and
    {short_name}.context.md (context/)."""
    for cat in categories:
        doc = docs_root / "documentation" / cat / f"{short_name}.md"
        ctx = docs_root / "context" / cat / f"{short_name}.context.md"
        if doc.exists() or ctx.exists():
            return (doc if doc.exists() else None, ctx if ctx.exists() else None)
    return None, None


def file_stats(path: Path | None) -> dict | None:
    if path is None or not path.exists():
        return None
    stat = path.stat()
    lines = len(path.read_text(encoding="utf-8", errors="replace").splitlines())
    return {
        "path": str(path),
        "size_bytes": stat.st_size,
        "lines": lines,
    }


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Count and verify package documentation files after parallel subagent run."
    )
    parser.add_argument(
        "--packages", required=True,
        help="Comma-separated list of package short names to verify"
    )
    parser.add_argument(
        "--root", default=".",
        help="Project root directory (default: current working directory)"
    )
    args = parser.parse_args()

    repo_root = Path(args.root).resolve()
    docs_root = repo_root / "_bmad-docs"

    categories = discover_categories(docs_root)

    package_names = [p.strip() for p in args.packages.split(",") if p.strip()]
    if not package_names:
        print(json.dumps({"error": "No package names provided via --packages"}))
        sys.exit(1)

    results = []
    missing_doc = []
    missing_ctx = []

    for name in package_names:
        doc_path, ctx_path = find_doc_file(docs_root, name, categories)
        doc_stats = file_stats(doc_path)
        ctx_stats = file_stats(ctx_path)

        status = "complete" if doc_stats and ctx_stats else (
            "partial" if doc_stats or ctx_stats else "missing"
        )

        entry = {
            "name": name,
            "status": status,
            "doc": doc_stats,
            "context": ctx_stats,
        }
        results.append(entry)

        if not doc_stats:
            missing_doc.append(name)
        if not ctx_stats:
            missing_ctx.append(name)

    complete = [r for r in results if r["status"] == "complete"]
    partial = [r for r in results if r["status"] == "partial"]
    missing = [r for r in results if r["status"] == "missing"]

    all_ok = len(missing) == 0 and len(partial) == 0

    report = {
        "all_files_present": all_ok,
        "expected": len(package_names),
        "complete": len(complete),
        "partial": len(partial),
        "missing": len(missing),
        "results": results,
        "missing_doc_files": missing_doc,
        "missing_context_files": missing_ctx,
        "summary": (
            f"✅ {len(complete)}/{len(package_names)} packages fully documented"
            if all_ok
            else f"⚠️  {len(complete)}/{len(package_names)} complete, "
                 f"{len(partial)} partial, {len(missing)} missing"
        ),
    }

    print(json.dumps(report, indent=2))
    sys.exit(0 if all_ok else 2)


if __name__ == "__main__":
    main()
