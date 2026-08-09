const request = require('supertest');
const app = require('../src/app');
const { uniqueUsername, VALID_PASSWORD } = require('./helpers/credentials');

describe('POST /api/auth/register', () => {
  test('registers a new user and sets an httpOnly session cookie', async () => {
    const username = uniqueUsername();

    const res = await request(app)
      .post('/api/auth/register')
      .send({ username, password: VALID_PASSWORD });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: expect.any(Number), username });

    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    const authCookie = cookies.find((c) => c.startsWith('auth_token='));
    expect(authCookie).toBeDefined();
    expect(authCookie).toMatch(/HttpOnly/i);
  });

  test('rejects registering a username that already exists', async () => {
    const username = uniqueUsername();
    await request(app).post('/api/auth/register').send({ username, password: VALID_PASSWORD });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ username, password: VALID_PASSWORD });

    expect(res.status).toBe(409);
    expect(res.body.message).toBeTruthy();
  });

  test.each([
    ['username too short', { username: 'ab', password: VALID_PASSWORD }],
    ['username has invalid characters', { username: 'bad user!', password: VALID_PASSWORD }],
    ['password too short', { username: uniqueUsername(), password: 'short1' }],
    ['missing password', { username: uniqueUsername() }],
  ])('rejects invalid payload: %s', async (_label, payload) => {
    const res = await request(app).post('/api/auth/register').send(payload);
    expect(res.status).toBe(400);
    expect(res.body.message).toBeTruthy();
  });
});

describe('POST /api/auth/login', () => {
  async function registerUser() {
    const username = uniqueUsername();
    await request(app).post('/api/auth/register').send({ username, password: VALID_PASSWORD });
    return username;
  }

  test('logs in with correct credentials and sets a session cookie', async () => {
    const username = await registerUser();

    const res = await request(app)
      .post('/api/auth/login')
      .send({ username, password: VALID_PASSWORD });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: expect.any(Number), username });
    expect(res.headers['set-cookie']?.[0]).toMatch(/^auth_token=/);
  });

  test('rejects an incorrect password with a generic message', async () => {
    const username = await registerUser();

    const res = await request(app)
      .post('/api/auth/login')
      .send({ username, password: 'WrongPassword1' });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });

  test('rejects a nonexistent username with the same generic message (no user enumeration)', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: uniqueUsername('ghost'), password: VALID_PASSWORD });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });
});

describe('GET /api/auth/me', () => {
  test('returns the current user when authenticated', async () => {
    const agent = request.agent(app);
    const username = uniqueUsername();
    await agent.post('/api/auth/register').send({ username, password: VALID_PASSWORD });

    const res = await agent.get('/api/auth/me');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: expect.any(Number), username });
  });

  test('returns 401 when no session cookie is present', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  test('returns 401 with a garbage/forged cookie', async () => {
    const res = await request(app).get('/api/auth/me').set('Cookie', ['auth_token=not-a-real-jwt']);
    expect(res.status).toBe(401);
  });
});

describe('POST /api/auth/logout', () => {
  test('clears the session so subsequent /me calls are unauthenticated', async () => {
    const agent = request.agent(app);
    const username = uniqueUsername();
    await agent.post('/api/auth/register').send({ username, password: VALID_PASSWORD });

    const logoutRes = await agent.post('/api/auth/logout');
    expect(logoutRes.status).toBe(204);

    const meRes = await agent.get('/api/auth/me');
    expect(meRes.status).toBe(401);
  });
});
