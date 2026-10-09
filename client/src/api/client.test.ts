import { describe, expect, it, vi } from 'vitest';
import { createApiClient } from './client';

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status });

describe('api client', () => {
  it('lists tasks', async () => {
    const fetchFn = vi.fn().mockResolvedValue(jsonResponse([{ id: '1' }]));
    const tasks = await createApiClient(fetchFn).list();
    expect(tasks).toEqual([{ id: '1' }]);
    expect(fetchFn.mock.calls[0][0]).toBe('/api/tasks');
  });

  it('serialises filters into the query string', async () => {
    const fetchFn = vi.fn().mockResolvedValue(jsonResponse([]));
    await createApiClient(fetchFn).list({ priority: 'high', search: '' });
    expect(fetchFn.mock.calls[0][0]).toBe('/api/tasks?priority=high');
  });

  it('sends the body when creating', async () => {
    const fetchFn = vi.fn().mockResolvedValue(jsonResponse({ id: '1' }, 201));
    await createApiClient(fetchFn).create({ title: 'A' });
    const init = fetchFn.mock.calls[0][1];
    expect(init.method).toBe('POST');
    expect(init.body).toBe(JSON.stringify({ title: 'A' }));
  });

  it('throws the server error message', async () => {
    const fetchFn = vi.fn().mockResolvedValue(jsonResponse({ error: { code: 'VALIDATION_ERROR', message: 'bad title' } }, 400));
    await expect(createApiClient(fetchFn).create({ title: '' })).rejects.toThrow('bad title');
  });

  it('handles 204 responses', async () => {
    const fetchFn = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    await expect(createApiClient(fetchFn).remove('1')).resolves.toBeUndefined();
  });
});
