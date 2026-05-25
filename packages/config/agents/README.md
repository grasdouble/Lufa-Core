# @grasdouble/lufa_config_agents

Shared AI agent rules for the Grasdouble ecosystem.

## Usage

Add as a devDependency:

```bash
pnpm add -D @grasdouble/lufa_config_agents
```

Then reference the shared rules in your repo's `AGENTS.md`:

```markdown
## ⚠️ Read shared Grasdouble rules first

Read and apply: `./node_modules/@grasdouble/lufa_config_agents/AGENTS.shared.md`
```

## What's included

The shared rules cover cross-repo conventions:

- Self-improvement workflow
- Critical thinking before implementing
- Git — no commits, no destructive operations
- Package Manager — always use pnpm
- RTK — token-optimized CLI
- TypeScript — never call `tsc` directly
- Workflow — no planning files in the repo
- Accessibility — WCAG checklist
- Changesets — naming and content conventions
