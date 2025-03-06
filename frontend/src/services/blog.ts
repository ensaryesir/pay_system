import axios from 'axios';
import { getToken } from './auth';
import { logError } from '@/utils/logger';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

// Debug log to check API URL
console.log('Blog Service API URL:', API_URL);
console.log('Base URL:', BASE_URL);

export interface Blog {
  _id: string;
  title: string;
  content: string;
  image: string;
  author: {
    _id: string;
    name: string;
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface BlogResponse {
  success: boolean;
  blog?: Blog;
  blogs?: Blog[];
  message?: string;
  imageUrl?: string;
}

export const uploadImage = async (file: File): Promise<BlogResponse> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        success: false,
        message: 'Oturum bulunamadı'
      };
    }

    // Dosya tipi kontrolü
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        message: 'Sadece resim dosyaları yükleyebilirsiniz (JPEG, PNG, GIF, WEBP)'
      };
    }

    // Dosya boyutu kontrolü (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        message: 'Dosya boyutu 5MB\'dan küçük olmalıdır'
      };
    }

    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post(`${API_URL}/blog/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error: any) {
    logError('Error uploading image:', error);
    // Sunucudan gelen hata mesajını göster
    const errorMessage = error.response?.data?.message || 'Resim yüklenirken bir hata oluştu';
    return {
      success: false,
      message: errorMessage
    };
  }
};

export const getAllBlogs = async (): Promise<BlogResponse> => {
  try {
    const response = await axios.get(`${API_URL}/blog`);
    
    // API'den gelen blog verilerindeki image URL'lerini düzelt
    if (response.data.success && response.data.blogs) {
      response.data.blogs = response.data.blogs.map((blog: Blog) => ({
        ...blog,
        // URL'yi düzelt: /api/uploads yerine /uploads kullan
        image: blog.image.startsWith('http') 
          ? blog.image.replace('/api/uploads', '/uploads')
          : `${BASE_URL}${blog.image}`
      }));
    }
    
    return response.data;
  } catch (error: any) {
    logError('Error fetching blogs:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Haberler getirilemedi'
    };
  }
};

export const getBlogById = async (id: string): Promise<BlogResponse> => {
  try {
    const response = await axios.get(`${API_URL}/blog/${id}`);
    
    // API'den gelen blog verisindeki image URL'sini düzelt
    if (response.data.success && response.data.blog) {
      response.data.blog = {
        ...response.data.blog,
        // URL'yi düzelt: /api/uploads yerine /uploads kullan
        image: response.data.blog.image.startsWith('http') 
          ? response.data.blog.image.replace('/api/uploads', '/uploads')
          : `${BASE_URL}${response.data.blog.image}`
      };
    }
    
    return response.data;
  } catch (error: any) {
    logError('Error fetching blog:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Haber getirilemedi'
    };
  }
};

export const createBlog = async (blogData: Omit<Blog, '_id' | 'author' | 'createdAt' | 'updatedAt'>): Promise<BlogResponse> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        success: false,
        message: 'Oturum bulunamadı'
      };
    }

    const response = await axios.post(`${API_URL}/blog`, blogData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    logError('Error creating blog:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Haber oluşturulamadı'
    };
  }
};

export const updateBlog = async (id: string, blogData: Partial<Blog>): Promise<BlogResponse> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        success: false,
        message: 'Oturum bulunamadı'
      };
    }

    const response = await axios.put(`${API_URL}/blog/${id}`, blogData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    logError('Error updating blog:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Haber güncellenemedi'
    };
  }
};

export const deleteBlog = async (id: string): Promise<BlogResponse> => {
  try {
    const token = getToken();
    if (!token) {
      return {
        success: false,
        message: 'Oturum bulunamadı'
      };
    }

    const response = await axios.delete(`${API_URL}/blog/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    logError('Error deleting blog:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Haber silinemedi'
    };
  }
}; 