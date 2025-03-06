import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımızda | Uluslararası Kültür ve Turizm Derneği",
  description: "Uluslararası Kültür ve Turizm Derneği olarak; kültürel mirası koruma, turizm işbirlikleri geliştirme ve küresel kültür diyaloğunu destekleme misyonuyla çalışıyoruz.",
  keywords: [
    "hakkımızda",
    "dernek misyonu",
    "kültürel miras",
    "turizm işbirlikleri",
    "uluslararası organizasyon",
    "küresel kültür"
  ],
  authors: [{ name: "Uluslararası Kültür ve Turizm Derneği", url: "https://ornekdernek.com" }],
  openGraph: {
    type: "website",
    url: "https://ornekdernek.com/hakkimizda",
    title: "Küresel Kültür Elçisi | Derneğimizin Hikayesi",
    description: "85+ ülkede kültürel köprüler kuran derneğimizin vizyoner yaklaşımını keşfedin.",
    images: [{ url: "/images/dernek-ekibi.jpg" }] // Takım fotoğrafı veya infografik
  },
  alternates: {
    canonical: "https://ornekdernek.com/hakkimizda"
  }
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Hakkımızda"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. In varius eros eget sapien consectetur ultrices. Ut quis dapibus libero."
      />
      <AboutSectionOne />
      <AboutSectionTwo />
    </>
  );
};

export default AboutPage;
