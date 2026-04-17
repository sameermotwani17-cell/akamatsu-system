"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ShoppingCart, Search, Menu, X, Leaf } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/lib/store/cart";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { cn } from "@/lib/utils";

const categories = [
  { key: "health", href: "/shop?category=health" },
  { key: "beauty", href: "/shop?category=beauty" },
  { key: "supplements", href: "/shop?category=supplements" },
  { key: "wellness", href: "/shop?category=wellness" },
  { key: "lifestyle", href: "/shop?category=lifestyle" },
];

export function Header() {
  const t = useTranslations();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { itemCount, toggleCart } = useCartStore();
  const count = itemCount();

  return (
    <>
      {/* Trust bar */}
      <div className="bg-brand-red text-white text-xs py-1.5 text-center font-sans tracking-wide">
        <span className="hidden sm:inline">
          🌿 {t("trust.organic")} · {t("trust.gluten_free")} ·{" "}
          {t("trust.free_pickup")} · {t("trust.reviews_summary")}
        </span>
        <span className="sm:hidden">🌿 {t("trust.organic")} · {t("trust.free_pickup")}</span>
      </div>

      <header className="sticky top-0 z-50 bg-white border-b border-brand-cream-dark shadow-sm">
        <div className="container-padded">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 shrink-0"
              aria-label={t("nav.home")}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-red">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="font-serif text-xl font-semibold text-brand-red leading-none">
                  赤松
                </span>
                <span className="block font-sans text-[10px] text-brand-stone uppercase tracking-widest leading-none mt-0.5">
                  Health & Lifestyle
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
              {categories.map((cat) => (
                <Link
                  key={cat.key}
                  href={cat.href}
                  className="font-sans text-sm text-foreground/70 hover:text-brand-red transition-colors"
                >
                  {t(`categories.${cat.key}`)}
                </Link>
              ))}
              <Link
                href="/admin"
                className="font-sans text-sm text-foreground/70 hover:text-brand-red transition-colors"
              >
                {t("nav.admin")}
              </Link>
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg hover:bg-brand-cream transition-colors"
                aria-label={t("nav.search")}
              >
                <Search className="h-5 w-5 text-foreground/70" />
              </button>

              <LocaleSwitcher />

              <button
                onClick={toggleCart}
                className="relative p-2 rounded-lg hover:bg-brand-cream transition-colors"
                aria-label={`${t("nav.cart")} (${count})`}
              >
                <ShoppingCart className="h-5 w-5 text-foreground/70" />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-red text-[10px] font-bold text-white">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-brand-cream transition-colors"
                aria-label={t("nav.toggle_menu")}
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="pb-3 -mt-1">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const q = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value;
                  if (q) window.location.href = `/shop?q=${encodeURIComponent(q)}`;
                }}
              >
                <input
                  name="q"
                  type="search"
                  placeholder={t("nav.search_placeholder")}
                  autoFocus
                  className="w-full rounded-lg border border-brand-cream-dark bg-brand-cream px-4 py-2.5 text-sm font-sans outline-none focus:ring-2 focus:ring-brand-red transition-shadow"
                  aria-label={t("nav.search_products")}
                />
              </form>
            </div>
          )}
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-brand-cream-dark bg-white">
            <nav className="container-padded py-4 space-y-1" aria-label="Mobile navigation">
              {categories.map((cat) => (
                <Link
                  key={cat.key}
                  href={cat.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2.5 font-sans text-sm text-foreground/80 hover:bg-brand-cream hover:text-brand-red transition-colors"
                >
                  {t(`categories.${cat.key}`)}
                </Link>
              ))}
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2.5 font-sans text-sm text-foreground/80 hover:bg-brand-cream hover:text-brand-red transition-colors"
              >
                {t("nav.admin")}
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
