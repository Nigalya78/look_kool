"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type AnimVariant = "fade-up" | "fade-in" | "slide-left" | "slide-right" | "scale-in";

interface AnimateInProps {
  children: React.ReactNode;
  variant?: AnimVariant;
  delay?: number;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  threshold?: number;
  style?: React.CSSProperties;
}

const VARIANT_CLASS: Record<AnimVariant, string> = {
  "fade-up":     "animate-fade-up",
  "fade-in":     "animate-fade-in",
  "slide-left":  "animate-slide-left",
  "slide-right": "animate-slide-right",
  "scale-in":    "animate-scale-in",
};

export function AnimateIn({
  children,
  variant = "fade-up",
  delay = 0,
  className,
  as: Tag = "div",
  threshold = 0.15,
  style,
}: AnimateInProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const Component = Tag as React.ElementType;

  const animationStyle = triggered && delay > 0 ? { animationDelay: `${delay}ms` } : {};
  const combinedStyle = { ...animationStyle, ...style };

  return (
    <Component
      ref={ref}
      className={cn(
        triggered ? VARIANT_CLASS[variant] : "opacity-0",
        className
      )}
      style={Object.keys(combinedStyle).length > 0 ? combinedStyle : undefined}
    >
      {children}
    </Component>
  );
}
