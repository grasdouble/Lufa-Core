/**
 * sync-import-maps.mjs
 *
 * Reads all import map JSON files in src/, parses the CDN URLs to extract
 * the package name and version, then compares against the installed version
 * in node_modules and updates mismatches.
 *
 * No configuration needed — adding a new lib to an import map is enough.
 *
 * Usage:
 *   node scripts/sync-import-maps.mjs          # dry-run (preview changes)
 *   node scripts/sync-import-maps.mjs --write  # apply changes to disk
 *
 * Run after a dependency upgrade:
 *   pnpm sync:importmaps
 */

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const PKG_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const WORKSPACE_ROOT = resolve(PKG_ROOT, '../../../..');
const WRITE = process.argv.includes('--write');

// --- Version resolution ---

/**
 * Candidate node_modules locations, in resolution order.
 * Covers local package, workspace root, and sibling packages (pnpm workspaces).
 */
const NODE_MODULES_ROOTS = [
  resolve(PKG_ROOT, 'node_modules'),
  resolve(WORKSPACE_ROOT, 'node_modules'),
  ...readdirSync(resolve(PKG_ROOT, '..'), { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => resolve(PKG_ROOT, '..', d.name, 'node_modules')),
];

const versionCache = new Map();

const resolveInstalledVersion = (pkgName) => {
  if (versionCache.has(pkgName)) return versionCache.get(pkgName);

  for (const root of NODE_MODULES_ROOTS) {
    try {
      const version = JSON.parse(readFileSync(resolve(root, pkgName, 'package.json'), 'utf8')).version;
      versionCache.set(pkgName, version);
      return version;
    } catch {
      // not in this location — try next
    }
  }

  return null; // package not installed locally (e.g. external CDN-only dep)
};

// --- URL parsing ---

/**
 * Parses a CDN URL of the form:
 *   https://cdn.example.com/(@scope/pkg|pkg)@VERSION[/path]
 *
 * Returns { pkgName, currentVersion, urlPrefix, urlSuffix } or null if the
 * URL does not match the expected pattern (e.g. relative paths).
 */
const parseCdnUrl = (url) => {
  const match = url.match(/^(https?:\/\/[^/]+\/)(.+?)@([0-9][^/]*)(\/.*)?$/);
  if (!match) return null;

  const [, base, pkgName, currentVersion, urlSuffix = ''] = match;
  return { pkgName, currentVersion, urlPrefix: `${base}${pkgName}@`, urlSuffix };
};

// --- Sync logic ---

const IMPORT_MAPS_DIR = resolve(PKG_ROOT, 'src');
const importMapFiles = readdirSync(IMPORT_MAPS_DIR).filter((f) => f.startsWith('importMap') && f.endsWith('.json'));

let hasChanges = false;

for (const fileName of importMapFiles) {
  const absPath = resolve(IMPORT_MAPS_DIR, fileName);
  const importMap = JSON.parse(readFileSync(absPath, 'utf8'));
  let fileChanged = false;

  for (const [key, url] of Object.entries(importMap.imports ?? {})) {
    const parsed = parseCdnUrl(url);
    if (!parsed) continue;

    const { pkgName, currentVersion, urlPrefix, urlSuffix } = parsed;
    const installedVersion = resolveInstalledVersion(pkgName);

    if (!installedVersion || installedVersion === currentVersion) continue;

    importMap.imports[key] = `${urlPrefix}${installedVersion}${urlSuffix}`;
    fileChanged = true;
    hasChanges = true;
    console.log(`  src/${fileName}`);
    console.log(`    ${key} (${pkgName}): ${currentVersion} → ${installedVersion}`);
  }

  if (fileChanged && WRITE) {
    writeFileSync(absPath, JSON.stringify(importMap, null, 2) + '\n', 'utf8');
  }
}

if (!hasChanges) {
  console.log('✅ All import maps are already up to date.');
} else if (WRITE) {
  console.log('\n✅ Import maps updated.');
} else {
  console.log('\n⚠️  Run with --write to apply changes.');
}
