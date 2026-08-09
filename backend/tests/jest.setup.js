// Runs before each test file's module registry is set up. The app (and the
// jwt utility in particular) requires these env vars to be present at
// require-time, and rate limits are relaxed so normal functional tests
// aren't throttled by production-sized limits.
process.env.JWT_SECRET = 'test-only-secret-do-not-use-in-production';
process.env.FRONTEND_URL = 'http://localhost:5173';
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.AUTH_RATE_LIMIT_MAX = process.env.AUTH_RATE_LIMIT_MAX || '1000';
process.env.RATE_LIMIT_MAX = process.env.RATE_LIMIT_MAX || '1000';
