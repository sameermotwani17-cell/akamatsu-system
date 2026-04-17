import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, Leaf } from "lucide-react";

export function HeroSection() {
  const t = useTranslations();

  return (
    <section
      className="relative min-h-[85vh] flex items-center overflow-hidden bg-brand-red"
      aria-label="Hero"
    >
      {/* Decorative background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-red via-brand-red to-[#8B2018] opacity-95" />
        <svg
          className="absolute right-0 top-0 h-full w-1/2 opacity-10"
          viewBox="0 0 600 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="500" cy="200" r="350" stroke="white" strokeWidth="1" />
          <circle cx="400" cy="500" r="280" stroke="white" strokeWidth="1" />
          <circle cx="300" cy="150" r="200" stroke="white" strokeWidth="1" />
          <circle cx="550" cy="600" r="220" stroke="white" strokeWidth="1" />
        </svg>
        <div className="absolute top-1/4 right-1/4 opacity-10 rotate-45">
          <Leaf className="h-32 w-32 text-white" />
        </div>
        <div className="absolute bottom-1/3 right-1/3 opacity-[0.06] -rotate-12">
          <Leaf className="h-48 w-48 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="relative container-padded py-20 lg:py-28">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 backdrop-blur-sm border border-white/20">
            <Leaf className="h-3.5 w-3.5 text-brand-gold" />
            <span className="font-sans text-xs font-medium text-white/90 tracking-wide">
              有機 JAS認証 · オーガニック · グルテンフリー
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance">
            {t("hero.headline").split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i === 0 && <br />}
              </span>
            ))}
          </h1>

          {/* Subheadline */}
          <p className="mt-6 font-sans text-base sm:text-lg text-white/80 leading-relaxed max-w-xl">
            {t("hero.subheadline")}
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 font-sans font-semibold text-brand-red shadow-lg hover:bg-brand-cream transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-red"
            >
              {t("hero.cta_primary")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/shop?category=health"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/40 px-8 py-4 font-sans font-medium text-white hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-red"
            >
              {t("hero.cta_secondary")}
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-10 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-7 w-7 rounded-full bg-white/30 border-2 border-white/50 flex items-center justify-center text-white text-[10px] font-bold"
                    aria-hidden="true"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-3 w-3 fill-brand-gold" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="font-sans text-xs text-white/70">
                  {t("hero.reviews_count")}
                </p>
              </div>
            </div>

            <div className="h-8 w-px bg-white/20" aria-hidden="true" />

            <div className="font-sans text-xs text-white/70">
              <span className="font-semibold text-white">{t("hero.pickup_threshold")}</span>
              <br />
              {t("hero.pickup_free_short")}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none" aria-hidden="true">
        <svg viewBox="0 0 1440 80" className="w-full" preserveAspectRatio="none">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#FAF7F2" />
        </svg>
      </div>
    </section>
  );
}
