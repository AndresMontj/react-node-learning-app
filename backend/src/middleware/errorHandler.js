// Centralized error handler. Keep responses generic so stack traces and
// internal details never reach the client.
function errorHandler(err, req, res, _next) {
  console.error(err);

  if (res.headersSent) {
    return;
  }

  const status = err.status || 500;
  const message = status === 500 ? 'Internal server error' : err.message;

  res.status(status).json({ message });
}

function notFoundHandler(req, res) {
  res.status(404).json({ message: 'Not found' });
}

module.exports = { errorHandler, notFoundHandler };
