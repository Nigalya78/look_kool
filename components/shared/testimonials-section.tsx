"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Fashion Blogger",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    rating: 5,
    text: "LookKool has completely transformed my wardrobe! The quality of their ethnic wear is exceptional, and the designs are so unique. I get compliments every time I wear their outfits. The customer service is also top-notch!",
  },
  {
    id: 2,
    name: "Ananya Patel",
    role: "Marketing Executive",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    rating: 5,
    text: "I ordered my wedding lehenga from LookKool and it was absolutely stunning! The craftsmanship, the fabric quality, and the fit were perfect. They made my special day even more memorable. Highly recommend!",
  },
  {
    id: 3,
    name: "Ritu Gupta",
    role: "Interior Designer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    rating: 5,
    text: "The western wear collection is amazing! I love how they blend contemporary trends with comfort. Fast delivery and the packaging is so premium. LookKool is now my go-to for all fashion needs.",
  },
  {
    id: 4,
    name: "Meera Reddy",
    role: "Software Engineer",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
    rating: 5,
    text: "Finally found a boutique that understands what modern Indian women want! The mix of traditional and contemporary styles is perfect. The sizes are accurate and the return policy is hassle-free.",
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <section className="py-10 lg:py-14 bg-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-100/50 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl" />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-[#5B1E7A] mb-1">Testimonials</p>
          <h2 className="text-3xl font-[family-name:var(--font-playfair)] font-semibold text-[#111111]">
            What Our Customers Say
          </h2>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Quote Icon */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 opacity-10">
              <Quote className="w-24 h-24 text-[#5B1E7A]" />
            </div>

            {/* Main Content */}
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-3xl p-8 lg:p-12 shadow-premium border border-purple-100">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="text-center"
                >
                  {/* Stars */}
                  <div className="flex justify-center gap-1 mb-6">
                    {[...Array(current.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="font-[family-name:var(--font-cormorant)] text-xl lg:text-2xl text-gray-700 italic leading-relaxed mb-8">
                    &ldquo;{current.text}&rdquo;
                  </blockquote>

                  {/* Author */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden ring-4 ring-purple-100 mb-4">
                      <Image
                        src={current.avatar}
                        alt={current.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <h4 className="font-semibold text-[#111111] text-lg">
                      {current.name}
                    </h4>
                    <p className="text-gray-500 text-sm">
                      {current.role}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={prevTestimonial}
                  className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-[#5B1E7A] hover:shadow-lg transition-all"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Indicators */}
                <div className="flex gap-2">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setDirection(idx > currentIndex ? 1 : -1);
                        setCurrentIndex(idx);
                      }}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === currentIndex
                          ? "w-8 bg-[#5B1E7A]"
                          : "w-2 bg-gray-300 hover:bg-gray-400"
                      }`}
                      aria-label={`Go to testimonial ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextTestimonial}
                  className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-[#5B1E7A] hover:shadow-lg transition-all"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Mini Avatars */}
          <div className="flex justify-center gap-4 mt-8">
            {testimonials.map((testimonial, idx) => (
              <button
                key={testimonial.id}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`relative w-12 h-12 rounded-full overflow-hidden transition-all duration-300 ${
                  idx === currentIndex
                    ? "ring-2 ring-[#5B1E7A] ring-offset-2 scale-110"
                    : "opacity-50 hover:opacity-80"
                }`}
              >
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
