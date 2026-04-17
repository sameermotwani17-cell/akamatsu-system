"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const t = useTranslations();
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } =
    useCartStore();
  const drawerRef = useRef<HTMLDivElement>(null);
  const sub = subtotal();

  // Close on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeCart();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, closeCart]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("cart.title")}
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brand-cream-dark px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-brand-red" />
            <h2 className="font-serif text-lg font-semibold">
              {t("cart.title")}
            </h2>
            {items.length > 0 && (
              <span className="rounded-full bg-brand-red/10 px-2 py-0.5 text-xs font-medium text-brand-red">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="rounded-lg p-1.5 hover:bg-brand-cream transition-colors"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-12">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
              <div>
                <p className="font-serif text-lg font-medium text-foreground/60">
                  {t("cart.empty")}
                </p>
                <p className="font-sans text-sm text-muted-foreground mt-1">
                  {t("cart.empty_description")}
                </p>
              </div>
              <button
                onClick={closeCart}
                className="btn-secondary text-sm px-5 py-2"
              >
                {t("cart.continue_shopping")}
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.productId}-${item.variant ?? ""}`}
                className="flex gap-3 rounded-xl bg-brand-cream p-3"
              >
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-white">
                  <Image
                    src={item.image_url || "/placeholder-product.jpg"}
                    alt={item.name_ja}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm font-medium text-foreground leading-snug line-clamp-2">
                    {item.name_ja}
                  </p>
                  {item.variant && (
                    <p className="font-sans text-xs text-muted-foreground mt-0.5">
                      {item.variant}
                    </p>
                  )}
                  <p className="font-serif text-sm font-semibold text-brand-red mt-1">
                    {formatPrice(item.price * item.quantity)}
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity stepper */}
                    <div className="flex items-center gap-1 rounded-lg border border-brand-cream-dark bg-white">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1, item.variant)
                        }
                        className="p-1.5 hover:bg-brand-cream rounded-l-lg transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="min-w-[2ch] text-center font-sans text-sm font-medium px-1">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1, item.variant)
                        }
                        disabled={item.quantity >= item.stock_quantity}
                        className="p-1.5 hover:bg-brand-cream rounded-r-lg transition-colors disabled:opacity-40"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId, item.variant)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:text-brand-red hover:bg-red-50 transition-colors"
                      aria-label={`Remove ${item.name_ja}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer summary */}
        {items.length > 0 && (
          <div className="border-t border-brand-cream-dark px-5 py-4 space-y-3 bg-white">
            <div className="flex justify-between font-sans text-sm text-muted-foreground">
              <span>{t("cart.subtotal")}</span>
              <span className="text-foreground font-medium">{formatPrice(sub)}</span>
            </div>
            <div className="flex justify-between font-sans text-sm text-muted-foreground">
              <span>{t("cart.shipping")}</span>
              <span className="text-green-600 font-medium">{t("cart.free_pickup")}</span>
            </div>
            <div className="flex justify-between font-serif text-base font-semibold border-t border-brand-cream-dark pt-3">
              <span>{t("cart.total")}</span>
              <span className="text-brand-red">{formatPrice(sub)}</span>
            </div>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full text-center text-sm"
            >
              {t("cart.proceed_to_checkout")}
            </Link>
            <Link
              href="/cart"
              onClick={closeCart}
              className="block text-center font-sans text-xs text-muted-foreground hover:text-brand-red transition-colors"
            >
              {t("cart.title")} →
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
