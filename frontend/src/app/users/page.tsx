"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllUsers, updateUserRole, isSuperUser, getToken, login, logout, checkToken, getCurrentUser } from "@/services/auth";
import toast, { Toaster } from "react-hot-toast";

// Custom loggers that won't log in production
const logInfo = (message: string, data?: any) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(message, data || '');
  }
};

const logError = (message: string, data?: any) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(message, data || '');
  }
};

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const UserManagementPage = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

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
        if (tokenCheck.user.role !== 'superuser') {
          // Süper yönetici değil, hata sayfasına yönlendir
          router.push("/error");
          return;
        }
        
        // Yetki var, kullanıcıları yükle
        fetchUsersData();
      } catch (error) {
        logError("Token check error:", error);
        // Herhangi bir hata olursa, hata sayfasına yönlendir
        router.push("/error");
      }
    };

    // Kullanıcıları yükleme fonksiyonu
    const fetchUsersData = async () => {
      setLoading(true);
      try {
        logInfo("API URL:", process.env.NEXT_PUBLIC_API_URL);
        
        const tokenPreview = getToken()?.substring(0, 10) + "...";
        logInfo("Fetching users with token:", tokenPreview);
        
        const response = await getAllUsers();
        logInfo("Users response:", response);
        
        if (response.success && response.users) {
          setUsers(response.users);
          logInfo("Users loaded:", response.users.length);
        } else {
          toast.error(response.message || "Kullanıcı bilgileri getirilemedi");
          logError("Failed to load users:", response.message);
          
          // API hatası, muhtemelen yetki ile ilgili
          if (response.message?.includes("Oturum süreniz dolmuştur") || 
              response.message?.includes("erişim izniniz bulunmamaktadır")) {
            // Yetki hatası, hata sayfasına yönlendir
            router.push("/error");
          }
        }
      } catch (error) {
        logError("Error in fetchUsers:", error);
        toast.error("Bir hata oluştu.");
        // Hata durumunda da error sayfasına yönlendir
        router.push("/error");
      } finally {
        setLoading(false);
      }
    };
    
    redirectIfNotAuthorized();
  }, [router]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // İlk olarak token kontrolü yapalım
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      
      logInfo("Fetching users (refresh)...");
      
      const response = await getAllUsers();
      
      if (response.success && response.users) {
        setUsers(response.users);
        logInfo("Users refreshed:", response.users.length);
      } else {
        toast.error(response.message || "Kullanıcı bilgileri güncellenemedi");
        logError("Failed to refresh users:", response.message);
        
        // Token ile ilgili hata varsa, loading'i güncelleyelim
        if (response.message?.includes("Oturum süreniz dolmuştur") || 
            response.message?.includes("Token bulunamadı") ||
            response.message?.includes("Token geçersiz")) {
          setLoading(false);
        }
      }
    } catch (error) {
      logError("Error in fetchUsers:", error);
      toast.error("Kullanıcılar güncellenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/signin");
  };

  const handleEditRole = (user: User) => {
    // Get current user to check if modifying self
    const currentUser = getCurrentUser();
    
    // If the user is trying to modify their own role and they're a superuser
    if (currentUser && currentUser._id === user._id && currentUser.role === 'superuser') {
      toast.error("Dikkat: Kendi rolünüzü değiştirmeye çalışıyorsunuz. Bu işlem riskli olabilir.");
    }
    
    setSelectedUserId(user._id);
    setSelectedRole(user.role);
    setEditModalOpen(true);
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(e.target.value);
  };

  const handleSubmitRoleChange = async () => {
    if (!selectedUserId || !selectedRole) {
      toast.error("Lütfen bir kullanıcı ve rol seçin");
      return;
    }

    // Get current user to check if modifying self
    const currentUser = getCurrentUser();
    
    // Check if user is trying to downgrade their own superuser role
    if (
      currentUser && 
      currentUser._id === selectedUserId && 
      currentUser.role === 'superuser' && 
      selectedRole !== 'superuser'
    ) {
      // Count total superusers in the system
      const superUserCount = users.filter(user => user.role === 'superuser').length;
      
      // If there's only one superuser (the current user), don't allow role change
      if (superUserCount <= 1) {
        toast.error("Son süper yönetici olduğunuz için kendi rolünüzü düşüremezsiniz! Sistemde en az bir süper yönetici bulunmalıdır.");
        return;
      }
      
      // If there are other superusers, show confirmation dialog
      if (!window.confirm("DİKKAT: Kendi süper yönetici rolünüzü değiştirmek üzeresiniz. Bu işlem sisteme erişiminizi kısıtlayacaktır ve geri alınamayabilir. Devam etmek istediğinizden emin misiniz?")) {
        return;
      }
    }

    try {
      const response = await updateUserRole(selectedUserId, selectedRole);
      if (response.success) {
        toast.success("Kullanıcı rolü başarıyla güncellendi");
        // Update users list with the updated user
        setUsers(users.map(user => 
          user._id === selectedUserId ? { ...user, role: selectedRole } : user
        ));
        setEditModalOpen(false);
      } else {
        // Özel hata kontrolü - son süper yönetici
        if (response.message && response.message.includes('Son süper yönetici')) {
          toast.error("Dikkat: " + response.message);
        } else {
          toast.error(response.message || "Kullanıcı rolü güncellenemedi");
        }
      }
    } catch (error) {
      logError("Error in handleSubmitRoleChange:", error);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyiniz.");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'superuser':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'superuser':
        return 'Süper Yönetici';
      case 'admin':
        return 'Yönetici';
      default:
        return 'Üye';
    }
  };

  // Function to check if the user is the last superuser
  const isLastSuperuser = (user: User) => {
    if (user.role !== 'superuser') return false;
    
    // Count superusers
    const superusersCount = users.filter(u => u.role === 'superuser').length;
    return superusersCount <= 1;
  };

  // Function to handle deleting a user
  const handleDeleteUser = (user: User) => {
    // Don't allow deletion of the last superuser
    if (isLastSuperuser(user)) {
      toast.error("Son süper yönetici silinemez!");
      return;
    }

    // Get current user to check if deleting self
    const currentUser = getCurrentUser();
    
    // Prevent users from deleting themselves
    if (currentUser && currentUser._id === user._id) {
      toast.error("Kendi hesabınızı silemezsiniz!");
      return;
    }

    // Confirm deletion
    if (window.confirm(`${user.name} kullanıcısını silmek istediğinizden emin misiniz?`)) {
      // Here you would make an API call to delete the user
      toast.success(`${user.name} kullanıcısı silindi`);
      
      // For now, just remove from the local state
      // In a real implementation, you'd call an API and then update the state
      setUsers(users.filter(u => u._id !== user._id));
    }
  };

  return (
    <>
      <section className="py-16 md:py-20 lg:py-28">
        <div className="container">
          <div className="border-b border-body-color/[.15] pb-10 dark:border-white/[.15] mb-10">
            <div className="flex flex-wrap items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-black dark:text-white sm:text-4xl lg:text-5xl xl:text-4xl mt-10">
                  Üyeleri Yönet
                </h2>
                <p className="mt-4 text-base text-body-color dark:text-body-color-dark">
                  Tüm üyelerin listesi ve yetki yönetimi
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <button 
                  onClick={() => fetchUsers()} 
                  className="inline-flex items-center justify-center rounded-lg bg-primary py-3 px-7 text-center text-base font-medium text-white hover:bg-opacity-90"
                >
                  Yenile
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Adı
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      E-posta
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Yetki
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Kayıt Tarihi
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      İşlem
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>
                          {getRoleName(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditRole(user)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className={`text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ${
                            isLastSuperuser(user) ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          disabled={isLastSuperuser(user)}
                          title={isLastSuperuser(user) ? "Son süper yönetici silinemez" : ""}
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Edit Role Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" onClick={() => setEditModalOpen(false)}></div>
            <div className="relative bg-white dark:bg-gray-800 w-full max-w-md p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Kullanıcı Rolünü Düzenle
              </h3>
              
              {/* Süper yönetici uyarısı */}
              {selectedUserId && getCurrentUser()?._id === selectedUserId && getCurrentUser()?.role === 'superuser' && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <strong>Uyarı:</strong> Kendi yönetici rolünüzü değiştiriyorsunuz! Bu işlem sisteme erişiminizi kaybetmenize neden olabilir.
                      </p>
                      {users.filter(user => user.role === 'superuser').length <= 1 && (
                        <p className="text-sm text-red-700 mt-1">
                          <strong>DİKKAT:</strong> Sistemdeki tek süper yönetici sizsiniz! Rolünüzü düşüremezsiniz.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kullanıcı Rolü
                </label>
                <select
                  value={selectedRole}
                  onChange={handleRoleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  disabled={selectedUserId && 
                            getCurrentUser()?._id === selectedUserId && 
                            getCurrentUser()?.role === 'superuser' && 
                            users.filter(user => user.role === 'superuser').length <= 1}
                >
                  <option value="user" disabled={selectedUserId && 
                                        getCurrentUser()?._id === selectedUserId && 
                                        getCurrentUser()?.role === 'superuser' && 
                                        users.filter(user => user.role === 'superuser').length <= 1}>Üye</option>
                  <option value="admin" disabled={selectedUserId && 
                                         getCurrentUser()?._id === selectedUserId && 
                                         getCurrentUser()?.role === 'superuser' && 
                                         users.filter(user => user.role === 'superuser').length <= 1}>Yönetici</option>
                  <option value="superuser">Süper Yönetici</option>
                </select>
                {selectedUserId && 
                 getCurrentUser()?._id === selectedUserId && 
                 getCurrentUser()?.role === 'superuser' && 
                 users.filter(user => user.role === 'superuser').length <= 1 && (
                  <p className="mt-1 text-sm text-red-600">
                    Sistemdeki tek süper yönetici olduğunuz için rolünüzü değiştiremezsiniz.
                  </p>
                )}
              </div>
              
              {/* Süper yönetici bilgilendirmesi */}
              {selectedRole === 'superuser' && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        Süper Yönetici, tüm kullanıcıları ve rollerini yönetebilir. En az bir süper yönetici her zaman sistemde bulunmalıdır.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  İptal
                </button>
                <button
                  type="button"
                  onClick={handleSubmitRoleChange}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-right" />
    </>
  );
};

export default UserManagementPage; 