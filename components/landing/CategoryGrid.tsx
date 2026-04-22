import Link from "next/link";
import { useTranslations } from "next-intl";
import { Leaf, Droplets, Flame, Wind, Coffee } from "lucide-react";

const CATEGORIES = [
  {
    key: "health",
    descKey: "health_desc",
    icon: Leaf,
    bgColor: "#FDF5EC",
    iconColor: "#7A5235",
    hoverBg: "#7A5235",
  },
  {
    key: "beauty",
    descKey: "beauty_desc",
    icon: Droplets,
    bgColor: "#EAF4EA",
    iconColor: "#2D5A27",
    hoverBg: "#2D5A27",
  },
  {
    key: "supplements",
    descKey: "supplements_desc",
    icon: Flame,
    bgColor: "#FDF0E8",
    iconColor: "#B5402A",
    hoverBg: "#B5402A",
  },
  {
    key: "wellness",
    descKey: "wellness_desc",
    icon: Wind,
    bgColor: "#F4F0E8",
    iconColor: "#6B5238",
    hoverBg: "#5C3D20",
  },
  {
    key: "lifestyle",
    descKey: "lifestyle_desc",
    icon: Coffee,
    bgColor: "#F8F4EC",
    iconColor: "#9B6B48",
    hoverBg: "#7A5235",
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
                  className="flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-200"
                  style={{ background: cat.bgColor, color: cat.iconColor }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = cat.hoverBg;
                    (e.currentTarget as HTMLElement).style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = cat.bgColor;
                    (e.currentTarget as HTMLElement).style.color = cat.iconColor;
                  }}
                >
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </div>
                <div>
                  <p
                    className="font-serif text-sm font-semibold text-foreground transition-colors duration-200"
                    style={{}}
                  >
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
