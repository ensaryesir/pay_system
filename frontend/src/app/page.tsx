import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Blog from "@/components/Blog";
import Brands from "@/components/Brands";
import ScrollUp from "@/components/Common/ScrollUp";
import Contact from "@/components/Contact";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import Video from "@/components/Video";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Uluslararası Kültür ve Turizm Derneği | Kültürel Keşifler ve Turizm",
  description: "Uluslararası Kültür ve Turizm Derneği ile yerel kültürel miras uzmanları ve rehberler eşliğinde otantik deneyimler keşfedin.",
  keywords: ["kültür", "turizm", "uluslararası dernek", "kültürel miras", "seyahat", "rehberli turlar"],
  authors: [{ name: "Uluslararası Kültür ve Turizm Derneği", url: "https://ornekdernek.com" }],
  openGraph: {
    type: "website",
    url: "https://ornekdernek.com",
    title: "Uluslararası Kültür ve Turizm Derneği",
    description: "Kültürel miras ve turizm deneyimlerini keşfedin.",
    siteName: "Uluslararası Kültür ve Turizm Derneği",
  },
};

export default function Home() {
  return (
    <>
      <ScrollUp />
      <Hero /> {/* Main */}
      <Features /> {/* one cikan ozellikler */}
      <Video /> {/* video kismi */}
      <Brands /> {/* partner ve ortak kuruluslarimiz */}
      <AboutSectionOne /> {/* hakkimizda 1 */}
      <AboutSectionTwo /> {/* hakkimizda 2 */}
      <Testimonials /> {/* yonetim kurulumuz */}

      {/* <Pricing /> */}

      <Blog /> {/* haberler */}
      <Contact />  {/* iletisim */}
    </>
  );
}
