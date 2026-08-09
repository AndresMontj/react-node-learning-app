const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { isProduction } = require('./config/authConfig');

// In production there is no safe default: an unset FRONTEND_URL would either
// break CORS entirely or (worse) fall back to a value an operator didn't
// intend. Fail fast instead of silently misconfiguring the allow-list.
const FRONTEND_URL = process.env.FRONTEND_URL || (isProduction ? null : 'http://localhost:5173');
if (!FRONTEND_URL) {
  throw new Error(
    'FRONTEND_URL environment variable is required in production for CORS configuration.'
  );
}

const app = express();

// Trust the first hop reverse proxy (Render, Railway, Fly.io, Heroku, Nginx,
// etc.) so req.ip / X-Forwarded-For reflect the real client IP. Without this,
// every request behind the proxy resolves to the same IP, which breaks
// rate-limiting (all users share one bucket) and IP-based logging.
app.set('trust proxy', 1);

// Security headers (also disables the X-Powered-By header).
app.use(helmet());

// Restrict CORS to the known frontend origin and allow cookies to be sent.
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(compression());

// Request logging: concise dev output locally, Apache-style combined logs in
// production; silenced entirely during automated tests.
app.use(
  morgan(isProduction ? 'combined' : 'dev', {
    skip: () => process.env.NODE_ENV === 'test',
  })
);

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Health check for uptime monitoring / platform health probes. Exempt from
// the rate limiter below so frequent automated checks never get throttled.
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Generous global rate limit as a baseline abuse guard; auth routes apply
// their own stricter limiter on top of this. Configurable via RATE_LIMIT_MAX
// so automated tests aren't constrained by production-sized limits.
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: Number(process.env.RATE_LIMIT_MAX) || 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get('/', (req, res) => {
  res.send('Node.js Backend API is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
