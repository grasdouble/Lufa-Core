# Index Structure Template

Template for the `_bmad-docs/index.md` file.
Used by `step-04-update-index.md` to guide the index subagent.

---

## File Structure

```markdown
# Lufa Documentation Index

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

{ASCII diagram of package dependencies}

```

---

## Package Documentation

### Applications

| Package | Description | Docs |
| ------- | ----------- | ---- |
| {name} | {description} | [Doc](packages/apps/{name}.md) \| [Context](packages/apps/{name}.context.md) |

### CDN

| Package | Description | Docs |
| ------- | ----------- | ---- |
| {name} | {description} | [Doc](packages/cdn/{name}.md) \| [Context](packages/cdn/{name}.context.md) |

### Configuration

| Package | Description | Docs |
| ------- | ----------- | ---- |
| {name} | {description} | [Doc](packages/config/{name}.md) \| [Context](packages/config/{name}.context.md) |

### Design System

| Package | Description | Docs |
| ------- | ----------- | ---- |
| {name} | {description} | [Doc](packages/design-system/{name}.md) \| [Context](packages/design-system/{name}.context.md) |

### Plugins

| Package | Description | Docs |
| ------- | ----------- | ---- |
| {name} | {description} | [Doc](packages/plugins/{name}.md) \| [Context](packages/plugins/{name}.context.md) |

### Proof of Concept

| Package | Description | Docs |
| ------- | ----------- | ---- |
| {name} | {description} | [Doc](packages/poc/{name}.md) \| [Context](packages/poc/{name}.context.md) |

---

## Navigation Guide

### For New Developers
1. Read [Project Context](project-context.md)
2. Explore the [Design System](packages/design-system/lufa_design-system.md) core package
3. Understand the [Microfrontend Architecture](packages/apps/lufa_microfrontend_main-container.md)
4. Review [Design System Tokens](packages/design-system/lufa_design-system-tokens.md) and [Themes](packages/design-system/lufa_design-system-themes.md)

### For AI Agents
1. **ALWAYS** start with [Project Context](project-context.md)
2. Check relevant package `.context.md` files
3. Refer to Design System documentation for component/token usage

### For Feature Development
1. Check Design System component guidelines
2. Review existing microfrontend patterns
3. Follow Playwright test strategy

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

All links should be relative to `_bmad-docs/`:

```markdown
<!-- Within _bmad-docs -->

[Project Context](project-context.md)
[Package Doc](packages/design-system/lufa_design-system.md)

<!-- To docs/ folder (if exists) -->

[Architecture](../docs/Architecture/...)
```

## Package Table Format

```markdown
| Package                        | Description                   | Docs                                                                                                                   |
| ------------------------------ | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| @grasdouble/lufa_design-system | Core Design System components | [Doc](packages/design-system/lufa_design-system.md) \| [Context](packages/design-system/lufa_design-system.context.md) |
```
