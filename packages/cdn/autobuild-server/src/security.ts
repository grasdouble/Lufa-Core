import type { CorsOptions } from 'cors';
import type { NextFunction, Request, Response } from 'express';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

// List of allowed domains
export const whitelist: string[] = [
  'https://sebastien-lemouillour.fr',
  'https://www.sebastien-lemouillour.fr',
  'http://localhost:5173',
];

// Define a custom error for stricter typing
export class CorsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CorsError';
  }
}

// CORS configuration options
export const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void): void => {
    const isLocalhostOrigin = /^http:\/\/localhost(?::\d+)?$/.test(origin ?? '');

    if (!origin) {
      // Some asset fetches (depending on browser/request mode) may not include Origin.
      // Allowing them keeps public CDN asset loading functional.
      callback(null, true);
    } else if (whitelist.includes(origin) || isLocalhostOrigin) {
      // Allow access if the origin is in the whitelist
      callback(null, true);
    } else {
      // Deny access if the origin is not in the whitelist
      callback(new CorsError('Access denied by CORS policy'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};

// The limiter owns expiration; no public reset endpoint or second blocklist.
export const getRateLimiter = (options: { limit?: number; windowMs?: number } = {}) =>
  rateLimit({
    windowMs: options.windowMs ?? 10 * 60 * 1000,
    limit: options.limit ?? 1000,
    keyGenerator: (req: Request) => ipKeyGenerator(req.ip ?? req.socket.remoteAddress ?? 'unknown'),
    handler: (_req: Request, res: Response) => {
      res.status(429).json({ error: 'Too many requests. Retry after the rate limit window expires.' });
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

// Middleware to prevent search engine indexing
export const noIndexMiddleware = (_req: Request, res: Response, next: NextFunction): void => {
  res.setHeader('X-Robots-Tag', 'noindex');
  next();
};
