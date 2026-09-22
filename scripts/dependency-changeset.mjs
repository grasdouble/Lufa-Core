import { execFileSync } from 'node:child_process';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

export const affectedPackages = (files, packages) =>
  packages
    .filter((pkg) => files.some((file) => file.startsWith(`${pkg.directory}/`)))
    .map((pkg) => pkg.name)
    .sort();

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const gitFiles = (args) => execFileSync('git', args, { encoding: 'utf8' }).split('\0').filter(Boolean);
  const manifests = gitFiles(['ls-files', '-z', 'packages/**/package.json']);
  const packages = await Promise.all(
    manifests.map(async (file) => ({
      directory: path.dirname(file),
      name: JSON.parse(await readFile(file, 'utf8')).name,
    }))
  );
  const changed = affectedPackages(gitFiles(['diff', '--name-only', '-z', 'HEAD', '--', 'packages/']), packages);
  const covered = new Set();
  for (const file of await readdir('.changeset')) {
    if (!file.endsWith('.md') || file === 'README.md') continue;
    const content = await readFile(path.join('.changeset', file), 'utf8');
    const frontmatter = content.split('---')[1] ?? '';
    for (const match of frontmatter.matchAll(/^["']?(@[^"':\s]+)["']?:\s*(?:patch|minor|major)/gm))
      covered.add(match[1]);
  }
  const missing = changed.filter((name) => !covered.has(name));
  if (missing.length) {
    // A stable filename makes repeated runs idempotent; a PR is rebuilt from its base each run.
    let file = '.changeset/update-core-dependencies.md';
    const existing = new Set(await readdir('.changeset'));
    for (let i = 2; existing.has(path.basename(file)); i++) file = `.changeset/update-core-dependencies-${i}.md`;
    await writeFile(
      file,
      `---\n${missing.map((name) => `"${name}": patch`).join('\n')}\n---\n\nchore: update dependencies and synchronize shared agent rules.\n`
    );
  }
}
