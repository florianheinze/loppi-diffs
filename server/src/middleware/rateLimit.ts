import type { RequestHandler } from 'express';
import { AppError } from '../utils/errors';

interface Options {
  windowMs: number;
  max: number;
  now?: () => number;
}

export function rateLimit({ windowMs, max, now = Date.now }: Options): RequestHandler {
  const hits = new Map<string, { count: number; resetAt: number }>();

  return (req, res, next) => {
    const key = req.ip ?? 'unknown';
    const t = now();
    let entry = hits.get(key);
    if (!entry || entry.resetAt <= t) {
      entry = { count: 0, resetAt: t + windowMs };
      hits.set(key, entry);
    }
    entry.count++;

    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - entry.count));
    if (entry.count > max) return next(new AppError(429, 'Too many requests', 'RATE_LIMITED'));
    next();
  };
}
