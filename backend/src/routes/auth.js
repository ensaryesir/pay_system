const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, isSuperUser } = require('../middleware/auth');
const { generateToken, invalidateToken } = require('../config/auth');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'Bu e-posta adresi ile kayıtlı bir kullanıcı bulunmaktadır.' 
      });
    }

    // Create new user
    const user = new User({
      email,
      password,
      name
    });

    await user.save();

    // Generate JWT token using the common function
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Kullanıcı başarıyla kaydedildi',
      token,
      user: {
        id: user._id,
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Kayıt işlemi başarısız oldu. Lütfen tekrar deneyiniz.' 
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Geçersiz e-posta veya şifre. Lütfen bilgilerinizi kontrol ediniz.' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Geçersiz e-posta veya şifre. Lütfen bilgilerinizi kontrol ediniz.' 
      });
    }

    // Generate JWT token using the common function
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Giriş başarılı',
      token,
      user: {
        id: user._id,
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Giriş başarısız oldu. Lütfen tekrar deneyiniz.' 
    });
  }
});

// Get all users - Only available to superusers
router.get('/users', isSuperUser, async (req, res) => {
  try {
    // Fetch all users
    const users = await User.find().select('-password');
    
    res.json({
      success: true,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Kullanıcı bilgileri getirilemedi'
    });
  }
});

// Update user role - Only available to superusers
router.patch('/users/:userId/role', isSuperUser, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validate role
    if (!['user', 'admin', 'superuser'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz kullanıcı rolü'
      });
    }

    // Check if this is the last superuser
    if (role !== 'superuser') {
      // First, find the user we're trying to modify
      const targetUser = await User.findById(userId);
      
      // If the target user is currently a superuser
      if (targetUser && targetUser.role === 'superuser') {
        // Count total superusers in the system
        const superuserCount = await User.countDocuments({ role: 'superuser' });
        
        // If this is the last superuser, prevent downgrade
        if (superuserCount <= 1) {
          return res.status(403).json({
            success: false,
            message: 'Son süper yöneticinin rolü değiştirilemez. En az bir süper yönetici olmalıdır.'
          });
        }
      }
    }

    // Find and update user
    const user = await User.findByIdAndUpdate(
      userId, 
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    res.json({
      success: true,
      message: 'Kullanıcı rolü başarıyla güncellendi',
      user
    });
  } catch (error) {
    console.error('Role update error:', error);
    res.status(500).json({
      success: false,
      message: 'Kullanıcı rolü güncellenemedi'
    });
  }
});

// Update user profile - Authenticated users can update their own profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    // Update name if provided
    if (name) {
      user.name = name;
    }

    // Update password if provided
    if (newPassword) {
      // Verify current password
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Şifre değişikliği için mevcut şifrenizi girmelisiniz'
        });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Mevcut şifreniz yanlış'
        });
      }

      // Set new password
      user.password = newPassword;
    }

    // Save updated user
    await user.save();

    res.json({
      success: true,
      message: 'Profil bilgileriniz başarıyla güncellendi',
      user: {
        id: user._id,
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Profil güncellenemedi. Lütfen tekrar deneyiniz.'
    });
  }
});

// Debug route to check token
router.get('/check-token', protect, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Token is valid',
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    console.error('Check token error:', error);
    res.status(500).json({
      success: false,
      message: 'Token check failed'
    });
  }
});

// Logout route to invalidate token
router.post('/logout', async (req, res) => {
  try {
    let token;
    
    // Extract token from request
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.body.token) {
      token = req.body.token;
    }
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    // Invalidate the token
    invalidateToken(token);
    
    res.status(200).json({
      success: true,
      message: 'Successfully logged out'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during logout'
    });
  }
});

module.exports = router;