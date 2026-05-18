# RTK — Token-Optimized CLI

**rtk** is a CLI proxy that filters and compresses command outputs, saving 60-90% tokens.

## Rule

Always prefix shell commands with `rtk`:

```bash
# Instead of:              Use:
git status                 rtk git status
git log -10                rtk git log -10
cargo test                 rtk cargo test
docker ps                  rtk docker ps
kubectl get pods           rtk kubectl pods
```

## Meta commands (use directly)

```bash
rtk gain              # Token savings dashboard
rtk gain --history    # Per-command savings history
rtk discover          # Find missed rtk opportunities
rtk proxy <cmd>       # Run raw (no filtering) but track usage
```

## Design System — Prefer components over custom CSS

Always use Lufa Design System components before writing custom CSS. Use the `lufa-design-system` skill to discover the current list of available components and their props.

Only write custom CSS for things the DS genuinely cannot do:

- `min-height`, `aspect-ratio`, or other structural constraints
- Responsive `auto-fit` / `auto-fill` grid layouts
- Element-level styles (e.g. `img` sizing)
- Design token values not exposed via component props (e.g. `border-top` with a token)

## TypeScript — Do not emit files

The `tsconfig` files in this repo have `declaration: true` and `sourceMap: true`. Never run `tsc` without `--noEmit` in source folders.

- ✅ `pnpm typecheck` (already uses `--noEmit`)
- ❌ `tsc` or `tsc -p tsconfig.json` alone → emits `.js`, `.d.ts`, `.map` files into `src/`

If stray generated files appear in `src/` (`.js`, `.js.map`, `.d.ts`, `.d.ts.map`), delete them immediately.
