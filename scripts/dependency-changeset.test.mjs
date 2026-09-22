import assert from 'node:assert/strict';
import test from 'node:test';

import { affectedPackages } from './dependency-changeset.mjs';

test('covers changed workspace files without including the root or sibling packages', () => {
  const packages = [
    { directory: 'packages/config/agents', name: '@grasdouble/agents' },
    { directory: 'packages/config/agentstwo', name: '@grasdouble/other' },
  ];
  assert.deepEqual(affectedPackages(['package.json', 'packages/config/agents/AGENTS.shared.md'], packages), [
    '@grasdouble/agents',
  ]);
  assert.deepEqual(affectedPackages(['pnpm-lock.yaml'], packages), []);
});
