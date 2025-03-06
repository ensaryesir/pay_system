"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, checkToken, isAdminOrSuperUser } from "@/services/auth";
import { logError } from "@/utils/logger";
import { createBlog, uploadImage } from "@/services/blog";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

const AdminPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
    tags: ""
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const redirectIfNotAuthorized = async () => {
      // Check if token exists
      const token = getToken();
      if (!token) {
        // Kullanıcı giriş yapmamış, hata sayfasına yönlendir
        router.push("/error");
        return;
      }

      // Token var, kullanıcı rolünü kontrol et
      try {
        const tokenCheck = await checkToken();
        if (!tokenCheck.success) {
          // Token geçersiz
          router.push("/error");
          return;
        }
        
        // Kullanıcı rolünü kontrol et
        if (!isAdminOrSuperUser()) {
          // Admin veya süper yönetici değil, hata sayfasına yönlendir
          router.push("/error");
          return;
        }
      } catch (error) {
        logError("Token check error:", error);
        // Herhangi bir hata olursa, hata sayfasına yönlendir
        router.push("/error");
      }
    };
    
    redirectIfNotAuthorized();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Dosya tipi kontrolü
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Sadece resim dosyaları yükleyebilirsiniz (JPEG, PNG, GIF, WEBP)');
      e.target.value = ''; // Input'u temizle
      return;
    }

    // Dosya boyutu kontrolü (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Dosya boyutu 5MB\'dan küçük olmalıdır');
      e.target.value = ''; // Input'u temizle
      return;
    }

    setSelectedImage(file);
    
    // Resim önizleme için
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsUploading(true);
      let imageUrl = formData.image;

      // Eğer yeni bir resim seçildiyse, önce onu yükle
      if (selectedImage) {
        const uploadResponse = await uploadImage(selectedImage);
        if (!uploadResponse.success) {
          toast.error(uploadResponse.message || 'Resim yüklenemedi');
          return;
        }
        imageUrl = uploadResponse.imageUrl || '';
      }

      // Tags'i array'e çevir
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const response = await createBlog({
        ...formData,
        image: imageUrl,
        tags
      });

      if (response.success) {
        toast.success('Haber başarıyla oluşturuldu');
        // Formu temizle
        setFormData({
          title: "",
          content: "",
          image: "",
          tags: ""
        });
        setSelectedImage(null);
        setImagePreview(null);
      } else {
        toast.error(response.message || 'Haber oluşturulurken bir hata oluştu');
      }
    } catch (error) {
      toast.error('Haber oluşturulurken bir hata oluştu');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="border-b border-body-color/[.15] pb-10 dark:border-white/[.15] mb-10">
          <div className="flex flex-wrap items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-black dark:text-white sm:text-4xl lg:text-5xl xl:text-4xl mt-10">
                Yönetici Paneli
              </h2>
              <p className="mt-4 text-base text-body-color dark:text-body-color-dark">
                Yönetici işlemleri için kontrol paneli
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-6 text-black dark:text-white">
              Yeni Haber Ekle
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Başlık
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Haber başlığı"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  İçerik
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Haber içeriği"
                />
              </div>

              <div className="mb-8">
                <label
                  htmlFor="image"
                  className="mb-3 block text-sm font-medium text-dark dark:text-white"
                >
                  Haber Görseli
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleImageChange}
                  className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Sadece resim dosyaları yükleyebilirsiniz (JPEG, PNG, GIF, WEBP). Maksimum dosya boyutu: 5MB
                </p>
                {imagePreview && (
                  <div className="mt-4">
                    <p className="mb-2 text-sm font-medium">Görsel Önizleme:</p>
                    <Image
                      src={imagePreview}
                      alt="Önizleme"
                      width={200}
                      height={150}
                      className="rounded-md object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Etiketler
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Etiketleri virgülle ayırın: kültür, turizm, etkinlik"
                />
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className={`w-full bg-primary text-white py-3 px-6 rounded-md hover:bg-opacity-90 transition duration-300 ${
                  isUploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isUploading ? 'Yükleniyor...' : 'Haber Oluştur'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </section>
  );
};

export default AdminPage; 