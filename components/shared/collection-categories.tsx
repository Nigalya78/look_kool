"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";

interface DbCategory {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  _count: {
    products: number;
  };
}

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 800 800'%3E%3Crect width='800' height='800' fill='%23F3EDF7'/%3E%3C/svg%3E";

export function CollectionCategories() {
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const scrollStartX = useRef(0);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) setCategories(data.data);
      })
      .catch(() => {});
  }, []);

  const updateState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const pos = el.scrollLeft;
    setProgress(max > 0 ? pos / max : 0);
    setCanPrev(pos > 4);
    setCanNext(pos < max - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateState, { passive: true });
    updateState();
    return () => el.removeEventListener("scroll", updateState);
  }, [updateState, categories]);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const cardW = (el.querySelector("div") as HTMLElement | null)?.offsetWidth ?? 300;
    el.scrollBy({ left: dir * (cardW + 20), behavior: "smooth" });
  };

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    scrollStartX.current = trackRef.current?.scrollLeft ?? 0;
    e.preventDefault();
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    trackRef.current.scrollLeft = scrollStartX.current - (e.clientX - dragStartX.current);
  };
  const onMouseUp = () => { isDragging.current = false; };

  return (
    <section className="pt-6 pb-2 lg:pt-12 lg:pb-4 bg-white">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">

        {/* Header */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#5B1E7A] mb-1">Collections</p>
          <h2 className="text-3xl font-[family-name:var(--font-playfair)] font-semibold text-[#111111]">
            Shop By Category
          </h2>
        </div>

        {/* Slider track */}
        <div
          ref={trackRef}
          className="flex gap-5 overflow-x-auto scroll-smooth pb-2 cursor-grab active:cursor-grabbing select-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="shrink-0 w-[220px] sm:w-[260px] md:w-[300px]"
            >
              <Link
                href={`/categories/${category.slug}`}
                className="group relative block h-[220px] sm:h-[260px] md:h-[320px] rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(91,30,122,0.16)] transition-all duration-300"
                draggable={false}
              >
                <Image
                  src={category.image || PLACEHOLDER}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width:640px)220px,(max-width:768px)260px,300px"
                  unoptimized={!category.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-4 left-4 rounded-full bg-[#5B1E7A] px-3 py-1.5 text-[10px] font-bold text-white shadow-md">
                  {category._count.products} Products
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="mb-1.5 text-lg font-semibold text-white">{category.name}</h3>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-white/80 group-hover:text-white transition-colors">
                    Explore Now <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-5 h-[2px] bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#5B1E7A] rounded-full transition-all duration-150"
            style={{ width: `${Math.max(8, progress * 100)}%` }}
          />
        </div>

        {/* Bottom controls */}
        <div className="mt-5 flex items-center justify-between">
          <Link
            href="/products"
            className="flex items-center gap-1.5 text-sm font-medium text-[#5B1E7A] hover:gap-2.5 transition-all duration-200"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
          <div className="flex gap-2">
            <button
              onClick={() => scrollBy(-1)}
              disabled={!canPrev}
              aria-label="Scroll left"
              className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow-sm transition-all duration-200 hover:border-[#5B1E7A] hover:text-[#5B1E7A] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollBy(1)}
              disabled={!canNext}
              aria-label="Scroll right"
              className="w-9 h-9 rounded-full bg-[#5B1E7A] text-white flex items-center justify-center shadow-md transition-all duration-200 hover:bg-[#4a1870] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}