"use client";

import { useLocale } from "next-intl";

export function LocaleSwitcher() {
  const locale = useLocale();

  const switchLocale = (nextLocale: "ja" | "en") => {
    if (nextLocale === locale) return;
    document.cookie = `locale=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    // Full page reload so every page re-fetches from the server with the new cookie
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-brand-cream-dark p-0.5">
      <button
        onClick={() => switchLocale("ja")}
        className={`px-2 py-1 rounded text-xs font-sans font-medium transition-colors ${
          locale === "ja"
            ? "text-white"
            : "text-foreground/60 hover:text-foreground"
        }`}
        style={locale === "ja" ? { background: "#7A5235" } : undefined}
        aria-label="日本語"
        aria-pressed={locale === "ja"}
      >
        JP
      </button>
      <button
        onClick={() => switchLocale("en")}
        className={`px-2 py-1 rounded text-xs font-sans font-medium transition-colors ${
          locale === "en"
            ? "text-white"
            : "text-foreground/60 hover:text-foreground"
        }`}
        style={locale === "en" ? { background: "#7A5235" } : undefined}
        aria-label="English"
        aria-pressed={locale === "en"}
      >
        EN
      </button>
    </div>
  );
}
