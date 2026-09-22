import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const format = process.argv[2];
if (!['esm', 'cjs'].includes(format)) throw new Error('Usage: node build.mjs <esm|cjs>');

// Bundled CommonJS dependencies still use require and __dirname in the ESM entry.
const esmBanner = [
  "import { createRequire } from 'node:module';",
  "import { dirname } from 'node:path';",
  "import { fileURLToPath as fileURLToPathFromBanner } from 'node:url';",
  'const require = createRequire(import.meta.url);',
  'const __dirname = dirname(fileURLToPathFromBanner(import.meta.url));',
].join('\n');

await build({
  absWorkingDir: fileURLToPath(new URL('.', import.meta.url)),
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: `dist/index.${format === 'esm' ? 'mjs' : 'cjs'}`,
  platform: 'node',
  format,
  banner: format === 'esm' ? { js: esmBanner } : undefined,
  logLevel: 'info',
});
