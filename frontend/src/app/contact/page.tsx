import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim | Uluslararası Kültür ve Turizm Derneği",
  description: "Uluslararası Kültür ve Turizm Derneği ile iletişime geçin. Sorularınız, önerileriniz ve işbirliği talepleriniz için bize ulaşın.",
  // other metadata
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
