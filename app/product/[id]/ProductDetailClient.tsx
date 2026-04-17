"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Zap, ChevronRight, Minus, Plus, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice, getStockStatus } from "@/lib/utils";
import type { Product, Review } from "@/types/database";
import { ProductGallery } from "@/components/product/ProductGallery";
import { NutritionPanel } from "@/components/product/NutritionPanel";
import { StarRating } from "@/components/product/StarRating";
import { CertBadges } from "@/components/product/CertBadges";
import { ProductCard } from "@/components/product/ProductCard";
import { cn } from "@/lib/utils";

type Tab = "description" | "ingredients" | "how_to_use" | "reviews";

type ProductDetailClientProps = {
  product: Product;
  reviews: Review[];
  related: Product[];
};

export function ProductDetailClient({ product, reviews, related }: ProductDetailClientProps) {
  const t = useTranslations();
  const locale = useLocale();
  const { addItem, openCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<Tab>("description");
  const [addedToCart, setAddedToCart] = useState(false);

  const stockStatus = getStockStatus(product.stock_quantity);
  const isOnSale = product.sale_price !== null && product.sale_price < product.price;
  const displayPrice = product.sale_price ?? product.price;
  const primaryName = locale === "en" ? product.name_en : product.name_ja;
  const primaryDesc = locale === "en" ? product.description_en : product.description_ja;

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    openCart();
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    window.location.href = "/checkout";
  };

  const stockIndicator = {
    in_stock: {
      icon: CheckCircle,
      text: t("product.in_stock"),
      color: "text-green-600",
    },
    low_stock: {
      icon: AlertTriangle,
      text: t("product.low_stock", { count: product.stock_quantity }),
      color: "text-amber-600",
    },
    out_of_stock: {
      icon: XCircle,
      text: t("product.out_of_stock"),
      color: "text-red-600",
    },
  }[stockStatus];

  const StockIcon = stockIndicator.icon;

  // Rating bar distribution (mock)
  const ratingDist = [
    { stars: 5, pct: 65 },
    { stars: 4, pct: 22 },
    { stars: 3, pct: 8 },
    { stars: 2, pct: 3 },
    { stars: 1, pct: 2 },
  ];

  const getReviewBarWidthClass = (pct: number) => {
    if (pct >= 95) return "w-full";
    if (pct >= 85) return "w-5/6";
    if (pct >= 70) return "w-3/4";
    if (pct >= 55) return "w-2/3";
    if (pct >= 45) return "w-1/2";
    if (pct >= 30) return "w-1/3";
    if (pct >= 15) return "w-1/4";
    if (pct > 0) return "w-[10%]";
    return "w-0";
  };

  const TABS: { key: Tab; label: string }[] = [
    { key: "description", label: t("product.description") },
    { key: "ingredients", label: t("product.ingredients") },
    { key: "how_to_use", label: t("product.how_to_use") },
    { key: "reviews", label: `${t("product.reviews")} (${product.review_count})` },
  ];

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-brand-cream-dark" aria-label="Breadcrumb">
        <div className="container-padded py-3">
          <ol className="flex items-center gap-1.5 font-sans text-xs text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-brand-red transition-colors">
                {t("product.home")}
              </Link>
            </li>
            <li aria-hidden="true"><ChevronRight className="h-3 w-3" /></li>
            <li>
              <Link href="/shop" className="hover:text-brand-red transition-colors">
                {t("product.shop_label")}
              </Link>
            </li>
            <li aria-hidden="true"><ChevronRight className="h-3 w-3" /></li>
            <li>
              <Link
                href={`/shop?category=${product.category}`}
                className="hover:text-brand-red transition-colors capitalize"
              >
                {t(`categories.${product.category}`)}
              </Link>
            </li>
            <li aria-hidden="true"><ChevronRight className="h-3 w-3" /></li>
            <li className="text-foreground font-medium truncate max-w-[200px]">
              {primaryName}
            </li>
          </ol>
        </div>
      </nav>

      <div className="container-padded py-8">
        {/* Main product section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
          {/* Gallery */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductGallery images={product.image_urls} productName={primaryName} />
          </div>

          {/* Product info */}
          <div className="space-y-5">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.is_bestseller && (
                <span className="rounded-md bg-brand-red px-2.5 py-1 text-xs font-bold text-white uppercase tracking-wide">
                  {t("product.bestseller")}
                </span>
              )}
              {product.is_new && (
                <span className="rounded-md bg-brand-gold px-2.5 py-1 text-xs font-bold text-white uppercase tracking-wide">
                  {t("product.new")}
                </span>
              )}
              <CertBadges certifications={product.certifications} />
            </div>

            {/* Name */}
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground leading-tight">
                {primaryName}
              </h1>
              <p className="font-sans text-sm text-muted-foreground mt-1">
                {locale === "en" ? product.name_ja : product.name_en}
              </p>
            </div>

            {/* Rating */}
            <button
              onClick={() => setActiveTab("reviews")}
              className="flex items-center gap-2 group"
              aria-label="Go to reviews"
            >
              <StarRating
                rating={product.rating_avg}
                reviewCount={product.review_count}
                size="md"
              />
              <span className="font-sans text-xs text-brand-red opacity-0 group-hover:opacity-100 transition-opacity">
                {t("product.view_reviews_link")}
              </span>
            </button>

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="font-serif text-3xl font-bold text-brand-red">
                {formatPrice(displayPrice)}
              </span>
              {isOnSale && (
                <>
                  <span className="font-sans text-lg text-muted-foreground line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="rounded-md bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                    {Math.round(((product.price - displayPrice) / product.price) * 100)}% OFF
                  </span>
                </>
              )}
            </div>
            <p className="font-sans text-xs text-muted-foreground -mt-3">
              {t("product.tax_included")}
            </p>

            {/* Short description */}
            <p className="font-sans text-sm text-foreground/75 leading-relaxed">
              {primaryDesc}
            </p>

            {/* Stock indicator */}
            <div className={cn("flex items-center gap-1.5", stockIndicator.color)}>
              <StockIcon className="h-4 w-4" />
              <span className="font-sans text-sm font-medium">{stockIndicator.text}</span>
            </div>

            {/* Nutrition panel — above CTAs */}
            {product.nutrition_per_serving && (
              <NutritionPanel
                nutrition={product.nutrition_per_serving}
                ingredientsEn={product.ingredients_en}
                ingredientsJa={product.ingredients_ja}
                certifications={product.certifications}
                servingSize={product.serving_size ?? undefined}
                productName={product.name_ja}
              />
            )}

            {/* Quantity stepper */}
            <div className="flex items-center gap-4">
              <span className="font-sans text-sm font-medium text-foreground">
                {t("product.quantity")}:
              </span>
              <div className="flex items-center rounded-xl border-2 border-brand-cream-dark bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2.5 hover:bg-brand-cream rounded-l-xl transition-colors disabled:opacity-40"
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-[3ch] text-center font-sans font-semibold text-base px-2">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock_quantity, q + 1))
                  }
                  className="p-2.5 hover:bg-brand-cream rounded-r-xl transition-colors disabled:opacity-40"
                  disabled={
                    quantity >= product.stock_quantity ||
                    stockStatus === "out_of_stock"
                  }
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="font-sans text-sm text-muted-foreground">
                = {formatPrice(displayPrice * quantity)}
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                onClick={handleAddToCart}
                disabled={stockStatus === "out_of_stock"}
                className={cn(
                  "btn-primary flex-1 py-4 text-base",
                  addedToCart && "bg-green-600 hover:bg-green-700"
                )}
              >
                <ShoppingCart className="h-5 w-5" />
                {addedToCart ? t("product.added_to_cart") : t("product.add_to_cart")}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={stockStatus === "out_of_stock"}
                className="btn-secondary flex-1 py-4 text-base"
              >
                <Zap className="h-5 w-5" />
                {t("product.buy_now")}
              </button>
            </div>

            {/* Pickup note */}
            <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 flex items-start gap-3">
              <span className="text-lg shrink-0">🏪</span>
              <div>
                <p className="font-sans text-xs font-semibold text-green-800">
                  {t("product.free_pickup_note")}
                </p>
                <p className="font-sans text-xs text-green-700 mt-0.5">
                  {t("product.store_address")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Below fold tabs */}
        <div className="mt-12">
          {/* Tab bar */}
          <div
            className="flex border-b border-brand-cream-dark overflow-x-auto scrollbar-hide"
            role="tablist"
          >
            {TABS.map((tab) => (
              <button
                key={tab.key}
                role="tab"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex-shrink-0 px-5 py-3 font-sans text-sm font-medium transition-all border-b-2 -mb-px",
                  activeTab === tab.key
                    ? "border-brand-red text-brand-red"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="bg-white rounded-b-xl border border-t-0 border-brand-cream-dark p-6 md:p-8">
            {activeTab === "description" && (
              <div className="prose prose-sm max-w-none font-sans space-y-4">
                <p className="text-foreground leading-relaxed">{product.description_ja}</p>
                <p className="text-muted-foreground leading-relaxed">{product.description_en}</p>
              </div>
            )}

            {activeTab === "ingredients" && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-serif text-base font-semibold mb-2">{t("product.ingredients_label")}</h3>
                  <p className="font-sans text-sm text-foreground/80 leading-relaxed">
                    {product.ingredients_ja || product.ingredients}
                  </p>
                </div>
                {product.certifications?.length > 0 && (
                  <div>
                    <h3 className="font-serif text-base font-semibold mb-2">{t("product.certifications_label")}</h3>
                    <CertBadges certifications={product.certifications} />
                  </div>
                )}
              </div>
            )}

            {activeTab === "how_to_use" && (
              <div className="space-y-3">
                <h3 className="font-serif text-base font-semibold">{t("product.how_to_use_label")}</h3>
                <p className="font-sans text-sm text-foreground/80 leading-relaxed">
                  {product.how_to_use}
                </p>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-8">
                {/* Rating summary */}
                <div className="flex flex-col sm:flex-row gap-8 pb-8 border-b border-brand-cream-dark">
                  <div className="text-center">
                    <div className="font-serif text-5xl font-bold text-brand-red">
                      {product.rating_avg.toFixed(1)}
                    </div>
                    <StarRating rating={product.rating_avg} size="md" showCount={false} />
                    <p className="font-sans text-xs text-muted-foreground mt-1">
                      {t("product.reviews_count", { count: product.review_count.toLocaleString("ja-JP") })}
                    </p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {ratingDist.map(({ stars, pct }) => (
                      <div key={stars} className="flex items-center gap-3">
                        <span className="font-sans text-xs text-muted-foreground w-4 text-right">
                          {stars}★
                        </span>
                        <div className="flex-1 h-2 rounded-full bg-brand-cream-dark overflow-hidden">
                          <div
                            className={cn("h-full rounded-full bg-brand-gold", getReviewBarWidthClass(pct))}
                          />
                        </div>
                        <span className="font-sans text-xs text-muted-foreground w-8">
                          {pct}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review list */}
                <div className="space-y-6">
                  {reviews.length === 0 ? (
                    <p className="font-sans text-sm text-muted-foreground text-center py-8">
                      {t("product.no_reviews")}
                    </p>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.id} className="border-b border-brand-cream-dark pb-6 last:border-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-sans text-sm font-semibold">
                                {review.user_name}
                              </span>
                              {review.verified && (
                                <span className="inline-flex items-center gap-0.5 rounded-full bg-green-50 border border-green-200 px-1.5 py-0.5 text-[10px] font-medium text-green-700">
                                  <CheckCircle className="h-2.5 w-2.5" />
                                  {t("product.verified")}
                                </span>
                              )}
                            </div>
                            <StarRating rating={review.rating} size="sm" showCount={false} />
                          </div>
                          <span className="font-sans text-xs text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString("ja-JP")}
                          </span>
                        </div>
                        <p className="font-sans text-sm text-foreground/80 mt-2 leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-16">
            <div className="mb-6">
              <h2 className="section-title">{t("product.you_may_also_like")}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((p) => (
                <div key={p.id} className="product-grid-item animate-fade-in opacity-0">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
