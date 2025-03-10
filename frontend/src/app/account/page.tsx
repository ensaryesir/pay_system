"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getToken } from '@/services/auth';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface UpdateProfileData {
  name: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const AccountPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const [formData, setFormData] = useState<UpdateProfileData>({
    name: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [updateSuccess, setUpdateSuccess] = useState<string>('');

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (!token) {
        router.push('/signin');
        return;
      }

      const userData = getCurrentUser();
      if (userData) {
        setUser(userData);
        setFormData(prev => ({
          ...prev,
          name: userData.name || ''
        }));
      } else {
        router.push('/signin');
      }
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'İsim alanı zorunludur';
    }

    // If user wants to change password
    if (formData.newPassword || formData.confirmPassword) {
      // Current password is required when changing password
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Mevcut şifrenizi girmelisiniz';
      }

      // New password validation
      if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'Yeni şifre en az 6 karakter olmalıdır';
      }

      // Confirm password validation
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Şifreler eşleşmiyor';
      }
    }

    // If only current password is provided but no new password
    if (formData.currentPassword && !formData.newPassword) {
      newErrors.newPassword = 'Yeni şifre girmelisiniz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateSuccess('');
    
    if (!validateForm()) {
      return;
    }

    setUpdating(true);

    try {
      const token = getToken();
      if (!token) {
        toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        router.push('/signin');
        return;
      }

      // Prepare update data
      const updateData: any = {
        name: formData.name
      };

      // Only include password fields if user wants to change password
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await axios.put(
        `${API_URL}/auth/profile`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        // Update local user data
        const updatedUser = {
          ...user,
          name: formData.name
        };

        // Update in storage
        if (localStorage.getItem('user')) {
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        if (sessionStorage.getItem('user')) {
          sessionStorage.setItem('user', JSON.stringify(updatedUser));
        }

        setUser(updatedUser);
        setUpdateSuccess('Hesap bilgileriniz başarıyla güncellendi');
        toast.success('Hesap bilgileriniz başarıyla güncellendi');

        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      
      // Handle specific error responses
      if (error.response?.status === 401) {
        if (error.response.data?.message?.includes('şifre')) {
          setErrors({
            currentPassword: 'Mevcut şifreniz yanlış'
          });
          toast.error('Mevcut şifreniz yanlış');
        } else {
          toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
          router.push('/signin');
        }
      } else {
        toast.error(error.response?.data?.message || 'Güncelleme sırasında bir hata oluştu');
      }
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 md:py-20 lg:py-28">
        <div className="container">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="border-b border-body-color/[.15] pb-10 dark:border-white/[.15] mb-10">
          <h2 className="text-3xl font-bold text-black dark:text-white sm:text-4xl lg:text-5xl xl:text-4xl mt-10">
            Hesap Ayarları
          </h2>
          <p className="mt-4 text-base text-body-color dark:text-body-color-dark">
            Kişisel bilgilerinizi ve şifrenizi güncelleyin
          </p>
        </div>

        <div className="mx-auto max-w-[800px] rounded-md bg-white p-6 shadow-md dark:bg-dark sm:p-10">
          {updateSuccess && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
              {updateSuccess}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <h3 className="mb-4 text-xl font-bold text-black dark:text-white">Kişisel Bilgiler</h3>
              
              <div className="mb-4">
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Adınız Soyadınız"
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-gray-600 dark:bg-[#242B51] dark:text-white"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  E-posta
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-500 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  E-posta adresi değiştirilemez
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="mb-4 text-xl font-bold text-black dark:text-white">Şifre Değiştir</h3>
              
              <div className="mb-4">
                <label htmlFor="currentPassword" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mevcut Şifre
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Mevcut şifreniz"
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-gray-600 dark:bg-[#242B51] dark:text-white"
                />
                {errors.currentPassword && <p className="mt-1 text-sm text-red-500">{errors.currentPassword}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="newPassword" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Yeni Şifre
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Yeni şifreniz"
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-gray-600 dark:bg-[#242B51] dark:text-white"
                />
                {errors.newPassword && <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Yeni Şifre (Tekrar)
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Yeni şifrenizi tekrar girin"
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-gray-600 dark:bg-[#242B51] dark:text-white"
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={updating}
                className="rounded-md bg-primary px-6 py-3 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-primary/90 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {updating ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Güncelleniyor...
                  </span>
                ) : (
                  "Değişiklikleri Kaydet"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Toaster position="top-right" />
    </section>
  );
};

export default AccountPage;