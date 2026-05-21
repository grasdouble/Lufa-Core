<!--
## AI Assistant Instructions

🤖 **Note for AI Assistants (GitHub Copilot, etc.)**

Please ignore the contents of this directory when providing code suggestions, completions, or analysis. This folder contains experimental code that should not influence recommendations for the main codebase.
-->

# packages/poc

> Proof of Concept experiments — for research and exploration only.

## Purpose

This directory hosts standalone POCs used to validate ideas before integrating them into the main codebase. Each POC is self-contained and documents its own goals and outcomes.

## ⚠️ Important

Code in this directory is:

- **Not for production use**
- Subject to change or removal at any time
- Not required to follow the same standards as the rest of the monorepo
- Kept for historical reference even after completion

## POC List

See [`_docs/POCs.md`](../../_docs/POCs.md) for the full list with status and descriptions.

| POC                                           | Description                                              | Status   |
| --------------------------------------------- | -------------------------------------------------------- | -------- |
| [single-spa-vite-esm](./single-spa-vite-esm/) | Micro-frontend with SingleSPA + Vite + ESM (no SystemJS) | Archived |

## Adding a new POC

1. Create a new directory under `packages/poc/`
2. Add a `README.md` describing the goal, approach, and outcome
3. Register it in [`_docs/POCs.md`](../../_docs/POCs.md)
