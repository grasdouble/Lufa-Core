import console from 'node:console';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

export async function validateDocs(root) {
  const errors = [];
  const read = async (file) => {
    try {
      return await readFile(path.join(root, file), 'utf8');
    } catch {
      errors.push(`Missing required file: ${file}`);
      return '';
    }
  };
  const agents = await read('AGENTS.md');
  const shared = await read('packages/config/agents/AGENTS.shared.md');
  const readme = await read('README.md');
  const tools = await read('.tool-versions');
  const manifest = await read('package.json');
  const begin = '<!-- BEGIN:AGENTS.shared -->';
  const end = '<!-- END:AGENTS.shared -->';
  const start = agents.indexOf(begin);
  const finish = agents.indexOf(end, start + begin.length);
  const embedded =
    start >= 0 && finish > start
      ? agents
          .slice(start + begin.length, finish)
          .replace(/^\s*<!-- source:[^\n]*-->\s*/, '')
          .trim()
      : '';
  if (!embedded || embedded !== shared.trim())
    errors.push('AGENTS.md shared rules are out of sync; run pnpm sync:agents');
  try {
    const pkg = JSON.parse(manifest);
    const pnpm = tools.match(/^pnpm\s+(\S+)/m)?.[1];
    if (pkg.packageManager !== `pnpm@${pnpm}`)
      errors.push('pnpm versions differ between package.json and .tool-versions');
  } catch {
    errors.push('Invalid package.json');
  }
  for (const [file, content] of [
    ['README.md', readme],
    ['AGENTS.md', agents],
  ]) {
    const prose = content.replace(/```[\s\S]*?```/g, '');
    for (const match of prose.matchAll(/\]\(([^)]+)\)/g)) {
      const link = match[1].split('#')[0];
      if (!link || /^[a-z]+:|^\//i.test(link)) continue;
      try {
        await access(path.resolve(root, path.dirname(file), decodeURIComponent(link)));
      } catch {
        errors.push(`Broken link in ${file}: ${link}`);
      }
    }
  }
  return errors;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const errors = await validateDocs(process.cwd());
  errors.forEach((error) => console.error(error));
  if (errors.length) process.exitCode = 1;
  else console.log('Core documentation checks passed');
}
