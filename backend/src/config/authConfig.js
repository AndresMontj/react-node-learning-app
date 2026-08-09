const COOKIE_NAME = 'auth_token';
const isProduction = process.env.NODE_ENV === 'production';

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax',
  maxAge: 60 * 60 * 1000, // 1 hour, matches JWT expiry
  path: '/',
};

module.exports = { COOKIE_NAME, cookieOptions, isProduction };
