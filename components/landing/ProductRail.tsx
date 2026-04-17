import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types/database";

type ProductRailProps = {
  products: Product[];
  title?: string;
  titleSub?: string;
  viewAllHref?: string;
};

export function ProductRail({
  products,
  title,
  titleSub,
  viewAllHref = "/shop",
}: ProductRailProps) {
  const t = useTranslations("landing");

  if (products.length === 0) return null;

  const displayTitle = title ?? t("popular_title");
  const displaySub = titleSub ?? t("popular_subtitle");

  return (
    <section className="py-16 bg-brand-cream" aria-labelledby="product-rail-heading">
      <div className="container-padded">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 id="product-rail-heading" className="section-title">
              {displayTitle}
            </h2>
            <p className="font-sans text-sm text-muted-foreground mt-1">
              {displaySub}
            </p>
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="flex items-center gap-1.5 font-sans text-sm font-medium text-brand-red hover:text-brand-red-dark transition-colors group"
            >
              {t("view_all")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>

        {/* Horizontal scroll rail */}
        <div
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:overflow-visible"
          role="list"
          aria-label={displayTitle}
        >
          {products.map((product, i) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-56 sm:w-auto product-grid-item animate-fade-in opacity-0"
              role="listitem"
            >
              <ProductCard product={product} priority={i < 4} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
