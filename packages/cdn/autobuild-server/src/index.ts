import os from 'node:os';
import path from 'node:path';
import { config as dotenvxConfig } from '@dotenvx/dotenvx';

import { createApp } from './app.js';

const environment = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenvxConfig({ path: [environment, '.env'], override: false, quiet: true });
const githubToken = process.env.GITHUB_TOKEN;
if (!githubToken) throw new Error('Environment variable GITHUB_TOKEN is required.');
const port = Number(process.env.PORT ?? 3000);
if (!Number.isInteger(port) || port < 0 || port > 65535)
  throw new Error('PORT must be an integer between 0 and 65535.');
const trustProxy = process.env.TRUSTED_PROXIES?.split(',')
  .map((proxy) => proxy.trim())
  .filter(Boolean);
const app = createApp({
  cdnDir: process.env.CDN_DIR ?? path.join(os.tmpdir(), 'cdn-v2'),
  githubToken,
  trustProxy,
});
const server = app.listen(port, () => {
  const address = server.address();
  console.log(`CDN listening on port ${typeof address === 'object' && address ? address.port : port}`);
});
