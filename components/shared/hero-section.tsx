"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const rightCards = [
  {
    badge: "TRENDING",
    eyebrow: "TRENDING NOW",
    title: "Kurtis",
    subtitle: "Collection",
    href: "/categories/kurtis",
    image: "https://images.unsplash.com/photo-1610030469629-276faf63f469?w=400&q=80",
  },
  {
    badge: "25% OFF",
    eyebrow: "BEST SELLERS",
    title: "Tops",
    subtitle: "Collection",
    href: "/categories/tops",
    image: "https://images.unsplash.com/photo-1610030469629-276faf63f469?w=400&q=80",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.1 + i * 0.15, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-purple-50 via-white to-purple-100 py-4 sm:py-8 lg:py-12">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.35fr_1fr] gap-4 lg:gap-6">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="order-2 lg:order-1 flex flex-col justify-center text-center lg:text-left py-6 lg:py-0"
          >
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-[#5B1E7A] uppercase mb-3 sm:mb-4">
              NEW ARRIVALS
            </span>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-[42px] xl:text-5xl font-bold text-[#111111] leading-[1.1] mb-2 sm:mb-3">
              THE BEST<br className="hidden lg:block" /> FASHION
            </h1>
            <h2 className="font-[family-name:var(--font-playfair)] text-xl sm:text-2xl lg:text-3xl font-semibold text-[#5B1E7A] italic mb-4 sm:mb-6">
              Style For You
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-xs mx-auto lg:mx-0 mb-5 sm:mb-7">
              Discover our curated collection of premium women&apos;s fashion. From elegant ethnic wear to trendy outfits.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-[#5B1E7A] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold hover:bg-[#4A1863] hover:scale-105 transition-all duration-300 w-fit mx-auto lg:mx-0 shadow-lg shadow-purple-900/20"
            >
              SHOP NOW
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Center: Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 lg:order-2 relative h-[380px] sm:h-[420px] lg:h-[520px] xl:h-[560px] rounded-3xl overflow-hidden bg-[#faf8fc] shadow-[0_12px_40px_rgba(91,30,122,0.12)]"
          >
            {/* Decorative blob */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#5B1E7A]/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-300/20 rounded-full blur-3xl" />
            <Image
              src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&q=80"
              alt="Fashion Model"
              fill
              className="object-cover object-top"
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
            />

            
          </motion.div>

          {/* Right: Stacked Cards */}
          <div className="order-3 hidden lg:flex flex-col gap-4 lg:gap-6">
            {rightCards.map((card, i) => (
              <motion.div
                key={card.title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="group relative flex-1 rounded-3xl overflow-hidden bg-[#F0E6F5] shadow-[0_8px_30px_rgba(91,30,122,0.08)] hover:shadow-[0_12px_40px_rgba(91,30,122,0.14)] transition-all duration-300"
              >
                <div className="absolute right-0 top-0 bottom-0 w-[45%] h-full">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    sizes="20vw"
                  />
                </div>
                <div className="absolute top-4 right-4 bg-[#5B1E7A] text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-md">
                  {card.badge}
                </div>
                <div className="relative h-full p-6 xl:p-7 flex flex-col justify-center max-w-[55%]">
                  <span className="text-[10px] font-bold tracking-[0.15em] text-[#5B1E7A] uppercase mb-1.5">
                    {card.eyebrow}
                  </span>
                  <h3 className="text-xl xl:text-2xl font-semibold text-[#111111] mb-1">
                    {card.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">{card.subtitle}</p>
                  <Link
                    href={card.href}
                    className="text-xs font-semibold text-[#5B1E7A] hover:underline inline-flex items-center gap-1 w-fit"
                  >
                    Explore Now <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
