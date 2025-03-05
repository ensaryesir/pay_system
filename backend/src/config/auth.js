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

// Simple in-memory token blacklist
// In a production app, this should be in Redis or another persistent store
const tokenBlacklist = new Set();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ userId: id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE
  });
};

// Verify JWT Token
const verifyToken = (token) => {
  try {
    // Check if token is blacklisted
    if (tokenBlacklist.has(token)) {
      console.log('Token is blacklisted');
      return null;
    }
    
    // Log token information for debugging (only partial token for security)
    const tokenPreview = token.substring(0, 15) + '...';
    //console.log(`Verifying token: ${tokenPreview}`);
    
    const decoded = jwt.verify(token, JWT_SECRET);
    //console.log('Token successfully verified:', {
    //  userId: decoded.userId || decoded.id,
    //  exp: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : 'undefined'
    //});
    
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', {
      name: error.name,
      message: error.message,
      token: token ? token.substring(0, 10) + '...' : 'undefined'
    });
    return null;
  }
};

// Invalidate a token by adding it to the blacklist
const invalidateToken = (token) => {
  if (token) {
    tokenBlacklist.add(token);
    console.log(`Token blacklisted: ${token.substring(0, 10)}...`);
    return true;
  }
  return false;
};

module.exports = {
  generateToken,
  verifyToken,
  invalidateToken,
  JWT_SECRET
};