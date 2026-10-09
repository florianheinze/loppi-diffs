import { describe, expect, it } from 'vitest';
import { formatDate, formatDueLabel } from './formatDate';

describe('formatDate', () => {
  it('formats an ISO date', () => {
    expect(formatDate('2025-01-05T12:00:00.000Z')).toBe('Jan 5, 2025');
  });

  it('returns a dash for invalid input', () => {
    expect(formatDate('not a date')).toBe('—');
  });
});

describe('formatDueLabel', () => {
  const now = new Date('2025-06-15T12:00:00.000Z');

  it('labels today and tomorrow', () => {
    expect(formatDueLabel('2025-06-15T18:00:00.000Z', now)).toBe('Today');
    expect(formatDueLabel('2025-06-16T18:00:00.000Z', now)).toBe('Tomorrow');
  });

  it('labels overdue dates', () => {
    expect(formatDueLabel('2025-06-14T06:00:00.000Z', now)).toBe('Yesterday');
    expect(formatDueLabel('2025-06-10T12:00:00.000Z', now)).toBe('5 days overdue');
  });

  it('falls back to a formatted date for later dates', () => {
    expect(formatDueLabel('2025-07-01T12:00:00.000Z', now)).toBe('Jul 1, 2025');
  });
});
