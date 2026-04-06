# Package Naming Conventions

Reference data for the `update-project-docs` workflow.

---

## Variable Reference

| Variable               | Example                                        | Source                                           |
| ---------------------- | ---------------------------------------------- | ------------------------------------------------ |
| `{package_name}`       | `@scope/my-package`                            | `package.json` → `name` field                   |
| `{package_name_short}` | `my-package`                                   | `{package_name}` without `@scope/` prefix        |
| `{package_path}`       | `packages/ui/my-package`                       | relative path from project root                  |
| `{category}`           | `ui`                                           | derived from path segment after `{packages_root}/` |
| `{project_root}`       | `/Users/.../my-project`                        | absolute project root                            |
| `{output_path}`        | `{docs_output_path}/documentation/ui`          | docs output directory                            |
| `{current_commit}`     | `abc1234def5678...`                            | HEAD SHA from Step 1 scan report                 |
| `{commits_since_last}` | `["abc1234 fix: ...", "def5678 feat: ..."]`    | git log output from Step 1 scan report           |

---

## Scope Stripping Examples

| Package Name (input)            | Short Name (output)   |
| ------------------------------- | --------------------- |
| `@scope/my-package`             | `my-package`          |
| `@scope/ui-button`              | `ui-button`           |
| `@scope/plugin-vite-foo`        | `plugin-vite-foo`     |
| `@scope/config-eslint`          | `config-eslint`       |
| `my-unscoped-package`           | `my-unscoped-package` |

> If `{package_scope}` is empty (no scope configured), `{package_name_short}` equals `{package_name}`.

---

## Output File Naming

| Short Name          | Main Doc              | Context Doc                    |
| ------------------- | --------------------- | ------------------------------ |
| `my-package`        | `my-package.md`       | `my-package.context.md`        |
| `plugin-vite-foo`   | `plugin-vite-foo.md`  | `plugin-vite-foo.context.md`   |

---

## Directory Mapping

Docs output directories use two parallel trees under `{docs_output_path}/`:

| File Type       | Output Path                                                      |
| --------------- | ---------------------------------------------------------------- |
| Main doc        | `{docs_output_path}/documentation/{category}/{package-name}.md` |
| AI context doc  | `{docs_output_path}/context/{category}/{package-name}.context.md` |

The `{category}` value mirrors the directory structure of `{packages_root}/` and is discovered at runtime — not hardcoded.

---

## Quality Standards

### Documentation Content

1. **Accuracy** — All information from actual code analysis, not assumptions
2. **Completeness** — Cover all public APIs and exports
3. **Examples** — Working code examples sourced from the codebase
4. **Currency** — Version and `generatedAtCommit` in frontmatter

### Language

- **Documentation content**: English (always)
- **Progress messages**: English
