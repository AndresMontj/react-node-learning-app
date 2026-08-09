const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const app = express();

// Security headers (also disables the X-Powered-By header).
app.use(helmet());

// Restrict CORS to the known frontend origin and allow cookies to be sent.
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

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
