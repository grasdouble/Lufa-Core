import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { validateDocs } from './validate-ai-docs.mjs';

async function fixture(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'core-docs-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, 'packages/config/agents'), { recursive: true });
  await writeFile(path.join(root, 'packages/config/agents/AGENTS.shared.md'), 'Shared rules');
  await writeFile(
    path.join(root, 'AGENTS.md'),
    '<!-- BEGIN:AGENTS.shared -->\n<!-- source: local -->\n\nShared rules\n\n<!-- END:AGENTS.shared -->'
  );
  await writeFile(path.join(root, 'README.md'), 'Use `pnpm all:test`. [Agents](./AGENTS.md)');
  await writeFile(
    path.join(root, 'package.json'),
    JSON.stringify({ scripts: { 'all:test': 'test' }, packageManager: 'pnpm@11.1.2' })
  );
  await writeFile(path.join(root, '.tool-versions'), 'nodejs 25.2.1\npnpm 11.1.2\n');
  return root;
}

test('validates Core without obsolete CLAUDE or design-system files', async (t) => {
  assert.deepEqual(await validateDocs(await fixture(t)), []);
});
test('detects drift in shared rules, broken links and pnpm version', async (t) => {
  const root = await fixture(t);
  await writeFile(path.join(root, 'packages/config/agents/AGENTS.shared.md'), 'New rules');
  await writeFile(path.join(root, 'README.md'), '[Missing](./missing.md)');
  await writeFile(path.join(root, '.tool-versions'), 'nodejs 25.2.1\npnpm 10.0.0\n');
  const errors = await validateDocs(root);
  assert.ok(errors.some((error) => error.includes('shared rules')));
  assert.ok(errors.some((error) => error.includes('missing.md')));
  assert.ok(errors.some((error) => error.includes('pnpm')));
});
