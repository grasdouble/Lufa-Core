import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

for (const format of ['mjs', 'cjs']) {
  test(`built ${format} entry starts and serves HTTP`, { timeout: 15000 }, async (t) => {
    const cwd = await mkdtemp(path.join(os.tmpdir(), 'cdn-smoke-'));
    const child = spawn(process.execPath, [fileURLToPath(new URL(`../dist/index.${format}`, import.meta.url))], {
      cwd,
      env: { PATH: process.env.PATH, GITHUB_TOKEN: 'local-smoke-test', PORT: '0', CDN_DIR: cwd },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    t.after(async () => {
      if (child.exitCode === null && child.signalCode === null) {
        const exited = new Promise((resolve) => child.once('exit', resolve));
        child.kill();
        await exited;
      }
      await rm(cwd, { recursive: true, force: true });
    });
    let output = '';
    const port = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Startup timed out: ${output}`)), 10000);
      child.once('error', (error) => {
        clearTimeout(timer);
        reject(error);
      });
      child.once('exit', (code) => {
        clearTimeout(timer);
        reject(new Error(`Exited ${code}: ${output}`));
      });
      child.stderr.on('data', (data) => {
        output += data;
      });
      child.stdout.on('data', (data) => {
        output += data;
        const match = output.match(/CDN listening on port (\d+)/);
        if (match) {
          clearTimeout(timer);
          resolve(match[1]);
        }
      });
    });
    const response = await fetch(`http://127.0.0.1:${port}/unblock-ip`);
    assert.equal(response.status, 404);
    assert.equal(response.headers.get('x-robots-tag'), 'noindex');
  });
}
