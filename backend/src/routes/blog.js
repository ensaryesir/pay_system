const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { protect, isAdminOrSuperUser } = require('../middleware/auth');
const upload = require('../config/upload');
const multer = require('multer');

// Get all blogs - Public
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .populate('author', 'name');

    res.json({
      success: true,
      blogs
    });
  } catch (error) {
    console.error('Blog fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Haberler getirilemedi'
    });
  }
});

// Get a single blog by ID - Public
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name');
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Haber bulunamadı'
      });
    }

    res.json({
      success: true,
      blog
    });
  } catch (error) {
    console.error('Blog fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Haber getirilemedi'
    });
  }
});

// Upload image - Admin only
router.post('/upload', protect, isAdminOrSuperUser, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        // Multer hatası (dosya boyutu vb.)
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'Dosya boyutu çok büyük. Maksimum 5MB olmalıdır.'
          });
        }
        return res.status(400).json({
          success: false,
          message: `Yükleme hatası: ${err.message}`
        });
      } else {
        // Diğer hatalar (dosya tipi vb.)
        return res.status(400).json({
          success: false,
          message: err.message || 'Dosya yüklenirken bir hata oluştu'
        });
      }
    }

    // Dosya yüklenmemişse
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Lütfen bir resim dosyası seçin'
      });
    }

    // Dosya yolu oluştur - /api olmadan
    const imageUrl = `/uploads/${req.file.filename}`;

    res.json({
      success: true,
      imageUrl
    });
  });
});

// Create new blog - Admin only
router.post('/', protect, isAdminOrSuperUser, async (req, res) => {
  try {
    const { title, content, image, tags } = req.body;

    const blog = await Blog.create({
      title,
      content,
      image,
      tags,
      author: req.user._id
    });

    res.status(201).json({
      success: true,
      blog
    });
  } catch (error) {
    console.error('Blog creation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Haber oluşturulamadı'
    });
  }
});

// Update blog - Admin only
router.put('/:id', protect, isAdminOrSuperUser, async (req, res) => {
  try {
    const { title, content, image, tags } = req.body;
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content, image, tags },
      { new: true, runValidators: true }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Haber bulunamadı'
      });
    }

    res.json({
      success: true,
      blog
    });
  } catch (error) {
    console.error('Blog update error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Haber güncellenemedi'
    });
  }
});

// Delete blog - Admin only
router.delete('/:id', protect, isAdminOrSuperUser, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Haber bulunamadı'
      });
    }

    res.json({
      success: true,
      message: 'Haber başarıyla silindi'
    });
  } catch (error) {
    console.error('Blog deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Haber silinemedi'
    });
  }
});

module.exports = router; 