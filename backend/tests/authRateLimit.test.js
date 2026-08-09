const request = require('supertest');
const { uniqueUsername, VALID_PASSWORD } = require('./helpers/credentials');

describe('auth rate limiting', () => {
  const originalLimit = process.env.AUTH_RATE_LIMIT_MAX;
  let app;

  beforeAll(() => {
    // Rebuild the app with a very low auth rate limit so the limiter's
    // blocking behavior can be verified without sending hundreds of requests.
    process.env.AUTH_RATE_LIMIT_MAX = '2';
    jest.resetModules();
    // eslint-disable-next-line global-require
    app = require('../src/app');
  });

  afterAll(() => {
    process.env.AUTH_RATE_LIMIT_MAX = originalLimit;
    jest.resetModules();
  });

  test('blocks login attempts once the limit is exceeded', async () => {
    const agent = request.agent(app);
    const attempt = () =>
      agent.post('/api/auth/login').send({ username: uniqueUsername('nouser'), password: VALID_PASSWORD });

    const first = await attempt();
    const second = await attempt();
    const third = await attempt();

    expect(first.status).toBe(401);
    expect(second.status).toBe(401);
    expect(third.status).toBe(429);
    expect(third.body.message).toMatch(/too many attempts/i);
  });
});
