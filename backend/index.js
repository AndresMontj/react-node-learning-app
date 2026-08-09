require('dotenv').config();

const app = require('./src/app');

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown: stop accepting new connections and let in-flight
// requests finish before exiting, so deploys/restarts don't drop requests.
function shutdown(signal) {
  console.log(`${signal} received: closing server gracefully`);
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });

  // Safety net in case some connection never closes.
  setTimeout(() => process.exit(1), 10000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
