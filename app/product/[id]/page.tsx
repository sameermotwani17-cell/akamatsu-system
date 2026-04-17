import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MOCK_PRODUCTS, MOCK_REVIEWS } from "@/lib/mock-data";
import { ProductDetailClient } from "./ProductDetailClient";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return MOCK_PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = MOCK_PRODUCTS.find((p) => p.id === id);
  if (!product) return {};
  return {
    title: `${product.name_ja} — ${product.name_en}`,
    description: product.description_en,
    openGraph: {
      title: product.name_ja,
      description: product.description_en,
      images: product.image_urls[0] ? [{ url: product.image_urls[0] }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = MOCK_PRODUCTS.find((p) => p.id === id);
  if (!product) notFound();

  const reviews = MOCK_REVIEWS.filter((r) => r.product_id === id);
  const related = MOCK_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== id
  ).slice(0, 4);

  // JSON-LD product schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name_en,
    description: product.description_en,
    image: product.image_urls,
    sku: product.id,
    offers: {
      "@type": "Offer",
      price: product.sale_price ?? product.price,
      priceCurrency: "JPY",
      availability:
        product.stock_quantity > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating_avg,
      reviewCount: product.review_count,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product} reviews={reviews} related={related} />
    </>
  );
}
