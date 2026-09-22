import os from 'node:os';
import path from 'node:path';
import type { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import express from 'express';

import { CorsError, corsOptions, getRateLimiter, noIndexMiddleware } from './security.js';
import { extractParams, loadLibrary, sendEntry } from './utils.js';

type AppOptions = {
  cdnDir: string;
  githubToken: string;
  trustProxy?: string[];
  rateLimit?: { limit?: number; windowMs?: number };
  load?: typeof loadLibrary;
  send?: typeof sendEntry;
};

export const createApp = ({
  cdnDir,
  githubToken,
  trustProxy,
  rateLimit,
  load = loadLibrary,
  send = sendEntry,
}: AppOptions): express.Application => {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', trustProxy?.length ? trustProxy : false);
  app.use(noIndexMiddleware);
  app.use(getRateLimiter(rateLimit));
  app.use(cors(corsOptions));

  app.get('{/:urlScope}/:urlName@:urlVersion{/*urlExportPath}', async (req: Request, res: Response) => {
    const param = (name: string) => {
      const value = req.params[name];
      return Array.isArray(value) ? value.join('/') : value;
    };
    const urlScope = param('urlScope');
    const urlName = param('urlName');
    const urlVersion = param('urlVersion');
    if (
      !urlName ||
      !/^[a-zA-Z0-9_-][a-zA-Z0-9._-]*$/.test(urlName) ||
      !urlVersion ||
      !/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(urlVersion) ||
      (urlScope && !/^@?[a-zA-Z0-9_-][a-zA-Z0-9._-]*$/.test(urlScope))
    ) {
      res.status(400).json({ error: 'Invalid package name or version' });
      return;
    }
    const params = extractParams({
      urlScope,
      urlName,
      urlVersion,
      urlExportPath: param('urlExportPath'),
      CDN_DIR: path.resolve(cdnDir),
      TMP_DIR: os.tmpdir(),
    });
    const result = await load({ ...params, CDN_DIR: path.resolve(cdnDir), GITHUB_TOKEN: githubToken });
    if (result.status !== 200) {
      res.status(result.status).json({ error: result.message });
      return;
    }
    const entry = await send(params);
    if (entry.status !== 200 || !entry.outputFile) {
      res.status(entry.status).json({ error: entry.message });
      return;
    }
    res.sendFile(entry.outputFile);
  });

  app.use((error: Error, _req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      next(error);
      return;
    }
    const status = error instanceof CorsError ? 403 : 500;
    res.status(status).json({ error: status === 403 ? 'Access denied by CORS policy' : 'Unable to serve package' });
  });
  return app;
};
