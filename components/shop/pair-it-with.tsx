"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Heart } from "lucide-react";
import { motion } from "framer-motion";

interface PairedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  category: string;
}

interface PairItWithProps {
  products?: PairedProduct[];
}

const defaultPairedProducts: PairedProduct[] = [
  {
    id: "1",
    name: "Classic White Sneakers",
    slug: "classic-white-sneakers",
    price: 2499,
    originalPrice: 2999,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80",
    category: "Footwear",
  },
  {
    id: "2",
    name: "Leather Crossbody Bag",
    slug: "leather-crossbody-bag",
    price: 1899,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80",
    category: "Handbags",
  },
  {
    id: "3",
    name: "Gold Statement Earrings",
    slug: "gold-statement-earrings",
    price: 899,
    originalPrice: 1299,
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400&q=80",
    category: "Jewelry",
  },
];

export function PairItWith({ products = defaultPairedProducts }: PairItWithProps) {
  return (
    <section className="py-8 border-t border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[#111111]">Pair It With</h3>
          <p className="text-sm text-gray-500 mt-0.5">Complete your look with these items</p>
        </div>
        <Link
          href="/products"
          className="text-sm font-medium text-[#5B1E7A] hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <Link href={`/products/${product.slug}`}>
              <div className="relative aspect-square bg-gray-100 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                {product.originalPrice && (
                  <span className="absolute top-2 left-2 px-2 py-1 bg-[#5B1E7A] text-white text-xs font-bold rounded">
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                )}
                <button
                  className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#5B1E7A] hover:text-white"
                  aria-label="Add to wishlist"
                >
                  <Heart className="w-4 h-4" />
                </button>
              </div>
            </Link>

            <div className="p-4">
              <p className="text-xs text-gray-500 mb-1">{product.category}</p>
              <Link href={`/products/${product.slug}`}>
                <h4 className="font-medium text-[#111111] text-sm mb-2 line-clamp-1 group-hover:text-[#5B1E7A] transition-colors">
                  {product.name}
                </h4>
              </Link>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#111111]">₹{product.price.toLocaleString()}</span>
                  {product.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <button
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#5B1E7A] hover:text-white transition-colors"
                  aria-label="Add to cart"
                >
                  <ShoppingBag className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
