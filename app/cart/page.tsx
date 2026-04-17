"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, Tag, ArrowRight, ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";

export default function CartPage() {
  const t = useTranslations();
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCartStore();
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  const sub = subtotal();
  const tax = 0; // already included in price (10% naizei)
  const delivery = 0; // pickup only
  const total = sub;

  const handleCoupon = () => {
    if (coupon.toUpperCase() === "WELCOME10") {
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponError("無効なクーポンコードです / Invalid coupon code");
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center px-4 text-center gap-6">
        <div className="rounded-full bg-white p-8 shadow-sm">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
        </div>
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">
            {t("cart.empty")}
          </h1>
          <p className="font-sans text-sm text-muted-foreground mt-2">
            {t("cart.empty_description")}
          </p>
        </div>
        <Link href="/shop" className="btn-primary px-8 py-3">
          <ShoppingBag className="h-4 w-4" />
          {t("cart.continue_shopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream py-8">
      <div className="container-padded">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 font-sans text-sm text-muted-foreground hover:text-brand-red transition-colors mb-4"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("cart.continue_shopping")}
          </Link>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            {t("cart.title")}
          </h1>
          <p className="font-sans text-sm text-muted-foreground mt-1">
            {items.reduce((s, i) => s + i.quantity, 0)}点の商品
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variant ?? ""}`}
                className="rounded-2xl bg-white border border-brand-cream-dark p-4 flex gap-4 shadow-sm"
              >
                {/* Image */}
                <Link
                  href={`/product/${item.productId}`}
                  className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-brand-cream block"
                >
                  <Image
                    src={item.image_url || "/placeholder-product.jpg"}
                    alt={item.name_ja}
                    fill
                    sizes="96px"
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.productId}`}>
                    <h3 className="font-sans font-medium text-foreground leading-snug hover:text-brand-red transition-colors line-clamp-2">
                      {item.name_ja}
                    </h3>
                    <p className="font-sans text-xs text-muted-foreground mt-0.5">
                      {item.name_en}
                    </p>
                  </Link>
                  {item.variant && (
                    <span className="mt-1 inline-block rounded bg-brand-cream px-2 py-0.5 font-sans text-xs text-muted-foreground">
                      {item.variant}
                    </span>
                  )}

                  <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                    {/* Quantity stepper */}
                    <div className="flex items-center rounded-xl border-2 border-brand-cream-dark bg-brand-cream">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1, item.variant)
                        }
                        disabled={item.quantity <= 1}
                        className="p-2 hover:bg-white rounded-l-xl transition-colors disabled:opacity-40"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-[3ch] text-center font-sans font-semibold text-sm px-1">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1, item.variant)
                        }
                        disabled={item.quantity >= item.stock_quantity}
                        className="p-2 hover:bg-white rounded-r-xl transition-colors disabled:opacity-40"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-serif text-base font-semibold text-brand-red">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.productId, item.variant)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                        aria-label={`Remove ${item.name_ja}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear cart */}
            <div className="text-right">
              <button
                onClick={clearCart}
                className="font-sans text-xs text-muted-foreground hover:text-red-500 transition-colors"
              >
                カートを空にする / Clear Cart
              </button>
            </div>
          </div>

          {/* Order summary sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-white border border-brand-cream-dark p-5 shadow-sm sticky top-24 space-y-4">
              <h2 className="font-serif text-lg font-semibold text-foreground">
                注文内容
              </h2>

              {/* Line totals */}
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.variant ?? ""}`}
                    className="flex justify-between font-sans text-sm text-muted-foreground"
                  >
                    <span className="line-clamp-1 flex-1 pr-2">
                      {item.name_ja} × {item.quantity}
                    </span>
                    <span className="shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-brand-cream-dark pt-3 space-y-2">
                <div className="flex justify-between font-sans text-sm">
                  <span className="text-muted-foreground">{t("cart.subtotal")}</span>
                  <span className="font-medium">{formatPrice(sub)}</span>
                </div>
                <div className="flex justify-between font-sans text-sm">
                  <span className="text-muted-foreground">{t("cart.shipping")}</span>
                  <span className="text-green-600 font-medium">¥0 {t("cart.free_pickup")}</span>
                </div>
                <div className="flex justify-between font-sans text-xs text-muted-foreground">
                  <span>{t("cart.tax")}</span>
                  <span>内税</span>
                </div>
              </div>

              {/* Coupon */}
              <div className="border-t border-brand-cream-dark pt-3 space-y-2">
                <label className="font-sans text-sm font-medium text-foreground" htmlFor="coupon">
                  <Tag className="inline h-4 w-4 mr-1.5 text-muted-foreground" />
                  {t("cart.coupon")}
                </label>
                <div className="flex gap-2">
                  <input
                    id="coupon"
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    placeholder="WELCOME10"
                    className="flex-1 rounded-lg border border-brand-cream-dark bg-brand-cream px-3 py-2 font-sans text-sm outline-none focus:ring-2 focus:ring-brand-red transition-shadow uppercase"
                    aria-describedby={couponError ? "coupon-error" : undefined}
                  />
                  <button
                    onClick={handleCoupon}
                    className="rounded-lg bg-brand-stone px-3 py-2 font-sans text-xs text-white hover:bg-brand-stone/80 transition-colors"
                  >
                    {t("cart.apply_coupon")}
                  </button>
                </div>
                {couponError && (
                  <p id="coupon-error" className="font-sans text-xs text-red-500" role="alert">
                    {couponError}
                  </p>
                )}
                {couponApplied && (
                  <p className="font-sans text-xs text-green-600 font-medium">
                    ✓ クーポンが適用されました！ (-10%)
                  </p>
                )}
              </div>

              {/* Total */}
              <div className="border-t-2 border-foreground pt-3">
                <div className="flex justify-between">
                  <span className="font-serif text-lg font-bold">{t("cart.total")}</span>
                  <span className="font-serif text-xl font-bold text-brand-red">
                    {formatPrice(couponApplied ? Math.round(total * 0.9) : total)}
                  </span>
                </div>
                <p className="font-sans text-xs text-muted-foreground mt-0.5 text-right">
                  消費税10%込み
                </p>
              </div>

              {/* CTA */}
              <Link href="/checkout" className="btn-primary w-full text-center py-4">
                {t("cart.proceed_to_checkout")}
                <ArrowRight className="h-4 w-4" />
              </Link>

              {/* Trust signals */}
              <div className="flex flex-wrap gap-2 justify-center pt-1">
                <span className="font-sans text-[10px] text-muted-foreground flex items-center gap-1">
                  🔒 安全な決済
                </span>
                <span className="font-sans text-[10px] text-muted-foreground flex items-center gap-1">
                  🏪 店舗受取無料
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
