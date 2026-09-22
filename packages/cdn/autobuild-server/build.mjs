import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const format = process.argv[2];
if (!['esm', 'cjs'].includes(format)) throw new Error('Usage: node build.mjs <esm|cjs>');

await build({
  absWorkingDir: fileURLToPath(new URL('.', import.meta.url)),
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: `dist/index.${format === 'esm' ? 'mjs' : 'cjs'}`,
  platform: 'node',
  format,
  packages: 'external',
  logLevel: 'info',
});
