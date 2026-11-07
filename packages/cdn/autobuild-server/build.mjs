import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const format = process.argv[2];
if (!['esm', 'cjs'].includes(format)) throw new Error('Usage: node build.mjs <esm|cjs>');

// Bundled CommonJS dependencies still use require, __dirname and __filename in the ESM entry.
const esmBanner = [
  "import { createRequire } from 'node:module';",
  "import { dirname } from 'node:path';",
  "import { fileURLToPath as fileURLToPathFromBanner } from 'node:url';",
  'const require = createRequire(import.meta.url);',
  'const __filename = fileURLToPathFromBanner(import.meta.url);',
  'const __dirname = dirname(__filename);',
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
