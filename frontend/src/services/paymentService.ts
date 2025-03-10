import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Interface for payment data
export interface PaymentData {
  donationType: string;
  amount: string;
  isCorporate: boolean;
  institutionName?: string;
  name: string;
  surname: string;
  email: string;
  donateForSomeone: boolean;
  recipientName?: string;
  recipientSurname?: string;
  deductionDay?: number;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

// Interface for payment response
export interface PaymentResponse {
  success: boolean;
  message: string;
  transactionId?: string;
}

/**
 * Process a payment
 * @param paymentData - The payment data from the form
 * @returns Promise with payment response
 */
export const processPayment = async (paymentData: PaymentData): Promise<PaymentResponse> => {
  try {
    const response = await axios.post(`${API_URL}/payments`, paymentData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Return the error message from the server
      return error.response.data as PaymentResponse;
    } else {
      // Generic error handling
      return {
        success: false,
        message: 'Ödeme işlemi sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
      };
    }
  }
};

/**
 * Cancel a recurring payment
 * @param paymentId - The ID of the payment to cancel
 * @param token - Authentication token
 * @returns Promise with cancellation response
 */
export const cancelRecurringPayment = async (paymentId: string, token: string): Promise<PaymentResponse> => {
  try {
    const response = await axios.post(
      `${API_URL}/payments/${paymentId}/cancel`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as PaymentResponse;
    } else {
      return {
        success: false,
        message: 'Abonelik iptali sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
      };
    }
  }
};

/**
 * Get all payments (admin only)
 * @param token - Authentication token
 * @returns Promise with payments data
 */
export const getAllPayments = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/payments`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      return {
        success: false,
        message: 'Bağış kayıtları alınırken bir hata oluştu'
      };
    }
  }
};

/**
 * Get payment by ID (admin only)
 * @param paymentId - The ID of the payment to retrieve
 * @param token - Authentication token
 * @returns Promise with payment data
 */
export const getPaymentById = async (paymentId: string, token: string) => {
  try {
    const response = await axios.get(`${API_URL}/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      return {
        success: false,
        message: 'Bağış kaydı alınırken bir hata oluştu'
      };
    }
  }
};