import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Store } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

const REAL_PRODUCTS = ["r1", "r2", "r3"].map((id) =>
  MOCK_PRODUCTS.find((p) => p.id === id)!
).filter(Boolean);

export function InStoreNow() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <section className="py-16 bg-white" aria-labelledby="in-store-heading">
      <div className="container-padded">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-red/10 border border-brand-red/20 px-3 py-1 mb-3">
              <Store className="h-3.5 w-3.5 text-brand-red" />
              <span className="font-sans text-xs font-semibold text-brand-red">
                {t("landing.in_store_badge")}
              </span>
            </div>
            <h2 id="in-store-heading" className="section-title">
              {t("landing.in_store_title")}
            </h2>
            <p className="font-sans text-sm text-muted-foreground mt-1">
              {t("landing.in_store_subtitle")}
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-1.5 font-sans text-sm font-medium text-brand-red hover:text-brand-red-dark transition-colors group"
          >
            {t("landing.view_all")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REAL_PRODUCTS.map((product, i) => {
            const isOnSale = product.sale_price !== null && product.sale_price < product.price;
            const displayPrice = product.sale_price ?? product.price;
            const productName = locale === "en" ? product.name_en : product.name_ja;
            const productDesc = locale === "en" ? product.description_en : product.description_ja;

            const certMap: Record<string, { label: string; cls: string }> = {
              gluten_free: { label: t("badges.gluten_free"), cls: "badge-gluten-free" },
              organic: { label: t("badges.organic"), cls: "badge-organic" },
              no_additives: { label: t("badges.no_additives"), cls: "badge-no-additives" },
              vegan: { label: t("badges.vegan"), cls: "badge-vegan" },
            };

            return (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group block rounded-2xl overflow-hidden bg-brand-cream border border-brand-cream-dark hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Product photo */}
                <div className="relative aspect-[4/3] overflow-hidden bg-white">
                  <Image
                    src={product.image_urls[0]}
                    alt={productName}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority={i === 0}
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {product.is_bestseller && (
                      <span className="rounded-md bg-brand-red px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
                        {t("product.bestseller")}
                      </span>
                    )}
                    {product.is_new && (
                      <span className="rounded-md bg-brand-gold px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
                        {t("product.new")}
                      </span>
                    )}
                    {isOnSale && (
                      <span className="rounded-md bg-green-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
                        {t("product.on_sale")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Info panel */}
                <div className="p-4 space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {product.certifications.slice(0, 3).map((cert) => {
                      const m = certMap[cert];
                      return m ? (
                        <span key={cert} className={m.cls}>{m.label}</span>
                      ) : null;
                    })}
                  </div>

                  <h3 className="font-serif text-base font-semibold text-foreground group-hover:text-brand-red transition-colors leading-snug">
                    {productName}
                  </h3>
                  <p className="font-sans text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {productDesc}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="font-serif text-lg font-bold text-brand-red">
                        ¥{displayPrice.toLocaleString("ja-JP")}
                      </span>
                      {isOnSale && (
                        <span className="ml-2 font-sans text-xs text-muted-foreground line-through">
                          ¥{product.price.toLocaleString("ja-JP")}
                        </span>
                      )}
                    </div>
                    <span className="font-sans text-xs text-brand-red font-medium group-hover:gap-2 flex items-center gap-1 transition-all">
                      {t("product.details")} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile view all */}
        <div className="mt-6 text-center sm:hidden">
          <Link href="/shop" className="btn-secondary text-sm px-6 py-2.5">
            {t("landing.view_all_products")}
          </Link>
        </div>
      </div>
    </section>
  );
}
