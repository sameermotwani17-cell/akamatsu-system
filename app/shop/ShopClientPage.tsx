"use client";

import { useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { ProductCard } from "@/components/product/ProductCard";
import { getMockProducts } from "@/lib/mock-data";

const CATEGORIES = ["health", "beauty", "supplements", "wellness", "lifestyle"];
const SORT_OPTIONS = [
  { value: "bestseller", labelKey: "best_selling" },
  { value: "price_asc", labelKey: "price_asc" },
  { value: "price_desc", labelKey: "price_desc" },
  { value: "newest", labelKey: "newest" },
  { value: "rating", labelKey: "highest_rated" },
];

type FilterState = {
  categories: string[];
  price: "" | "under_1000" | "1000_3000" | "over_3000";
  minRating: number;
  inStock: boolean;
  sort: string;
  search: string;
};

type ShopClientPageProps = {
  initialParams: {
    category?: string;
    sort?: string;
    q?: string;
    price?: string;
    rating?: string;
    inStock?: string;
  };
};

export function ShopClientPage({ initialParams }: ShopClientPageProps) {
  const t = useTranslations();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    categories: initialParams.category ? [initialParams.category] : [],
    price: (initialParams.price as FilterState["price"]) ?? "",
    minRating: initialParams.rating ? Number(initialParams.rating) : 0,
    inStock: initialParams.inStock === "true",
    sort: initialParams.sort ?? "bestseller",
    search: initialParams.q ?? "",
  });

  const products = useMemo(() => {
    let minPrice: number | undefined;
    let maxPrice: number | undefined;
    if (filters.price === "under_1000") maxPrice = 999;
    else if (filters.price === "1000_3000") { minPrice = 1000; maxPrice = 3000; }
    else if (filters.price === "over_3000") minPrice = 3001;

    return getMockProducts({
      category: filters.categories.length === 1 ? filters.categories[0] : undefined,
      sort: filters.sort,
      search: filters.search || undefined,
      inStock: filters.inStock || undefined,
      minPrice,
      maxPrice,
      minRating: filters.minRating > 0 ? filters.minRating : undefined,
    }).filter((p) => {
      if (filters.categories.length > 1) {
        return filters.categories.includes(p.category);
      }
      return true;
    });
  }, [filters]);

  const toggleCategory = (cat: string) => {
    setFilters((f) => ({
      ...f,
      categories: f.categories.includes(cat)
        ? f.categories.filter((c) => c !== cat)
        : [...f.categories, cat],
    }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      price: "",
      minRating: 0,
      inStock: false,
      sort: "bestseller",
      search: "",
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.price !== "" ||
    filters.minRating > 0 ||
    filters.inStock ||
    filters.search !== "";

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-sans text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
          {t("filters.category_label")}
        </h3>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className="h-4 w-4 rounded border-brand-cream-dark text-brand-red focus:ring-brand-red"
              />
              <span className="font-sans text-sm text-foreground/80 group-hover:text-brand-red transition-colors">
                {t(`categories.${cat}`)}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="font-sans text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
          {t("filters.price_label")}
        </h3>
        <div className="space-y-2">
          {[
            { value: "", label: t("filters.all_categories") },
            { value: "under_1000", label: t("filters.price_under_1000") },
            { value: "1000_3000", label: t("filters.price_1000_3000") },
            { value: "over_3000", label: t("filters.price_over_3000") },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="price"
                checked={filters.price === opt.value}
                onChange={() =>
                  setFilters((f) => ({ ...f, price: opt.value as FilterState["price"] }))
                }
                className="h-4 w-4 text-brand-red focus:ring-brand-red"
              />
              <span className="font-sans text-sm text-foreground/80 group-hover:text-brand-red transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-sans text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
          {t("filters.rating_label")}
        </h3>
        <div className="space-y-2">
          {[0, 3, 4].map((rating) => (
            <label key={rating} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === rating}
                onChange={() => setFilters((f) => ({ ...f, minRating: rating }))}
                className="h-4 w-4 text-brand-red focus:ring-brand-red"
              />
              <span className="font-sans text-sm text-foreground/80 group-hover:text-brand-red transition-colors">
                {rating === 0
                  ? t("filters.all_categories")
                  : `${rating}★ ${t("filters.all_categories").toLowerCase()}`}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* In Stock */}
      <div>
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => setFilters((f) => ({ ...f, inStock: e.target.checked }))}
            className="h-4 w-4 rounded border-brand-cream-dark text-brand-red focus:ring-brand-red"
          />
          <span className="font-sans text-sm font-medium text-foreground group-hover:text-brand-red transition-colors">
            {t("filters.in_stock")}
          </span>
        </label>
      </div>

      {/* Clear */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1.5 text-sm text-brand-red hover:text-brand-red-dark font-medium transition-colors"
        >
          <X className="h-3.5 w-3.5" />
          {t("filters.clear_filters")}
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Sticky top bar */}
      <div className="sticky top-16 z-30 bg-white border-b border-brand-cream-dark shadow-sm">
        <div className="container-padded py-3">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                value={filters.search}
                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                placeholder="商品を検索 / Search..."
                className="w-full rounded-lg border border-brand-cream-dark bg-brand-cream py-2 pl-9 pr-4 text-sm font-sans outline-none focus:ring-2 focus:ring-brand-red transition-shadow"
                aria-label="Search products"
              />
            </div>

            {/* Sort dropdown */}
            <div className="relative hidden sm:block">
              <select
                value={filters.sort}
                onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
                className="appearance-none rounded-lg border border-brand-cream-dark bg-white px-4 py-2 pr-8 text-sm font-sans outline-none focus:ring-2 focus:ring-brand-red cursor-pointer"
                aria-label={t("filters.sort")}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {t(`filters.${opt.labelKey}`)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="lg:hidden flex items-center gap-1.5 rounded-lg border border-brand-cream-dark bg-white px-3 py-2 text-sm font-sans transition-colors hover:bg-brand-cream"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {t("filters.filters")}
            </button>

            {/* Result count */}
            <span className="hidden sm:block font-sans text-xs text-muted-foreground shrink-0">
              {t("filters.results", { count: products.length })}
            </span>
          </div>
        </div>
      </div>

      <div className="container-padded py-8">
        <div className="flex gap-8">
          {/* Sidebar filters (desktop) */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-32 rounded-xl bg-white border border-brand-cream-dark p-5">
              <FilterPanel />
            </div>
          </aside>

          {/* Mobile filters */}
          {mobileFiltersOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/40">
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-lg font-semibold">
                    {t("filters.filters")}
                  </h2>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="rounded-lg p-1.5 hover:bg-brand-cream"
                    aria-label={t("filters.close")}
                    title={t("filters.close")}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <FilterPanel />
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="btn-primary w-full mt-6"
                >
                  {t("filters.show_count", { count: products.length })}
                </button>
              </div>
            </div>
          )}

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5 sm:hidden">
              <p className="font-sans text-sm text-muted-foreground">
                {t("filters.results", { count: products.length })}
              </p>
              <select
                value={filters.sort}
                onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
                className="appearance-none rounded-lg border border-brand-cream-dark bg-white px-3 py-1.5 text-sm font-sans outline-none focus:ring-2 focus:ring-brand-red"
                aria-label={t("filters.sort")}
                title={t("filters.sort")}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {t(`filters.${opt.labelKey}`)}
                  </option>
                ))}
              </select>
            </div>

            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
                <div className="text-5xl">🔍</div>
                <h3 className="font-serif text-xl font-semibold text-foreground/60">
                  {t("filters.no_products")}
                </h3>
                <p className="font-sans text-sm text-muted-foreground">
                  {t("filters.no_products_sub")}
                </p>
                <button onClick={clearFilters} className="btn-secondary text-sm px-5 py-2">
                  {t("filters.clear_filters")}
                </button>
              </div>
            ) : (
              <div
                className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
                role="list"
                aria-label="Products"
              >
                {products.map((product, i) => (
                  <div
                    key={product.id}
                    className="product-grid-item animate-fade-in opacity-0"
                    role="listitem"
                  >
                    <ProductCard product={product} priority={i < 4} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
