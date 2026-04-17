import { ShieldCheck, Leaf, Wheat, Star, Store } from "lucide-react";
import { useTranslations } from "next-intl";

export function TrustBar() {
  const t = useTranslations("trust");

  const TRUST_ITEMS = [
    { icon: Store, text: t("free_pickup"), subtext: "Free Store Pickup", color: "text-brand-red" },
    { icon: Leaf, text: t("organic_full"), subtext: "Certified Organic", color: "text-green-600" },
    { icon: Wheat, text: t("gluten_free_full"), subtext: "Gluten-Free", color: "text-amber-600" },
    { icon: ShieldCheck, text: t("secure_full"), subtext: "Secure Payment", color: "text-blue-600" },
    { icon: Star, text: t("rating"), subtext: "1,200+ Reviews", color: "text-brand-gold" },
  ];

  return (
    <section
      className="bg-brand-cream-dark border-y border-brand-cream-dark py-6"
      aria-label="Trust signals"
    >
      <div className="container-padded">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {TRUST_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.text} className="flex items-center gap-3">
                <div className={`shrink-0 ${item.color}`}>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-sans text-xs font-semibold text-foreground leading-tight">
                    {item.text}
                  </p>
                  <p className="font-sans text-[10px] text-muted-foreground leading-tight">
                    {item.subtext}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
