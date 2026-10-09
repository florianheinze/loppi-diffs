import type { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { rateLimit } from './rateLimit';

function hit(limiter: ReturnType<typeof rateLimit>, ip = '1.1.1.1') {
  const next = vi.fn();
  const res = { setHeader: vi.fn() } as unknown as Response;
  limiter({ ip } as Request, res, next);
  return next.mock.calls[0][0];
}

describe('rateLimit', () => {
  it('allows requests up to the limit', () => {
    const limiter = rateLimit({ windowMs: 1000, max: 2 });
    expect(hit(limiter)).toBeUndefined();
    expect(hit(limiter)).toBeUndefined();
  });

  it('blocks with 429 once the limit is exceeded', () => {
    const limiter = rateLimit({ windowMs: 1000, max: 1 });
    hit(limiter);
    const err = hit(limiter);
    expect(err.status).toBe(429);
    expect(err.code).toBe('RATE_LIMITED');
  });

  it('tracks clients separately', () => {
    const limiter = rateLimit({ windowMs: 1000, max: 1 });
    hit(limiter, 'a');
    expect(hit(limiter, 'b')).toBeUndefined();
  });

  it('resets after the window', () => {
    let time = 0;
    const limiter = rateLimit({ windowMs: 1000, max: 1, now: () => time });
    hit(limiter);
    time = 1001;
    expect(hit(limiter)).toBeUndefined();
  });
});
