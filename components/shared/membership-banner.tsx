"use client";

import Link from "next/link";
import { Crown, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function MembershipBanner() {
  return (
    <section className="py-6 lg:py-10 px-4 sm:px-6 lg:px-8 xl:px-12 bg-white">
      <div className="max-w-screen-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-[#5B1E7A] via-[#6B2FA3] to-[#5B1E7A] px-5 py-5 sm:px-8 sm:py-6 shadow-[0_10px_40px_rgba(91,30,122,0.22)]"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-sm">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm sm:text-base font-bold text-white leading-tight">
                JOIN LOOKKOOL MEMBERSHIP
              </p>
              <p className="text-[10px] sm:text-xs text-white/80 mt-0.5 leading-tight">
                Exclusive offers, early access & extra discounts!
              </p>
            </div>
          </div>
          <Link
            href="/account/membership"
            className="shrink-0 inline-flex items-center gap-1 bg-white text-[#5B1E7A] text-xs sm:text-sm font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            JOIN NOW <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
