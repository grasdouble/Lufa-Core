---
"@grasdouble/lufa_config_agents": minor
---

feat: add `--local <path>` flag to `lufa-agents-sync` for local iteration

When developing changes to `AGENTS.shared.md`, you can now point the CLI at a
local clone of Lufa-Core instead of the published npm version:

```bash
pnpm sync:agents --local ../Lufa-Core
# or with an absolute path
lufa-agents-sync --local /path/to/Lufa-Core
```

The injected block will be annotated with `local@<version>` so it's clear the
content comes from an unpublished local source.

---

docs: clarify changeset grouping rules — atomic vs independent changes

Replaces the "one changeset per package" rule with a clearer decision model:
use a shared file when changes are part of the same atomic feature/fix,
use separate files when packages changed for unrelated reasons.
Also adds a rule requiring every package with changed files to be covered.
