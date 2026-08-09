const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_TTL = '1h';

if (!JWT_SECRET) {
  // Fail fast: never allow the server to run with an undefined/empty secret,
  // which would make tokens trivially forgeable.
  throw new Error(
    'JWT_SECRET environment variable is required. Set it in backend/.env'
  );
}

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_TTL });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { signToken, verifyToken, TOKEN_TTL };
