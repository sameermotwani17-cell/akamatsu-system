-- Akamatsu Health & Lifestyle — Skeleton Seed
-- This file intentionally avoids real inventory data.
-- Fill this file when product master data is ready.

begin;

-- Optional: clear existing data in local/dev only.
-- truncate table payment_events, order_items, orders, reviews, cart_items, products restart identity cascade;

-- =====================
-- PLACEHOLDER PRODUCTS (minimum examples)
-- =====================
-- Keep 2-3 products only for UI validation before real inventory import.
insert into products (
  sku,
  slug,
  name_ja,
  name_en,
  description_ja,
  description_en,
  category,
  price,
  sale_price,
  stock_quantity,
  image_urls,
  certifications
)
values
(
  'SKU-SAMPLE-001',
  'sample-product-health',
  'サンプル商品A',
  'Sample Product A',
  '在庫マスタ未確定のため仮の商品です。',
  'Temporary sample product until inventory master is finalized.',
  'health',
  2500,
  null,
  10,
  array['https://picsum.photos/seed/akamatsu-1/800/800'],
  array['organic']
),
(
  'SKU-SAMPLE-002',
  'sample-product-beauty',
  'サンプル商品B',
  'Sample Product B',
  '在庫マスタ未確定のため仮の商品です。',
  'Temporary sample product until inventory master is finalized.',
  'beauty',
  3200,
  2800,
  5,
  array['https://picsum.photos/seed/akamatsu-2/800/800'],
  array['gluten_free']
)
on conflict (sku) do update
set
  slug = excluded.slug,
  name_ja = excluded.name_ja,
  name_en = excluded.name_en,
  description_ja = excluded.description_ja,
  description_en = excluded.description_en,
  category = excluded.category,
  price = excluded.price,
  sale_price = excluded.sale_price,
  stock_quantity = excluded.stock_quantity,
  image_urls = excluded.image_urls,
  certifications = excluded.certifications,
  updated_at = now();

-- =====================
-- PLACEHOLDER REVIEW (optional)
-- =====================
-- insert into reviews (product_id, user_name, rating, comment, verified)
-- select id, 'Sample User', 5, 'Great sample product', true
-- from products
-- where sku = 'SKU-SAMPLE-001';

-- =====================
-- NOTE FOR REAL INVENTORY IMPORT
-- =====================
-- Replace the two sample rows above with generated INSERTs from your source file.
-- Recommended source columns:
-- sku, slug, name_ja, name_en, description_ja, description_en,
-- category, price, sale_price, stock_quantity, image_urls, certifications.

commit;
