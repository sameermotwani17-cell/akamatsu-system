"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight, ChevronLeft, User, Store, CreditCard, CheckCircle,
  Shield, Lock, AlertCircle, MapPin, Clock
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice, generateOrderId, getBusinessDays } from "@/lib/utils";
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

type PaymentInfo = {
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardName: string;
};

type CheckoutState = {
  customer: CustomerInfo;
  pickup: PickupInfo;
  payment: PaymentInfo;
};

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

function OrderSummaryPanel({ compact = false }: { compact?: boolean }) {
  const { items, subtotal } = useCartStore();
  const [open, setOpen] = useState(!compact);
  const sub = subtotal();

  return (
    <div className="rounded-2xl bg-white border border-brand-cream-dark overflow-hidden shadow-sm">
      <button
        onClick={() => compact && setOpen(!open)}
        className={cn(
          "w-full flex items-center justify-between p-4",
          compact && "cursor-pointer hover:bg-brand-cream/50 transition-colors"
        )}
        aria-expanded={open}
      >
        <span className="font-serif text-base font-semibold">
          注文内容 / Order Summary
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
              <span>小計</span>
              <span>{formatPrice(sub)}</span>
            </div>
            <div className="flex justify-between font-sans text-sm text-muted-foreground">
              <span>送料</span>
              <span className="text-green-600">¥0（店舗受取）</span>
            </div>
            <div className="flex justify-between font-sans text-xs text-muted-foreground">
              <span>消費税</span>
              <span>内税（10%）</span>
            </div>
          </div>

          <div className="border-t-2 border-foreground pt-3 flex justify-between">
            <span className="font-serif font-bold">合計</span>
            <span className="font-serif font-bold text-brand-red text-lg">{formatPrice(sub)}</span>
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
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!data.lastName.trim()) e.lastName = "姓を入力してください";
    if (!data.firstName.trim()) e.firstName = "名を入力してください";
    if (!data.email.includes("@")) e.email = "有効なメールアドレスを入力してください";
    if (data.phone.replace(/\D/g, "").length < 10) e.phone = "有効な電話番号を入力してください";
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
          {t("customer_info")} / Customer Information
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
              placeholder="山田"
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
              placeholder="花子"
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
          <p className="font-sans text-sm font-semibold text-foreground">アカウント / Account</p>
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
              <p className="font-sans text-xs text-muted-foreground">アカウントなしで注文できます</p>
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
              <p className="font-sans text-xs text-muted-foreground">注文履歴の確認・次回以降の手続きが簡単に</p>
            </div>
          </label>
          {!data.isGuest && (
            <div className="pt-2">
              <label htmlFor="password" className="block font-sans text-xs font-medium text-foreground mb-1">
                パスワード（8文字以上）
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
        次へ — 受取方法
        <ChevronRight className="h-4 w-4" />
      </button>
    </form>
  );
}

function PickupForm({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: PickupInfo;
  onChange: (d: Partial<PickupInfo>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const t = useTranslations("checkout");
  const [errors, setErrors] = useState<{ date?: string; slot?: string }>({});
  const businessDays = getBusinessDays(14);

  const validate = () => {
    const e: typeof errors = {};
    if (!data.date) e.date = "受取日を選択してください";
    if (!data.slot) e.slot = "受取時間を選択してください";
    setErrors(e);
    return !e.date && !e.slot;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <h2 className="font-serif text-xl font-semibold">
        {t("fulfillment")} / Store Pickup
      </h2>

      {/* Store info card */}
      <div className="rounded-xl border border-green-200 bg-green-50 p-4 space-y-2">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-sans text-sm font-semibold text-green-800">
              赤松 Health & Lifestyle 本店
            </p>
            <p className="font-sans text-xs text-green-700 mt-0.5">
              〒150-0001 東京都渋谷区神宮前1-2-3 赤松ビル 1F
            </p>
            <p className="font-sans text-xs text-green-700">
              営業時間: 10:00〜19:00（日曜・祝日定休）
            </p>
          </div>
        </div>

        {/* Google Maps embed (static placeholder) */}
        <div className="mt-2 rounded-lg overflow-hidden border border-green-200 aspect-video bg-green-100 flex items-center justify-center">
          <div className="text-center text-green-700/70">
            <MapPin className="h-8 w-8 mx-auto mb-1" />
            <p className="font-sans text-xs">Googleマップ / Google Maps</p>
            <a
              href="https://maps.google.com/?q=渋谷区神宮前1-2-3"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-xs text-green-600 underline hover:text-green-800"
            >
              地図を開く / Open Map →
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2">
          <Store className="h-4 w-4 text-green-600" />
          <span className="font-sans text-xs font-semibold text-green-800">
            {t("no_delivery_fee")} — 送料¥0
          </span>
        </div>
      </div>

      {/* Date picker */}
      <div>
        <label htmlFor="pickupDate" className="block font-sans text-sm font-semibold text-foreground mb-2">
          {t("pickup_date")} <span className="text-brand-red" aria-hidden="true">*</span>
        </label>
        <select
          id="pickupDate"
          value={data.date}
          onChange={(e) => onChange({ date: e.target.value })}
          className={cn(
            "w-full rounded-xl border bg-white px-4 py-3 font-sans text-sm outline-none focus:ring-2 focus:ring-brand-red transition-shadow appearance-none",
            errors.date ? "border-red-400" : "border-brand-cream-dark"
          )}
        >
          <option value="">受取日を選択してください / Select a date</option>
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

      {/* Time slot */}
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
                data.slot === slot.value
                  ? "border-brand-red bg-brand-red/5"
                  : "border-brand-cream-dark bg-white hover:border-brand-red/50"
              )}
            >
              <input
                type="radio"
                name="timeSlot"
                value={slot.value}
                checked={data.slot === slot.value}
                onChange={() => onChange({ slot: slot.value })}
                className="sr-only"
              />
              <Clock className={cn(
                "h-4 w-4",
                data.slot === slot.value ? "text-brand-red" : "text-muted-foreground"
              )} />
              <span className={cn(
                "font-sans text-sm font-medium",
                data.slot === slot.value ? "text-brand-red" : "text-foreground"
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
          次へ — お支払い
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
  const [errors, setErrors] = useState<Partial<Record<keyof PaymentInfo, string>>>({});

  const validate = () => {
    const e: typeof errors = {};
    if (data.cardNumber.replace(/\s/g, "").length < 16) e.cardNumber = "有効なカード番号を入力してください";
    if (data.expiry.length < 5) e.expiry = "有効期限を入力してください";
    if (data.cvv.length < 3) e.cvv = "CVVを入力してください";
    if (!data.cardName.trim()) e.cardName = "カード名義を入力してください";
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
          {t("payment")} / Payment
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
          <p className="font-sans text-xs font-semibold text-foreground">AirPay決済 / AirPay Payment</p>
          <p className="font-sans text-[10px] text-muted-foreground">
            カード情報はトークン化されます。サーバーには保存されません。
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
          カード名義 / Name on Card <span className="text-brand-red" aria-hidden="true">*</span>
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
              処理中...
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
        注文を確定することで、
        <Link href="/legal/privacy" className="underline hover:text-brand-red">プライバシーポリシー</Link>
        および
        <Link href="/legal/tokusho" className="underline hover:text-brand-red">特定商取引法に基づく表記</Link>
        に同意したものとみなされます。
      </p>
    </form>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const [state, setState] = useState<CheckoutState>({
    customer: { lastName: "", firstName: "", email: "", phone: "", isGuest: true, password: "" },
    pickup: { date: "", slot: "" },
    payment: { cardNumber: "", expiry: "", cvv: "", cardName: "" },
  });

  const updateCustomer = useCallback((d: Partial<CustomerInfo>) => {
    setState((s) => ({ ...s, customer: { ...s.customer, ...d } }));
  }, []);
  const updatePickup = useCallback((d: Partial<PickupInfo>) => {
    setState((s) => ({ ...s, pickup: { ...s.pickup, ...d } }));
  }, []);
  const updatePayment = useCallback((d: Partial<PaymentInfo>) => {
    setState((s) => ({ ...s, payment: { ...s.payment, ...d } }));
  }, []);

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    // AirPay stub — simulate 1.5s processing
    await new Promise((r) => setTimeout(r, 1500));

    const orderId = generateOrderId();
    const orderData = {
      orderId,
      customerName: `${state.customer.lastName} ${state.customer.firstName}`,
      email: state.customer.email,
      phone: state.customer.phone,
      pickupDate: state.pickup.date,
      pickupSlot: state.pickup.slot,
      items,
      subtotal: subtotal(),
      total: subtotal(),
    };

    // Persist to sessionStorage for confirmation page
    sessionStorage.setItem("lastOrder", JSON.stringify(orderData));
    clearCart();
    router.push("/order-confirmation");
  };

  // Guard empty cart
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="font-sans text-muted-foreground">カートが空です / Cart is empty</p>
          <Link href="/shop" className="btn-primary inline-flex">ショップへ戻る</Link>
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
                <PickupForm
                  data={state.pickup}
                  onChange={updatePickup}
                  onNext={() => setStep(3)}
                  onBack={() => setStep(1)}
                />
              )}
              {step === 3 && (
                <PaymentForm
                  data={state.payment}
                  onChange={updatePayment}
                  onNext={handlePlaceOrder}
                  onBack={() => setStep(2)}
                  isProcessing={isProcessing}
                />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-4">
            <OrderSummaryPanel compact />

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
                  <span className="font-sans text-xs text-muted-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
