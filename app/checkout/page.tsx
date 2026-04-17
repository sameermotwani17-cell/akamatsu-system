"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight, ChevronLeft, User, Store, CreditCard, CheckCircle,
  Shield, Lock, AlertCircle, MapPin, Clock
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice, getBusinessDays } from "@/lib/utils";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type CustomerInfo = {
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  isGuest: boolean;
  password: string;
};

type PickupInfo = {
  date: string;
  slot: string;
};

type DeliveryInfo = {
  postalCode: string;
  prefecture: string;
  city: string;
  addressLine1: string;
  addressLine2: string;
};

type PaymentInfo = {
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardName: string;
};

type CheckoutState = {
  customer: CustomerInfo;
  fulfillmentType: "pickup" | "delivery";
  pickup: PickupInfo;
  delivery: DeliveryInfo;
  payment: PaymentInfo;
};

const ESTIMATED_DELIVERY_FEE = 600;

const STEPS = [
  { id: 1, key: "customer_info", icon: User },
  { id: 2, key: "fulfillment", icon: Store },
  { id: 3, key: "payment", icon: CreditCard },
] as const;

const TIME_SLOTS = [
  { value: "10-12", label: "10:00 〜 12:00" },
  { value: "12-14", label: "12:00 〜 14:00" },
  { value: "14-16", label: "14:00 〜 16:00" },
  { value: "16-18", label: "16:00 〜 18:00" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}
function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 2) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepIndicator({ currentStep }: { currentStep: number }) {
  const t = useTranslations("checkout");
  return (
    <div className="flex items-center justify-center gap-0" aria-label="Checkout steps">
      {STEPS.map((step, i) => {
        const done = currentStep > step.id;
        const active = currentStep === step.id;
        const Icon = step.icon;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all",
                  done && "border-brand-red bg-brand-red text-white",
                  active && "border-brand-red bg-white text-brand-red shadow-md",
                  !done && !active && "border-brand-cream-dark bg-white text-muted-foreground"
                )}
                aria-current={active ? "step" : undefined}
              >
                {done ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              <span
                className={cn(
                  "font-sans text-[10px] font-medium hidden sm:block",
                  active ? "text-brand-red" : "text-muted-foreground"
                )}
              >
                {t(step.key)}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-16 sm:w-24 mx-1 sm:mx-2 transition-colors",
                  currentStep > step.id ? "bg-brand-red" : "bg-brand-cream-dark"
                )}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderSummaryPanel({
  compact = false,
  fulfillmentType,
  deliveryFee,
}: {
  compact?: boolean;
  fulfillmentType: "pickup" | "delivery";
  deliveryFee: number;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const isJa = locale === "ja";
  const { items, subtotal } = useCartStore();
  const [open, setOpen] = useState(!compact);
  const sub = subtotal();
  const total = sub + deliveryFee;

  return (
    <div className="rounded-2xl bg-white border border-brand-cream-dark overflow-hidden shadow-sm">
      <button
        onClick={() => compact && setOpen(!open)}
        className={cn(
          "w-full flex items-center justify-between p-4",
          compact && "cursor-pointer hover:bg-brand-cream/50 transition-colors"
        )}
      >
        <span className="font-serif text-base font-semibold">
          {isJa ? "注文内容" : "Order Summary"}
        </span>
        {compact && (
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-brand-red">{formatPrice(sub)}</span>
            <ChevronRight className={cn("h-4 w-4 transition-transform", open && "rotate-90")} />
          </div>
        )}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-brand-cream-dark">
          <div className="space-y-3 pt-3">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variant ?? ""}`}
                className="flex gap-3 items-center"
              >
                <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-brand-cream flex-shrink-0">
                  <Image
                    src={item.image_url || "/placeholder-product.jpg"}
                    alt={item.name_ja}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-red text-[9px] font-bold text-white">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-xs font-medium text-foreground line-clamp-1">
                    {item.name_ja}
                  </p>
                  {item.variant && (
                    <p className="font-sans text-[10px] text-muted-foreground">{item.variant}</p>
                  )}
                </div>
                <span className="font-sans text-xs font-semibold text-foreground shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-brand-cream-dark pt-3 space-y-1.5">
            <div className="flex justify-between font-sans text-sm text-muted-foreground">
              <span>{t("cart.subtotal")}</span>
              <span>{formatPrice(sub)}</span>
            </div>
            <div className="flex justify-between font-sans text-sm text-muted-foreground">
              <span>{t("cart.shipping")}</span>
              <span className={deliveryFee === 0 ? "text-green-600" : "text-foreground"}>
                {deliveryFee === 0
                  ? (isJa ? "¥0（店舗受取）" : "¥0 (store pickup)")
                  : `${formatPrice(deliveryFee)} ${isJa ? "（配送見積）" : "(estimated delivery)"}`}
              </span>
            </div>
            <div className="flex justify-between font-sans text-xs text-muted-foreground">
              <span>{isJa ? "消費税" : "Tax"}</span>
              <span>{isJa ? "内税（10%）" : "Included (10%)"}</span>
            </div>
          </div>

          <div className="border-t-2 border-foreground pt-3 flex justify-between">
            <span className="font-serif font-bold">{t("cart.total")}</span>
            <span className="font-serif font-bold text-brand-red text-lg">{formatPrice(total)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Step forms ───────────────────────────────────────────────────────────────

function CustomerForm({
  data,
  onChange,
  onNext,
}: {
  data: CustomerInfo;
  onChange: (d: Partial<CustomerInfo>) => void;
  onNext: () => void;
}) {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const isJa = locale === "ja";
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!data.lastName.trim()) e.lastName = isJa ? "姓を入力してください" : "Please enter last name";
    if (!data.firstName.trim()) e.firstName = isJa ? "名を入力してください" : "Please enter first name";
    if (!data.email.includes("@")) e.email = isJa ? "有効なメールアドレスを入力してください" : "Please enter a valid email";
    if (data.phone.replace(/\D/g, "").length < 10) e.phone = isJa ? "有効な電話番号を入力してください" : "Please enter a valid phone number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <h2 className="font-serif text-xl font-semibold mb-5">
          {t("customer_info")}
        </h2>

        {/* Name row */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label htmlFor="lastName" className="block font-sans text-sm font-medium text-foreground mb-1.5">
              {t("last_name")} <span className="text-brand-red" aria-hidden="true">*</span>
            </label>
            <input
              id="lastName"
              type="text"
              value={data.lastName}
              onChange={(e) => onChange({ lastName: e.target.value })}
              placeholder={isJa ? "山田" : "Yamada"}
              required
              autoComplete="family-name"
              className={cn(
                "w-full rounded-xl border bg-white px-4 py-3 font-sans text-sm outline-none transition-shadow focus:ring-2 focus:ring-brand-red",
                errors.lastName ? "border-red-400" : "border-brand-cream-dark"
              )}
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
            />
            {errors.lastName && (
              <p id="lastName-error" className="mt-1 font-sans text-xs text-red-500" role="alert">
                {errors.lastName}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="firstName" className="block font-sans text-sm font-medium text-foreground mb-1.5">
              {t("first_name")} <span className="text-brand-red" aria-hidden="true">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              value={data.firstName}
              onChange={(e) => onChange({ firstName: e.target.value })}
              placeholder={isJa ? "花子" : "Hanako"}
              required
              autoComplete="given-name"
              className={cn(
                "w-full rounded-xl border bg-white px-4 py-3 font-sans text-sm outline-none transition-shadow focus:ring-2 focus:ring-brand-red",
                errors.firstName ? "border-red-400" : "border-brand-cream-dark"
              )}
            />
            {errors.firstName && (
              <p className="mt-1 font-sans text-xs text-red-500" role="alert">{errors.firstName}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block font-sans text-sm font-medium text-foreground mb-1.5">
            {t("email")} <span className="text-brand-red" aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="hanako@example.com"
            required
            autoComplete="email"
            className={cn(
              "w-full rounded-xl border bg-white px-4 py-3 font-sans text-sm outline-none transition-shadow focus:ring-2 focus:ring-brand-red",
              errors.email ? "border-red-400" : "border-brand-cream-dark"
            )}
          />
          {errors.email && (
            <p className="mt-1 font-sans text-xs text-red-500" role="alert">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div className="mb-5">
          <label htmlFor="phone" className="block font-sans text-sm font-medium text-foreground mb-1.5">
            {t("phone")} <span className="text-brand-red" aria-hidden="true">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="090-0000-0000"
            required
            autoComplete="tel"
            className={cn(
              "w-full rounded-xl border bg-white px-4 py-3 font-sans text-sm outline-none transition-shadow focus:ring-2 focus:ring-brand-red",
              errors.phone ? "border-red-400" : "border-brand-cream-dark"
            )}
          />
          {errors.phone && (
            <p className="mt-1 font-sans text-xs text-red-500" role="alert">{errors.phone}</p>
          )}
        </div>

        {/* Account option */}
        <div className="rounded-xl bg-brand-cream border border-brand-cream-dark p-4 space-y-2">
          <p className="font-sans text-sm font-semibold text-foreground">{isJa ? "アカウント" : "Account"}</p>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="accountType"
              checked={data.isGuest}
              onChange={() => onChange({ isGuest: true })}
              className="mt-0.5 h-4 w-4 text-brand-red focus:ring-brand-red"
            />
            <div>
              <span className="font-sans text-sm font-medium text-foreground">{t("guest_checkout")}</span>
              <p className="font-sans text-xs text-muted-foreground">{isJa ? "アカウントなしで注文できます" : "Checkout without creating an account"}</p>
            </div>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="accountType"
              checked={!data.isGuest}
              onChange={() => onChange({ isGuest: false })}
              className="mt-0.5 h-4 w-4 text-brand-red focus:ring-brand-red"
            />
            <div>
              <span className="font-sans text-sm font-medium text-foreground">{t("create_account")}</span>
              <p className="font-sans text-xs text-muted-foreground">{isJa ? "注文履歴の確認・次回以降の手続きが簡単に" : "Save history and speed up next checkout"}</p>
            </div>
          </label>
          {!data.isGuest && (
            <div className="pt-2">
              <label htmlFor="password" className="block font-sans text-xs font-medium text-foreground mb-1">
                {isJa ? "パスワード（8文字以上）" : "Password (8+ characters)"}
              </label>
              <input
                id="password"
                type="password"
                value={data.password}
                onChange={(e) => onChange({ password: e.target.value })}
                placeholder="••••••••"
                minLength={8}
                className="w-full rounded-lg border border-brand-cream-dark bg-white px-3 py-2 font-sans text-sm outline-none focus:ring-2 focus:ring-brand-red"
              />
            </div>
          )}
        </div>
      </div>

      <button type="submit" className="btn-primary w-full py-4">
        {isJa ? "次へ - 受取方法" : "Next - Fulfillment"}
        <ChevronRight className="h-4 w-4" />
      </button>
    </form>
  );
}

function FulfillmentForm({
  fulfillmentType,
  pickup,
  delivery,
  onFulfillmentTypeChange,
  onPickupChange,
  onDeliveryChange,
  onNext,
  onBack,
}: {
  fulfillmentType: "pickup" | "delivery";
  pickup: PickupInfo;
  delivery: DeliveryInfo;
  onFulfillmentTypeChange: (next: "pickup" | "delivery") => void;
  onPickupChange: (d: Partial<PickupInfo>) => void;
  onDeliveryChange: (d: Partial<DeliveryInfo>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const isJa = locale === "ja";
  const [errors, setErrors] = useState<{
    date?: string;
    slot?: string;
    postalCode?: string;
    prefecture?: string;
    city?: string;
    addressLine1?: string;
  }>({});
  const businessDays = getBusinessDays(14);

  const validate = () => {
    const e: typeof errors = {};
    if (fulfillmentType === "pickup") {
      if (!pickup.date) e.date = isJa ? "受取日を選択してください" : "Please select a pickup date";
      if (!pickup.slot) e.slot = isJa ? "受取時間を選択してください" : "Please select a pickup time";
    } else {
      if (!delivery.postalCode.trim()) e.postalCode = isJa ? "郵便番号を入力してください" : "Please enter postal code";
      if (!delivery.prefecture.trim()) e.prefecture = isJa ? "都道府県を入力してください" : "Please enter prefecture";
      if (!delivery.city.trim()) e.city = isJa ? "市区町村を入力してください" : "Please enter city";
      if (!delivery.addressLine1.trim()) e.addressLine1 = isJa ? "住所を入力してください" : "Please enter address";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <h2 className="font-serif text-xl font-semibold">
        {t("fulfillment")}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onFulfillmentTypeChange("pickup")}
          className={cn(
            "rounded-xl border px-4 py-3 text-left transition-colors",
            fulfillmentType === "pickup"
              ? "border-brand-red bg-brand-red/5"
              : "border-brand-cream-dark bg-white hover:border-brand-red/50"
          )}
        >
          <p className="font-sans text-sm font-semibold text-foreground">{isJa ? "店舗受取" : "Store Pickup"}</p>
          <p className="font-sans text-xs text-muted-foreground">{isJa ? "送料¥0" : "Shipping ¥0"}</p>
        </button>
        <button
          type="button"
          onClick={() => onFulfillmentTypeChange("delivery")}
          className={cn(
            "rounded-xl border px-4 py-3 text-left transition-colors",
            fulfillmentType === "delivery"
              ? "border-brand-red bg-brand-red/5"
              : "border-brand-cream-dark bg-white hover:border-brand-red/50"
          )}
        >
          <p className="font-sans text-sm font-semibold text-foreground">{isJa ? "配送" : "Delivery"}</p>
          <p className="font-sans text-xs text-muted-foreground">{formatPrice(ESTIMATED_DELIVERY_FEE)} {isJa ? "（見積）" : "(estimated)"}</p>
        </button>
      </div>

      {/* Store info card */}
      {fulfillmentType === "pickup" ? (
      <div className="rounded-xl border border-green-200 bg-green-50 p-4 space-y-2">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-sans text-sm font-semibold text-green-800">
              {isJa ? "赤松 Health & Lifestyle 本店" : "Akamatsu Health & Lifestyle Main Store"}
            </p>
            <p className="font-sans text-xs text-green-700 mt-0.5">
              {isJa ? "〒150-0001 東京都渋谷区神宮前1-2-3 赤松ビル 1F" : "1F Akamatsu Building, 1-2-3 Jingumae, Shibuya, Tokyo 150-0001"}
            </p>
            <p className="font-sans text-xs text-green-700">
              {isJa ? "営業時間: 10:00〜19:00（日曜・祝日定休）" : "Hours: 10:00-19:00 (Closed Sun & Holidays)"}
            </p>
          </div>
        </div>

        {/* Google Maps embed (static placeholder) */}
        <div className="mt-2 rounded-lg overflow-hidden border border-green-200 aspect-video bg-green-100 flex items-center justify-center">
          <div className="text-center text-green-700/70">
            <MapPin className="h-8 w-8 mx-auto mb-1" />
            <p className="font-sans text-xs">{isJa ? "Googleマップ" : "Google Maps"}</p>
            <a
              href="https://maps.google.com/?q=渋谷区神宮前1-2-3"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-xs text-green-600 underline hover:text-green-800"
            >
              {isJa ? "地図を開く" : "Open map"} →
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2">
          <Store className="h-4 w-4 text-green-600" />
          <span className="font-sans text-xs font-semibold text-green-800">
            {t("no_delivery_fee")} - {isJa ? "送料¥0" : "Shipping ¥0"}
          </span>
        </div>
      </div>
      ) : (
        <div className="rounded-xl border border-brand-cream-dark bg-brand-cream p-4 space-y-3">
          <p className="font-sans text-sm font-semibold text-foreground">{isJa ? "配送先住所" : "Delivery Address"}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="postalCode" className="block font-sans text-xs text-muted-foreground mb-1">{isJa ? "郵便番号" : "Postal code"}</label>
              <input
                id="postalCode"
                value={delivery.postalCode}
                onChange={(e) => onDeliveryChange({ postalCode: e.target.value })}
                placeholder={isJa ? "150-0001" : "150-0001"}
                className={cn("w-full rounded-lg border bg-white px-3 py-2 font-sans text-sm outline-none focus:ring-2 focus:ring-brand-red", errors.postalCode ? "border-red-400" : "border-brand-cream-dark")}
              />
            </div>
            <div>
              <label htmlFor="prefecture" className="block font-sans text-xs text-muted-foreground mb-1">{isJa ? "都道府県" : "Prefecture"}</label>
              <input
                id="prefecture"
                value={delivery.prefecture}
                onChange={(e) => onDeliveryChange({ prefecture: e.target.value })}
                placeholder={isJa ? "東京都" : "Tokyo"}
                className={cn("w-full rounded-lg border bg-white px-3 py-2 font-sans text-sm outline-none focus:ring-2 focus:ring-brand-red", errors.prefecture ? "border-red-400" : "border-brand-cream-dark")}
              />
            </div>
            <div>
              <label htmlFor="city" className="block font-sans text-xs text-muted-foreground mb-1">{isJa ? "市区町村" : "City"}</label>
              <input
                id="city"
                value={delivery.city}
                onChange={(e) => onDeliveryChange({ city: e.target.value })}
                placeholder={isJa ? "渋谷区" : "Shibuya"}
                className={cn("w-full rounded-lg border bg-white px-3 py-2 font-sans text-sm outline-none focus:ring-2 focus:ring-brand-red", errors.city ? "border-red-400" : "border-brand-cream-dark")}
              />
            </div>
            <div>
              <label htmlFor="addressLine1" className="block font-sans text-xs text-muted-foreground mb-1">{isJa ? "番地" : "Address line 1"}</label>
              <input
                id="addressLine1"
                value={delivery.addressLine1}
                onChange={(e) => onDeliveryChange({ addressLine1: e.target.value })}
                placeholder={isJa ? "神宮前1-2-3" : "1-2-3 Jingumae"}
                className={cn("w-full rounded-lg border bg-white px-3 py-2 font-sans text-sm outline-none focus:ring-2 focus:ring-brand-red", errors.addressLine1 ? "border-red-400" : "border-brand-cream-dark")}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="addressLine2" className="block font-sans text-xs text-muted-foreground mb-1">{isJa ? "建物名・部屋番号（任意）" : "Address line 2 (optional)"}</label>
              <input
                id="addressLine2"
                value={delivery.addressLine2}
                onChange={(e) => onDeliveryChange({ addressLine2: e.target.value })}
                placeholder={isJa ? "赤松ビル 1F" : "Akamatsu Building 1F"}
                className="w-full rounded-lg border border-brand-cream-dark bg-white px-3 py-2 font-sans text-sm outline-none focus:ring-2 focus:ring-brand-red"
              />
            </div>
          </div>
          <p className="font-sans text-xs text-muted-foreground">
            {isJa
              ? `配送料は見積です。現在の想定: ${formatPrice(ESTIMATED_DELIVERY_FEE)}`
              : `Delivery fee is estimated. Current estimate: ${formatPrice(ESTIMATED_DELIVERY_FEE)}`}
          </p>
        </div>
      )}

      {/* Date picker */}
      {fulfillmentType === "pickup" && (
      <div>
        <label htmlFor="pickupDate" className="block font-sans text-sm font-semibold text-foreground mb-2">
          {t("pickup_date")} <span className="text-brand-red" aria-hidden="true">*</span>
        </label>
        <select
          id="pickupDate"
          value={pickup.date}
          onChange={(e) => onPickupChange({ date: e.target.value })}
          className={cn(
            "w-full rounded-xl border bg-white px-4 py-3 font-sans text-sm outline-none focus:ring-2 focus:ring-brand-red transition-shadow appearance-none",
            errors.date ? "border-red-400" : "border-brand-cream-dark"
          )}
        >
          <option value="">{isJa ? "受取日を選択してください" : "Select a date"}</option>
          {businessDays.map((d) => {
            const label = d.toLocaleDateString("ja-JP", {
              month: "long",
              day: "numeric",
              weekday: "short",
            });
            return (
              <option key={d.toISOString()} value={d.toISOString().split("T")[0]}>
                {label}
              </option>
            );
          })}
        </select>
        {errors.date && (
          <p className="mt-1 font-sans text-xs text-red-500" role="alert">{errors.date}</p>
        )}
      </div>
      )}

      {/* Time slot */}
      {fulfillmentType === "pickup" && (
      <div>
        <p className="font-sans text-sm font-semibold text-foreground mb-2">
          {t("pickup_time")} <span className="text-brand-red" aria-hidden="true">*</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          {TIME_SLOTS.map((slot) => (
            <label
              key={slot.value}
              className={cn(
                "flex items-center gap-2.5 rounded-xl border-2 px-4 py-3 cursor-pointer transition-all",
                pickup.slot === slot.value
                  ? "border-brand-red bg-brand-red/5"
                  : "border-brand-cream-dark bg-white hover:border-brand-red/50"
              )}
            >
              <input
                type="radio"
                name="timeSlot"
                value={slot.value}
                checked={pickup.slot === slot.value}
                onChange={() => onPickupChange({ slot: slot.value })}
                className="sr-only"
              />
              <Clock className={cn(
                "h-4 w-4",
                pickup.slot === slot.value ? "text-brand-red" : "text-muted-foreground"
              )} />
              <span className={cn(
                "font-sans text-sm font-medium",
                pickup.slot === slot.value ? "text-brand-red" : "text-foreground"
              )}>
                {slot.label}
              </span>
            </label>
          ))}
        </div>
        {errors.slot && (
          <p className="mt-1 font-sans text-xs text-red-500" role="alert">{errors.slot}</p>
        )}
      </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="btn-secondary flex-1 py-3.5"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("back")}
        </button>
        <button type="submit" className="btn-primary flex-1 py-3.5">
          {isJa ? "次へ - お支払い" : "Next - Payment"}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}

function PaymentForm({
  data,
  onChange,
  onNext,
  onBack,
  isProcessing,
}: {
  data: PaymentInfo;
  onChange: (d: Partial<PaymentInfo>) => void;
  onNext: () => void;
  onBack: () => void;
  isProcessing: boolean;
}) {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const isJa = locale === "ja";
  const [errors, setErrors] = useState<Partial<Record<keyof PaymentInfo, string>>>({});

  const validate = () => {
    const e: typeof errors = {};
    if (data.cardNumber.replace(/\s/g, "").length < 16) e.cardNumber = isJa ? "有効なカード番号を入力してください" : "Please enter a valid card number";
    if (data.expiry.length < 5) e.expiry = isJa ? "有効期限を入力してください" : "Please enter expiry date";
    if (data.cvv.length < 3) e.cvv = isJa ? "CVVを入力してください" : "Please enter CVV";
    if (!data.cardName.trim()) e.cardName = isJa ? "カード名義を入力してください" : "Please enter cardholder name";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-semibold">
          {t("payment")}
        </h2>
        <div className="flex items-center gap-1.5 rounded-full bg-green-50 border border-green-200 px-3 py-1">
          <Lock className="h-3.5 w-3.5 text-green-600" />
          <span className="font-sans text-xs font-medium text-green-700">
            {t("pci_compliant")}
          </span>
        </div>
      </div>

      {/* AirPay notice */}
      <div className="rounded-xl border border-brand-cream-dark bg-brand-cream p-3 flex items-center gap-3">
        <div className="flex h-9 w-14 items-center justify-center rounded-lg bg-white border border-brand-cream-dark">
          <span className="font-serif text-sm font-bold text-brand-red">AirPay</span>
        </div>
        <div>
          <p className="font-sans text-xs font-semibold text-foreground">{isJa ? "AirPay決済" : "AirPay Payment"}</p>
          <p className="font-sans text-[10px] text-muted-foreground">
            {isJa ? "カード情報はトークン化されます。サーバーには保存されません。" : "Card details are tokenized and never stored on our server."}
          </p>
        </div>
        <Shield className="h-5 w-5 text-brand-stone ml-auto shrink-0" />
      </div>

      {/* Card number */}
      <div>
        <label htmlFor="cardNumber" className="block font-sans text-sm font-semibold text-foreground mb-1.5">
          {t("card_number")} <span className="text-brand-red" aria-hidden="true">*</span>
        </label>
        <div className="relative">
          <input
            id="cardNumber"
            type="text"
            inputMode="numeric"
            value={data.cardNumber}
            onChange={(e) => onChange({ cardNumber: formatCardNumber(e.target.value) })}
            placeholder="0000 0000 0000 0000"
            maxLength={19}
            autoComplete="cc-number"
            className={cn(
              "w-full rounded-xl border bg-white px-4 py-3 font-sans text-sm outline-none transition-shadow focus:ring-2 focus:ring-brand-red tracking-widest",
              errors.cardNumber ? "border-red-400" : "border-brand-cream-dark"
            )}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
            {["VISA", "MC", "JCB"].map((brand) => (
              <span
                key={brand}
                className="rounded border border-brand-cream-dark bg-white px-1.5 py-0.5 font-sans text-[9px] font-bold text-muted-foreground"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
        {errors.cardNumber && (
          <p className="mt-1 font-sans text-xs text-red-500" role="alert">{errors.cardNumber}</p>
        )}
      </div>

      {/* Expiry + CVV row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="expiry" className="block font-sans text-sm font-semibold text-foreground mb-1.5">
            {t("expiry")} <span className="text-brand-red" aria-hidden="true">*</span>
          </label>
          <input
            id="expiry"
            type="text"
            inputMode="numeric"
            value={data.expiry}
            onChange={(e) => onChange({ expiry: formatExpiry(e.target.value) })}
            placeholder="MM/YY"
            maxLength={5}
            autoComplete="cc-exp"
            className={cn(
              "w-full rounded-xl border bg-white px-4 py-3 font-sans text-sm outline-none transition-shadow focus:ring-2 focus:ring-brand-red",
              errors.expiry ? "border-red-400" : "border-brand-cream-dark"
            )}
          />
          {errors.expiry && (
            <p className="mt-1 font-sans text-xs text-red-500" role="alert">{errors.expiry}</p>
          )}
        </div>
        <div>
          <label htmlFor="cvv" className="block font-sans text-sm font-semibold text-foreground mb-1.5">
            {t("cvv")} <span className="text-brand-red" aria-hidden="true">*</span>
          </label>
          <input
            id="cvv"
            type="text"
            inputMode="numeric"
            value={data.cvv}
            onChange={(e) => onChange({ cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
            placeholder="123"
            maxLength={4}
            autoComplete="cc-csc"
            className={cn(
              "w-full rounded-xl border bg-white px-4 py-3 font-sans text-sm outline-none transition-shadow focus:ring-2 focus:ring-brand-red",
              errors.cvv ? "border-red-400" : "border-brand-cream-dark"
            )}
          />
          {errors.cvv && (
            <p className="mt-1 font-sans text-xs text-red-500" role="alert">{errors.cvv}</p>
          )}
        </div>
      </div>

      {/* Card name */}
      <div>
        <label htmlFor="cardName" className="block font-sans text-sm font-semibold text-foreground mb-1.5">
          {isJa ? "カード名義" : "Name on Card"} <span className="text-brand-red" aria-hidden="true">*</span>
        </label>
        <input
          id="cardName"
          type="text"
          value={data.cardName}
          onChange={(e) => onChange({ cardName: e.target.value.toUpperCase() })}
          placeholder="HANAKO YAMADA"
          autoComplete="cc-name"
          className={cn(
            "w-full rounded-xl border bg-white px-4 py-3 font-sans text-sm outline-none transition-shadow focus:ring-2 focus:ring-brand-red uppercase tracking-wider",
            errors.cardName ? "border-red-400" : "border-brand-cream-dark"
          )}
        />
        {errors.cardName && (
          <p className="mt-1 font-sans text-xs text-red-500" role="alert">{errors.cardName}</p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="btn-secondary flex-1 py-3.5"
          disabled={isProcessing}
        >
          <ChevronLeft className="h-4 w-4" />
          {t("back")}
        </button>
        <button
          type="submit"
          disabled={isProcessing}
          className="btn-primary flex-1 py-3.5"
        >
          {isProcessing ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {isJa ? "処理中..." : "Processing..."}
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" />
              {t("place_order")}
            </>
          )}
        </button>
      </div>

      <p className="font-sans text-[10px] text-muted-foreground text-center">
        {isJa ? "注文を確定することで、" : "By placing your order, you agree to our "}
        <Link href="/legal/privacy" className="underline hover:text-brand-red">{isJa ? "プライバシーポリシー" : "Privacy Policy"}</Link>
        {isJa ? "および" : " and "}
        <Link href="/legal/tokusho" className="underline hover:text-brand-red">{isJa ? "特定商取引法に基づく表記" : "Commercial Transactions Notice"}</Link>
        {isJa ? "に同意したものとみなされます。" : "."}
      </p>
    </form>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const isJa = locale === "ja";
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [idempotencyKey] = useState(
    () =>
      (typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `akm-${Date.now()}-${Math.random().toString(16).slice(2)}`)
  );

  const [state, setState] = useState<CheckoutState>({
    customer: { lastName: "", firstName: "", email: "", phone: "", isGuest: true, password: "" },
    fulfillmentType: "pickup",
    pickup: { date: "", slot: "" },
    delivery: { postalCode: "", prefecture: "", city: "", addressLine1: "", addressLine2: "" },
    payment: { cardNumber: "", expiry: "", cvv: "", cardName: "" },
  });

  const updateCustomer = useCallback((d: Partial<CustomerInfo>) => {
    setState((s) => ({ ...s, customer: { ...s.customer, ...d } }));
  }, []);
  const updatePickup = useCallback((d: Partial<PickupInfo>) => {
    setState((s) => ({ ...s, pickup: { ...s.pickup, ...d } }));
  }, []);
  const updateDelivery = useCallback((d: Partial<DeliveryInfo>) => {
    setState((s) => ({ ...s, delivery: { ...s.delivery, ...d } }));
  }, []);
  const updatePayment = useCallback((d: Partial<PaymentInfo>) => {
    setState((s) => ({ ...s, payment: { ...s.payment, ...d } }));
  }, []);

  const deliveryFee = state.fulfillmentType === "delivery" ? ESTIMATED_DELIVERY_FEE : 0;

  const handlePlaceOrder = async () => {
    setSubmitError(null);
    setIsProcessing(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idempotencyKey,
          customer: {
            firstName: state.customer.firstName,
            lastName: state.customer.lastName,
            email: state.customer.email,
            phone: state.customer.phone,
          },
          fulfillmentType: state.fulfillmentType,
          pickup: {
            date: state.pickup.date,
            slot: state.pickup.slot,
          },
          delivery: {
            postalCode: state.delivery.postalCode,
            prefecture: state.delivery.prefecture,
            city: state.delivery.city,
            addressLine1: state.delivery.addressLine1,
            addressLine2: state.delivery.addressLine2,
            estimatedFee: deliveryFee,
          },
          items: items.map((item) => ({
            productId: item.productId,
            name_ja: item.name_ja,
            name_en: item.name_en,
            quantity: item.quantity,
            price: item.price,
            image_url: item.image_url,
            variant: item.variant,
          })),
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || (isJa ? "注文に失敗しました" : "Failed to place order"));
      }

      clearCart();
      router.push(`/order-confirmation?orderId=${encodeURIComponent(result.id)}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : isJa ? "注文の作成に失敗しました。" : "Failed to create order.";
      setSubmitError(message);
      setIsProcessing(false);
    }
  };

  // Guard empty cart
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="font-sans text-muted-foreground">{isJa ? "カートが空です" : "Cart is empty"}</p>
          <Link href="/shop" className="btn-primary inline-flex">{isJa ? "ショップへ戻る" : "Back to shop"}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream py-8">
      <div className="container-padded max-w-5xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-serif text-2xl font-bold text-foreground">
            {t("title")}
          </h1>
          <div className="mt-6">
            <StepIndicator currentStep={step} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form column */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl bg-white border border-brand-cream-dark p-6 md:p-8 shadow-sm">
              {step === 1 && (
                <CustomerForm
                  data={state.customer}
                  onChange={updateCustomer}
                  onNext={() => setStep(2)}
                />
              )}
              {step === 2 && (
                <FulfillmentForm
                  fulfillmentType={state.fulfillmentType}
                  pickup={state.pickup}
                  delivery={state.delivery}
                  onFulfillmentTypeChange={(next) => setState((s) => ({ ...s, fulfillmentType: next }))}
                  onPickupChange={updatePickup}
                  onDeliveryChange={updateDelivery}
                  onNext={() => setStep(3)}
                  onBack={() => setStep(1)}
                />
              )}
              {step === 3 && (
                <>
                  <PaymentForm
                    data={state.payment}
                    onChange={updatePayment}
                    onNext={handlePlaceOrder}
                    onBack={() => setStep(2)}
                    isProcessing={isProcessing}
                  />
                  {submitError && (
                    <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                      <p className="font-sans text-sm text-red-700">
                        {submitError}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-4">
            <OrderSummaryPanel compact fulfillmentType={state.fulfillmentType} deliveryFee={deliveryFee} />

            {/* Trust signals */}
            <div className="rounded-2xl bg-white border border-brand-cream-dark p-4 space-y-2">
              {[
                { icon: "🔒", text: "SSL暗号化による安全な通信" },
                { icon: "🏪", text: "店舗受取で送料¥0" },
                { icon: "🌿", text: "有機・グルテンフリー認証商品" },
                { icon: "✅", text: "PCI DSS準拠の決済処理" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2.5">
                  <span className="text-base">{item.icon}</span>
                  <span className="font-sans text-xs text-muted-foreground">
                    {isJa
                      ? item.text
                      : item.icon === "🔒"
                        ? "Secure connection with SSL"
                        : item.icon === "🏪"
                          ? "Store pickup with ¥0 shipping"
                          : item.icon === "🌿"
                            ? "Certified organic and gluten-free products"
                            : "PCI DSS compliant payment processing"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
