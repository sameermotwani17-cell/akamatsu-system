import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: {
    default: "赤松 Health & Lifestyle | オーガニック・グルテンフリー",
    template: "%s | 赤松 Health & Lifestyle",
  },
  description:
    "オーガニック・グルテンフリーの健康食品、サプリメント、ビューティー商品。地元の健康ショップが自信を持ってお届けします。",
  keywords: ["オーガニック", "グルテンフリー", "健康食品", "サプリメント", "美容", "wellness"],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://akamatsu-health.jp"
  ),
  openGraph: {
    type: "website",
    locale: "ja_JP",
    alternateLocale: "en_US",
    siteName: "赤松 Health & Lifestyle",
    title: "赤松 Health & Lifestyle | オーガニック・グルテンフリー",
    description:
      "オーガニック・グルテンフリーの健康食品、サプリメント、ビューティー商品。",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col bg-brand-cream font-sans">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
