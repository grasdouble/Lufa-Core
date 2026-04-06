# Package Naming Conventions

Reference data for the `update-project-docs` workflow.

---

## Variable Reference

| Variable               | Example                                     | Source                                      |
| ---------------------- | ------------------------------------------- | ------------------------------------------- |
| `{package_name}`       | `@grasdouble/lufa_design-system`            | `package.json` → `name` field               |
| `{package_name_short}` | `lufa_design-system`                        | `{package_name}` without `@scope/` prefix   |
| `{package_path}`       | `packages/design-system/main`               | relative path from project root             |
| `{category}`           | `design-system`                             | derived from path segment after `packages/` |
| `{project_root}`       | `/Users/.../Lufa`                           | absolute project root                       |
| `{output_path}`        | `_bmad-docs/packages/design-system`         | docs output directory                       |
| `{current_commit}`     | `abc1234def5678...`                         | HEAD SHA from Step 1 scan report            |
| `{commits_since_last}` | `["abc1234 fix: ...", "def5678 feat: ..."]` | git log output from Step 1 scan report      |

---

## Scope Stripping Examples

| Package Name (input)                               | Short Name (output)                    |
| -------------------------------------------------- | -------------------------------------- |
| `@grasdouble/lufa_design-system`                   | `lufa_design-system`                   |
| `@grasdouble/lufa_design-system-tokens`            | `lufa_design-system-tokens`            |
| `@grasdouble/lufa_plugin_vite_import-map-injector` | `lufa_plugin_vite_import-map-injector` |
| `@grasdouble/lufa_microfrontend_main-container`    | `lufa_microfrontend_main-container`    |
| `@grasdouble/lufa_config_eslint`                   | `lufa_config_eslint`                   |
| `@grasdouble/cdn_autobuild-server`                 | `cdn_autobuild-server`                 |

---

## Output File Naming

| Short Name                             | Main Doc                                  | Context Doc                                       |
| -------------------------------------- | ----------------------------------------- | ------------------------------------------------- |
| `lufa_design-system`                   | `lufa_design-system.md`                   | `lufa_design-system.context.md`                   |
| `lufa_plugin_vite_import-map-injector` | `lufa_plugin_vite_import-map-injector.md` | `lufa_plugin_vite_import-map-injector.context.md` |

---

## Directory Mapping

| Package Path                    | Docs Output Path                     |
| ------------------------------- | ------------------------------------ |
| `packages/apps/*`               | `_bmad-docs/packages/apps/`          |
| `packages/apps/microfrontend/*` | `_bmad-docs/packages/apps/`          |
| `packages/cdn/*`                | `_bmad-docs/packages/cdn/`           |
| `packages/config/*`             | `_bmad-docs/packages/config/`        |
| `packages/design-system/*`      | `_bmad-docs/packages/design-system/` |
| `packages/plugins/vite/*`       | `_bmad-docs/packages/plugins/`       |
| `packages/plugins/vscode/*`     | `_bmad-docs/packages/plugins/`       |
| `packages/poc/*`                | `_bmad-docs/packages/poc/`           |

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
