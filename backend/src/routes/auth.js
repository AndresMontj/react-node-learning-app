const express = require('express');
const bcrypt = require('bcryptjs');
const { z } = require('zod');
const rateLimit = require('express-rate-limit');

const { signToken } = require('../utils/jwt');
const { COOKIE_NAME, cookieOptions } = require('../config/authConfig');
const { requireAuth } = require('../middleware/auth');
const { createUser, findUserByUsername } = require('../data/store');

const router = express.Router();

const SALT_ROUNDS = 12;

const credentialsSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(32, 'Username must be at most 32 characters')
    .regex(/^[a-zA-Z0-9_.-]+$/, 'Username has invalid characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long'),
});

// Strict limiter on auth endpoints to slow down brute-force / credential
// stuffing attempts. Keyed by IP (express-rate-limit default).
// Configurable via AUTH_RATE_LIMIT_MAX so automated tests can exercise the
// limiter behavior without needing to send real production-sized traffic.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: Number(process.env.AUTH_RATE_LIMIT_MAX) || 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts, please try again later' },
});

function issueSession(res, user) {
  const token = signToken({ sub: user.id, username: user.username });
  res.cookie(COOKIE_NAME, token, cookieOptions);
}

router.post('/register', authLimiter, async (req, res, next) => {
  try {
    const parsed = credentialsSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0].message });
    }

    const { username, password } = parsed.data;

    if (findUserByUsername(username)) {
      // Generic message: don't confirm which usernames already exist.
      return res.status(409).json({ message: 'Unable to register with those credentials' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = createUser({ username, passwordHash });

    issueSession(res, user);
    res.status(201).json({ id: user.id, username: user.username });
  } catch (err) {
    next(err);
  }
});

router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const parsed = credentialsSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const { username, password } = parsed.data;
    const user = findUserByUsername(username);

    // Always run bcrypt.compare (even with a dummy hash) to keep response
    // timing consistent whether or not the username exists.
    const passwordHash = user?.passwordHash || '$2a$12$invalidsaltinvalidsaltinvalidsaltinvalidsaltinva';
    const isMatch = await bcrypt.compare(password, passwordHash);

    if (!user || !isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    issueSession(res, user);
    res.json({ id: user.id, username: user.username });
  } catch (err) {
    next(err);
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: undefined });
  res.status(204).end();
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ id: req.user.id, username: req.user.username });
});

module.exports = router;
