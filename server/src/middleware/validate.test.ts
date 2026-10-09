import type { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { ValidationError } from '../utils/errors';
import { validate } from './validate';

const schema = z.object({ title: z.string().min(1) });

function run(body: unknown) {
  const req = { body } as Request;
  const next = vi.fn();
  validate(schema)(req, {} as Response, next);
  return { req, next };
}

describe('validate middleware', () => {
  it('passes valid bodies through', () => {
    const { next } = run({ title: 'ok' });
    expect(next).toHaveBeenCalledWith();
  });

  it('forwards a 400 ValidationError for invalid bodies', () => {
    const { next } = run({ title: '' });
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(ValidationError);
    expect(err.status).toBe(400);
    expect(err.code).toBe('VALIDATION_ERROR');
  });

  it('treats a missing body as an empty object', () => {
    const { next } = run(undefined);
    expect(next.mock.calls[0][0].message).toContain('title');
  });

  it('replaces body with the parsed result', () => {
    const { req } = run({ title: 'ok', extra: 1 });
    expect(req.body).toEqual({ title: 'ok' });
  });
});
