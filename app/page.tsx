import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { HeroSection } from "@/components/landing/HeroSection";
import { CategoryGrid } from "@/components/landing/CategoryGrid";
import { ProductRail } from "@/components/landing/ProductRail";
import { TrustBar } from "@/components/landing/TrustBar";
import { InStoreNow } from "@/components/landing/InStoreNow";
import { getMockProducts } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "赤松 | この町のいいもの — 自然食品・調味料",
  description:
    "創業85年。みそ・醤油・塩・だし・発酵食品など、地域に根ざした自然食品と調味料を丁寧に取り揃えています。",
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

      {/* Store story section */}
      <section className="py-16 bg-white" aria-labelledby="story-heading">
        <div className="container-padded">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 border"
                style={{ background: "#FDF5EC", borderColor: "#E8D0A8" }}
              >
                <span style={{ color: "#7A5235" }} className="text-sm">🏡</span>
                <span className="font-sans text-xs font-medium" style={{ color: "#5C3D20" }}>
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

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-2">
                {[
                  { num: t("stat1_num"), label: t("stat1_label"), sub: t("stat1_sub") },
                  { num: t("stat2_num"), label: t("stat2_label"), sub: t("stat2_sub") },
                  { num: t("stat3_num"), label: t("stat3_label"), sub: t("stat3_sub") },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="font-serif text-2xl font-bold" style={{ color: "#7A5235" }}>
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

            {/* Visual grid — warm earthy gradients */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-3">
                <div
                  className="aspect-[4/5] rounded-2xl overflow-hidden flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #4A2E14 0%, #7A5235 100%)" }}
                >
                  <div className="text-center text-white p-4">
                    <div className="text-5xl mb-2">🫙</div>
                    <p className="font-serif text-sm font-medium opacity-90">みそ・発酵</p>
                  </div>
                </div>
                <div
                  className="aspect-square rounded-2xl overflow-hidden flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #1F4A1B 0%, #2D6B28 100%)" }}
                >
                  <div className="text-center text-white p-4">
                    <div className="text-4xl mb-1">🌿</div>
                    <p className="font-serif text-xs font-medium opacity-90">自然食品</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3 pt-6">
                <div
                  className="aspect-square rounded-2xl overflow-hidden flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #5C2810 0%, #8B3A20 100%)" }}
                >
                  <div className="text-center text-white p-4">
                    <div className="text-4xl mb-1">🍶</div>
                    <p className="font-serif text-xs font-medium opacity-90">醤油・塩</p>
                  </div>
                </div>
                <div
                  className="aspect-[4/5] rounded-2xl overflow-hidden flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #3D2E10 0%, #6B5238 100%)" }}
                >
                  <div className="text-center text-white p-4">
                    <div className="text-5xl mb-2">🍵</div>
                    <p className="font-serif text-sm font-medium opacity-90">だし・甘酒</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
