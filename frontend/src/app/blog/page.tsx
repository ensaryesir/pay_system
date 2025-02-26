import { Metadata } from "next";
import BlogContent from "./BlogContent";
import Breadcrumb from "@/components/Common/Breadcrumb";

export const metadata: Metadata = {
  title: "Haberler & Duyurular | Uluslararası Kültür ve Turizm Derneği",
  description: "Küresel kültür projeleri, turizm işbirlikleri ve dernek etkinliklerine dair güncel haberleri keşfedin. Dünya kültür mirasını takip edin.",
  keywords: [
    "kültür haberleri",
    "turizm etkinlikleri",
    "uluslararası duyurular",
    "kültürel projeler",
    "dernek faaliyetleri",
    "global etkinlik takvimi"
  ],
  authors: [{ name: "Uluslararası Kültür ve Turizm Derneği", url: "https://ornekdernek.com" }],
  openGraph: {
    type: "website", 
    url: "https://ornekdernek.com/haberler",
    title: "Kültür-Turizm Gündemi | Uluslararası Haberler",
    description: "150+ ülkeden kültür ve turizm gelişmeleri tek platformda!",
    images: [{ url: "/images/global-haberler-banner.jpg" }] // Haber listesi için özel banner
  },
  alternates: {
    canonical: "https://ornekdernek.com/haberler"
  }
};

const Blog = () => {
  return (
    <>
      <Breadcrumb
        pageName="Haberler"
        description="Derneğimizin faaliyetleri, etkinlikleri ve duyurularını bu sayfada bulabilirsiniz."
      />
      <BlogContent />
    </>
  );
};

export default Blog;
