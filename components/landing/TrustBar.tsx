import { History, MapPin, Leaf, Phone, Truck } from "lucide-react";
import { useTranslations } from "next-intl";

export function TrustBar() {
  const t = useTranslations("trust");

  const TRUST_ITEMS = [
    {
      icon: History,
      text: "創業85年",
      subtext: "地域に根ざした信頼の老舗",
      iconColor: "#7A5235",
    },
    {
      icon: MapPin,
      text: "地域密着",
      subtext: "地元のお客様を第一に",
      iconColor: "#2D5A27",
    },
    {
      icon: Leaf,
      text: t("organic_full"),
      subtext: "無添加・自然食品",
      iconColor: "#4A7A44",
    },
    {
      icon: Phone,
      text: "TEL・LINE受付",
      subtext: "お気軽にお問い合わせを",
      iconColor: "#B5402A",
    },
    {
      icon: Truck,
      text: t("free_pickup"),
      subtext: "地域配達・全国ゆうパック",
      iconColor: "#6B5238",
    },
  ];

  return (
    <section
      className="border-y border-brand-cream-dark py-6"
      style={{ background: "#EDE3D8" }}
      aria-label="Trust signals"
    >
      <div className="container-padded">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {TRUST_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.text} className="flex items-center gap-3">
                <div className="shrink-0" style={{ color: item.iconColor }}>
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
