"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, ArrowRight, ChevronRight, ImageOff } from "lucide-react";
import { useState } from "react";

// Simple SVG placeholder for broken images
const PLACEHOLDER_SVG = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23f3f4f6"/><text x="200" y="200" text-anchor="middle" fill="%239ca3af" font-size="16">No Image</text></svg>';

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
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-between mb-6"
        >
          <h2 className="text-sm font-bold tracking-wider text-[#111111] uppercase">
            Best Sellers
          </h2>
          <Link
            href="/products"
            className="text-xs font-semibold text-[#5B1E7A] hover:underline inline-flex items-center gap-1"
          >
            View all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
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
              <ProductCard product={product} isMember={isMember} />
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

function ProductCard({ product, isMember }: { product: Product; isMember: boolean }) {
  const finalPrice = (isMember && product.memberPrice && product.memberPrice > 0) ? product.memberPrice : product.price;
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group">
      {/* Image Container */}
      <div className="relative aspect-[3/4] rounded-2xl lg:rounded-3xl overflow-hidden bg-gray-100 mb-3 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(91,30,122,0.12)] transition-all duration-300">
        <Link href={`/products/${product.slug}`} className="block h-full w-full">
          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <ImageOff className="h-8 w-8 text-gray-300 mx-auto mb-1" />
                <span className="text-xs text-gray-400">No image</span>
              </div>
            </div>
          ) : (
            <Image
              src={product.img || PLACEHOLDER_SVG}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={() => setImageError(true)}
            />
          )}
        </Link>

        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-3 left-3 bg-[#5B1E7A] text-white text-[10px] font-bold px-2 py-1 rounded-full">
            {product.discount}
          </div>
        )}

        {/* Wishlist - always visible on mobile, hover on desktop */}
        <button
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 text-[#111111] flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:hover:bg-[#5B1E7A] lg:hover:text-white active:bg-[#5B1E7A] active:text-white transition-all duration-300 shadow-md"
          aria-label="Add to wishlist"
        >
          <Heart className="w-4 h-4" />
        </button>

        {/* Member Badge */}
        {product.memberPrice && product.memberPrice > 0 && (
          <div className="absolute top-3 left-3 mt-6 bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-1 rounded-full">
            Member Price
          </div>
        )}

        {/* Quick Add - Desktop hover only */}
        <button
          className="absolute bottom-3 left-3 right-3 bg-white text-[#111111] py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-[#5B1E7A] hover:text-white transition-all duration-300 shadow-lg"
          aria-label="Add to cart"
        >
          <ShoppingBag className="w-4 h-4" />
          Add to Cart
        </button>
      </div>

      {/* Product Info */}
      <div>
        {/* Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-medium text-[#111111] text-sm mb-2 line-clamp-2 group-hover:text-[#5B1E7A] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-[#111111]">₹{finalPrice.toLocaleString()}</span>
          {product.originalPrice && product.originalPrice > finalPrice && (
            <>
              <span className="text-sm text-gray-400 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-[#5B1E7A] bg-purple-50 px-1.5 py-0.5 rounded">
                {product.discount}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
