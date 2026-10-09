import { describe, expect, it } from 'vitest';
import { validateTask } from './validateTask';

describe('validateTask', () => {
  it('accepts a valid task', () => {
    expect(validateTask({ title: 'Ship it' })).toEqual({});
  });

  it('requires a title', () => {
    expect(validateTask({ title: '   ' }).title).toBe('Title is required');
  });

  it('rejects overly long titles', () => {
    expect(validateTask({ title: 'x'.repeat(81) }).title).toMatch(/at most 80/);
  });

  it('rejects invalid dates', () => {
    expect(validateTask({ title: 'A', dueDate: 'soon' }).dueDate).toBe('Invalid date');
  });
});
