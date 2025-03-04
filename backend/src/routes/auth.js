const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Bu e-posta adresi ile kayıtlı bir kullanıcı bulunmaktadır.' });
    }

    // Create new user
    const user = new User({
      email,
      password,
      name
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Kullanıcı başarıyla kaydedildi',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Kayıt işlemi başarısız oldu. Lütfen tekrar deneyiniz.' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  console.log('Login request received:', { email: req.body.email, timestamp: new Date().toISOString() });

  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    console.log('User lookup result:', { found: !!user, email });

    if (!user) {
      console.log('Login failed: User not found', { email });
      return res.status(401).json({ message: 'Geçersiz e-posta veya şifre. Lütfen bilgilerinizi kontrol ediniz.' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    console.log('Password verification:', { email, isMatch });

    if (!isMatch) {
      console.log('Login failed: Invalid password', { email });
      return res.status(401).json({ message: 'Geçersiz e-posta veya şifre. Lütfen bilgilerinizi kontrol ediniz.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful:', { email, userId: user._id });

    res.json({
      success: true,
      message: 'Giriş başarılı',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
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

module.exports = router;