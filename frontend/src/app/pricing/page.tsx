import Breadcrumb from "@/components/Common/Breadcrumb";
import PaymentForm from "@/components/Pricing";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bağış Yap | Uluslararası Kültür ve Turizm Derneği",
  description: "Uluslararası Kültür ve Turizm Derneği'ne bağış yaparak kültürel mirasın korunmasına ve sürdürülebilir turizm projelerine destek olun.",
  keywords: [
    "bağış yap", 
    "kültür derneği bağış", 
    "turizm derneği destek", 
    "kültürel miras koruma", 
    "sürdürülebilir turizm desteği"
  ],
  authors: [{ name: "Uluslararası Kültür ve Turizm Derneği", url: "https://ornekdernek.com" }],
  openGraph: {
    type: "website",
    url: "https://ornekdernek.com/bagis",
    title: "Bağış Yap | Uluslararası Kültür ve Turizm Derneği",
    description: "Kültürel mirasın korunması ve sürdürülebilir turizm projelerine destek olmak için bağış yapın.",
    images: [{ url: "/images/bagis-og.jpg" }]
  },
};

const PricingPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Bağış Yap"
        description="Derneğimize bağış yaparak kültürel mirasın korunmasına ve sürdürülebilir turizm projelerine destek olabilirsiniz."
      />

      <PaymentForm />
    </>
  );
};

export default PricingPage;