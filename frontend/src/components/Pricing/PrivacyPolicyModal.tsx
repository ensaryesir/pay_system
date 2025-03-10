"use client";

import { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal = ({ isOpen, onClose }: PrivacyPolicyModalProps) => {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        initialFocus={cancelButtonRef}
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity dark:bg-gray-900 dark:bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all dark:bg-gray-800 sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-2xl font-semibold leading-6 text-gray-900 dark:text-white"
                    >
                      Kişisel Verilerin Korunması Aydınlatma Metni
                    </Dialog.Title>
                    <div className="mt-6 text-left">
                      <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                        <p>
                          <strong>1. Veri Sorumlusu</strong>
                        </p>
                        <p>
                          Uluslararası Kültür ve Turizm Derneği ("Dernek") olarak kişisel verilerinizin güvenliği ve korunması konusunda büyük hassasiyet göstermekteyiz. Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında, kişisel verilerinizin işlenme amaçları, hukuki sebepleri ve haklarınız konusunda sizi bilgilendirmek amacıyla hazırlanmıştır.
                        </p>

                        <p>
                          <strong>2. İşlenen Kişisel Veriler</strong>
                        </p>
                        <p>
                          Bağış işleminiz kapsamında aşağıdaki kişisel verileriniz işlenmektedir:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Kimlik bilgileri (ad, soyad)</li>
                          <li>İletişim bilgileri (e-posta adresi)</li>
                          <li>Finansal bilgiler (bağış miktarı, ödeme bilgileri)</li>
                          <li>Kurumsal bağış durumunda kurum adı</li>
                          <li>Başkası adına bağış yapılması durumunda alıcı kişinin adı ve soyadı</li>
                        </ul>

                        <p>
                          <strong>3. Kişisel Verilerin İşlenme Amaçları</strong>
                        </p>
                        <p>
                          Kişisel verileriniz aşağıdaki amaçlar doğrultusunda işlenmektedir:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Bağış işlemlerinin gerçekleştirilmesi ve takibi</li>
                          <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                          <li>Dernek faaliyetleri hakkında bilgilendirme yapılması</li>
                          <li>İstatistiksel değerlendirmeler ve raporlamalar</li>
                          <li>Bağışçılarla iletişim kurulması</li>
                        </ul>

                        <p>
                          <strong>4. Kişisel Verilerin Aktarılması</strong>
                        </p>
                        <p>
                          Kişisel verileriniz, yukarıda belirtilen amaçlar doğrultusunda, yasal yükümlülüklerimizi yerine getirmek amacıyla yetkili kamu kurum ve kuruluşlarına, bağış işlemlerinin gerçekleştirilmesi amacıyla ödeme hizmeti sağlayıcılarına ve hukuki danışmanlık hizmeti alınan kişi ve kurumlara aktarılabilmektedir.
                        </p>

                        <p>
                          <strong>5. Kişisel Verilerin Toplanma Yöntemi ve Hukuki Sebebi</strong>
                        </p>
                        <p>
                          Kişisel verileriniz, elektronik ortamda web sitemiz üzerinden doldurduğunuz formlar aracılığıyla toplanmaktadır. Kişisel verilerinizin işlenmesinin hukuki sebepleri; KVKK'nın 5. maddesinde belirtilen açık rızanızın bulunması, bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması, hukuki yükümlülüğümüzün yerine getirilmesi ve ilgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla, veri sorumlusunun meşru menfaatleri için veri işlenmesinin zorunlu olmasıdır.
                        </p>

                        <p>
                          <strong>6. Kişisel Veri Sahibinin Hakları</strong>
                        </p>
                        <p>
                          KVKK'nın 11. maddesi uyarınca, kişisel veri sahibi olarak aşağıdaki haklara sahipsiniz:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                          <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
                          <li>Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                          <li>Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme</li>
                          <li>Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme</li>
                          <li>KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerinizin silinmesini veya yok edilmesini isteme</li>
                          <li>Kişisel verilerinizin aktarıldığı üçüncü kişilere yukarıda sayılan (e) ve (f) bentleri uyarınca yapılan işlemlerin bildirilmesini isteme</li>
                          <li>İşlenen verilerinizin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
                          <li>Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
                        </ul>

                        <p>
                          <strong>7. İletişim</strong>
                        </p>
                        <p>
                          Yukarıda belirtilen haklarınızı kullanmak için veya kişisel verilerinizin işlenmesi ile ilgili soru ve görüşleriniz için aşağıdaki iletişim bilgilerinden bize ulaşabilirsiniz:
                        </p>
                        <p>
                          E-posta: info@ornekdernek.com<br />
                          Adres: Örnek Mahallesi, Örnek Sokak No:1, 34000 İstanbul
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    onClick={onClose}
                    ref={cancelButtonRef}
                  >
                    Kapat
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default PrivacyPolicyModal;