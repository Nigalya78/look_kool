"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";

const categories = [
  {
    id: 1,
    name: "New Arrivals",
    image: "https://images.unsplash.com/photo-1549488344-cbb6c34cf08b?w=400&q=80",
    link: "/products",
  },
  {
    id: 2,
    name: "Kurtis",
    image: "https://images.unsplash.com/photo-1610030469629-276faf63f469?w=400&q=80",
    link: "/categories/kurtis",
  },
  {
    id: 3,
    name: "Tops",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80",
    link: "/categories/tops",
  },
  {
    id: 4,
    name: "Maxi Dresses",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80",
    link: "/categories/maxi-dresses",
  },
  {
    id: 5,
    name: "Sarees",
    image: "https://images.unsplash.com/photo-1609245347659-30d6236adb8f?w=400&q=80",
    link: "/categories/sarees",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function CollectionCategories() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      checkScroll();
      return () => container.removeEventListener("scroll", checkScroll);
    }
  }, []);

  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: -150, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: 150, behavior: "smooth" });
    }
  };

  return (
    <section className="py-12 lg:py-16 bg-white relative">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-between mb-6"
        >
          <h2 className="text-sm font-bold tracking-wider text-[#111111] uppercase">
            Shop by Category
          </h2>
          <Link
            href="/products"
            className="text-xs font-semibold text-[#5B1E7A] hover:underline inline-flex items-center gap-1"
          >
            View all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {/* Mobile Navigation Arrows */}
        <div className="lg:hidden absolute left-2 top-1/2 mt-8 z-10">
          <button
            onClick={scrollLeft}
            className={`w-8 h-8 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center transition-opacity ${
              canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4 text-[#5B1E7A]" />
          </button>
        </div>
        <div className="lg:hidden absolute right-2 top-1/2 mt-8 z-10">
          <button
            onClick={scrollRight}
            className={`w-8 h-8 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center transition-opacity ${
              canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4 text-[#5B1E7A]" />
          </button>
        </div>

        {/* Categories - Horizontal Cards */}
        <div className="relative -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
          <motion.div
            ref={scrollContainerRef}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="flex items-stretch gap-3 sm:gap-4 lg:gap-5 overflow-x-auto pb-4 scrollbar-hide"
          >
            {categories.map((category) => (
              <motion.div key={category.id} variants={itemVariants} className="flex-shrink-0 w-[240px] sm:w-[280px] lg:w-[320px]">
                <Link
                  href={category.link}
                  className="group flex items-center gap-4 rounded-3xl bg-[#F8F4FB] p-3 pr-5 hover:bg-[#F0E6F5] hover:shadow-[0_8px_30px_rgba(91,30,122,0.10)] transition-all duration-300 h-full"
                >
                  {/* Square Image */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 bg-white">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="120px"
                    />
                  </div>

                  {/* Category Info */}
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm sm:text-base font-semibold text-[#111111] group-hover:text-[#5B1E7A] transition-colors duration-300 mb-1">
                      {category.name}
                    </span>
                    <span className="text-xs font-semibold text-[#5B1E7A] inline-flex items-center gap-1">
                      Explore Now <ChevronRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
