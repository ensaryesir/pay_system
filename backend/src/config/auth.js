const jwt = require('jsonwebtoken');

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