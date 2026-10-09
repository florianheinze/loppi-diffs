import { describe, expect, it } from 'vitest';
import { validateTask } from './validateTask';

const now = new Date('2025-06-15T12:00:00.000Z');

describe('validateTask', () => {
  it('accepts a valid task', () => {
    expect(validateTask({ title: 'Ship it' }, now)).toEqual({});
  });

  it('rejects titles shorter than 3 characters', () => {
    expect(validateTask({ title: '  a ' }, now).title).toMatch(/at least 3/);
  });

  it('rejects overly long titles', () => {
    expect(validateTask({ title: 'x'.repeat(81) }, now).title).toMatch(/at most 80/);
  });

  it('rejects invalid dates', () => {
    expect(validateTask({ title: 'Abc', dueDate: 'soon' }, now).dueDate).toBe('Invalid date');
  });

  it('rejects due dates in the past but allows today', () => {
    expect(validateTask({ title: 'Abc', dueDate: '2025-06-14T00:00:00.000Z' }, now).dueDate).toMatch(/past/);
    expect(validateTask({ title: 'Abc', dueDate: '2025-06-15T00:00:00.000Z' }, now).dueDate).toBeUndefined();
  });

  it('limits the number of tags', () => {
    expect(validateTask({ title: 'Abc', tags: ['1', '2', '3', '4', '5', '6'] }, now).tags).toMatch(/At most 5/);
  });
});
