"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  images: string[];
  basePrice: number;
  comparePrice: number | null;
  memberPrice: number | null;
  hasVariants: boolean;
  material: string | null;
  productVariants: {
    price: number;
    comparePrice: number | null;
    stock: number;
  }[];
}

interface RecommendedProductsProps {
  categoryId: string;
  currentProductId: string;
  initialProducts: Product[];
}

export function RecommendedProducts({
  categoryId,
  currentProductId,
  initialProducts,
}: RecommendedProductsProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 4;
  const totalPages = Math.ceil(initialProducts.length / productsPerPage);

  const paginatedProducts = initialProducts.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );

  const handlePrev = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  if (initialProducts.length === 0) return null;

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">You Might Also Like</h2>
          <p className="text-sm text-muted-foreground mt-0.5">More from the same collection</p>
        </div>
        <Link
          href="/products"
          className="text-sm font-medium text-primary hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="relative">
        {/* Previous Arrow */}
        {totalPages > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-border flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Previous products"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
        )}

        {/* Next Arrow */}
        {totalPages > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-border flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Next products"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {paginatedProducts.map((product) => {
          const displayPrice =
            product.hasVariants && product.productVariants[0]
              ? product.productVariants[0].price
              : product.basePrice;
          const displayCompare =
            product.hasVariants && product.productVariants[0]
              ? product.productVariants[0].comparePrice
              : product.comparePrice;
          const hasDiscount =
            displayCompare && displayCompare > displayPrice;
          const discountPct = hasDiscount
            ? Math.round(((displayCompare - displayPrice) / displayCompare) * 100)
            : 0;

          return (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group bg-white rounded-xl border border-border overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[4/3] bg-muted overflow-hidden shrink-0">
                <Image
                  src={product.images[0] ?? "/placeholder.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                {hasDiscount && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-destructive text-white text-xs font-semibold rounded-md">
                    -{discountPct}%
                  </span>
                )}
              </div>
              <div className="p-3 flex flex-col flex-1">
                <p className="text-xs text-muted-foreground line-clamp-1">{product.material}</p>
                <h3 className="mt-0.5 text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-sm font-bold text-foreground">
                    ₹{displayPrice.toLocaleString()}
                  </span>
                  {hasDiscount && (
                    <span className="text-xs text-muted-foreground line-through">
                      ₹{displayCompare!.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
        </div>

        {/* Pagination Dots */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentPage ? "bg-[#5B1E7A]" : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
