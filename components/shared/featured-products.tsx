"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/shop/product-card";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number | null;
  discount?: string | null;
  rating: number;
  reviews: number;
  img: string;
  category: { name: string; slug: string };
  memberPrice?: number | null;
  stock?: number;
  variantId?: string | null;
  hasVariants?: boolean;
  description?: string;
}

interface FeaturedProductsProps {
  products: Product[];
  isMember: boolean;
}

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

export function FeaturedProducts({ products, isMember }: FeaturedProductsProps) {
  const displayProducts = products.slice(0, 8);

  return (
    <section className="pt-8 pb-10 lg:pt-10 lg:pb-14 bg-white">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#5B1E7A] mb-1">Best Sellers</p>
            <h2 className="text-3xl font-[family-name:var(--font-playfair)] font-semibold text-[#111111]">
              Discover Your Style
            </h2>
          </div>
          
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          {displayProducts.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard
                product={{
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  description: product.description ?? "",
                  basePrice: product.price,
                  comparePrice: product.originalPrice ?? null,
                  memberPrice: product.memberPrice ?? null,
                  stock: product.stock ?? 99,
                  images: [product.img],
                  material: null,
                  hasVariants: product.hasVariants ?? false,
                  category: product.category,
                  reviewCount: product.reviews,
                  variant: product.variantId ? { id: product.variantId, price: product.price, comparePrice: product.originalPrice ?? null, memberPrice: product.memberPrice ?? null, stock: product.stock ?? 99, image: product.img } : null,
                }}
                isMember={isMember}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button - desktop only */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="hidden lg:block text-center mt-12"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 border-2 border-[#5B1E7A] text-[#5B1E7A] hover:bg-[#5B1E7A] hover:text-white font-medium text-sm px-8 py-4 rounded-full transition-all duration-300 group"
          >
            View All Products
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

