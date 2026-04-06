#!/usr/bin/env node
/**
 * list-packages.mjs
 * Scans a monorepo and outputs all packages grouped by category as a markdown table.
 *
 * Usage:
 *   node list-packages.mjs [--root <project-root>] [--packages-root <packages-dir>] [--project-name <name>]
 *
 * Options:
 *   --root            Absolute or relative path to the project root (default: cwd)
 *   --packages-root   Name of the packages directory relative to root (default: packages)
 *   --project-name    Project name used in the output header (default: read from root package.json)
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, relative } from 'path';

// ---------------------------------------------------------------------------
// CLI args (minimal parser, no dependencies)
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = { root: null, packagesRoot: 'packages', projectName: null };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--root' && argv[i + 1]) args.root = argv[++i];
    else if (argv[i] === '--packages-root' && argv[i + 1]) args.packagesRoot = argv[++i];
    else if (argv[i] === '--project-name' && argv[i + 1]) args.projectName = argv[++i];
    // Legacy positional arg: first non-flag argument is the project root
    else if (!argv[i].startsWith('--') && !args.root) args.root = argv[i];
  }
  return args;
}

const args = parseArgs(process.argv);
const projectRoot = args.root ? new URL(args.root, `file://${process.cwd()}/`).pathname : process.cwd();
const packagesDir = join(projectRoot, args.packagesRoot);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readPackageJson(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

function detectCategory(filePath) {
  const rel = relative(projectRoot, filePath);
  const parts = rel.split('/');
  // If under packagesRoot: category = first segment after packagesRoot
  if (parts[0] === args.packagesRoot) return parts[1] || 'root';
  return 'root';
}

const _SKIP_DIRS = new Set(['node_modules', 'dist', '.git', 'coverage', '__pycache__', '.cache']);

function findPackageJsonFiles(dir, results = []) {
  if (!existsSync(dir)) return results;
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (_SKIP_DIRS.has(entry.name)) continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      findPackageJsonFiles(fullPath, results);
    } else if (entry.name === 'package.json') {
      results.push(fullPath);
    }
  }
  return results;
}

// ---------------------------------------------------------------------------
// Collect packages
// ---------------------------------------------------------------------------

const packages = [];

// Root package.json
const rootPkg = readPackageJson(join(projectRoot, 'package.json'));
const projectName = args.projectName || rootPkg?.name || 'Monorepo';

if (rootPkg?.name) {
  packages.push({ category: 'root', name: rootPkg.name, version: rootPkg.version || '—', path: '.' });
}

// Sub-packages under packagesRoot
for (const filePath of findPackageJsonFiles(packagesDir)) {
  const pkg = readPackageJson(filePath);
  if (!pkg?.name) continue;
  const category = detectCategory(filePath);
  const relPath = relative(projectRoot, filePath).replace('/package.json', '');
  packages.push({ category, name: pkg.name, version: pkg.version || '—', path: relPath });
}

// ---------------------------------------------------------------------------
// Group and sort
// ---------------------------------------------------------------------------

const grouped = {};
for (const pkg of packages) {
  if (!grouped[pkg.category]) grouped[pkg.category] = [];
  grouped[pkg.category].push(pkg);
}

// Derive category order: 'root' first, then alphabetical
const categoryOrder = ['root', ...Object.keys(grouped).filter(c => c !== 'root').sort()];

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

const totalPackages = packages.length;
const totalCategories = Object.keys(grouped).length;

console.log(`# ${projectName} — Packages\n`);

for (const cat of categoryOrder) {
  const group = grouped[cat];
  if (!group || group.length === 0) continue;

  const label = cat.charAt(0).toUpperCase() + cat.slice(1);
  console.log(`## ${label}\n`);
  console.log('| Package | Version | Path |');
  console.log('|---------|---------|------|');
  for (const pkg of group.sort((a, b) => a.name.localeCompare(b.name))) {
    console.log(`| \`${pkg.name}\` | \`${pkg.version}\` | \`${pkg.path}\` |`);
  }
  console.log('');
}

console.log(`---\n_${totalPackages} packages in ${totalCategories} categories._`);
