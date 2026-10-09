import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../app';
import { TaskRepository } from '../repositories/taskRepository';

const UNKNOWN_ID = '00000000-0000-4000-8000-000000000000';

describe('/api/tasks', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    app = createApp(new TaskRepository());
  });

  it('starts empty', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('creates and fetches a task', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'Buy milk', priority: 'high' });
    expect(created.status).toBe(201);
    expect(created.body.priority).toBe('high');

    const fetched = await request(app).get(`/api/tasks/${created.body.id}`);
    expect(fetched.body.title).toBe('Buy milk');
  });

  it('rejects an empty title with a structured error', async () => {
    const res = await request(app).post('/api/tasks').send({ title: '' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects an unknown priority', async () => {
    const res = await request(app).post('/api/tasks').send({ title: 'A', priority: 'urgent' });
    expect(res.status).toBe(400);
  });

  it('updates the status', async () => {
    const { body } = await request(app).post('/api/tasks').send({ title: 'A' });
    const res = await request(app).patch(`/api/tasks/${body.id}`).send({ status: 'doing' });
    expect(res.body.status).toBe('doing');
  });

  it('filters by query parameters', async () => {
    await request(app).post('/api/tasks').send({ title: 'Important', priority: 'high' });
    await request(app).post('/api/tasks').send({ title: 'Meh', priority: 'low' });
    const res = await request(app).get('/api/tasks').query({ priority: 'high' });
    expect(res.body.map((t: { title: string }) => t.title)).toEqual(['Important']);
  });

  it('returns 404 for unknown tasks', async () => {
    const res = await request(app).get(`/api/tasks/${UNKNOWN_ID}`);
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('returns 400 for malformed ids', async () => {
    const res = await request(app).get('/api/tasks/nope');
    expect(res.status).toBe(400);
  });

  it('deletes a task', async () => {
    const { body } = await request(app).post('/api/tasks').send({ title: 'A' });
    const res = await request(app).delete(`/api/tasks/${body.id}`);
    expect(res.status).toBe(204);
  });
});

describe('/api/stats', () => {
  it('reports counts', async () => {
    const app = createApp(new TaskRepository());
    await request(app).post('/api/tasks').send({ title: 'A', priority: 'high' });
    const res = await request(app).get('/api/stats');
    expect(res.body.total).toBe(1);
    expect(res.body.byPriority.high).toBe(1);
  });
});
