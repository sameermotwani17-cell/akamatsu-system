"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export function LocaleSwitcher() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (locale: string) => {
    document.cookie = `locale=${locale}; path=/; max-age=31536000`;
    startTransition(() => {
      router.refresh();
    });
  };

  const currentLocale =
    typeof document !== "undefined"
      ? document.cookie
          .split("; ")
          .find((row) => row.startsWith("locale="))
          ?.split("=")[1] ?? "ja"
      : "ja";

  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-brand-cream-dark p-0.5">
      <button
        onClick={() => switchLocale("ja")}
        disabled={isPending}
        className={`px-2 py-1 rounded text-xs font-sans font-medium transition-colors ${
          currentLocale !== "en"
            ? "bg-brand-red text-white"
            : "text-foreground/60 hover:text-foreground"
        }`}
        aria-label="日本語"
        aria-pressed={currentLocale !== "en"}
      >
        JP
      </button>
      <button
        onClick={() => switchLocale("en")}
        disabled={isPending}
        className={`px-2 py-1 rounded text-xs font-sans font-medium transition-colors ${
          currentLocale === "en"
            ? "bg-brand-red text-white"
            : "text-foreground/60 hover:text-foreground"
        }`}
        aria-label="English"
        aria-pressed={currentLocale === "en"}
      >
        EN
      </button>
    </div>
  );
}
