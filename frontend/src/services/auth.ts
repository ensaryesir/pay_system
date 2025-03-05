import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Debug log to check API URL
console.log('Using API URL:', API_URL);

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  message?: string;
  user?: {
    name: string;
    email: string;
    role: string;
  };
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface UsersResponse {
  success: boolean;
  users?: User[];
  message?: string;
}

interface UserRoleUpdateResponse {
  success: boolean;
  message?: string;
  user?: User;
}

// Normal log for non-error cases
const logInfo = (message: string, data?: any) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(message, data || '');
  }
};

// Error logging for actual errors
const logError = (message: string, error: any) => {
  // Only log errors in development
  if (process.env.NODE_ENV !== 'production') {
    console.error(message, error);
  }
};

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
    
    // Use logInfo instead of logError for successful responses
    if (response.data.success) {
      logInfo('Login successful:', {
        user: response.data.user ? {
          name: response.data.user.name,
          role: response.data.user.role
        } : 'No user data'
      });
    }
    
    if (response.data.success && response.data.token) {
      // Store token based on rememberMe preference
      if (userData.rememberMe) {
        // If rememberMe is true, store in localStorage for persistent login
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        logInfo('Authentication data stored in localStorage (persistent)');
      } else {
        // If rememberMe is false or undefined, only use sessionStorage
        // This will be cleared when the browser is closed
        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
        logInfo('Authentication data stored in sessionStorage (session only)');
      }
      
      // Set the default Authorization header for all future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    
    return response.data;
  } catch (error: any) {
    logError('Login error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Giriş başarısız'
    };
  }
};

/**
 * Completely logs out the user by removing all authentication data
 * from both localStorage and sessionStorage and invalidating the token on the server.
 */
export const logout = async (): Promise<void> => {
  try {
    const token = getToken();
    
    if (token) {
      // Call the logout API to invalidate token on server
      await axios.post(`${API_URL}/auth/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  } catch (error) {
    // Even if server logout fails, continue with client-side logout
    if (process.env.NODE_ENV !== 'production') {
      console.error('Logout API error:', error);
    }
  } finally {
    // Remove from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Remove from sessionStorage
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    
    // Clear any other potential auth-related items
    localStorage.removeItem('auth');
    sessionStorage.removeItem('auth');
    
    // For debugging
    if (process.env.NODE_ENV !== 'production') {
      console.log('User logged out, all auth data cleared');
    }
    
    // Force invalid any cached axios requests
    axios.defaults.headers.common['Authorization'] = '';
  }
};

export const getToken = (): string | null => {
  try {
    // Try to get token from localStorage first
    let token = localStorage.getItem('token');
    
    // If not in localStorage, try sessionStorage
    if (!token) {
      token = sessionStorage.getItem('token');
    }
    
    if (!token) {
      // Don't log error when there's no token, as this is normal for non-logged in users
      return null;
    }
    
    return token;
  } catch (error) {
    // Still log actual storage access errors
    logError('Error getting token from storage:', error);
    return null;
  }
};

export const getCurrentUser = (): any => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

export const isSuperUser = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'superuser';
};

export const getAllUsers = async (): Promise<UsersResponse> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        success: false,
        message: 'Token bulunamadı'
      };
    }

    const response = await axios.get(`${API_URL}/auth/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    // Use the custom logger to avoid console errors in production
    logError('Error fetching users:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: `${API_URL}/auth/users`
    });
    
    // Handle specific error cases
    if (error.code === 'ERR_NETWORK') {
      return {
        success: false,
        message: 'Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.'
      };
    }
    
    if (error.response?.status === 401) {
      // Clear invalid token
      logout();
      return {
        success: false,
        message: 'Oturum süreniz dolmuştur, lütfen tekrar giriş yapınız'
      };
    }

    if (error.response?.status === 403) {
      return {
        success: false,
        message: 'Bu sayfaya erişim izniniz bulunmamaktadır'
      };
    }
    
    return {
      success: false,
      message: error.response?.data?.message || 'Kullanıcı bilgileri getirilemedi'
    };
  }
};

export const updateUserRole = async (userId: string, role: string): Promise<UserRoleUpdateResponse> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        success: false,
        message: 'Token bulunamadı'
      };
    }

    const response = await axios.patch(
      `${API_URL}/auth/users/${userId}/role`,
      { role },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Kullanıcı rolü güncellenemedi'
    };
  }
};

// Debug function to check if token is valid
export const checkToken = async (): Promise<{ success: boolean; message: string; user?: any }> => {
  try {
    // Get the token from storage
    const token = getToken();
    
    // If no token exists, return failed result without showing error
    if (!token) {
      return { 
        success: false, 
        message: 'Token bulunamadı' 
      };
    }

    // Make request with token
    const response = await axios.get(`${API_URL}/auth/check-token`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error: any) {
    logError('Token check error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    return {
      success: false,
      message: error.response?.data?.message || 'Token geçersiz'
    };
  }
};

// Set up axios interceptor to include the token in all requests
axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);