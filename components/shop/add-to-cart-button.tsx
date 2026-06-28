"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Check, Zap, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useBuyNowStore } from "@/store/buy-now";
import { useRouter } from "next/navigation";
import {
  ProductPopupModal,
  type ProductPopupModalProduct,
} from "./product-popup-modal";

interface AddToCartButtonProps {
  product: ProductPopupModalProduct;
  disabled?: boolean;
  hasVariants?: boolean;
  quantity?: number;
  outOfStock?: boolean;
  directBuyNow?: boolean;
}

export function AddToCartButton({
  product,
  disabled = false,
  hasVariants = false,
  quantity = 1,
  outOfStock = false,
  directBuyNow = false,
}: AddToCartButtonProps) {
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [isBuyNowPopupOpen, setIsBuyNowPopupOpen] = useState(false);
  const [isBuyNowLoading, setIsBuyNowLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isAddedRaw = useCartStore((state) => state.isInCart(product.id, product.variantId ?? null));
  const addItem = useCartStore((state) => state.addItem);
  const setBuyNow = useBuyNowStore((state) => state.set);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  const isAdded = mounted && isAddedRaw;

  const hasSelectedVariant = product.variantId !== null && product.variantId !== undefined;
  const buttonText = disabled
    ? "Out of Stock"
    : hasVariants && !hasSelectedVariant
      ? "Choose Options"
      : "Add to Cart";

  // ── Add to Cart ──────────────────────────────────────────────────
  const handleAddToCart = () => {
    if (hasVariants && !hasSelectedVariant) {
      setIsAddPopupOpen(true);
    } else {
      addItem(product, quantity);
    }
  };

  const handleAddConfirm = (qty: number, selectedSize: string | null) => {
    const cartProduct = selectedSize
      ? { ...product, variantLabel: `Size: ${selectedSize}` }
      : product;
    addItem(cartProduct, qty);
  };

  // ── Buy Now ───────────────────────────────────────────────────────
  // If directBuyNow=true (product detail page), skip popup — variant/qty already selected on page
  // Otherwise open popup for qty+size selection (product cards on listing page)
  const handleBuyNow = () => {
    if (directBuyNow) {
      setIsBuyNowLoading(true);
      const cartProduct = { ...product, variantId: product.variantId ?? null };
      setBuyNow({ product: cartProduct, quantity });
      addItem(cartProduct, quantity);
      router.push("/checkout");
    } else {
      setIsBuyNowPopupOpen(true);
    }
  };

  const handleBuyNowConfirm = (qty: number, selectedSize: string | null) => {
    setIsBuyNowLoading(true);
    const cartProduct = selectedSize
      ? { ...product, variantLabel: `Size: ${selectedSize}` }
      : product;
    // Add to cart so it's preserved if user doesn't place the order
    addItem(cartProduct, qty);
    // Set the buy-now item so checkout shows only this product
    setBuyNow({ product: { ...cartProduct, variantId: cartProduct.variantId ?? null }, quantity: qty });
    router.push("/checkout");
  };

  return (
    <>
      <div className="flex gap-3">
        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={disabled}
          className={cn(
            "flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200",
            disabled
              ? "cursor-not-allowed bg-gray-100 text-gray-400"
              : isAdded
              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
              : "bg-[#5B1E7A] text-white hover:bg-[#4a1870] shadow-lg shadow-[#5B1E7A]/20"
          )}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4" />
              Added
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              {buttonText}
            </>
          )}
        </button>

        {/* Buy Now Button */}
        <button
          onClick={handleBuyNow}
          disabled={outOfStock || isBuyNowLoading}
          className={cn(
            "flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200",
            outOfStock
              ? "cursor-not-allowed bg-gray-100 text-gray-400"
              : isBuyNowLoading
              ? "bg-[#333333] text-white cursor-wait"
              : "bg-[#111111] text-white hover:bg-[#333333] shadow-lg"
          )}
        >
          {isBuyNowLoading
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <Zap className="w-4 h-4" />}
          {isBuyNowLoading ? "Redirecting..." : "Buy Now"}
        </button>
      </div>

      {/* Add to Cart popup */}
      <ProductPopupModal
        open={isAddPopupOpen}
        onOpenChange={setIsAddPopupOpen}
        product={product}
        onConfirm={handleAddConfirm}
        confirmLabel="Add to Cart"
      />

      {/* Buy Now popup */}
      <ProductPopupModal
        open={isBuyNowPopupOpen}
        onOpenChange={setIsBuyNowPopupOpen}
        product={product}
        onConfirm={handleBuyNowConfirm}
        confirmLabel="Buy Now"
      />
    </>
  );
}
