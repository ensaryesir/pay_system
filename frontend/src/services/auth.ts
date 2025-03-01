import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  message?: string;
}

export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Kayıt işlemi başarısız oldu'
    };
  }
};

export const login = async (userData: LoginData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, userData);
    if (response.data.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Giriş başarısız'
    };
  }
};

export const logout = (): void => {
  localStorage.removeItem('token');
};

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};