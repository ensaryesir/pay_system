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
  title: "Uluslararasi Kultur ve Turizm Dernegi",
  description: "Discover and book authentic cultural experiences with local heritage experts and guides",
  // other metadata
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
