"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Store, Calendar, Clock, ShoppingBag, Mail } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { formatPrice } from "@/lib/utils";
type ApiOrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name_ja: string;
  product_name_en: string;
  variant: string | null;
  quantity: number;
  unit_price: number;
  line_total: number;
  image_url: string | null;
};

type OrderData = {
  orderId: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  fulfillmentType: "pickup" | "delivery";
  pickupDate: string;
  pickupSlot: string;
  postalCode: string | null;
  prefecture: string | null;
  city: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  deliveryFee: number;
  items: ApiOrderItem[];
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
      className="inline-grid grid-cols-8 gap-px rounded-lg border-4 border-white bg-white p-2 shadow-sm"
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
  const locale = useLocale();
  const isJa = locale === "ja";
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    if (!orderId) {
      setLoading(false);
      return;
    }

    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || (isJa ? "注文の読み込みに失敗しました" : "Failed to load order"));

        if (!mounted) return;
        setOrder({
          orderId: json.order.id,
          orderNumber: json.order.order_number ?? json.order.id,
          customerName: json.order.customer_name,
          email: json.order.email,
          phone: json.order.phone,
          fulfillmentType: json.order.fulfillment_type === "delivery" ? "delivery" : "pickup",
          pickupDate: json.order.pickup_date,
          pickupSlot: json.order.pickup_slot,
          postalCode: json.order.postal_code,
          prefecture: json.order.prefecture,
          city: json.order.city,
          addressLine1: json.order.address_line1,
          addressLine2: json.order.address_line2,
          deliveryFee: json.order.delivery_fee ?? 0,
          items: json.items ?? [],
          subtotal: json.order.subtotal,
          total: json.order.total,
        });
      } catch {
        if (mounted) setOrder(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
        <p className="font-sans text-muted-foreground">{isJa ? "注文を読み込み中..." : "Loading order..."}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="text-5xl">📦</div>
          <h1 className="font-serif text-xl font-semibold">
            {isJa ? "注文が見つかりません" : "No order found"}
          </h1>
          <Link href="/shop" className="btn-primary inline-flex">
            {t("back_to_shop")}
          </Link>
        </div>
      </div>
    );
  }

  const pickupDate = order.pickupDate
    ? new Date(order.pickupDate).toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      })
    : "";

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
              {order.orderNumber}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {/* Fulfillment details */}
          <div className="rounded-2xl bg-white border border-brand-cream-dark p-5 shadow-sm space-y-4">
            <h2 className="font-serif text-lg font-semibold flex items-center gap-2">
              <Store className="h-5 w-5 text-brand-red" />
              {order.fulfillmentType === "pickup" ? t("pickup_details") : (isJa ? "配送先情報" : "Delivery Details")}
            </h2>

            {order.fulfillmentType === "pickup" ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-brand-cream p-3 space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="font-sans text-xs font-medium">{isJa ? "受取日" : "Pickup Date"}</span>
                    </div>
                    <p className="font-sans text-sm font-semibold text-foreground">{pickupDate}</p>
                  </div>
                  <div className="rounded-xl bg-brand-cream p-3 space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="font-sans text-xs font-medium">{isJa ? "受取時間" : "Pickup Time"}</span>
                    </div>
                    <p className="font-sans text-sm font-semibold text-foreground">
                      {TIME_SLOT_LABELS[order.pickupSlot] ?? order.pickupSlot}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-brand-cream p-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                    <Store className="h-4 w-4" />
                    <span className="font-sans text-xs font-medium">{isJa ? "店舗" : "Store"}</span>
                  </div>
                  <p className="font-sans text-sm font-semibold text-foreground">
                    {isJa ? "赤松 Health & Lifestyle 本店" : "Akamatsu Health & Lifestyle Main Store"}
                  </p>
                  <p className="font-sans text-xs text-muted-foreground">
                    {isJa ? "〒150-0001 東京都渋谷区神宮前1-2-3 赤松ビル 1F" : "1F Akamatsu Building, 1-2-3 Jingumae, Shibuya, Tokyo 150-0001"}
                  </p>
                </div>
                {/* QR code */}
                <div className="flex flex-col items-center gap-3 pt-2 border-t border-brand-cream-dark">
                  <p className="font-sans text-xs text-muted-foreground text-center">
                    {isJa ? "店頭でこのQRコードをご提示ください" : "Show this QR code in-store"}
                  </p>
                  <QRCodeMock value={order.orderNumber} />
                  <p className="font-mono text-sm font-bold text-foreground tracking-widest">
                    {order.orderNumber}
                  </p>
                </div>
              </>
            ) : (
              <div className="rounded-xl bg-brand-cream p-3 space-y-1">
                <p className="font-sans text-xs font-medium text-muted-foreground">{isJa ? "配送先" : "Delivery address"}</p>
                <p className="font-sans text-sm font-semibold text-foreground">
                  {[order.postalCode, order.prefecture, order.city, order.addressLine1, order.addressLine2].filter(Boolean).join(" ")}
                </p>
                <p className="font-sans text-xs text-muted-foreground">
                  {isJa ? "配送準備ができ次第発送します。" : "We will ship as soon as your order is prepared."}
                </p>
              </div>
            )}
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
                  key={item.id}
                  className="flex items-center gap-3"
                >
                  <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-brand-cream flex-shrink-0 border border-brand-cream-dark">
                    <Image
                      src={item.image_url || "/placeholder-product.jpg"}
                      alt={item.product_name_ja}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm font-medium text-foreground line-clamp-1">
                      {item.product_name_ja}
                    </p>
                    {item.variant && (
                      <p className="font-sans text-xs text-muted-foreground">{item.variant}</p>
                    )}
                    <p className="font-sans text-xs text-muted-foreground">
                      {formatPrice(item.unit_price)} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-serif text-sm font-semibold text-brand-red shrink-0">
                    {formatPrice(item.line_total)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-brand-cream-dark pt-3 space-y-1.5">
              <div className="flex justify-between font-sans text-sm text-muted-foreground">
                <span>{isJa ? "小計" : "Subtotal"}</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between font-sans text-sm text-muted-foreground">
                <span>{isJa ? "送料" : "Shipping"}</span>
                <span className={order.deliveryFee > 0 ? "text-foreground" : "text-green-600"}>
                  {order.deliveryFee > 0
                    ? `${formatPrice(order.deliveryFee)} ${isJa ? "（配送見積）" : "(estimated delivery)"}`
                    : (isJa ? "¥0（店舗受取）" : "¥0 (store pickup)")}
                </span>
              </div>
              <div className="flex justify-between font-sans text-xs text-muted-foreground">
                <span>{isJa ? "消費税（10%）" : "Tax (10%)"}</span>
                <span>{isJa ? "内税" : "Included"}</span>
              </div>
              <div className="flex justify-between font-serif text-base font-bold pt-2 border-t border-brand-cream-dark">
                <span>{isJa ? "お支払い合計" : "Total Paid"}</span>
                <span className="text-brand-red">{formatPrice(order.total)}</span>
              </div>
              <p className="font-sans text-xs text-muted-foreground text-right">{isJa ? "支払い済み ✓" : "Paid ✓"}</p>
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
                {isJa ? (
                  <>
                    確認メールを <strong>{order.email}</strong> に送信しました。届かない場合は迷惑メールフォルダをご確認ください。
                  </>
                ) : (
                  <>
                    We sent a confirmation email to <strong>{order.email}</strong>. If you do not see it, please check your spam folder.
                  </>
                )}
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
