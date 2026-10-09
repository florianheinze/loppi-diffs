import { describe, expect, it } from 'vitest';
import { formatDate } from './formatDate';

describe('formatDate', () => {
  it('formats an ISO date', () => {
    expect(formatDate('2025-01-05T12:00:00.000Z')).toBe('Jan 5, 2025');
  });
});
