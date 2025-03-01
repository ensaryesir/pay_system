const { verifyToken } = require('../config/auth');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Lütfen giriş yapınız'
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Oturum süreniz dolmuştur, lütfen tekrar giriş yapınız'
      });
    }

    // Get user from token
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Lütfen tekrar giriş yapınız'
    });
  }
};

module.exports = { protect };