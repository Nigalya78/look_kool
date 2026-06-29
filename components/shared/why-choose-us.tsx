"use client";

import { motion } from "framer-motion";
import { Gem, Truck, Sparkles, Clock, Shield, Heart } from "lucide-react";

const features = [
  {
    icon: Gem,
    title: "Premium Quality",
    description: "Handpicked designer collections crafted with the finest fabrics and attention to detail.",
    color: "from-purple-500 to-purple-700",
  },
  {
    icon: Sparkles,
    title: "Latest Trends",
    description: "Stay ahead with our curated selection of trending styles and contemporary designs.",
    color: "from-pink-500 to-purple-600",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Enjoy quick 2-5 day delivery across India with real-time tracking on every order.",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "Shop with confidence using our 100% secure checkout with multiple payment options.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Our dedicated team is always ready to assist you with any queries or concerns.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Heart,
    title: "Boutique Service",
    description: "Experience personalized shopping with our fashion experts and styling advice.",
    color: "from-rose-500 to-pink-600",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function WhyChooseUs() {
  return (
    <section className="py-10 lg:py-14 bg-gradient-to-b from-purple-50 via-white to-purple-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent" />
      
      {/* Background Blobs */}
      <div className="absolute top-40 left-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-40 right-10 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl" />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium tracking-[0.2em] text-[#5B1E7A] mb-4 block">
            WHY LOOKKOOL
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#111111] mb-4">
            The LookKool Experience
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base lg:text-lg">
            We believe every woman deserves to look and feel her best. Discover why thousands choose us for their fashion needs.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group"
              >
                <div className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-premium transition-all duration-500 h-full border border-gray-100 hover:border-purple-200">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#111111] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover Accent */}
                  <div className="mt-6 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-[#5B1E7A] to-purple-400 transition-all duration-500" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
        >
          {[
            { value: "50K+", label: "Happy Customers" },
            { value: "10K+", label: "Products" },
            { value: "4.9", label: "Average Rating" },
            { value: "24h", label: "Support Response" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="font-[family-name:var(--font-playfair)] text-4xl lg:text-5xl font-bold text-gradient-purple mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 text-sm font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
