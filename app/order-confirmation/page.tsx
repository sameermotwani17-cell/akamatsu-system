"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Store, Calendar, Clock, ShoppingBag, Mail, QrCode } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatPrice } from "@/lib/utils";
import type { CartLineItem } from "@/lib/store/cart";

type OrderData = {
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  pickupDate: string;
  pickupSlot: string;
  items: CartLineItem[];
  subtotal: number;
  total: number;
};

const TIME_SLOT_LABELS: Record<string, string> = {
  "10-12": "10:00 〜 12:00",
  "12-14": "12:00 〜 14:00",
  "14-16": "14:00 〜 16:00",
  "16-18": "16:00 〜 18:00",
};

function QRCodeMock({ value }: { value: string }) {
  // Visual QR code mock using grid pattern
  const size = 8;
  const pattern = Array.from({ length: size * size }, (_, i) => {
    const x = i % size;
    const y = Math.floor(i / size);
    const hash = (x * 3 + y * 7 + value.charCodeAt(x % value.length)) % 3;
    return hash === 0;
  });

  return (
    <div
      className="inline-grid rounded-lg border-4 border-white bg-white p-2 shadow-sm"
      style={{ gridTemplateColumns: `repeat(${size}, 1fr)`, gap: "1px" }}
      aria-label={`QR Code for order ${value}`}
    >
      {pattern.map((filled, i) => (
        <div
          key={i}
          className={`h-5 w-5 rounded-sm ${filled ? "bg-foreground" : "bg-white"}`}
        />
      ))}
    </div>
  );
}

export default function OrderConfirmationPage() {
  const t = useTranslations("confirmation");
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("lastOrder");
    if (raw) {
      try {
        setOrder(JSON.parse(raw));
      } catch {
        /* ignore */
      }
    }
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="text-5xl">📦</div>
          <h1 className="font-serif text-xl font-semibold">
            注文が見つかりません / No order found
          </h1>
          <Link href="/shop" className="btn-primary inline-flex">
            ショッピングを続ける
          </Link>
        </div>
      </div>
    );
  }

  const pickupDate = new Date(order.pickupDate).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div className="min-h-screen bg-brand-cream py-8">
      <div className="container-padded max-w-2xl">
        {/* Success header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              {/* Sparkle ring */}
              <div className="absolute inset-0 rounded-full animate-ping bg-green-200 opacity-30" />
            </div>
          </div>

          <h1 className="font-serif text-3xl font-bold text-foreground">
            {t("title")}
          </h1>
          <p className="font-sans text-base text-muted-foreground mt-2">
            {t("subtitle")}
          </p>

          {/* Order number */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white border border-brand-cream-dark px-5 py-2 shadow-sm">
            <span className="font-sans text-sm text-muted-foreground">{t("order_number")}:</span>
            <span className="font-serif font-bold text-brand-red tracking-wide">
              {order.orderId}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {/* Pickup details */}
          <div className="rounded-2xl bg-white border border-brand-cream-dark p-5 shadow-sm space-y-4">
            <h2 className="font-serif text-lg font-semibold flex items-center gap-2">
              <Store className="h-5 w-5 text-brand-red" />
              {t("pickup_details")}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl bg-brand-cream p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="font-sans text-xs font-medium">受取日 / Pickup Date</span>
                </div>
                <p className="font-sans text-sm font-semibold text-foreground">{pickupDate}</p>
              </div>
              <div className="rounded-xl bg-brand-cream p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="font-sans text-xs font-medium">受取時間 / Pickup Time</span>
                </div>
                <p className="font-sans text-sm font-semibold text-foreground">
                  {TIME_SLOT_LABELS[order.pickupSlot] ?? order.pickupSlot}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-brand-cream p-3">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <Store className="h-4 w-4" />
                <span className="font-sans text-xs font-medium">店舗 / Store</span>
              </div>
              <p className="font-sans text-sm font-semibold text-foreground">
                赤松 Health & Lifestyle 本店
              </p>
              <p className="font-sans text-xs text-muted-foreground">
                〒150-0001 東京都渋谷区神宮前1-2-3 赤松ビル 1F
              </p>
            </div>

            {/* QR code */}
            <div className="flex flex-col items-center gap-3 pt-2 border-t border-brand-cream-dark">
              <p className="font-sans text-xs text-muted-foreground text-center">
                店頭でこのQRコードをご提示ください / Show this QR code in-store
              </p>
              <QRCodeMock value={order.orderId} />
              <p className="font-mono text-sm font-bold text-foreground tracking-widest">
                {order.orderId}
              </p>
            </div>
          </div>

          {/* Items ordered */}
          <div className="rounded-2xl bg-white border border-brand-cream-dark p-5 shadow-sm space-y-4">
            <h2 className="font-serif text-lg font-semibold flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-brand-red" />
              {t("items_ordered")}
            </h2>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={`${item.productId}-${item.variant ?? ""}`}
                  className="flex items-center gap-3"
                >
                  <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-brand-cream flex-shrink-0 border border-brand-cream-dark">
                    <Image
                      src={item.image_url || "/placeholder-product.jpg"}
                      alt={item.name_ja}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm font-medium text-foreground line-clamp-1">
                      {item.name_ja}
                    </p>
                    {item.variant && (
                      <p className="font-sans text-xs text-muted-foreground">{item.variant}</p>
                    )}
                    <p className="font-sans text-xs text-muted-foreground">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-serif text-sm font-semibold text-brand-red shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-brand-cream-dark pt-3 space-y-1.5">
              <div className="flex justify-between font-sans text-sm text-muted-foreground">
                <span>小計</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between font-sans text-sm text-muted-foreground">
                <span>送料</span>
                <span className="text-green-600">¥0（店舗受取）</span>
              </div>
              <div className="flex justify-between font-sans text-xs text-muted-foreground">
                <span>消費税（10%）</span>
                <span>内税</span>
              </div>
              <div className="flex justify-between font-serif text-base font-bold pt-2 border-t border-brand-cream-dark">
                <span>お支払い合計</span>
                <span className="text-brand-red">{formatPrice(order.total)}</span>
              </div>
              <p className="font-sans text-xs text-muted-foreground text-right">支払い済み ✓</p>
            </div>
          </div>

          {/* Confirmation email notice */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 flex items-start gap-3">
            <Mail className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-sans text-sm font-semibold text-blue-800">
                {t("confirmation_sent")}
              </p>
              <p className="font-sans text-xs text-blue-700 mt-0.5">
                確認メールを <strong>{order.email}</strong> に送信しました。
                届かない場合は迷惑メールフォルダをご確認ください。
              </p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/shop" className="btn-primary flex-1 text-center py-4">
              <ShoppingBag className="h-4 w-4" />
              {t("back_to_shop")}
            </Link>
            <Link href="/" className="btn-secondary flex-1 text-center py-4">
              ホームへ戻る
            </Link>
          </div>

          {/* Footer note */}
          <p className="font-sans text-xs text-muted-foreground text-center">
            ご不明な点はお気軽にお問い合わせください。
            <a href="mailto:info@akamatsu-health.jp" className="text-brand-red hover:underline ml-1">
              info@akamatsu-health.jp
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
