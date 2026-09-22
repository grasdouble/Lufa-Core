import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { copyFile, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

const exec = promisify(execFile);
const require = createRequire(import.meta.url);
const packageRoot = fileURLToPath(new URL('../', import.meta.url));

test('both bundles build without invoking the esbuild CLI launcher', { timeout: 30000 }, async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'cdn-build-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const { scripts } = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  await writeFile(path.join(root, 'package.json'), JSON.stringify({ private: true, type: 'module', scripts }));
  await mkdir(path.join(root, 'src'));
  await writeFile(path.join(root, 'src/index.ts'), 'export const answer: number = 42;');
  await mkdir(path.join(root, 'node_modules/.bin'), { recursive: true });
  await symlink(path.dirname(require.resolve('esbuild/package.json')), path.join(root, 'node_modules/esbuild'));
  // Simulate an unusable package-manager launcher without changing the real installation.
  await writeFile(
    path.join(root, 'node_modules/.bin/esbuild'),
    '#!/usr/bin/env node\nthrow new Error("The esbuild CLI launcher must not be invoked");\n',
    { mode: 0o755 }
  );
  await copyFile(new URL('../build.mjs', import.meta.url), path.join(root, 'build.mjs'));
  await exec('pnpm', ['--dir', root, 'run', 'build'], { cwd: packageRoot, timeout: 20000 });
  for (const extension of ['mjs', 'cjs']) {
    const bundle = pathToFileURL(path.join(root, `dist/index.${extension}`)).href;
    const { stdout } = await exec(process.execPath, [
      '--input-type=module',
      '-e',
      `const mod = await import(${JSON.stringify(bundle)}); console.log(mod.answer);`,
    ]);
    assert.equal(stdout.trim(), '42');
  }
});
