"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import SectionTitle from "../Common/SectionTitle";
import PrivacyPolicyModal from "./PrivacyPolicyModal";

const PaymentForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [donationType, setDonationType] = useState("one-time");
  const [amount, setAmount] = useState("");
  const [isCorporate, setIsCorporate] = useState(false);
  const [institutionName, setInstitutionName] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [donateForSomeone, setDonateForSomeone] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [recipientSurname, setRecipientSurname] = useState("");
  const [deductionDay, setDeductionDay] = useState(1);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [privacyPolicyOpen, setPrivacyPolicyOpen] = useState(false);

  // Önceden tanımlanmış bağış miktarları
  const predefinedAmounts = [50, 100, 250, 500, 1000];

  // Önceden tanımlanmış bağış miktarı seçimi
  const handlePredefinedAmount = (value: number) => {
    setAmount(value.toString());
    // Seçilen miktar için hata varsa temizle
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: "" }));
    }
  };

  // Kart numarası formatı (4 haneli gruplar halinde)
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  // Son kullanma tarihi formatı (MM/YY)
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  // Form doğrulama
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Miktar kontrolü
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = "Lütfen geçerli bir bağış miktarı girin";
    }

    // Kurumsal bağış kontrolü
    if (isCorporate && !institutionName.trim()) {
      newErrors.institutionName = "Kurum adı gereklidir";
    }

    // Kişisel bilgiler kontrolü
    if (!name.trim()) {
      newErrors.name = "Ad gereklidir";
    }

    if (!surname.trim()) {
      newErrors.surname = "Soyad gereklidir";
    }

    // E-posta kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      newErrors.email = "Geçerli bir e-posta adresi girin";
    }

    // Başkası adına bağış kontrolü
    if (donateForSomeone) {
      if (!recipientName.trim()) {
        newErrors.recipientName = "Alıcı adı gereklidir";
      }
      if (!recipientSurname.trim()) {
        newErrors.recipientSurname = "Alıcı soyadı gereklidir";
      }
    }

    // Kart bilgileri kontrolü
    const cardNumberWithoutSpaces = cardNumber.replace(/\s/g, "");
    if (cardNumberWithoutSpaces.length < 16) {
      newErrors.cardNumber = "Geçerli bir kart numarası girin";
    }

    const expiryParts = expiryDate.split("/");
    if (expiryParts.length !== 2 || expiryParts[0].length !== 2 || expiryParts[1].length !== 2) {
      newErrors.expiryDate = "Geçerli bir son kullanma tarihi girin (AA/YY)";
    } else {
      const month = parseInt(expiryParts[0], 10);
      const year = parseInt(`20${expiryParts[1]}`, 10);
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      if (month < 1 || month > 12) {
        newErrors.expiryDate = "Geçersiz ay";
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        newErrors.expiryDate = "Kartınızın süresi dolmuş";
      }
    }

    if (cvv.length < 3) {
      newErrors.cvv = "Geçerli bir CVV kodu girin";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form gönderimi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Lütfen formdaki hataları düzeltin");
      return;
    }

    setIsSubmitting(true);

    try {
      // Import the payment service
      const { processPayment } = await import('@/services/paymentService');
      
      // Prepare payment data
      const paymentData = {
        donationType,
        amount,
        isCorporate,
        institutionName: isCorporate ? institutionName : undefined,
        name,
        surname,
        email,
        donateForSomeone,
        recipientName: donateForSomeone ? recipientName : undefined,
        recipientSurname: donateForSomeone ? recipientSurname : undefined,
        deductionDay: donationType === 'monthly' ? deductionDay : undefined,
        cardNumber,
        expiryDate,
        cvv
      };
      
      // Process payment through API
      const response = await processPayment(paymentData);
      
      if (response.success) {
        toast.success("Bağışınız için teşekkür ederiz!");
        // Teşekkür sayfasına yönlendirme
        router.push("/thank-you");
      } else {
        toast.error(response.message || "Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } catch (error) {
      console.error("Ödeme işlemi sırasında bir hata oluştu:", error);
      toast.error("Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative z-10 py-16 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          title="Bağış Yap"
          paragraph="Derneğimize yapacağınız bağışlar, kültürel mirasın korunması ve sürdürülebilir turizm projelerine destek olacaktır."
          center
          width="665px"
        />

        {/* Privacy Policy Modal */}
        <PrivacyPolicyModal 
          isOpen={privacyPolicyOpen} 
          onClose={() => setPrivacyPolicyOpen(false)} 
        />

        <div className="mx-auto max-w-[800px] rounded-md bg-white p-6 shadow-md dark:bg-dark sm:p-10">
          <form onSubmit={handleSubmit}>
            {/* Bağış Türü Seçimi */}
            <div className="mb-8">
              <h3 className="mb-4 text-xl font-bold text-black dark:text-white">Bağış Türü</h3>
              <div className="flex flex-wrap gap-4">
                <label className={`flex cursor-pointer items-center rounded-md border p-3 ${donationType === "one-time" ? "border-primary bg-primary/5" : "border-gray-300 dark:border-gray-600"}`}>
                  <input
                    type="radio"
                    name="donationType"
                    value="one-time"
                    checked={donationType === "one-time"}
                    onChange={() => setDonationType("one-time")}
                    className="mr-2 h-4 w-4 accent-primary"
                  />
                  <span>Tek Seferlik Bağış</span>
                </label>
                <label className={`flex cursor-pointer items-center rounded-md border p-3 ${donationType === "monthly" ? "border-primary bg-primary/5" : "border-gray-300 dark:border-gray-600"}`}>
                  <input
                    type="radio"
                    name="donationType"
                    value="monthly"
                    checked={donationType === "monthly"}
                    onChange={() => setDonationType("monthly")}
                    className="mr-2 h-4 w-4 accent-primary"
                  />
                  <span>Aylık Düzenli Bağış</span>
                </label>
              </div>
            </div>

            {/* Bağış Miktarı */}
            <div className="mb-8">
              <h3 className="mb-4 text-xl font-bold text-black dark:text-white">Bağış Miktarı</h3>
              <div className="mb-4 flex flex-wrap gap-2">
                {predefinedAmounts.map((preAmount) => (
                  <button
                    key={preAmount}
                    type="button"
                    onClick={() => handlePredefinedAmount(preAmount)}
                    className={`rounded-md px-4 py-2 ${
                      amount === preAmount.toString()
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {preAmount} ₺
                  </button>
                ))}
              </div>
              <div>
                <label htmlFor="amount" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Diğer Miktar (₺)
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Bağış miktarı girin"
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-gray-600 dark:bg-[#242B51] dark:text-white"
                />
                {errors.amount && <p className="mt-1 text-sm text-red-500">{errors.amount}</p>}
              </div>
            </div>

            {/* Bağışçı Bilgileri */}
            <div className="mb-8">
              <h3 className="mb-4 text-xl font-bold text-black dark:text-white">Bağışçı Bilgileri</h3>
              
              {/* Kurumsal/Bireysel Seçimi */}
              <div className="mb-4">
                <label className="mb-2 flex items-center">
                  <input
                    type="checkbox"
                    checked={isCorporate}
                    onChange={() => setIsCorporate(!isCorporate)}
                    className="mr-2 h-4 w-4 accent-primary"
                  />
                  <span>Kurumsal bağış yapmak istiyorum</span>
                </label>
              </div>

              {/* Kurumsal Bağış Alanları */}
              {isCorporate && (
                <div className="mb-4">
                  <label htmlFor="institutionName" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Kurum Adı
                  </label>
                  <input
                    type="text"
                    id="institutionName"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    placeholder="Kurum adını girin"
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-gray-600 dark:bg-[#242B51] dark:text-white"
                  />
                  {errors.institutionName && <p className="mt-1 text-sm text-red-500">{errors.institutionName}</p>}
                </div>
              )}

              {/* Kişisel Bilgiler */}
              <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ad
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Adınız"
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-gray-600 dark:bg-[#242B51] dark:text-white"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="surname" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Soyad
                  </label>
                  <input
                    type="text"
                    id="surname"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    placeholder="Soyadınız"
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-gray-600 dark:bg-[#242B51] dark:text-white"
                  />
                  {errors.surname && <p className="mt-1 text-sm text-red-500">{errors.surname}</p>}
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  E-posta
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-posta adresiniz"
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-gray-600 dark:bg-[#242B51] dark:text-white"
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              {/* Başkası Adına Bağış */}
              <div className="mb-4">
                <label className="mb-2 flex items-center">
                  <input
                    type="checkbox"
                    checked={donateForSomeone}
                    onChange={() => setDonateForSomeone(!donateForSomeone)}
                    className="mr-2 h-4 w-4 accent-primary"
                  />
                  <span>Başkası adına bağış yapmak istiyorum</span>
                </label>
              </div>

              {donateForSomeone && (
                <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="recipientName" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Alıcı Adı
                    </label>
                    <input
                      type="text"
                      id="recipientName"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Alıcının adı"
                      className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-gray-600 dark:bg-[#242B51] dark:text-white"
                    />
                    {errors.recipientName && <p className="mt-1 text-sm text-red-500">{errors.recipientName}</p>}
                  </div>
                  <div>
                    <label htmlFor="recipientSurname" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Alıcı Soyadı
                    </label>
                    <input
                      type="text"
                      id="recipientSurname"
                      value={recipientSurname}
                      onChange={(e) => setRecipientSurname(e.target.value)}
                      placeholder="Alıcının soyadı"
                      className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-gray-600 dark:bg-[#242B51] dark:text-white"
                    />
                    {errors.recipientSurname && <p className="mt-1 text-sm text-red-500">{errors.recipientSurname}</p>}
                  </div>
                </div>
              )}

              {/* Aylık Bağış için Tahsilat Günü */}
              {donationType === "monthly" && (
                <div className="mb-4">
                  <label htmlFor="deductionDay" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Aylık Tahsilat Günü
                  </label>
                  <select
                    id="deductionDay"
                    value={deductionDay}
                    onChange={(e) => setDeductionDay(Number(e.target.value))}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-gray-600 dark:bg-[#242B51] dark:text-white"
                  >
                    {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Ödeme Bilgileri */}
            <div className="mb-8">
              <h3 className="mb-4 text-xl font-bold text-black dark:text-white">Ödeme Bilgileri</h3>
              
              <div className="mb-4">
                <label htmlFor="cardNumber" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Kart Numarası
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-gray-600 dark:bg-[#242B51] dark:text-white"
                />
                {errors.cardNumber && <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>}
              </div>

              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiryDate" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Son Kullanma Tarihi
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                    placeholder="AA/YY"
                    maxLength={5}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-gray-600 dark:bg-[#242B51] dark:text-white"
                  />
                  {errors.expiryDate && <p className="mt-1 text-sm text-red-500">{errors.expiryDate}</p>}
                </div>
                <div>
                  <label htmlFor="cvv" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="123"
                    maxLength={4}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-gray-600 dark:bg-[#242B51] dark:text-white"
                  />
                  {errors.cvv && <p className="mt-1 text-sm text-red-500">{errors.cvv}</p>}
                </div>
              </div>
            </div>

            {/* Güvenlik Notu */}
            <div className="mb-8 rounded-md bg-gray-50 p-4 text-sm dark:bg-gray-800">
              <p className="mb-2 font-medium">Güvenlik Bilgisi:</p>
              <p>
                • Tüm ödeme bilgileriniz SSL sertifikası ile şifrelenerek korunmaktadır.<br />
                • Kart bilgileriniz sistemimizde saklanmaz, sadece ödeme işlemi için kullanılır.<br />
                • Aylık bağışlar için, belirttiğiniz günde kartınızdan otomatik tahsilat yapılacaktır.<br />
                • İstediğiniz zaman düzenli bağışınızı durdurabilirsiniz.
              </p>
            </div>

            {/* Onay ve Gönder */}
            <div className="mb-8">
              <label className="mb-4 flex items-start">
                <input
                  type="checkbox"
                  required
                  className="mr-2 mt-1 h-4 w-4 accent-primary"
                />
                <span className="text-sm">
                  Kişisel verilerimin işlenmesine ilişkin <button type="button" onClick={() => setPrivacyPolicyOpen(true)} className="text-primary hover:underline">Aydınlatma Metni</button>'ni okudum ve anladım. Kişisel verilerimin belirtilen amaçlar doğrultusunda işlenmesini onaylıyorum.
                </span>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-primary px-5 py-3 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-primary/90 disabled:bg-gray-400"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="mr-2 h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    İşleniyor...
                  </span>
                ) : (
                  `${donationType === "one-time" ? "Tek Seferlik" : "Aylık"} Bağış Yap`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default PaymentForm;