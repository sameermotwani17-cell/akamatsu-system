"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const t = useTranslations("admin");
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (active && data.session) {
        router.replace("/owner/orders");
      }
    })();
    return () => {
      active = false;
    };
  }, [router, supabase]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.replace("/owner/orders");
  };

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-brand-cream-dark bg-white p-8 shadow-sm">
        <h1 className="font-serif text-2xl font-bold text-foreground">{t("title")}</h1>
        <p className="font-sans text-sm text-muted-foreground mt-1">
          {t("subtitle")}
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="admin-email" className="block font-sans text-sm font-medium text-foreground mb-1.5">
              {t("email")}
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@example.com"
              required
              autoComplete="email"
              className="w-full rounded-xl border border-brand-cream-dark bg-white px-4 py-3 font-sans text-sm outline-none transition-shadow focus:ring-2 focus:ring-brand-red"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block font-sans text-sm font-medium text-foreground mb-1.5">
              {t("password")}
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-brand-cream-dark bg-white px-4 py-3 font-sans text-sm outline-none transition-shadow focus:ring-2 focus:ring-brand-red"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2">
              <p className="font-sans text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center"
          >
            {loading ? t("signingIn") : t("signIn")}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-brand-cream-dark">
          <Link href="/" className="font-sans text-sm text-brand-red hover:underline">
            {t("backToStorefront")}
          </Link>
        </div>
      </div>
    </div>
  );
}
