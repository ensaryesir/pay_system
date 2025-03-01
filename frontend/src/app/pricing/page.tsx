import Breadcrumb from "@/components/Common/Breadcrumb";
import Pricing from "@/components/Pricing";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fiyatlandırma | Uluslararası Kültür ve Turizm Derneği",
  description: "Uluslararası Kültür ve Turizm Derneği üyelik paketleri ve fiyatlandırma seçenekleri. Kültürel deneyimlere erişim için üyelik fırsatlarını keşfedin.",
  keywords: [
    "üyelik paketleri",
    "fiyatlandırma",
    "kültür derneği üyeliği",
    "turizm etkinlikleri",
    "üyelik avantajları",
    "kültürel deneyimler"
  ],
  authors: [{ name: "Uluslararası Kültür ve Turizm Derneği", url: "https://ornekdernek.com" }],
  openGraph: {
    type: "website",
    url: "https://ornekdernek.com/pricing",
    title: "Üyelik Paketleri | Kültür ve Turizm Fırsatları",
    description: "Kültürel deneyimlere erişim için üyelik seçeneklerimizi inceleyin.",
    siteName: "Uluslararası Kültür ve Turizm Derneği",
  },
};

const PricingPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Fiyatlandırma"
        description="Derneğimizin sunduğu üyelik paketleri ve fiyatlandırma seçeneklerini inceleyin. Size en uygun paketi seçerek kültürel deneyimlere erişim sağlayın."
      />
      <Pricing />
    </>
  );
};

export default PricingPage;