import type { Metadata } from "next";
import { ShopClientPage } from "./ShopClientPage";

export const metadata: Metadata = {
  title: "すべての商品 — ショップ",
  description: "オーガニック・グルテンフリーの健康食品、サプリメント、ビューティーアイテムを幅広くご用意しています。",
};

type ShopPageProps = {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    q?: string;
    price?: string;
    rating?: string;
    inStock?: string;
  }>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  return <ShopClientPage initialParams={params} />;
}
