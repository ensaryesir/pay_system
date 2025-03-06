const { verifyToken } = require('../config/auth');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    // Log auth headers for debugging
    //console.log('Auth headers:', req.headers.authorization ? `${req.headers.authorization.substring(0, 20)}...` : 'none');

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      console.log('No token found in request');
      return res.status(401).json({
        success: false,
        message: 'Lütfen giriş yapınız'
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      console.log('Token verification failed');
      return res.status(401).json({
        success: false,
        message: 'Oturum süreniz dolmuştur, lütfen tekrar giriş yapınız'
      });
    }

    // Get user from token (using userId from token payload)
    const userId = decoded.userId || decoded.id;
    if (!userId) {
      console.log('No userId in decoded token:', decoded);
      return res.status(401).json({
        success: false,
        message: 'Geçersiz token, lütfen tekrar giriş yapınız'
      });
    }

    req.user = await User.findById(userId).select('-password');
    
    if (!req.user) {
      console.log(`User not found with ID: ${userId}`);
      return res.status(401).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    //console.log(`User authenticated: ${req.user.name} (${req.user.role})`);
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({
      success: false,
      message: 'Lütfen tekrar giriş yapınız'
    });
  }
};

const isSuperUser = (req, res, next) => {
  // First ensure user is authenticated by using protect as middleware
  protect(req, res, (err) => {
    if (err) return next(err);
    
    // Check if user has superuser role
    if (req.user && req.user.role === 'superuser') {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: 'Bu sayfaya erişim izniniz bulunmamaktadır'
      });
    }
  });
};

const isAdminOrSuperUser = (req, res, next) => {
  // First ensure user is authenticated by using protect as middleware
  protect(req, res, (err) => {
    if (err) return next(err);
    
    // Check if user has admin or superuser role
    if (req.user && (req.user.role === 'admin' || req.user.role === 'superuser')) {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: 'Bu sayfaya erişim izniniz bulunmamaktadır'
      });
    }
  });
};

module.exports = {
  protect,
  isSuperUser,
  isAdminOrSuperUser
};