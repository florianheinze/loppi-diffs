import { describe, expect, it } from 'vitest';
import { isBeforeToday } from './dates';

const now = new Date('2025-06-15T14:30:00.000Z');

describe('isBeforeToday', () => {
  it('is true for earlier days', () => {
    expect(isBeforeToday('2025-06-14T23:59:59.000Z', now)).toBe(true);
  });

  it('is false for earlier hours of the same day', () => {
    expect(isBeforeToday('2025-06-15T00:00:00.000Z', now)).toBe(false);
  });

  it('is false for future days', () => {
    expect(isBeforeToday('2025-06-16T00:00:00.000Z', now)).toBe(false);
  });
});
