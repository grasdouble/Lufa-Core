# Index Structure Template

Template for the `{docs_output_path}/index.md` file.
Used by `04-update-index.md` to guide the index subagent.

---

## File Structure

```markdown
# {{project_name}} Documentation Index

> Central navigation for all project documentation.
> Last updated: {date}

---

## Quick Reference Links

### Critical Reading (MUST READ FIRST)

| Document                              | Purpose                                  |
| ------------------------------------- | ---------------------------------------- |
| [Project Context](project-context.md) | **CRITICAL** rules AI agents must follow |

### Architecture Documentation

| Document                 | Content        |
| ------------------------ | -------------- |
| {Architecture doc links} | {descriptions} |

### Development Guidelines

| Document              | Content        |
| --------------------- | -------------- |
| {Guideline doc links} | {descriptions} |

---

## Package Dependency Map
```

{ASCII diagram of package dependencies — generated from actual workspace graph}

```

---

## Package Documentation

{One section per category discovered under {docs_output_path}/documentation/.
Section title = category name. Table rows = packages in that category.
Both the doc link (documentation/) and context link (context/) appear in the same row.}

### {Category Name}

| Package | Description | Docs |
| ------- | ----------- | ---- |
| {name} | {description} | [Doc](documentation/{category}/{name}.md) \| [Context](context/{category}/{name}.context.md) |

---

## Navigation Guide

### For New Developers
1. Read [Project Context](project-context.md)
2. Explore the core packages listed above
3. Review the architecture documentation

### For AI Agents
1. **ALWAYS** start with [Project Context](project-context.md)
2. Check relevant package `.context.md` files in `context/` before making changes
3. Refer to package documentation in `documentation/` for API details

### For Feature Development
1. Check existing package guidelines
2. Review architecture patterns in project context
3. Follow the testing conventions

---

## Documentation Statistics

| Category | Count | Last Updated |
| -------- | ----- | ------------ |
| Packages Documented | {count} | {date} |
| Architecture Docs | {count} | — |
| Guidelines | {count} | — |
```

---

## Link Format Rules

All links should be relative to `{docs_output_path}/`:

```markdown
<!-- Root files -->
[Project Context](project-context.md)

<!-- Package documentation -->
[Package Doc](documentation/{category}/my-package.md)

<!-- AI context files -->
[Package Context](context/{category}/my-package.context.md)

<!-- To docs/ folder (if exists) -->
[Architecture](../docs/Architecture/...)
```

## Package Table Format

```markdown
| Package           | Description         | Docs                                                                                                           |
| ----------------- | ------------------- | -------------------------------------------------------------------------------------------------------------- |
| @scope/my-package | Short description   | [Doc](documentation/{category}/my-package.md) \| [Context](context/{category}/my-package.context.md) |
```
