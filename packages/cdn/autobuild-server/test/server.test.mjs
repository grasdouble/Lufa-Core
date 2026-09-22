import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import fs from 'fs-extra';

import { sendEntry } from '../src/utils.ts';

async function fixture(t, metadata = {}) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'cdn-test-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const pkg = path.join(root, 'demo@1');
  await mkdir(pkg);
  await writeFile(path.join(pkg, 'package.json'), JSON.stringify({ type: 'module', ...metadata }));
  await writeFile(path.join(pkg, 'index.js'), 'export default 1');
  return { root, pkg };
}

for (const exports of ['./index.js', { import: './index.js' }, { '.': { browser: { import: './index.js' } } }]) {
  test(`resolves root exports ${JSON.stringify(exports)}`, async (t) => {
    const { root, pkg } = await fixture(t, { exports });
    assert.equal(
      (await sendEntry({ CDN_DIR: root, cdnPkgPath: pkg, fullName: 'demo@1', exportPath: '.' })).status,
      200
    );
  });
}

test('unknown and null subpaths cannot fall back to main', async (t) => {
  const { root, pkg } = await fixture(t, { exports: { '.': './index.js', './private': null }, main: './index.js' });
  for (const exportPath of ['./missing', './private']) {
    assert.equal((await sendEntry({ CDN_DIR: root, cdnPkgPath: pkg, fullName: 'demo@1', exportPath })).status, 404);
  }
});

test('nested nonmatching conditions fall through, but explicit null remains blocked', async (t) => {
  const { root, pkg } = await fixture(t, { exports: { browser: { require: './unused.cjs' }, import: './index.js' } });
  assert.equal((await sendEntry({ CDN_DIR: root, cdnPkgPath: pkg, fullName: 'demo@1', exportPath: '.' })).status, 200);
  await writeFile(path.join(pkg, 'package.json'), JSON.stringify({ exports: { browser: null, import: './index.js' } }));
  assert.equal((await sendEntry({ CDN_DIR: root, cdnPkgPath: pkg, fullName: 'demo@1', exportPath: '.' })).status, 404);
});

test('wildcard nested subpaths and exact blocked overrides resolve consistently', async (t) => {
  const { root, pkg } = await fixture(t, {
    exports: { './features/*': './features/*.js', './features/private': null },
  });
  await mkdir(path.join(pkg, 'features'));
  await writeFile(path.join(pkg, 'features/hello.js'), 'export default 1');
  assert.equal(
    (await sendEntry({ CDN_DIR: root, cdnPkgPath: pkg, fullName: 'demo@1', exportPath: './features/hello' })).status,
    200
  );
  assert.equal(
    (await sendEntry({ CDN_DIR: root, cdnPkgPath: pkg, fullName: 'demo@1', exportPath: './features/private' })).status,
    404
  );
});

test('wildcard captures cannot traverse to a blocked sibling export', async (t) => {
  const { root, pkg } = await fixture(t, {
    exports: { './features/*': './features/*.js', './features/private': null },
  });
  await mkdir(path.join(pkg, 'features'));
  await writeFile(path.join(pkg, 'features/private.js'), 'export default 1');
  for (const exportPath of ['./features/../private', './features/./../private', './features/x/../private']) {
    assert.equal(
      (await sendEntry({ CDN_DIR: root, cdnPkgPath: pkg, fullName: 'demo@1', exportPath })).status,
      404,
      `exportPath ${exportPath} must not resolve the blocked export`
    );
  }
});

test('array export targets fall back past invalid entries', async (t) => {
  const { root, pkg } = await fixture(t, { exports: ['../invalid.js', './index.js'] });
  assert.equal((await sendEntry({ CDN_DIR: root, cdnPkgPath: pkg, fullName: 'demo@1', exportPath: '.' })).status, 200);
});

test('rejects path traversal and symlinks leaving a package', async (t) => {
  const { root, pkg } = await fixture(t, { exports: './escape.js' });
  await writeFile(path.join(root, 'secret.js'), 'secret');
  await symlink(path.join(root, 'secret.js'), path.join(pkg, 'escape.js'));
  assert.equal((await sendEntry({ CDN_DIR: root, cdnPkgPath: pkg, fullName: 'demo@1', exportPath: '.' })).status, 403);
  await writeFile(path.join(pkg, 'package.json'), JSON.stringify({ main: '../secret.js' }));
  assert.equal((await sendEntry({ CDN_DIR: root, cdnPkgPath: pkg, fullName: 'demo@1', exportPath: '.' })).status, 403);
});

test('entry serving rejects packages outside the configured cache before reading metadata', async (t) => {
  const { root, pkg } = await fixture(t);
  const cache = path.join(root, 'cache');
  await mkdir(cache);
  const readJson = t.mock.method(fs, 'readJson', () => {
    throw new Error('Metadata must not be read');
  });
  for (const cdnPkgPath of [pkg, cache, path.join(cache, '..', 'demo@1'), path.join(root, 'cache-other/demo@1')]) {
    assert.equal((await sendEntry({ CDN_DIR: cache, cdnPkgPath, fullName: 'demo@1', exportPath: '.' })).status, 403);
  }
  assert.equal(readJson.mock.callCount(), 0);
});

for (const scoped of [false, true]) {
  test(`entry serving rejects an escaping ${scoped ? 'scope' : 'package'} symlink before reading metadata`, async (t) => {
    const { root, pkg } = await fixture(t);
    const cache = path.join(root, 'cache');
    await mkdir(cache);
    const link = path.join(cache, scoped ? '@demo' : 'demo@1');
    await symlink(scoped ? root : pkg, link);
    const readJson = t.mock.method(fs, 'readJson', () => {
      throw new Error('Metadata must not be read');
    });
    const cdnPkgPath = scoped ? path.join(link, 'demo@1') : link;
    assert.equal((await sendEntry({ CDN_DIR: cache, cdnPkgPath, fullName: 'demo@1', exportPath: '.' })).status, 403);
    assert.equal(readJson.mock.callCount(), 0);
  });
}

test('entry serving rejects a manifest symlink outside the package before reading it', async (t) => {
  const { root, pkg } = await fixture(t);
  const sibling = `${pkg}-other`;
  await mkdir(sibling);
  await writeFile(path.join(sibling, 'package.json'), JSON.stringify({ exports: './index.js' }));
  await rm(path.join(pkg, 'package.json'));
  await symlink(path.join(sibling, 'package.json'), path.join(pkg, 'package.json'));
  const readJson = t.mock.method(fs, 'readJson', () => {
    throw new Error('Metadata must not be read');
  });
  assert.equal((await sendEntry({ CDN_DIR: root, cdnPkgPath: pkg, fullName: 'demo@1', exportPath: '.' })).status, 403);
  assert.equal(readJson.mock.callCount(), 0);
});

test('entry serving supports a configured cache symlink and internal file symlinks', async (t) => {
  const { root, pkg } = await fixture(t);
  const cacheLink = path.join(root, 'cache-link');
  await symlink(root, cacheLink);
  await writeFile(path.join(pkg, 'metadata.json'), JSON.stringify({ exports: './entry.js' }));
  await rm(path.join(pkg, 'package.json'));
  await symlink('./metadata.json', path.join(pkg, 'package.json'));
  await symlink('./index.js', path.join(pkg, 'entry.js'));
  const result = await sendEntry({
    CDN_DIR: cacheLink,
    cdnPkgPath: path.join(cacheLink, 'demo@1'),
    fullName: 'demo@1',
    exportPath: '.',
  });
  assert.equal(result.status, 200);
  assert.equal(await readFile(result.outputFile, 'utf8'), 'export default 1');
});

test('concurrent downloads are shared and published only after extraction completes', async (t) => {
  const { root } = await fixture(t);
  const { createLibraryLoader } = await import('../src/utils.ts');
  let calls = 0;
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const load = createLibraryLoader(async (_name, destination) => {
    calls++;
    await writeFile(path.join(destination, 'package.json'), JSON.stringify({ type: 'module' }));
    await gate;
    await writeFile(path.join(destination, 'index.js'), 'complete');
  });
  const options = { fullName: 'other@1', cdnPkgPath: path.join(root, 'other@1'), CDN_DIR: root, GITHUB_TOKEN: 'test' };
  const first = load(options);
  const second = load(options);
  await new Promise((resolve) => setTimeout(resolve, 30));
  await assert.rejects(readFile(path.join(options.cdnPkgPath, 'package.json')));
  release();
  assert.deepEqual(
    (await Promise.all([first, second])).map((result) => result.status),
    [200, 200]
  );
  assert.equal(calls, 1);
  assert.equal(await readFile(path.join(options.cdnPkgPath, 'index.js'), 'utf8'), 'complete');
});

test('failed extraction can retry without publishing partial files', async (t) => {
  const { root } = await fixture(t);
  const { createLibraryLoader } = await import('../src/utils.ts');
  let calls = 0;
  const load = createLibraryLoader(async (_name, destination) => {
    await writeFile(path.join(destination, 'package.json'), JSON.stringify({ type: 'module' }));
    if (++calls === 1) throw new Error('registry token secret');
  });
  const options = { fullName: 'other@1', cdnPkgPath: path.join(root, 'other@1'), CDN_DIR: root, GITHUB_TOKEN: 'test' };
  const failed = await load(options);
  assert.equal(failed.status, 502);
  assert.doesNotMatch(failed.message, /secret/);
  await assert.rejects(readFile(path.join(options.cdnPkgPath, 'package.json')));
  assert.equal((await load(options)).status, 200);
});

test('independent loaders preserve a winning cache and reuse it', async (t) => {
  const { root } = await fixture(t);
  const { createLibraryLoader } = await import('../src/utils.ts');
  let calls = 0;
  const extract = async (_name, destination) => {
    calls++;
    await writeFile(path.join(destination, 'package.json'), JSON.stringify({ type: 'module' }));
    await writeFile(path.join(destination, 'index.js'), 'complete');
  };
  const first = createLibraryLoader(extract);
  const second = createLibraryLoader(extract);
  const options = { fullName: 'race@1', cdnPkgPath: path.join(root, 'race@1'), CDN_DIR: root, GITHUB_TOKEN: 'test' };
  assert.deepEqual(
    (await Promise.all([first(options), second(options)])).map((result) => result.status),
    [200, 200]
  );
  const downloads = calls;
  assert.equal((await first(options)).status, 200);
  assert.equal(calls, downloads);
  assert.equal(await readFile(path.join(options.cdnPkgPath, 'index.js'), 'utf8'), 'complete');
});

test('non-ESM extraction never publishes a completed cache', async (t) => {
  const { root } = await fixture(t);
  const { createLibraryLoader } = await import('../src/utils.ts');
  const load = createLibraryLoader(async (_name, destination) => {
    await writeFile(path.join(destination, 'package.json'), JSON.stringify({ type: 'commonjs' }));
  });
  const options = { fullName: 'cjs@1', cdnPkgPath: path.join(root, 'cjs@1'), CDN_DIR: root, GITHUB_TOKEN: 'test' };
  assert.equal((await load(options)).status, 415);
  await assert.rejects(readFile(path.join(options.cdnPkgPath, '.lufa-complete')));
});

test('legacy and escaping cache directories are not served or removed', async (t) => {
  const { root, pkg } = await fixture(t);
  const { createLibraryLoader } = await import('../src/utils.ts');
  const load = createLibraryLoader(async () => {
    throw new Error('must not download');
  });
  const options = { fullName: 'demo@1', cdnPkgPath: pkg, CDN_DIR: root, GITHUB_TOKEN: 'test' };
  assert.equal((await load(options)).status, 503);
  assert.equal(await readFile(path.join(pkg, 'index.js'), 'utf8'), 'export default 1');
  assert.equal((await load({ ...options, cdnPkgPath: path.join(root, '..', 'outside') })).status, 403);
});

async function serve(t, options) {
  const { createApp } = await import('../src/app.ts');
  const app = createApp(options);
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  return { app, request: (url, headers) => fetch(`http://127.0.0.1:${server.address().port}${url}`, { headers }) };
}

test('unsupported npm packages send one 415 response without serving an entry', async (t) => {
  const { root } = await fixture(t);
  let served = false;
  const { request } = await serve(t, {
    cdnDir: root,
    githubToken: 'test',
    load: async () => ({ status: 415, message: 'Only ESM packages are supported' }),
    send: async () => {
      served = true;
      throw new Error('must not serve');
    },
  });
  assert.equal((await request('/common@1')).status, 415);
  assert.equal(served, false);
});

test('HTTP requests serve scoped nested exports and enforce CORS', async (t) => {
  const { root } = await fixture(t);
  const { createLibraryLoader } = await import('../src/utils.ts');
  const load = createLibraryLoader(async (name, destination, options) => {
    assert.equal(name, '@grasdouble/demo@1');
    assert.equal(options.registry, 'https://npm.pkg.github.com');
    await writeFile(
      path.join(destination, 'package.json'),
      JSON.stringify({ exports: { './feature/nested': './index.js' } })
    );
    await writeFile(path.join(destination, 'index.js'), 'export default 42');
  });
  const { request } = await serve(t, { cdnDir: root, githubToken: 'test', load });
  const response = await request('/grasdouble/demo@1/feature/nested');
  assert.equal(response.status, 200);
  assert.equal(await response.text(), 'export default 42');
  assert.equal((await request('/grasdouble/demo@1/missing')).status, 404);
  assert.equal(
    (await request('/grasdouble/demo@1/feature/nested', { Origin: 'https://untrusted.invalid' })).status,
    403
  );
});

test('HTTP errors do not disclose registry details', async (t) => {
  const { root } = await fixture(t);
  const { request } = await serve(t, {
    cdnDir: root,
    githubToken: 'test',
    load: async () => {
      throw new Error('secret-registry-token');
    },
  });
  const response = await request('/demo@1');
  assert.equal(response.status, 500);
  assert.doesNotMatch(await response.text(), /secret-registry-token/);
});

test('HTTP requests reject cached manifests pointing outside the package', async (t) => {
  const { root, pkg } = await fixture(t);
  await writeFile(path.join(pkg, '.lufa-complete'), '1');
  await writeFile(path.join(root, 'external.json'), JSON.stringify({ exports: './index.js' }));
  await rm(path.join(pkg, 'package.json'));
  await symlink(path.join(root, 'external.json'), path.join(pkg, 'package.json'));
  const { request } = await serve(t, { cdnDir: root, githubToken: 'test' });
  const response = await request('/demo@1');
  assert.equal(response.status, 403);
  assert.doesNotMatch(await response.text(), /export default|external\.json/);
});

test('forwarding headers cannot bypass limits or reset them via unblock-ip', async (t) => {
  const { root } = await fixture(t);
  const { app, request } = await serve(t, {
    cdnDir: root,
    githubToken: 'test',
    rateLimit: { limit: 1, windowMs: 1500 },
  });
  assert.equal(app.get('trust proxy'), false);
  assert.equal((await request('/unblock-ip', { 'X-Forwarded-For': '1.1.1.1' })).status, 404);
  assert.equal((await request('/unblock-ip', { 'X-Forwarded-For': '2.2.2.2' })).status, 429);
  assert.equal((await request('/unblock-ip')).status, 429);
  await new Promise((resolve) => setTimeout(resolve, 1600));
  assert.equal((await request('/unblock-ip')).status, 404);
});
