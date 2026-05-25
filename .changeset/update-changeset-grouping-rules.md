---
"@grasdouble/lufa_config_agents": patch
---

docs: clarify changeset grouping rules — atomic vs independent changes

Replaces the "one changeset per package" rule with a clearer decision model:
use a shared file when changes are part of the same atomic feature/fix,
use separate files when packages changed for unrelated reasons.
Also adds a rule requiring every package with changed files to be covered.
