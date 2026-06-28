"use client";

import { Truck, Wallet, RefreshCw, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Quick dispatch on all orders",
  },
  {
    icon: Wallet,
    title: "COD Available",
    description: "Cash on delivery",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "Hassle free returns",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description: "100% secure checkout",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export function FeatureStrip() {
  return (
    <section className="py-6 lg:py-10 bg-white">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4"
        >
          {features.map(({ icon: Icon, title, description }) => (
            <motion.div
              key={title}
              variants={itemVariants}
              className="flex items-center gap-3 rounded-2xl bg-white border border-gray-100 p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(91,30,122,0.08)] hover:border-purple-100 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-[#5B1E7A]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#111111] leading-tight">{title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-tight">{description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
