"use client"; // Slider için client-side rendering gerekli

import { useRef, useEffect, useState } from "react";
import { Brand } from "@/types/brand";
import Image from "next/image";
import brandsData from "./brandsData";

const Brands = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      
      // If we've scrolled to the end, jump to the start
      if (scrollLeft + clientWidth >= scrollWidth) {
        sliderRef.current.scrollLeft = 0;
      }
      // If we've scrolled past the start (backwards), jump to the end
      else if (scrollLeft <= 0) {
        sliderRef.current.scrollLeft = scrollWidth - clientWidth;
      }
    }
  };

  const handleWheel = (e: WheelEvent) => {
    setIsAutoScrolling(false); // Pause auto-scroll on manual interaction
    if (sliderRef.current) {
      e.preventDefault();
      sliderRef.current.scrollLeft += e.deltaY;
      handleScroll();
    }
  };

  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (slider) {
        slider.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  useEffect(() => {
    let autoScrollInterval: NodeJS.Timeout;

    if (isAutoScrolling) {
      autoScrollInterval = setInterval(() => {
        if (sliderRef.current) {
          sliderRef.current.scrollBy({ left: 200, behavior: "smooth" });
          handleScroll();
        }
      }, 3000); // Auto scroll every 3 seconds
    }

    return () => {
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
      }
    };
  }, [isAutoScrolling]);

  const scrollLeft = () => {
    setIsAutoScrolling(false); // Pause auto-scroll on manual interaction
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -200, behavior: "smooth" });
      handleScroll();
    }
  };

  const scrollRight = () => {
    setIsAutoScrolling(false); // Pause auto-scroll on manual interaction
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 200, behavior: "smooth" });
      handleScroll();
    }
  };

  return (
    <section className="py-16 md:py-20">
      <div className="container relative">
        <h3 className="mb-12 text-center text-3xl font-semibold text-dark dark:text-white">
          <br></br>
          Partner ve Ortak Kuruluşlarımız
        </h3>

        {/* Slider Container */}
        <div className="relative px-16 overflow-hidden">
          {/* Scroll Buttons */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-primary p-1.5 text-white shadow-lg hover:bg-primary/90"
            aria-label="Önceki logolar"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-primary p-1.5 text-white shadow-lg hover:bg-primary/90"
            aria-label="Sonraki logolar"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Slider */}
          <div
            ref={sliderRef}
            className="no-scrollbar flex gap-8 overflow-x-auto scroll-smooth py-4 scrollbar-hide" // Adjusted gap and padding
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {brandsData.map((brand) => (
              <SingleBrand key={brand.id} brand={brand} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const SingleBrand = ({ brand }: { brand: Brand }) => {
  return (
    <div className="flex-shrink-0">
      <a
        href={brand.href}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block h-32 w-64 opacity-75 transition-all hover:opacity-100 hover:scale-105"
      >
        <Image
          src={brand.image}
          alt={brand.name}
          fill
          className="object-contain"
        />
      </a>
    </div>
  );
};

export default Brands;