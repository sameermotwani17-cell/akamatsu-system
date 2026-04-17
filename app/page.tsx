import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { HeroSection } from "@/components/landing/HeroSection";
import { CategoryGrid } from "@/components/landing/CategoryGrid";
import { ProductRail } from "@/components/landing/ProductRail";
import { TrustBar } from "@/components/landing/TrustBar";
import { InStoreNow } from "@/components/landing/InStoreNow";
import { getMockProducts } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "赤松 Health & Lifestyle | 自然の恵みで、毎日を豊かに",
  description:
    "オーガニック・グルテンフリーの健康食品、サプリメント、ビューティー商品。地元の健康ショップが自信を持ってお届けします。",
};

export default function LandingPage() {
  const t = useTranslations("landing");
  const topProducts = getMockProducts({ limit: 8, sort: "bestseller" });

  return (
    <>
      <HeroSection />
      <TrustBar />
      <InStoreNow />
      <CategoryGrid />
      <ProductRail
        products={topProducts}
        title={t("popular_title")}
        titleSub={t("popular_subtitle")}
        viewAllHref="/shop"
      />

      {/* Organic/Natural editorial section */}
      <section className="py-16 bg-white" aria-labelledby="story-heading">
        <div className="container-padded">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-3 py-1">
                <span className="text-green-600 text-sm">🌿</span>
                <span className="font-sans text-xs font-medium text-green-700">
                  {t("story_badge")}
                </span>
              </div>
              <h2
                id="story-heading"
                className="font-serif text-3xl md:text-4xl font-semibold text-foreground leading-tight"
              >
                {t("story_title_1")}
                <br />
                {t("story_title_2")}
              </h2>
              <p className="font-sans text-base text-muted-foreground leading-relaxed">
                {t("story_body1")}
              </p>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                {t("story_body2")}
              </p>
              <div className="grid grid-cols-3 gap-4 pt-2">
                {[
                  { num: t("stat1_num"), label: t("stat1_label"), sub: t("stat1_sub") },
                  { num: t("stat2_num"), label: t("stat2_label"), sub: t("stat2_sub") },
                  { num: t("stat3_num"), label: t("stat3_label"), sub: t("stat3_sub") },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="font-serif text-2xl font-bold text-brand-red">
                      {stat.num}
                    </div>
                    <div className="font-sans text-xs font-medium text-foreground mt-0.5">
                      {stat.label}
                    </div>
                    <div className="font-sans text-[10px] text-muted-foreground">
                      {stat.sub}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-3">
                <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-green-100 to-green-200 overflow-hidden">
                  <div className="h-full flex items-center justify-center text-6xl">🌿</div>
                </div>
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 overflow-hidden">
                  <div className="h-full flex items-center justify-center text-5xl">🌾</div>
                </div>
              </div>
              <div className="space-y-3 pt-6">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-brand-red/10 to-brand-red/20 overflow-hidden">
                  <div className="h-full flex items-center justify-center text-5xl">🍵</div>
                </div>
                <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 overflow-hidden">
                  <div className="h-full flex items-center justify-center text-6xl">💧</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
