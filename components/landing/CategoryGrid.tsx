import Link from "next/link";
import { useTranslations } from "next-intl";
import { Heart, Sparkles, Pill, Flower2, Sun } from "lucide-react";

const CATEGORIES = [
  {
    key: "health",
    descKey: "health_desc",
    icon: Heart,
    color: "bg-red-50 text-brand-red group-hover:bg-brand-red group-hover:text-white",
  },
  {
    key: "beauty",
    descKey: "beauty_desc",
    icon: Sparkles,
    color: "bg-pink-50 text-pink-600 group-hover:bg-pink-600 group-hover:text-white",
  },
  {
    key: "supplements",
    descKey: "supplements_desc",
    icon: Pill,
    color: "bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white",
  },
  {
    key: "wellness",
    descKey: "wellness_desc",
    icon: Flower2,
    color: "bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white",
  },
  {
    key: "lifestyle",
    descKey: "lifestyle_desc",
    icon: Sun,
    color: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
  },
];

export function CategoryGrid() {
  const t = useTranslations("categories");

  return (
    <section className="py-16 bg-white" aria-labelledby="categories-heading">
      <div className="container-padded">
        <div className="text-center mb-10">
          <h2 id="categories-heading" className="section-title">
            {t("title")}
          </h2>
          <p className="font-sans text-sm text-muted-foreground mt-2">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.key}
                href={`/shop?category=${cat.key}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-brand-cream-dark bg-brand-cream p-5 text-center transition-all duration-200 hover:border-transparent hover:shadow-lg hover:-translate-y-1"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-200 ${cat.color}`}
                >
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-serif text-sm font-semibold text-foreground group-hover:text-brand-red transition-colors">
                    {t(cat.key)}
                  </p>
                  <p className="font-sans text-xs text-muted-foreground mt-0.5 leading-snug">
                    {t(cat.descKey)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
