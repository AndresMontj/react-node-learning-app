const request = require('supertest');
const app = require('../src/app');
const { uniqueUsername, VALID_PASSWORD } = require('./helpers/credentials');

async function registerAgent() {
  const agent = request.agent(app);
  const username = uniqueUsername();
  await agent.post('/api/auth/register').send({ username, password: VALID_PASSWORD });
  return agent;
}

describe('/api/todos authentication', () => {
  test('GET /api/todos without a session returns 401', async () => {
    const res = await request(app).get('/api/todos');
    expect(res.status).toBe(401);
  });

  test('POST /api/todos without a session returns 401', async () => {
    const res = await request(app).post('/api/todos').send({ text: 'Buy milk' });
    expect(res.status).toBe(401);
  });
});

describe('/api/todos CRUD', () => {
  test('starts empty for a newly registered user', async () => {
    const agent = await registerAgent();
    const res = await agent.get('/api/todos');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('creates a todo and returns it', async () => {
    const agent = await registerAgent();

    const res = await agent.post('/api/todos').send({ text: 'Buy milk' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      id: expect.any(Number),
      userId: expect.any(Number),
      text: 'Buy milk',
      completed: false,
    });
  });

  test('rejects creating a todo with empty text', async () => {
    const agent = await registerAgent();
    const res = await agent.post('/api/todos').send({ text: '   ' });
    expect(res.status).toBe(400);
  });

  test('lists todos created by the authenticated user', async () => {
    const agent = await registerAgent();
    await agent.post('/api/todos').send({ text: 'First' });
    await agent.post('/api/todos').send({ text: 'Second' });

    const res = await agent.get('/api/todos');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body.map((t) => t.text)).toEqual(['First', 'Second']);
  });

  test('updates a todo (e.g. toggling completed)', async () => {
    const agent = await registerAgent();
    const created = await agent.post('/api/todos').send({ text: 'Read a book' });

    const res = await agent.put(`/api/todos/${created.body.id}`).send({ completed: true });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: created.body.id, completed: true, text: 'Read a book' });
  });

  test('returns 404 when updating a nonexistent todo', async () => {
    const agent = await registerAgent();
    const res = await agent.put('/api/todos/999999').send({ completed: true });
    expect(res.status).toBe(404);
  });

  test('returns 400 when updating with an invalid id', async () => {
    const agent = await registerAgent();
    const res = await agent.put('/api/todos/not-a-number').send({ completed: true });
    expect(res.status).toBe(400);
  });

  test('deletes a todo', async () => {
    const agent = await registerAgent();
    const created = await agent.post('/api/todos').send({ text: 'Temporary' });

    const deleteRes = await agent.delete(`/api/todos/${created.body.id}`);
    expect(deleteRes.status).toBe(200);

    const listRes = await agent.get('/api/todos');
    expect(listRes.body).toEqual([]);
  });

  test('returns 404 when deleting a nonexistent todo', async () => {
    const agent = await registerAgent();
    const res = await agent.delete('/api/todos/999999');
    expect(res.status).toBe(404);
  });
});

describe('/api/todos per-user isolation', () => {
  test('users cannot see, update, or delete each other\'s todos', async () => {
    const agentA = await registerAgent();
    const agentB = await registerAgent();

    const createdByA = await agentA.post('/api/todos').send({ text: "A's private todo" });
    await agentB.post('/api/todos').send({ text: "B's own todo" });

    const bTodos = await agentB.get('/api/todos');
    expect(bTodos.body).toHaveLength(1);
    expect(bTodos.body.map((t) => t.text)).not.toContain("A's private todo");

    const updateAttempt = await agentB.put(`/api/todos/${createdByA.body.id}`).send({ completed: true });
    expect(updateAttempt.status).toBe(404);

    const deleteAttempt = await agentB.delete(`/api/todos/${createdByA.body.id}`);
    expect(deleteAttempt.status).toBe(404);

    const aTodos = await agentA.get('/api/todos');
    expect(aTodos.body).toHaveLength(1);
    expect(aTodos.body[0].completed).toBe(false);
  });
});
