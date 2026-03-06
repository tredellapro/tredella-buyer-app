import { create } from "zustand";
import { CartItem, Product } from "@/types";

import { ViewMode } from "./viewModeStore";

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getTotal: (mode: ViewMode) => number;
  getSubtotal: (mode: ViewMode) => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (product, quantity = 1) => {
    const items = get().items;
    const existing = items.find((i) => i.id === product.id);
    if (existing) {
      set({
        items: items.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i,
        ),
      });
    } else {
      set({ items: [...items, { ...product, quantity }] });
    }
  },
  updateQuantity: (productId, quantity) => {
    set({
      items: get()
        .items.map((i) =>
          i.id === productId ? { ...i, quantity: Math.max(0, quantity) } : i,
        )
        .filter((i) => i.quantity > 0),
    });
  },
  removeItem: (productId) => {
    set({ items: get().items.filter((i) => i.id !== productId) });
  },
  clearCart: () => set({ items: [] }),
  getSubtotal: (mode) => {
    return get().items.reduce((acc, item) => {
      let price = item.retailPrice;
      if (mode === "wholesale" && item.wholesale) {
        // Find applicable tier
        const tier = [...item.wholesale.tiers]
          .reverse()
          .find((t) => item.quantity >= t.min);
        price = tier ? tier.price : item.wholesalePrice || item.retailPrice;
      }
      return acc + price * item.quantity;
    }, 0);
  },
  getTotal: (mode) => {
    const subtotal = get().getSubtotal(mode);
    const shipping = subtotal > 0 ? 15 : 0; // Mock shipping
    const tax = subtotal * 0.08; // 8% tax
    return subtotal + shipping + tax;
  },
}));
