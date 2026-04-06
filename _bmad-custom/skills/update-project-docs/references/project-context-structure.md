# Project Context Structure Template

Template for the `_bmad-docs/project-context.md` file.
Used by `step-03-update-context.md` to guide the context subagent.

---

## File Structure

```markdown
# Project Context for AI Agents - Lufa

> **Purpose**: Critical rules and patterns that AI agents MUST follow.
> **Generated**: {date}
> **Focus**: Unobvious details that agents might otherwise miss.

---

## Technology Stack & Versions

{Current versions table}

---

## 🚨 CRITICAL: Design System Patterns (MUST READ)

### Token & Theme Usage

{Explanation with code examples — how to use design tokens and themes correctly}

### Component Import Rules

{Rules and examples — always import from the design system package, never from internals}

### Storybook Story Conventions

{Patterns and examples — how stories are structured, CSF format, args usage}

---

## 🚨 CRITICAL: Microfrontend Architecture

### Import Map Pattern

{How import maps work in this project — runtime module resolution}

### Microfrontend Boundaries

{What belongs in main-container vs feature microfrontends}

### Cross-Microfrontend Communication

{Patterns for inter-MF communication if any}

---

## 🚨 CRITICAL: TypeScript Rules

{TypeScript conventions — strict mode, path aliases, shared types}

---

## Import Patterns

{Standard import patterns for the project — @grasdouble/lufa\_\* scope usage}

---

## Testing Conventions

{Playwright test patterns, Storybook visual testing, unit testing}

---

## File Organization

{Directory structure conventions — where to put new files, naming rules}

---

## Build System

{Vite configuration patterns, pnpm workspace commands, plugin usage}

---

## Design System Tokens & Themes

{How to consume tokens, how to switch themes, CSS variables usage}

---

## Docusaurus Documentation

{How the documentation site is structured, how to add new pages}

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
2. **Design System Patterns** — Token/theme/component rules
3. **Microfrontend Architecture** — Import maps and boundaries
4. **TypeScript Rules** — Type safety conventions
5. **Common Mistakes** — Project-specific pitfalls

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

| Version               | Source File                                |
| --------------------- | ------------------------------------------ |
| Main dependencies     | Root `package.json`                        |
| Design System version | `packages/design-system/main/package.json` |
| TypeScript version    | Root `tsconfig.json` or `package.json`     |
| Exact versions        | `pnpm-lock.yaml`                           |
