"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart";
import { useBuyNowStore } from "@/store/buy-now";

export function ClearCartOnSuccess() {
  const clearCart = useCartStore((state) => state.clearCart);
  const clearBuyNow = useBuyNowStore((state) => state.clear);
  useEffect(() => {
    clearCart();
    clearBuyNow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
