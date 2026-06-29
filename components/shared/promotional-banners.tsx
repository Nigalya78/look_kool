"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";

const banners = [
  {
    id: 1,
    badge: "TRENDING",
    title: "Kurtis",
    cta: "Explore Now",
    href: "/categories/kurtis",
    image: "https://images.unsplash.com/photo-1610030469629-276faf63f469?w=600&q=80",
  },
  {
    id: 2,
    badge: "25% OFF",
    title: "Tops",
    cta: "Explore Now",
    href: "/categories/tops",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80",
  },
  {
    id: 3,
    badge: "NEW",
    title: "Maxi Dresses",
    cta: "Explore Now",
    href: "/categories/maxi-dresses",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80",
  },
];

export function PromotionalBanners() {
  return (
    <section className="py-6 lg:py-20 bg-white">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-between mb-4 lg:mb-8"
        >
          <h2 className="text-sm font-bold tracking-wider text-[#111111] uppercase">
            Shop By Category
          </h2>
          <Link
            href="/products"
            className="text-xs font-semibold text-[#5B1E7A] hover:underline inline-flex items-center gap-1"
          >
            View all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {/* Mobile: horizontal scroll / Desktop: grid */}
        <div className="flex lg:grid lg:grid-cols-3 gap-4 sm:gap-5 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 pb-2">
          {banners.map((banner, i) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex-shrink-0 w-[260px] sm:w-[300px] lg:w-auto"
            >
              <Link
                href={banner.href}
                className="group relative block h-[200px] sm:h-[220px] lg:h-[300px] rounded-[28px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.14)] transition-all duration-300"
              >
                {/* Background Image */}
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 70vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Dark bottom gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Badge */}
                <div className="absolute top-4 left-4 bg-[#5B1E7A] text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-md">
                  {banner.badge}
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-semibold text-xl text-white mb-2">
                    {banner.title}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-white hover:text-white/80 transition-colors">
                    {banner.cta} <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
