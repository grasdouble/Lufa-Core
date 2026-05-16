import type { CorsOptions } from 'cors';
import type { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';

// List of allowed domains
export const whitelist: string[] = ['https://sebastien-lemouillour.fr', 'https://www.sebastien-lemouillour.fr'];

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
    if (!origin) {
      // Deny requests without an origin
      callback(new CorsError('Access denied: Missing Origin header'));
    } else if (whitelist.includes(origin)) {
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

// Middleware to block requests from blocked IPs
export const ipBlockMiddleware =
  (blockedIPs: Set<string>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const clientIP = req.headers['x-forwarded-for']?.toString() ?? req.ip ?? 'unknown';
    if (blockedIPs.has(clientIP)) {
      res.status(403).json({ error: `Your IP ${clientIP} is blocked due to excessive requests.` });
      return;
    }
    next();
  };

// Rate limiter configuration
export const getRateLimiter = (blockedIPs: Set<string>) =>
  rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 1000, // Allow 1000 requests per 10 minutes
    keyGenerator: (req: Request) => req.ip ?? req.socket.remoteAddress ?? 'unknown',
    handler: (req: Request, res: Response) => {
      const clientIP = req.ip ?? req.socket.remoteAddress;

      if (clientIP) {
        blockedIPs.add(clientIP); // Block the IP after exceeding the rate limit
      }

      res.status(429).json({ error: `Too many requests. Your IP ${clientIP} has been temporarily blocked.` });
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });

// Middleware to unblock IPs periodically (optional, for automatic cleanup)
export const unblockIPsAfterTimeout = (blockedIPs: Set<string>) => {
  const unblockTimeout = 15 * 60 * 1000; // 15 minutes block duration
  setInterval(() => {
    blockedIPs.clear();
  }, unblockTimeout);
};
