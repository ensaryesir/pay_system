"use client";

import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { login } from '@/services/auth';

const SigninPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Lütfen e-posta ve şifrenizi giriniz.');
      return;
    }

    try {
      const response = await login({
        email: formData.email,
        password: formData.password
      });

      if (response.success) {
        router.push('/');
      } else {
        setError(response.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol ediniz.');
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.');
      console.error('Login error:', err);
    }
  };

  const handleGoogleLogin = () => {
    // Implement Google login functionality
    console.log('Google login clicked');
  };

  return (
    <>
      <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="shadow-three mx-auto max-w-[500px] rounded bg-white px-6 py-10 dark:bg-dark sm:p-[60px]">
                <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
                  Hesabınızda oturum açın
                </h3>
                <p className="mb-6 text-center text-base font-medium text-body-color">
                  Dernek hesabınıza giriş yapın.
                </p>
                {error && (
                  <div className="mb-6 text-center text-red-500">
                    {error}
                  </div>
                )}
                <button
                  onClick={handleGoogleLogin}
                  className="border-stroke dark:text-body-color-dark dark:shadow-two mb-6 flex w-full items-center justify-center rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-transparent dark:bg-[#2C303B] dark:hover:border-primary dark:hover:bg-primary/5 dark:hover:text-primary dark:hover:shadow-none"
                >
                  <span className="mr-3">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_95:967)">
                        <path
                          d="M19.9895 10.1871C19.9895 9.36767 19.9214 8.76973 19.7742 8.14966H10.1992V11.848H15.8195C15.7062 12.7671 15.0943 14.1512 13.7346 15.0813L13.7155 15.2051L16.7429 17.4969L16.9527 17.5174C18.879 15.7789 19.9895 13.221 19.9895 10.1871Z"
                          fill="#4285F4"
                        />
                        <path
                          d="M10.1993 19.9313C12.9527 19.9313 15.2643 19.0454 16.9527 17.5174L13.7346 15.0813C12.8734 15.6682 11.7176 16.0779 10.1993 16.0779C7.50243 16.0779 5.21352 14.3395 4.39759 11.9366L4.27799 11.9466L1.13003 14.3273L1.08887 14.4391C2.76588 17.6945 6.21061 19.9313 10.1993 19.9313Z"
                          fill="#34A853"
                        />
                        <path
                          d="M4.39748 11.9366C4.18219 11.3166 4.05759 10.6521 4.05759 9.96565C4.05759 9.27909 4.18219 8.61473 4.38615 7.99466L4.38045 7.8626L1.19304 5.44366L1.08875 5.49214C0.397576 6.84305 0.000976562 8.36008 0.000976562 9.96565C0.000976562 11.5712 0.397576 13.0882 1.08875 14.4391L4.39748 11.9366Z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M10.1993 3.85336C12.1142 3.85336 13.406 4.66168 14.1425 5.33717L17.0207 2.59107C15.253 0.985496 12.9527 0 10.1993 0C6.2106 0 2.76588 2.23672 1.08887 5.49214L4.38626 7.99466C5.21352 5.59183 7.50242 3.85336 10.1993 3.85336Z"
                          fill="#EB4335"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_95:967">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                  Google ile Giriş Yap
                </button>
                <div className="mb-8 flex items-center justify-center">
                  <span className="hidden h-[1px] w-full max-w-[70px] bg-body-color/50 sm:block"></span>
                  <p className="w-full px-2 text-center text-base font-medium text-body-color">
                    Veya e-postanızla giriş yapın
                  </p>
                  <span className="hidden h-[1px] w-full max-w-[70px] bg-body-color/50 sm:block"></span>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="mb-8">
                    <label htmlFor="email" className="mb-3 block text-sm text-dark dark:text-white">
                      E-posta Adresiniz
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="E-posta adresinizi girin"
                      className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                      required
                    />
                  </div>
                  <div className="mb-8">
                    <label htmlFor="password" className="mb-3 block text-sm text-dark dark:text-white">
                      Şifreniz
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Şifrenizi girin"
                      className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                      required
                    />
                  </div>
                  <div className="mb-8 flex flex-col justify-between sm:flex-row sm:items-center">
                    <div className="mb-4 sm:mb-0">
                      <label htmlFor="rememberMe" className="flex cursor-pointer select-none items-center text-sm font-medium text-body-color">
                        <div className="relative">
                          <input
                            type="checkbox"
                            id="rememberMe"
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div className="box mr-4 flex h-5 w-5 items-center justify-center rounded border border-body-color border-opacity-20 dark:border-white dark:border-opacity-10">
                            <span className={`opacity-${formData.rememberMe ? '100' : '0'}`}>
                              <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                                  fill="#3056D3"
                                  stroke="#3056D3"
                                  strokeWidth="0.4"
                                />
                              </svg>
                            </span>
                          </div>
                        </div>
                        Beni hatırla
                      </label>
                    </div>
                    <div>
                      <a href="#0" className="text-sm font-medium text-primary hover:underline">
                        Şifremi Unuttum?
                      </a>
                    </div>
                  </div>
                  <div className="mb-6">
                    <button type="submit" className="shadow-submit dark:shadow-submit-dark flex w-full items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium text-white duration-300 hover:bg-primary/90">
                      Giriş Yap
                    </button>
                  </div>
                </form>
                <p className="text-center text-base font-medium text-body-color">
                  Hesabınız yok mu?{" "}
                  <Link href="/signup" className="text-primary hover:underline">
                    Kayıt Ol
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute left-0 top-0 z-[-1]">
          <svg
            width="1440"
            height="969"
            viewBox="0 0 1440 969"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="mask0_95:1005"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1440"
              height="969"
            >
              <rect width="1440" height="969" fill="#090E34" />
            </mask>
            <g mask="url(#mask0_95:1005)">
              <path
                opacity="0.1"
                d="M1086.96 297.978L632.959 554.978L935.625 535.926L1086.96 297.978Z"
                fill="url(#paint0_linear_95:1005)"
              />
              <path
                opacity="0.1"
                d="M1324.5 755.5L1450 687V886.5L1324.5 967.5L-10 288L1324.5 755.5Z"
                fill="url(#paint1_linear_95:1005)"
              />
            </g>
            <defs>
              <linearGradient
                id="paint0_linear_95:1005"
                x1="1178.4"
                y1="151.853"
                x2="780.959"
                y2="453.581"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_95:1005"
                x1="160.5"
                y1="220"
                x2="1099.45"
                y2="1192.04"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>
    </>
  );
};

export default SigninPage;
