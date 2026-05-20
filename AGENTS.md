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

## TypeScript — Do not emit files

The `tsconfig` files in this repo have `declaration: true` and `sourceMap: true`. Never run `tsc` without `--noEmit` in source folders.

- ✅ `pnpm typecheck` (already uses `--noEmit`)
- ❌ `tsc` or `tsc -p tsconfig.json` alone → emits `.js`, `.d.ts`, `.map` files into `src/`

If stray generated files appear in `src/` (`.js`, `.js.map`, `.d.ts`, `.d.ts.map`), delete them immediately.
