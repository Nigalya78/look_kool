"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, ShoppingCart, Check } from "lucide-react";
import { WishlistToggleButton } from "./wishlist-toggle-button";
import { ProductPopupModal } from "./product-popup-modal";
import { useCartStore } from "@/store/cart";

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
  stock: number;
  category: { name: string; slug: string };
  productVariants: {
    id: string;
    price: number;
    comparePrice: number | null;
    memberPrice: number | null;
    stock: number;
  }[];
}

interface RecommendedProductsProps {
  categoryId: string;
  currentProductId: string;
  initialProducts: Product[];
  isMember?: boolean;
}

function RecommendedCard({ product, isMember = false }: { product: Product; isMember?: boolean }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const isInCartRaw = useCartStore((state) => state.isInCart(product.id, null));

  useEffect(() => { setMounted(true); }, []);
  const isInCart = mounted && isInCartRaw;

  const variant = product.hasVariants && product.productVariants[0] ? product.productVariants[0] : null;
  const displayPrice = (variant?.price && variant.price > 0) ? variant.price : product.basePrice;
  const displayCompare = (variant?.comparePrice && variant.comparePrice > 0) ? variant.comparePrice : product.comparePrice;
  const displayStock = variant?.stock ?? product.stock;
  const displayMemberPrice = (variant?.memberPrice && variant.memberPrice > 0) ? variant.memberPrice : product.memberPrice;
  const hasDiscount = !!(displayCompare && displayCompare > displayPrice);
  const discountPct = hasDiscount ? Math.round(((displayCompare! - displayPrice) / displayCompare!) * 100) : 0;

  const popupProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: isMember && displayMemberPrice && displayMemberPrice > 0 ? displayMemberPrice : displayPrice,
    memberPrice: displayMemberPrice,
    images: product.images.length ? product.images : ["/placeholder.jpg"],
    stock: displayStock,
    description: "",
    variantId: variant?.id ?? null,
  };

  const wishlistProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: displayPrice,
    comparePrice: displayCompare ?? null,
    memberPrice: displayMemberPrice ?? null,
    images: product.images.length ? product.images : ["/placeholder.jpg"],
    stock: displayStock,
    description: "",
    material: product.material,
    category: product.category,
    variantId: variant?.id ?? null,
  };

  return (
    <>
      <div className="group snap-start shrink-0 w-[200px] sm:w-[230px] md:w-[260px] bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#5B1E7A]/10 hover:border-[#5B1E7A]/20">
        {/* Image */}
        <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
          <Link href={`/products/${product.slug}`} draggable={false} className="absolute inset-0">
            <Image
              src={product.images[0] ?? "/placeholder.jpg"}
              alt={product.name}
              fill
              draggable={false}
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 200px, (max-width: 768px) 230px, 260px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          {hasDiscount && (
            <span className="absolute top-3 left-3 px-2 py-0.5 bg-[#5B1E7A] text-white text-[10px] font-bold rounded-full tracking-wide z-10">
              -{discountPct}% OFF
            </span>
          )}

          {/* Wishlist icon */}
          <WishlistToggleButton
            product={wishlistProduct}
            className="absolute top-2 right-2 z-10 h-7 w-7"
          />

          {/* Quick-add button on hover — desktop only */}
          <div className="hidden sm:block absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); setIsPopupOpen(true); }}
              disabled={displayStock === 0}
              className={`w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                displayStock === 0
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : isInCart
                  ? "bg-emerald-600 text-white"
                  : "bg-foreground text-white hover:bg-[#5B1E7A]"
              }`}
            >
              {isInCart ? <Check className="h-3.5 w-3.5" /> : <ShoppingCart className="h-3.5 w-3.5" />}
              {displayStock === 0 ? "Out of Stock" : isInCart ? "Added" : "Quick Add"}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-3.5 flex flex-col flex-1">
          <Link href={`/products/${product.slug}`} draggable={false} className="flex flex-col flex-1">
            {product.material && (
              <p className="text-[10px] font-medium uppercase tracking-wider text-[#5B1E7A]/70 mb-0.5">
                {product.material}
              </p>
            )}
            <h3 className="text-sm font-medium text-[#111111] line-clamp-2 leading-snug group-hover:text-[#5B1E7A] transition-colors duration-200">
              {product.name}
            </h3>
            <div className="mt-auto pt-2.5 flex items-baseline gap-2">
              <span className="text-sm font-bold text-[#111111]">₹{displayPrice.toLocaleString()}</span>
              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through">₹{displayCompare!.toLocaleString()}</span>
              )}
            </div>
          </Link>

          {/* Mobile-only Add to Cart button */}
          <button
            type="button"
            onClick={() => setIsPopupOpen(true)}
            disabled={displayStock === 0}
            className={`sm:hidden mt-2.5 w-full py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              displayStock === 0
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : isInCart
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                : "bg-[#5B1E7A] text-white hover:bg-[#4a1870]"
            }`}
          >
            {isInCart ? <Check className="h-3.5 w-3.5" /> : <ShoppingCart className="h-3.5 w-3.5" />}
            {displayStock === 0 ? "Out of Stock" : isInCart ? "Added" : "Add to Cart"}
          </button>
        </div>
      </div>

      <ProductPopupModal
        open={isPopupOpen}
        onOpenChange={setIsPopupOpen}
        product={popupProduct}
        onConfirm={(qty) => { addItem(popupProduct, qty); }}
        confirmLabel="Add to Cart"
      />
    </>
  );
}

export function RecommendedProducts({
  initialProducts,
  isMember = false,
}: RecommendedProductsProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  // Drag state
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const scrollStartX = useRef(0);

  const updateState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const pos = el.scrollLeft;
    setProgress(max > 0 ? pos / max : 0);
    setCanPrev(pos > 4);
    setCanNext(pos < max - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateState, { passive: true });
    updateState();
    return () => el.removeEventListener("scroll", updateState);
  }, [updateState]);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const cardW = el.querySelector("a")?.offsetWidth ?? 280;
    el.scrollBy({ left: dir * (cardW + 16), behavior: "smooth" });
  };

  // Mouse drag handlers
  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    scrollStartX.current = trackRef.current?.scrollLeft ?? 0;
    e.preventDefault();
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    trackRef.current.scrollLeft = scrollStartX.current - (e.clientX - dragStartX.current);
  };
  const onMouseUp = () => { isDragging.current = false; };

  if (initialProducts.length === 0) return null;

  return (
    <section className="mt-16 overflow-hidden">
      {/* Header */}
      <div className="flex items-end justify-between mb-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#5B1E7A] mb-1">Curated for you</p>
          <h2 className="text-2xl font-[family-name:var(--font-playfair)] font-semibold text-[#111111]">
            You Might Also Like
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-[#5B1E7A] hover:gap-2.5 transition-all duration-200"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
          {/* Arrow buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => scrollBy(-1)}
              disabled={!canPrev}
              aria-label="Scroll left"
              className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow-sm transition-all duration-200 hover:border-[#5B1E7A] hover:text-[#5B1E7A] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollBy(1)}
              disabled={!canNext}
              aria-label="Scroll right"
              className="w-9 h-9 rounded-full bg-[#5B1E7A] text-white flex items-center justify-center shadow-md transition-all duration-200 hover:bg-[#4a1870] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Slider track */}
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 cursor-grab active:cursor-grabbing select-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {initialProducts.map((product) => (
          <RecommendedCard key={product.id} product={product} isMember={isMember} />
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-5 h-[2px] bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#5B1E7A] rounded-full transition-all duration-150"
          style={{ width: `${Math.max(8, progress * 100)}%` }}
        />
      </div>
    </section>
  );
}
