"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice, getStockStatus } from "@/lib/utils";
import type { Product } from "@/types/database";
import { CertBadges } from "./CertBadges";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
};

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const t = useTranslations();
  const locale = useLocale();
  const { addItem, openCart } = useCartStore();
  const stockStatus = getStockStatus(product.stock_quantity);
  const isOnSale = product.sale_price !== null && product.sale_price < product.price;
  const displayPrice = product.sale_price ?? product.price;

  const primaryName = locale === "en" ? product.name_en : product.name_ja;
  const secondaryName = locale === "en" ? product.name_ja : product.name_en;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (stockStatus === "out_of_stock") return;
    addItem(product);
    openCart();
  };

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(product.rating_avg));

  return (
    <article className="product-card group flex flex-col">
      <Link href={`/product/${product.id}`} className="block relative">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-brand-cream">
          <Image
            src={product.image_urls[0] ?? "/placeholder-product.jpg"}
            alt={primaryName}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={priority}
          />
          {/* Badges overlay */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.is_bestseller && (
              <span className="rounded-md bg-brand-red px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wide shadow-sm">
                {t("product.bestseller")}
              </span>
            )}
            {product.is_new && (
              <span className="rounded-md bg-brand-gold px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wide shadow-sm">
                {t("product.new")}
              </span>
            )}
            {isOnSale && (
              <span className="rounded-md bg-green-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wide shadow-sm">
                {t("product.on_sale")}
              </span>
            )}
          </div>

          {/* Out of stock overlay */}
          {stockStatus === "out_of_stock" && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[2px]">
              <span className="rounded-lg bg-foreground/80 px-3 py-1.5 text-xs font-medium text-white">
                {t("product.out_of_stock")}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-3 gap-2">
        {product.certifications?.length > 0 && (
          <CertBadges certifications={product.certifications} compact />
        )}

        <Link href={`/product/${product.id}`}>
          <h3 className="font-serif text-sm font-medium text-foreground leading-snug line-clamp-2 hover:text-brand-red transition-colors">
            {primaryName}
          </h3>
          <p className="font-sans text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {secondaryName}
          </p>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex" aria-label={`Rating: ${product.rating_avg} out of 5`}>
            {stars.map((filled, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  filled ? "fill-brand-gold text-brand-gold" : "fill-muted text-muted"
                }`}
              />
            ))}
          </div>
          <span className="font-sans text-xs text-muted-foreground">
            ({product.review_count})
          </span>
        </div>

        {stockStatus === "low_stock" && (
          <p className="font-sans text-xs text-amber-600 font-medium">
            {t("product.low_stock", { count: product.stock_quantity })}
          </p>
        )}

        {/* Price + CTA */}
        <div className="flex items-end justify-between mt-auto pt-1">
          <div>
            <span className="font-serif text-base font-semibold text-brand-red">
              {formatPrice(displayPrice)}
            </span>
            {isOnSale && (
              <span className="ml-1.5 font-sans text-xs text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={stockStatus === "out_of_stock"}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-red text-white transition-all hover:bg-brand-red-dark hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label={`${t("product.add_to_cart")}: ${primaryName}`}
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
