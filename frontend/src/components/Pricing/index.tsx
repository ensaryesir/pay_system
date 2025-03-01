"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PaymentForm = () => {
  const router = useRouter();
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

  // Error states
  const [amountError, setAmountError] = useState("");
  const [nameError, setNameError] = useState("");
  const [surnameError, setSurnameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [institutionNameError, setInstitutionNameError] = useState("");
  const [recipientNameError, setRecipientNameError] = useState("");
  const [recipientSurnameError, setRecipientSurnameError] = useState("");
  const [cardNumberError, setCardNumberError] = useState("");
  const [expiryDateError, setExpiryDateError] = useState("");
  const [cvvError, setCvvError] = useState("");

  // Predefined amounts
  const predefinedAmounts = [100, 250, 500];

  // Handle predefined amount selection
  const handlePredefinedAmount = (value: number) => {
    setAmount(value.toString());
    setAmountError("");
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/.{4,16}/g);
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

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.slice(0, 2) + (v.length > 2 ? "/" + v.slice(2, 4) : "");
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let isValid = true;

    // Validate amount
    if (!amount || parseFloat(amount) <= 0) {
      setAmountError("Lütfen geçerli bir bağış miktarı girin.");
      isValid = false;
    } else {
      setAmountError("");
    }

    // Validate credit card fields
    if (!cardNumber || cardNumber.replace(/\s/g, "").length !== 16) {
      setCardNumberError("Geçerli bir kart numarası girin.");
      isValid = false;
    } else {
      setCardNumberError("");
    }

    if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
      setExpiryDateError("Geçerli bir son kullanma tarihi girin (AA/YY).");
      isValid = false;
    } else {
      setExpiryDateError("");
    }

    if (!cvv || !/^\d{3,4}$/.test(cvv)) {
      setCvvError("Geçerli bir CVV kodu girin.");
      isValid = false;
    } else {
      setCvvError("");
    }

    // Validate name fields
    if (isCorporate) {
      if (!institutionName) {
        setInstitutionNameError("Kurum adı zorunludur.");
        isValid = false;
      }
    } else {
      if (!name) {
        setNameError("Ad alanı zorunludur.");
        isValid = false;
      }
      if (!surname) {
        setSurnameError("Soyad alanı zorunludur.");
        isValid = false;
      }
    }

    // Validate email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Geçerli bir e-posta adresi girin.");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Validate recipient fields if donating for someone
    if (donateForSomeone) {
      if (!recipientName) {
        setRecipientNameError("Alıcı adı zorunludur.");
        isValid = false;
      }
      if (!recipientSurname) {
        setRecipientSurnameError("Alıcı soyadı zorunludur.");
        isValid = false;
      }
    }

    if (!isValid) return;

    // Process form submission
    try {
      const formData = {
        donationType,
        amount: parseFloat(amount),
        isCorporate,
        name: isCorporate ? institutionName : name,
        surname,
        email,
        donateForSomeone,
        recipientName,
        recipientSurname,
        deductionDay: donationType === "monthly" ? deductionDay : undefined,
      };

      const response = await fetch('http://localhost:5000/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Payment processing failed');
      }

      const result = await response.json();
      console.log('Payment successful:', result);
      router.push('/success');

    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="relative mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-lg dark:bg-dark">
          <h2 className="mb-8 text-center text-3xl font-bold text-dark dark:text-white">
            Bağış Yap
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Donation Type Selector */}
            <div className="flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
              <button
                type="button"
                onClick={() => setDonationType("one-time")}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${donationType === "one-time" ? "bg-primary text-white" : "text-gray-600 hover:text-dark dark:text-gray-300 dark:hover:text-white"}`}
              >
                Tek Seferlik Bağış
              </button>
              <button
                type="button"
                onClick={() => setDonationType("monthly")}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${donationType === "monthly" ? "bg-primary text-white" : "text-gray-600 hover:text-dark dark:text-gray-300 dark:hover:text-white"}`}
              >
                Aylık Bağış
              </button>
            </div>

            {/* Amount Input with Quick Selection */}
            <div>
              <label className="mb-2.5 block font-medium text-dark dark:text-white">
                Bağış Miktarı (TL)
              </label>
              <div className="flex gap-4">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 rounded-lg border border-transparent bg-gray-100 px-4 py-3 text-dark placeholder-gray-500 transition focus:border-primary focus:outline-none dark:bg-gray-800 dark:text-white"
                  placeholder="0.00"
                />
                <div className="flex gap-2">
                  {predefinedAmounts.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handlePredefinedAmount(value)}
                      className="rounded-lg bg-gray-100 px-4 py-3 text-dark transition hover:bg-primary hover:text-white dark:bg-gray-800 dark:text-white"
                    >
                      {value}TL
                    </button>
                  ))}
                </div>
              </div>
              {amountError && (
                <p className="mt-1 text-sm text-red-500">{amountError}</p>
              )}
            </div>

            {/* Corporate Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="corporate"
                checked={isCorporate}
                onChange={(e) => setIsCorporate(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label
                htmlFor="corporate"
                className="text-sm font-medium text-dark dark:text-white"
              >
                Kurumsal Bağışçı
              </label>
            </div>

            {/* Donor Information */}
            {isCorporate ? (
              <div>
                <label className="mb-2.5 block font-medium text-dark dark:text-white">
                  Kurum Adı
                </label>
                <input
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  className="w-full rounded-lg border border-transparent bg-gray-100 px-4 py-3 text-dark placeholder-gray-500 transition focus:border-primary focus:outline-none dark:bg-gray-800 dark:text-white"
                />
                {institutionNameError && (
                  <p className="mt-1 text-sm text-red-500">
                    {institutionNameError}
                  </p>
                )}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2.5 block font-medium text-dark dark:text-white">
                    Ad
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-transparent bg-gray-100 px-4 py-3 text-dark placeholder-gray-500 transition focus:border-primary focus:outline-none dark:bg-gray-800 dark:text-white"
                  />
                  {nameError && (
                    <p className="mt-1 text-sm text-red-500">{nameError}</p>
                  )}
                </div>
                <div>
                  <label className="mb-2.5 block font-medium text-dark dark:text-white">
                    Soyad
                  </label>
                  <input
                    type="text"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    className="w-full rounded-lg border border-transparent bg-gray-100 px-4 py-3 text-dark placeholder-gray-500 transition focus:border-primary focus:outline-none dark:bg-gray-800 dark:text-white"
                  />
                  {surnameError && (
                    <p className="mt-1 text-sm text-red-500">{surnameError}</p>
                  )}
                </div>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="mb-2.5 block font-medium text-dark dark:text-white">
                E-posta
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-transparent bg-gray-100 px-4 py-3 text-dark placeholder-gray-500 transition focus:border-primary focus:outline-none dark:bg-gray-800 dark:text-white"
              />
              {emailError && (
                <p className="mt-1 text-sm text-red-500">{emailError}</p>
              )}
            </div>

            {/* Donate for Someone Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="donateForSomeone"
                checked={donateForSomeone}
                onChange={(e) => setDonateForSomeone(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label
                htmlFor="donateForSomeone"
                className="text-sm font-medium text-dark dark:text-white"
              >
                Başkası Adına Bağış
              </label>
            </div>

            {/* Recipient Information */}
            {donateForSomeone && (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2.5 block font-medium text-dark dark:text-white">
                    Alıcı Adı
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full rounded-lg border border-transparent bg-gray-100 px-4 py-3 text-dark placeholder-gray-500 transition focus:border-primary focus:outline-none dark:bg-gray-800 dark:text-white"
                  />
                  {recipientNameError && (
                    <p className="mt-1 text-sm text-red-500">
                      {recipientNameError}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-2.5 block font-medium text-dark dark:text-white">
                    Alıcı Soyadı
                  </label>
                  <input
                    type="text"
                    value={recipientSurname}
                    onChange={(e) => setRecipientSurname(e.target.value)}
                    className="w-full rounded-lg border border-transparent bg-gray-100 px-4 py-3 text-dark placeholder-gray-500 transition focus:border-primary focus:outline-none dark:bg-gray-800 dark:text-white"
                  />
                  {recipientSurnameError && (
                    <p className="mt-1 text-sm text-red-500">
                      {recipientSurnameError}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Monthly Deduction Day */}
            {donationType === "monthly" && (
              <div>
                <label className="mb-2.5 block font-medium text-dark dark:text-white">
                  Aylık Ödeme Günü
                </label>
                <select
                  value={deductionDay}
                  onChange={(e) => setDeductionDay(parseInt(e.target.value))}
                  className="w-full rounded-lg border border-transparent bg-gray-100 px-4 py-3 text-dark transition focus:border-primary focus:outline-none dark:bg-gray-800 dark:text-white"
                >
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Credit Card Information */}
            <div className="space-y-4">
              <div>
                <label className="mb-2.5 block font-medium text-dark dark:text-white">
                  Kart Numarası
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                  className="w-full rounded-lg border border-transparent bg-gray-100 px-4 py-3 text-dark placeholder-gray-500 transition focus:border-primary focus:outline-none dark:bg-gray-800 dark:text-white"
                  placeholder="**** **** **** ****"
                />
                {cardNumberError && (
                  <p className="mt-1 text-sm text-red-500">{cardNumberError}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2.5 block font-medium text-dark dark:text-white">
                    Son Kullanma Tarihi
                  </label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                    maxLength={5}
                    className="w-full rounded-lg border border-transparent bg-gray-100 px-4 py-3 text-dark placeholder-gray-500 transition focus:border-primary focus:outline-none dark:bg-gray-800 dark:text-white"
                    placeholder="AA/YY"
                  />
                  {expiryDateError && (
                    <p className="mt-1 text-sm text-red-500">{expiryDateError}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2.5 block font-medium text-dark dark:text-white">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                    maxLength={4}
                    className="w-full rounded-lg border border-transparent bg-gray-100 px-4 py-3 text-dark placeholder-gray-500 transition focus:border-primary focus:outline-none dark:bg-gray-800 dark:text-white"
                    placeholder="***"
                  />
                  {cvvError && (
                    <p className="mt-1 text-sm text-red-500">{cvvError}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-8 py-4 text-base font-semibold text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp"
            >
              Bağış Yap
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default PaymentForm;