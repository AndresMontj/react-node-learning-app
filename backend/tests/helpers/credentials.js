let counter = 0;

// Each test gets a unique username so tests can run in any order/repeatedly
// against the same in-memory store without colliding on "already registered"
// conflicts.
function uniqueUsername(prefix = 'user') {
  counter += 1;
  return `${prefix}_${Date.now()}_${counter}`;
}

const VALID_PASSWORD = 'CorrectHorse1';

module.exports = { uniqueUsername, VALID_PASSWORD };
