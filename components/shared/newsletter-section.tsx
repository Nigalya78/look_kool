"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Sparkles, Check } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-purple-50 via-white to-purple-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent" />
      
      {/* Background Blobs */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl" />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 bg-purple-100 text-[#5B1E7A] px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Join 50,000+ Fashion Lovers</span>
            </div>

            <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#111111] mb-4 leading-tight">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-gray-600 text-base lg:text-lg mb-8 max-w-lg">
              Be the first to know about new arrivals, exclusive offers, styling tips, and special discounts delivered straight to your inbox.
            </p>

            {/* Benefits */}
            <div className="space-y-3">
              {[
                "Early access to sales and promotions",
                "Exclusive member-only discounts",
                "Style guides and fashion tips",
                "New collection previews",
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-[#5B1E7A] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-700 text-sm">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-luxury border border-purple-100 relative overflow-hidden">
              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-100 to-transparent rounded-bl-full" />
              
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[#111111] mb-2">
                    Welcome to LookKool!
                  </h3>
                  <p className="text-gray-600">
                    Check your inbox for a special welcome offer.
                  </p>
                </motion.div>
              ) : (
                <>
                  <div className="relative z-10">
                    <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[#111111] mb-2">
                      Get 15% Off Your First Order
                    </h3>
                    <p className="text-gray-600 text-sm mb-6">
                      Subscribe now and receive an exclusive discount code
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-[#5B1E7A] focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#5B1E7A] text-white py-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#4A1863] transition-colors disabled:opacity-70 disabled:cursor-not-allowed group"
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            Subscribe Now
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </form>

                    <p className="text-xs text-gray-500 mt-4 text-center">
                      By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Decorative Image */}
            <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-2xl overflow-hidden shadow-lg hidden lg:block">
              <Image
                src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=200&q=80"
                alt="Fashion"
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
