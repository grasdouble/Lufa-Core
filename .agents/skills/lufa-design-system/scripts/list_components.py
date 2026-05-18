#!/usr/bin/env python3
"""
List all components exported by @grasdouble/lufa_design-system
and their key props (including valid union values), by reading the installed package's type declarations.
"""

import sys
import re
from pathlib import Path

PNPM_STORE = Path("node_modules/.pnpm")
PKG_PATTERN = re.compile(r"@grasdouble\+lufa_design-system@.*react@")


def find_ds_dist() -> Path | None:
    if not PNPM_STORE.exists():
        return None
    for d in sorted(PNPM_STORE.iterdir(), reverse=True):
        if PKG_PATTERN.match(d.name):
            candidate = d / "node_modules/@grasdouble/lufa_design-system/dist"
            if candidate.exists():
                return candidate
    return None


def extract_components(dist: Path) -> dict[str, list[str]]:
    """
    Walk category index files and extract exported component names + prop types.
    Returns { category: [component_name, ...] }
    """
    categories = {}
    for index in dist.glob("*/index.d.ts"):
        category = index.parent.name
        exports = re.findall(r"export \{ (\w+) \}", index.read_text())
        # Keep only PascalCase (components, not types/utils)
        components = [e for e in exports if e[0].isupper() and not e.endswith("Props")]
        if components:
            categories[category] = components
    return categories


def extract_union_values(text: str, type_name: str) -> list[str] | None:
    """Extract string literal union values for a named type alias."""
    pattern = rf"type {type_name}\s*=\s*((?:'[^']+'\s*\|?\s*)+)"
    m = re.search(pattern, text)
    if m:
        return re.findall(r"'([^']+)'", m.group(1))
    return None


def extract_key_props(dist: Path, component: str) -> list[tuple[str, list[str] | None]]:
    """Return prop names with their valid union values when available."""
    for f in dist.rglob(f"{component}.d.ts"):
        text = f.read_text()
        # Collect named type aliases for union resolution
        type_aliases = dict(re.findall(r"type (\w+)\s*=\s*((?:'[^']+'\s*\|?\s*)+);", text))

        skip = {"children", "className", "ref", "as"}
        results = []
        for line in text.splitlines():
            m = re.match(r"\s{4}(\w+)\??:\s*(\w+);", line)
            if not m:
                # Try inline union: propName?: 'a' | 'b' | 'c'
                m2 = re.match(r"\s{4}(\w+)\??:\s*((?:'[^']+'\s*\|?\s*)+);", line)
                if m2:
                    prop = m2.group(1)
                    if prop in skip:
                        continue
                    values = re.findall(r"'([^']+)'", m2.group(2))
                    results.append((prop, values))
            else:
                prop, type_ref = m.group(1), m.group(2)
                if prop in skip:
                    continue
                values = extract_union_values(text, type_ref) if type_ref in type_aliases else None
                results.append((prop, values))
            if len(results) >= 6:
                break
        return results
    return []


def main() -> None:
    dist = find_ds_dist()
    if not dist:
        print("Could not locate @grasdouble/lufa_design-system in node_modules/.pnpm", file=sys.stderr)
        sys.exit(1)

    print(f"Design system: {dist.parent.name}\n")
    categories = extract_components(dist)

    for category, components in sorted(categories.items()):
        print(f"[{category}]")
        for comp in components:
            props = extract_key_props(dist, comp)
            print(f"  <{comp}>")
            for prop, values in props:
                if values:
                    print(f"    {prop}: {' | '.join(values)}")
                else:
                    print(f"    {prop}")
        print()


if __name__ == "__main__":
    main()
