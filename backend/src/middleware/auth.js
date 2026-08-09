const { verifyToken } = require('../utils/jwt');
const { COOKIE_NAME } = require('../config/authConfig');
const { findUserById } = require('../data/store');

function requireAuth(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const payload = verifyToken(token);
    const user = findUserById(payload.sub);

    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    req.user = { id: user.id, username: user.username };
    next();
  } catch {
    return res.status(401).json({ message: 'Authentication required' });
  }
}

module.exports = { requireAuth };
