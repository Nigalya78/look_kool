"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Check, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
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
}

export function AddToCartButton({
  product,
  disabled = false,
  hasVariants = false,
  quantity = 1,
}: AddToCartButtonProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isAddedRaw = useCartStore((state) => state.isInCart(product.id, product.variantId ?? null));
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  // Before hydration completes, always render the "not added" state to match SSR
  const isAdded = mounted && isAddedRaw;

  // If variant is selected (variantId exists), show "Add to Cart", otherwise "Choose Options"
  const hasSelectedVariant = product.variantId !== null && product.variantId !== undefined;
  const buttonText = disabled 
    ? "Out of Stock" 
    : hasVariants && !hasSelectedVariant 
      ? "Choose Options" 
      : "Add to Cart";

  const handleAddToCart = () => {
    if (hasVariants && !hasSelectedVariant) {
      // Show popup only if variants exist but none selected
      setIsPopupOpen(true);
    } else {
      // Add directly to cart with specified quantity
      addItem(product, quantity);
    }
  };

  const handleBuyNow = () => {
    if (hasVariants && !hasSelectedVariant) {
      setIsPopupOpen(true);
    } else {
      // Add to cart with specified quantity and go to checkout
      addItem(product, quantity);
      router.push("/checkout");
    }
  };

  const handleConfirm = (quantity: number) => {
    addItem(product, quantity);
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
          disabled={disabled}
          className={cn(
            "flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200",
            disabled
              ? "cursor-not-allowed bg-gray-100 text-gray-400"
              : "bg-[#111111] text-white hover:bg-[#333333] shadow-lg"
          )}
        >
          <Zap className="w-4 h-4" />
          Buy Now
        </button>
      </div>

      <ProductPopupModal
        open={isPopupOpen}
        onOpenChange={setIsPopupOpen}
        product={product}
        onConfirm={handleConfirm}
        confirmLabel={hasSelectedVariant ? "Add to Cart" : "Add Selected Item"}
      />
    </>
  );
}
