"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Truck, Sparkles } from "lucide-react";

type AnnouncementType = "DELIVERY" | "OFFER";

interface Announcement {
  id: string;
  text: string;
  type: AnnouncementType;
}

function typeIcon(type: AnnouncementType) {
  return type === "DELIVERY" ? Truck : Sparkles;
}

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [items, setItems] = useState<Announcement[] | null>(null);

  useEffect(() => {
    fetch("/api/announcements")
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d.announcements) && d.announcements.length > 0) {
          setItems(d.announcements);
        } else {
          setItems([]);
        }
      })
      .catch(() => setItems([]));
  }, []);

  useEffect(() => {
    if (!items || items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [items]);

  // null = still loading (hide bar); [] = no DB announcements (hide bar)
  if (!isVisible || !items || items.length === 0) return null;

  const current = items[currentIndex];
  const Icon = typeIcon(current.type);

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
