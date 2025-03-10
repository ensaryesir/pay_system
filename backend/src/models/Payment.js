const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  donationType: {
    type: String,
    required: true,
    enum: ['one-time', 'monthly']
  },
  amount: {
    type: Number,
    required: true
  },
  isCorporate: {
    type: Boolean,
    default: false
  },
  institutionName: {
    type: String,
    required: function() {
      return this.isCorporate;
    }
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  donateForSomeone: {
    type: Boolean,
    default: false
  },
  recipientName: {
    type: String,
    required: function() {
      return this.donateForSomeone;
    }
  },
  recipientSurname: {
    type: String,
    required: function() {
      return this.donateForSomeone;
    }
  },
  deductionDay: {
    type: Number,
    min: 1,
    max: 28,
    required: function() {
      return this.donationType === 'monthly';
    }
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'failed', 'completed'],
    default: 'active'
  },
  transactionId: {
    type: String,
    sparse: true
  },
  cancelledAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('Payment', paymentSchema);