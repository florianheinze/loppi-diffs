import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../app';
import { TaskRepository } from '../repositories/taskRepository';
import { TaskService } from '../services/taskService';

describe('/api/tasks', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    app = createApp(new TaskService(new TaskRepository()));
  });

  it('starts empty', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('creates and fetches a task', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'Buy milk' });
    expect(created.status).toBe(201);

    const fetched = await request(app).get(`/api/tasks/${created.body.id}`);
    expect(fetched.body.title).toBe('Buy milk');
  });

  it('rejects an empty title', async () => {
    const res = await request(app).post('/api/tasks').send({ title: '' });
    expect(res.status).toBe(400);
  });

  it('updates the status', async () => {
    const { body } = await request(app).post('/api/tasks').send({ title: 'A' });
    const res = await request(app).patch(`/api/tasks/${body.id}`).send({ status: 'done' });
    expect(res.body.status).toBe('done');
  });

  it('returns 404 for unknown tasks', async () => {
    const res = await request(app).get('/api/tasks/nope');
    expect(res.status).toBe(404);
  });

  it('deletes a task', async () => {
    const { body } = await request(app).post('/api/tasks').send({ title: 'A' });
    const res = await request(app).delete(`/api/tasks/${body.id}`);
    expect(res.status).toBe(204);
  });
});
