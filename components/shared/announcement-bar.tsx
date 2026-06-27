"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Truck, Sparkles } from "lucide-react";

const announcements = [
  {
    icon: Sparkles,
    text: "Festive Season Sale — Up to 50% Off",
  },
  {
    icon: Truck,
    text: "Free Shipping on Orders Above ₹999",
  },
  {
    icon: Sparkles,
    text: "New Collection Arrived — Shop the Latest Trends",
  },
];

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const current = announcements[currentIndex];
  const Icon = current.icon;

  return (
    <div className="bg-[#5B1E7A] text-white py-2.5 relative z-50">
      <div className="max-w-screen-2xl mx-auto relative flex items-center justify-center px-12 sm:px-32 lg:px-36">
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium tracking-wide text-center w-full overflow-hidden">
          <Icon className="w-4 h-4 text-white/80 shrink-0" />
          <span className="truncate">{current.text}</span>
        </div>
        <Link
          href="/products"
          className="hidden sm:inline-flex items-center gap-1 bg-white text-[#5B1E7A] text-xs font-bold px-3 py-1.5 rounded-full hover:bg-white/90 transition-colors shrink-0 absolute right-12 sm:right-32 lg:right-36 top-1/2 -translate-y-1/2"
        >
          Shop Now
        </Link>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/15 rounded-full transition-colors"
          aria-label="Close announcement"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
