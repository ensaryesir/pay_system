require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth routes
app.use('/api/auth', authRoutes);

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Payment System API' });
});

// Payment routes
app.post('/api/payments', async (req, res) => {
  try {
    const paymentData = req.body;
    // TODO: Implement payment processing logic
    res.status(201).json({ message: 'Payment processed successfully', data: paymentData });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ message: 'Payment processing failed' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});