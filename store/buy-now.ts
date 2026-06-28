import { create } from "zustand";
import type { CartItem } from "./cart";

interface BuyNowState {
  item: CartItem | null;
  set: (item: CartItem) => void;
  clear: () => void;
}

export const useBuyNowStore = create<BuyNowState>()((set) => ({
  item: null,
  set: (item) => set({ item }),
  clear: () => set({ item: null }),
}));
