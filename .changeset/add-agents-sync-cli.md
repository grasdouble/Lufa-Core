---
"@grasdouble/lufa_config_agents": minor
---

feat: add shared AI agent rules and `lufa-agents-sync` CLI for the Grasdouble ecosystem

Introduces `@grasdouble/lufa_config_agents`, a package that ships shared AI agent
rules (`AGENTS.shared.md`) and a `lufa-agents-sync` bin to embed those rules into
any consuming repo's `AGENTS.md`.

**Usage in consuming repos:**

```json
// package.json
{
  "scripts": {
    "sync:agents": "lufa-agents-sync"
  }
}
```

```bash
pnpm sync:agents
```

The command replaces the content between `<!-- BEGIN:AGENTS.shared -->` and
`<!-- END:AGENTS.shared -->` markers in `AGENTS.md` with the current version of
`AGENTS.shared.md`, and annotates the block with the package version for traceability.
