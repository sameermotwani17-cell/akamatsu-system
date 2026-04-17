"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export function LocaleSwitcher() {
  const router = useRouter();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (nextLocale: "ja" | "en") => {
    document.cookie = `locale=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-brand-cream-dark p-0.5">
      <button
        onClick={() => switchLocale("ja")}
        disabled={isPending}
        className={`px-2 py-1 rounded text-xs font-sans font-medium transition-colors ${
          locale === "ja"
            ? "bg-brand-red text-white"
            : "text-foreground/60 hover:text-foreground"
        }`}
        aria-label="日本語"
        aria-pressed={locale === "ja"}
      >
        JP
      </button>
      <button
        onClick={() => switchLocale("en")}
        disabled={isPending}
        className={`px-2 py-1 rounded text-xs font-sans font-medium transition-colors ${
          locale === "en"
            ? "bg-brand-red text-white"
            : "text-foreground/60 hover:text-foreground"
        }`}
        aria-label="English"
        aria-pressed={locale === "en"}
      >
        EN
      </button>
    </div>
  );
}
