import os from 'os';
import path from 'path';
import type { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import express from 'express';
import fs from 'fs-extra';

import '@dotenvx/dotenvx/config';

import type { ExtractedParams, LoadLibraryResult, PackageJson } from './types.js';
import type { ExtractParamsProps } from './utils.js';
import { CorsError, corsOptions, getRateLimiter, ipBlockMiddleware, unblockIPsAfterTimeout } from './security.js';
import { extractParams, loadLibrary, sendEntry } from './utils.js';

const app: express.Application = express();
// Enable trust proxy to get proper IPs behind proxies
app.set('trust proxy', true);

// TMP and CDN directories
const PORT = process.env.PORT ?? 3000;
const TMP_DIR = process.env.TMP_DIR ?? path.join(os.tmpdir(), 'tmp_cdn');
const CDN_DIR = process.env.CDN_DIR ?? path.join(os.tmpdir(), 'cdn');
if (!process.env.GITHUB_TOKEN) {
  throw new Error('Environment variable GITHUB_TOKEN is required but not defined.');
}
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Blocked IPs storage
const blockedIPs = new Set<string>();
const limiter = getRateLimiter(blockedIPs);

// Route to unblock the IP of the user making the request
app.get('/unblock-ip', (req: Request, res: Response): void => {
  const clientIP = req.ip ?? req.socket.remoteAddress;

  if (clientIP && blockedIPs.has(clientIP)) {
    // Delete the IP from the blocked IP list
    blockedIPs.delete(clientIP);

    // Reset the Limit races counter for this IP
    limiter.resetKey(clientIP);

    res.status(200).json({ message: `Your IP (${clientIP}) has been unblocked and rate limits have been reset.` });
    return;
  }
  res.status(400).json({ error: 'Your IP is not blocked.' });
  return;
});

unblockIPsAfterTimeout(blockedIPs);

app.use(ipBlockMiddleware(blockedIPs)); // Apply IP blocking middleware
app.use(limiter); // Apply rate limiting middleware
app.use(cors(corsOptions)); // Apply CORS middleware

// Middleware to handle CORS errors
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof CorsError) {
    res.status(403).json({ error: err.message });
  } else {
    next(err);
  }
});

app.get(['{/:urlScope}/:urlName@:urlVersion{/:urlExportPath}'], async (req: Request, res: Response): Promise<void> => {
  const { scope, exportPath, fullName, tmpPkgPath, cdnPkgPath }: ExtractedParams = extractParams({
    ...req.params,
    CDN_DIR,
    TMP_DIR,
  } as ExtractParamsProps);

  // Confirm that the path is not outside the CDN_DIR
  // and that it is not an absolute path
  // This is a security measure to prevent path traversal attacks
  // and to ensure that the package is being extracted in the correct directory
  if (path.relative(CDN_DIR, cdnPkgPath).startsWith('..') || path.isAbsolute(path.relative(CDN_DIR, cdnPkgPath))) {
    res.status(403).send('Forbidden');
    return;
  }

  const pkgJsonPath = path.resolve(cdnPkgPath, 'package.json');
  const tmpPkgJsonPath = path.resolve(tmpPkgPath, 'package.json');

  if (!pkgJsonPath || !fs.existsSync(pkgJsonPath)) {
    console.log(`Package ${fullName} not yet in the cdn.`);

    if (tmpPkgJsonPath && fs.existsSync(tmpPkgJsonPath)) {
      const pkgJson: PackageJson = await fs.readJson(tmpPkgJsonPath);
      if (pkgJson.type !== 'module') {
        console.log(`Package ${fullName} is not in ESM format. Skip it`);
        res.status(415).send(`⚠ We can't manage ${fullName} ⚠<br/> The CDN can manage only ESM packages.`);
        return;
      }
    }

    const loadResult: LoadLibraryResult = await loadLibrary({
      scope,
      fullName,
      tmpPkgPath,
      cdnPkgPath,
      TMP_DIR,
      CDN_DIR,
      GITHUB_TOKEN,
    });

    // Check if the load was successful from npm or github
    if (loadResult.status !== 200) {
      console.log(`❌ Error loading package ${fullName}:`, loadResult.message);
      res.status(loadResult.status).send(loadResult.message);
      return;
    }

    // An extra step is needed for packages not in the @grasdouble scope
    // we want to ensure that package is built in ESM format
    // and that the entry point is correct
    if (scope !== '@grasdouble') {
      console.log(`Start to check if the package ${fullName} is in ESM format...`);
      const pkgJson: PackageJson = await fs.readJson(path.join(tmpPkgPath, 'package.json'));
      if (pkgJson.type !== 'module') {
        console.log(`Package ${fullName} is not in ESM format. Skip it`);
        res.status(415).send(`⚠ We can't manage ${fullName} ⚠<br/> The CDN can manage only ESM packages.`);
      } else {
        console.log(`Package ${fullName} is already in ESM format.`);
        console.log(`Copying package.json to the CDN...`);
        await fs.copy(path.resolve(tmpPkgPath), path.resolve(cdnPkgPath));
      }
    }
  }

  // Starting from this point, we assume that the package is already in the CDN
  // and we just need to serve it
  console.log(`Package ${fullName} is in the CDN. Serving...`);
  const result = await sendEntry({
    cdnPkgPath,
    exportPath,
    fullName,
  });
  if (result.status !== 200) {
    res.status(result.status).send(result.message);
    return;
  }

  if (result.outputFile) {
    console.log(`Serving file ${result.outputFile}...`);
    if (!fs.existsSync(result.outputFile)) {
      // Need to wait a bit for the file to be created
      // This is a workaround for the fact that the file may not be created yet
      setTimeout(() => {
        res.status(200).sendFile(result.outputFile);
      }, 500);
    } else {
      res.status(200).sendFile(result.outputFile);
    }
  } else {
    res.status(500).send('Error: No output file found, although one was expected.');
  }
  return;
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log('TMP_DIR: ', TMP_DIR);
  console.log('CDN_DIR: ', CDN_DIR);
});
