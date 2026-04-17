"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "@/types/database";

export type CartLineItem = {
  productId: string;
  name_ja: string;
  name_en: string;
  price: number;
  image_url: string;
  quantity: number;
  variant?: string;
  stock_quantity: number;
};

type CartStore = {
  items: CartLineItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number, variant?: string) => void;
  removeItem: (productId: string, variant?: string) => void;
  updateQuantity: (productId: string, quantity: number, variant?: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  itemCount: () => number;
  subtotal: () => number;
};

const getItemKey = (productId: string, variant?: string) =>
  variant ? `${productId}::${variant}` : productId;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1, variant) => {
        set((state) => {
          const key = getItemKey(product.id, variant);
          const existing = state.items.find(
            (i) => getItemKey(i.productId, i.variant) === key
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                getItemKey(i.productId, i.variant) === key
                  ? {
                      ...i,
                      quantity: Math.min(
                        i.quantity + quantity,
                        product.stock_quantity
                      ),
                    }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                name_ja: product.name_ja,
                name_en: product.name_en,
                price: product.sale_price ?? product.price,
                image_url: product.image_urls[0] ?? "",
                quantity,
                variant,
                stock_quantity: product.stock_quantity,
              },
            ],
          };
        });
      },

      removeItem: (productId, variant) => {
        set((state) => ({
          items: state.items.filter(
            (i) => getItemKey(i.productId, i.variant) !== getItemKey(productId, variant)
          ),
        }));
      },

      updateQuantity: (productId, quantity, variant) => {
        if (quantity <= 0) {
          get().removeItem(productId, variant);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            getItemKey(i.productId, i.variant) === getItemKey(productId, variant)
              ? { ...i, quantity: Math.min(quantity, i.stock_quantity) }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "akamatsu-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
