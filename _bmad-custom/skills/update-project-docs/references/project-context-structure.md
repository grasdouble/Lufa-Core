# Project Context Structure Template

Template for the `{docs_output_path}/project-context.md` file.
Used by `03-update-context.md` to guide the context subagent.

---

## File Structure

```markdown
# Project Context for AI Agents - {{project_name}}

> **Purpose**: Critical rules and patterns that AI agents MUST follow.
> **Generated**: {date}
> **Focus**: Unobvious details that agents might otherwise miss.

---

## Technology Stack & Versions

{Current versions table — derived from root package.json and lock file}

---

## 🚨 CRITICAL: Architecture Patterns (MUST READ)

{The most important architectural patterns specific to this project.
Replace this section with the project's dominant architecture — examples:
- Design system / component library
- Microfrontend / module federation
- Plugin system
- Monorepo package boundaries
Each section should include: what it is, how to use it correctly, and what to avoid.}

---

## 🚨 CRITICAL: TypeScript Rules

{TypeScript conventions — strict mode, path aliases, shared types}

---

## Import Patterns

{Standard import patterns — package scope usage, aliasing conventions}

---

## Testing Conventions

{Test runner patterns, integration testing, unit testing approach}

---

## File Organization

{Directory structure conventions — where to put new files, naming rules}

---

## Build System

{Build tool configuration patterns, workspace commands, plugin usage}

---

## Common Mistakes to Avoid

{List of anti-patterns specific to this project}

---

## Quick Reference

{Cheat sheet style reference}
```

---

## Priority Sections

These sections MUST always be included:

1. **Technology Stack** — Current versions
2. **Architecture Patterns** — The dominant patterns for this project (discovered from codebase, not assumed)
3. **TypeScript Rules** — Type safety conventions
4. **Common Mistakes** — Project-specific pitfalls

Additional sections should be added based on what is actually present in the project (e.g. design system, microfrontends, plugin system, etc.).

---

## Writing Style

- **Imperative tone**: "ALWAYS", "NEVER", "MUST"
- **Code examples**: Show both ❌ wrong and ✅ correct
- **Concise**: Focus on unobvious rules
- **Scannable**: Use tables and bullet points

### Critical Rules Format

````markdown
### ❌ NEVER {anti-pattern}

{Brief explanation why}

```typescript
// ❌ FORBIDDEN
{bad code}

// ✅ CORRECT
{good code}
```
````

---

## Version Detection Sources

| Version            | Source File                                        |
| ------------------ | -------------------------------------------------- |
| Main dependencies  | Root `package.json`                                |
| TypeScript version | Root `tsconfig.json` or `package.json`             |
| Exact versions     | Lock file (`pnpm-lock.yaml`, `yarn.lock`, etc.)    |
| Package versions   | `{packages_root}/**/package.json`                  |
