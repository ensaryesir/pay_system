const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const { protect } = require('../middleware/auth');

// Payment gateway configuration - to be replaced with actual bank integration
const paymentGatewayConfig = {
  // This will be replaced with actual bank API credentials
  apiUrl: process.env.PAYMENT_GATEWAY_API_URL || 'https://api.example-payment-gateway.com',
  merchantId: process.env.PAYMENT_GATEWAY_MERCHANT_ID,
  apiKey: process.env.PAYMENT_GATEWAY_API_KEY,
  secretKey: process.env.PAYMENT_GATEWAY_SECRET_KEY
};

/**
 * Process a payment
 * POST /api/payments
 * Public route - no authentication required for donations
 */
router.post('/', async (req, res) => {
  try {
    const {
      donationType,
      amount,
      isCorporate,
      institutionName,
      name,
      surname,
      email,
      donateForSomeone,
      recipientName,
      recipientSurname,
      deductionDay,
      cardNumber,
      expiryDate,
      cvv
    } = req.body;

    // Basic validation
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Geçerli bir bağış miktarı gereklidir' });
    }

    if (!name || !surname || !email) {
      return res.status(400).json({ success: false, message: 'Ad, soyad ve e-posta alanları gereklidir' });
    }

    // Validate card information
    if (!cardNumber || !expiryDate || !cvv) {
      return res.status(400).json({ success: false, message: 'Kart bilgileri eksik veya geçersiz' });
    }

    // Format card data for processing
    const formattedCardNumber = cardNumber.replace(/\s/g, '');
    const [expiryMonth, expiryYear] = expiryDate.split('/');

    // In a real implementation, this would be sent to the payment gateway
    // For now, we'll simulate a payment gateway response
    
    // Simulated payment processing
    // In production, this would be replaced with actual API calls to the bank's payment gateway
    const paymentResult = await simulatePaymentGateway({
      amount: parseFloat(amount),
      cardNumber: formattedCardNumber,
      expiryMonth,
      expiryYear,
      cvv,
      donationType,
      name: `${name} ${surname}`,
      email
    });

    if (!paymentResult.success) {
      return res.status(400).json({
        success: false,
        message: paymentResult.message || 'Ödeme işlemi başarısız oldu'
      });
    }

    // Create payment record in database (without sensitive card details)
    const payment = new Payment({
      donationType,
      amount: parseFloat(amount),
      isCorporate: isCorporate || false,
      name: `${name} ${surname}`,
      email,
      donateForSomeone: donateForSomeone || false,
      recipientName: donateForSomeone ? recipientName : '',
      recipientSurname: donateForSomeone ? recipientSurname : '',
      deductionDay: donationType === 'monthly' ? deductionDay : null,
      // Store payment gateway transaction ID for reference
      transactionId: paymentResult.transactionId
    });

    // If corporate donation, add institution name
    if (isCorporate && institutionName) {
      payment.institutionName = institutionName;
    }

    await payment.save();

    return res.status(200).json({
      success: true,
      message: 'Bağış işleminiz başarıyla tamamlandı',
      transactionId: paymentResult.transactionId
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    return res.status(500).json({
      success: false,
      message: 'Ödeme işlemi sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
    });
  }
});

/**
 * Get all payments (admin only)
 * GET /api/payments
 * Private route - requires authentication
 */
router.get('/', protect, async (req, res) => {
  try {
    // Check if user is admin or superuser
    if (req.user.role !== 'admin' && req.user.role !== 'superuser') {
      return res.status(403).json({
        success: false,
        message: 'Bu işlem için yetkiniz bulunmamaktadır'
      });
    }

    const payments = await Payment.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      payments
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return res.status(500).json({
      success: false,
      message: 'Bağış kayıtları alınırken bir hata oluştu'
    });
  }
});

/**
 * Get payment by ID (admin only)
 * GET /api/payments/:id
 * Private route - requires authentication
 */
router.get('/:id', protect, async (req, res) => {
  try {
    // Check if user is admin or superuser
    if (req.user.role !== 'admin' && req.user.role !== 'superuser') {
      return res.status(403).json({
        success: false,
        message: 'Bu işlem için yetkiniz bulunmamaktadır'
      });
    }

    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Bağış kaydı bulunamadı'
      });
    }

    return res.status(200).json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('Error fetching payment:', error);
    return res.status(500).json({
      success: false,
      message: 'Bağış kaydı alınırken bir hata oluştu'
    });
  }
});

/**
 * Cancel a recurring payment (authenticated user or admin)
 * POST /api/payments/:id/cancel
 * Private route - requires authentication
 */
router.post('/:id/cancel', protect, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Bağış kaydı bulunamadı'
      });
    }

    // Check if user is authorized to cancel this payment
    // Only the user who made the payment or an admin can cancel
    const isAdmin = req.user.role === 'admin' || req.user.role === 'superuser';
    const isPaymentOwner = payment.email === req.user.email;
    
    if (!isAdmin && !isPaymentOwner) {
      return res.status(403).json({
        success: false,
        message: 'Bu işlem için yetkiniz bulunmamaktadır'
      });
    }

    // Only monthly payments can be cancelled
    if (payment.donationType !== 'monthly') {
      return res.status(400).json({
        success: false,
        message: 'Sadece aylık düzenli bağışlar iptal edilebilir'
      });
    }

    // In a real implementation, this would call the payment gateway to cancel the subscription
    // For now, we'll simulate a cancellation
    const cancellationResult = await simulateCancelSubscription(payment.transactionId);

    if (!cancellationResult.success) {
      return res.status(400).json({
        success: false,
        message: cancellationResult.message || 'Abonelik iptali başarısız oldu'
      });
    }

    // Update payment status in database
    payment.status = 'cancelled';
    payment.cancelledAt = new Date();
    await payment.save();

    return res.status(200).json({
      success: true,
      message: 'Düzenli bağışınız başarıyla iptal edildi'
    });
  } catch (error) {
    console.error('Error cancelling payment:', error);
    return res.status(500).json({
      success: false,
      message: 'Bağış iptali sırasında bir hata oluştu'
    });
  }
});

// Simulate payment gateway API call
// This function will be replaced with actual payment gateway integration
async function simulatePaymentGateway(paymentData) {
  // In a real implementation, this would make an API call to the payment gateway
  // For now, we'll simulate a successful payment most of the time
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate card validation
  const cardNumber = paymentData.cardNumber;
  
  // Basic Luhn algorithm check for card number validation
  if (!isValidCreditCard(cardNumber)) {
    return {
      success: false,
      message: 'Geçersiz kredi kartı numarası'
    };
  }
  
  // Simulate random success/failure (90% success rate)
  const isSuccessful = Math.random() < 0.9;
  
  if (isSuccessful) {
    return {
      success: true,
      transactionId: 'tr_' + Math.random().toString(36).substr(2, 9),
      message: 'Ödeme başarıyla gerçekleşti'
    };
  } else {
    return {
      success: false,
      message: 'Ödeme işlemi banka tarafından reddedildi. Lütfen kart bilgilerinizi kontrol edin.'
    };
  }
}

// Simulate subscription cancellation
async function simulateCancelSubscription(transactionId) {
  // In a real implementation, this would make an API call to the payment gateway
  // For now, we'll simulate a successful cancellation
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simulate random success/failure (95% success rate)
  const isSuccessful = Math.random() < 0.95;
  
  if (isSuccessful) {
    return {
      success: true,
      message: 'Abonelik başarıyla iptal edildi'
    };
  } else {
    return {
      success: false,
      message: 'Abonelik iptali sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
    };
  }
}

// Credit card validation using Luhn algorithm
function isValidCreditCard(cardNumber) {
  // Remove all non-digit characters
  cardNumber = cardNumber.replace(/\D/g, '');
  
  // Check if the card number is of valid length
  if (cardNumber.length < 13 || cardNumber.length > 19) {
    return false;
  }
  
  // Luhn algorithm
  let sum = 0;
  let shouldDouble = false;
  
  // Loop through values starting from the rightmost digit
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return (sum % 10) === 0;
}

module.exports = router;