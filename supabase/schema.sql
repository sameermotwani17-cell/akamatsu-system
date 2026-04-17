-- Akamatsu Health & Lifestyle — Supabase Schema
-- Run this in the Supabase SQL editor

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- =====================
-- PRODUCTS
-- =====================
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  name_ja text not null,
  name_en text not null,
  description_ja text not null default '',
  description_en text not null default '',
  ingredients text default '',
  ingredients_en text default '',
  ingredients_ja text default '',
  how_to_use text default '',
  category text not null check (category in ('health', 'beauty', 'supplements', 'wellness', 'lifestyle')),
  price integer not null, -- price in JPY
  sale_price integer, -- null = not on sale
  stock_quantity integer not null default 0,
  image_urls text[] not null default '{}',
  rating_avg numeric(3,1) not null default 0,
  review_count integer not null default 0,
  is_bestseller boolean not null default false,
  is_new boolean not null default false,
  nutrition_per_serving jsonb,
  serving_size text,
  certifications text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- =====================
-- ORDERS
-- =====================
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  customer_name text not null,
  email text not null,
  phone text not null,
  fulfillment_type text not null default 'pickup' check (fulfillment_type = 'pickup'),
  pickup_date date not null,
  pickup_slot text not null,
  items jsonb not null default '[]',
  subtotal integer not null default 0,
  delivery_fee integer not null default 0,
  tax integer not null default 0,
  total integer not null default 0,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed')),
  order_status text not null default 'confirmed' check (order_status in ('confirmed', 'ready', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

-- =====================
-- CART ITEMS (server-side sync)
-- =====================
create table if not exists cart_items (
  id uuid primary key default uuid_generate_v4(),
  session_id text,
  user_id uuid references auth.users(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  variant text,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now()
);

-- =====================
-- REVIEWS
-- =====================
create table if not exists reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  user_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null default '',
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

-- =====================
-- ROW LEVEL SECURITY
-- =====================
alter table products enable row level security;
alter table orders enable row level security;
alter table cart_items enable row level security;
alter table reviews enable row level security;

-- Products: public read
create policy "Products are publicly viewable"
  on products for select using (true);

-- Orders: anyone can insert (guest checkout), authenticated users see own orders
create policy "Anyone can create orders"
  on orders for insert with check (true);
create policy "Users can view own orders"
  on orders for select using (email = current_setting('app.user_email', true));

-- Cart: users manage their own cart
create policy "Cart items: self-manage"
  on cart_items for all
  using (
    session_id = current_setting('app.session_id', true)
    or user_id = auth.uid()
  );

-- Reviews: public read, authenticated insert
create policy "Reviews are publicly viewable"
  on reviews for select using (true);
create policy "Authenticated users can create reviews"
  on reviews for insert with check (auth.role() = 'authenticated');

-- =====================
-- INDEXES
-- =====================
create index if not exists idx_products_category on products(category);
create index if not exists idx_products_bestseller on products(is_bestseller) where is_bestseller = true;
create index if not exists idx_products_new on products(is_new) where is_new = true;
create index if not exists idx_products_stock on products(stock_quantity);
create index if not exists idx_reviews_product on reviews(product_id);
create index if not exists idx_cart_session on cart_items(session_id);
create index if not exists idx_cart_user on cart_items(user_id);
