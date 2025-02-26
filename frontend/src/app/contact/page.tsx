import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim | Uluslararası Kültür ve Turizm Derneği",
  description: "Uluslararası Kültür ve Turizm Derneği ile iletişime geçin. Soru, öneri ve işbirliği talepleriniz için bize ulaşın.",
  keywords: [
    "iletişim",
    "kültür derneği",
    "turizm işbirliği",
    "iletişim bilgileri",
    "sosyal sorumluluk",
    "ülkelerarası kültür"
  ],
  authors: [{ name: "Uluslararası Kültür ve Turizm Derneği", url: "https://ornekdernek.com" }],
  openGraph: {
    type: "website",
    url: "https://ornekdernek.com/iletisim",
    title: "İletişim | Kültür ve Turizmde Global İşbirlikleri",
    description: "Kültürel projeleriniz veya turizm partnerlikleri için derneğimizle iletişim kurun.",
    siteName: "Uluslararası Kültür ve Turizm Derneği",
  },
  twitter: {
    card: "summary_large_image",
    title: "İletişim | Uluslararası Kültür ve Turizm Derneği",
    description: "Kültür ve turizm alanında birlikte çalışalım! ➡️"
  }
};

const ContactPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="İletişim"
        description="Derneğimiz ile ilgili her türlü soru, öneri ve işbirliği talepleriniz için bizimle iletişime geçebilirsiniz. Size en kısa sürede dönüş yapacağız."
      />

      <Contact />
    </>
  );
};

export default ContactPage;
