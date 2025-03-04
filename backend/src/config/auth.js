const jwt = require('jsonwebtoken');

// JWT token expiration time is set in environment variables (.env file)
// You can modify JWT_EXPIRE in your .env file. Example values:
// JWT_EXPIRE="24h" (24 hours)
// JWT_EXPIRE="7d" (7 days)
// JWT_EXPIRE="30d" (30 days)
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE;

if (!JWT_SECRET || !JWT_EXPIRE) {
  throw new Error('JWT_SECRET and JWT_EXPIRE must be defined in environment variables');
}

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE
  });
};

// Verify JWT Token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
  JWT_SECRET
};