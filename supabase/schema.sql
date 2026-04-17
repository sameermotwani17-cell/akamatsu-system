-- Akamatsu Health & Lifestyle — Supabase Skeleton Schema
-- Phase: skeleton only (no real inventory loaded yet)

create extension if not exists pgcrypto;

-- =====================
-- PRODUCTS (catalog source of truth)
-- =====================
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  sku text unique,
  slug text unique,
  name_ja text not null,
  name_en text not null,
  description_ja text not null default '',
  description_en text not null default '',
  ingredients text default '',
  ingredients_en text default '',
  ingredients_ja text default '',
  how_to_use text default '',
  category text not null check (category in ('health', 'beauty', 'supplements', 'wellness', 'lifestyle')),
  price integer not null check (price >= 0),
  sale_price integer check (sale_price is null or sale_price >= 0),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  image_urls text[] not null default '{}',
  rating_avg numeric(3,1) not null default 0,
  review_count integer not null default 0,
  is_bestseller boolean not null default false,
  is_new boolean not null default false,
  is_active boolean not null default true,
  nutrition_per_serving jsonb,
  serving_size text,
  certifications text[] not null default '{}',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================
-- ORDERS (server-side order master)
-- =====================
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique,
  idempotency_key text unique,
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  email text not null,
  phone text not null,
  fulfillment_type text not null default 'pickup' check (fulfillment_type in ('pickup', 'delivery')),
  pickup_date date,
  pickup_slot text,
  -- Delivery fields are nullable for now until delivery flow is implemented.
  postal_code text,
  prefecture text,
  city text,
  address_line1 text,
  address_line2 text,
  items jsonb not null default '[]',
  subtotal integer not null default 0 check (subtotal >= 0),
  delivery_fee integer not null default 0 check (delivery_fee >= 0),
  discount integer not null default 0 check (discount >= 0),
  tax integer not null default 0 check (tax >= 0),
  total integer not null default 0 check (total >= 0),
  currency text not null default 'JPY',
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  order_status text not null default 'confirmed' check (order_status in ('confirmed', 'ready', 'completed', 'cancelled')),
  packed_at timestamptz,
  delivered_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================
-- ORDER ITEMS (normalized line items)
-- =====================
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name_ja text not null,
  product_name_en text not null,
  variant text,
  quantity integer not null check (quantity > 0),
  unit_price integer not null check (unit_price >= 0),
  line_total integer not null check (line_total >= 0),
  image_url text,
  created_at timestamptz not null default now()
);

-- =====================
-- CART ITEMS (optional server-side sync)
-- =====================
create table if not exists cart_items (
  id uuid primary key default gen_random_uuid(),
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
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  user_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null default '',
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

-- =====================
-- PAYMENT EVENTS (future integration skeleton)
-- =====================
create table if not exists payment_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  provider text not null,
  event_type text not null,
  event_id text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- =====================
-- PAYMENT TRANSACTIONS (admin/payment operations)
-- =====================
create table if not exists payment_transactions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  provider text not null default 'manual',
  method text,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded')),
  amount integer not null check (amount >= 0),
  currency text not null default 'JPY',
  reference text,
  metadata jsonb not null default '{}'::jsonb,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================
-- ROW LEVEL SECURITY
-- =====================
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table cart_items enable row level security;
alter table reviews enable row level security;
alter table payment_events enable row level security;
alter table payment_transactions enable row level security;

-- Products: public read
drop policy if exists "Products are publicly viewable" on products;
create policy "Products are publicly viewable"
  on products for select using (true);

-- Orders: allow insert for checkout, allow authenticated read on own user_id.
drop policy if exists "Anyone can create orders" on orders;
create policy "Anyone can create orders"
  on orders for insert with check (true);

drop policy if exists "Users can view own orders" on orders;
create policy "Users can view own orders"
  on orders for select using (auth.uid() = user_id);

-- Order items: readable when parent order belongs to authenticated user.
drop policy if exists "Users can view own order items" on order_items;
create policy "Users can view own order items"
  on order_items for select
  using (
    exists (
      select 1
      from orders o
      where o.id = order_items.order_id
        and o.user_id = auth.uid()
    )
  );

-- Cart: users manage own cart/session cart.
drop policy if exists "Cart items: self-manage" on cart_items;
create policy "Cart items: self-manage"
  on cart_items for all
  using (
    user_id = auth.uid()
    or session_id = current_setting('request.jwt.claim.session_id', true)
  )
  with check (
    user_id = auth.uid()
    or session_id = current_setting('request.jwt.claim.session_id', true)
  );

-- Reviews: public read, authenticated insert.
drop policy if exists "Reviews are publicly viewable" on reviews;
create policy "Reviews are publicly viewable"
  on reviews for select using (true);

drop policy if exists "Authenticated users can create reviews" on reviews;
create policy "Authenticated users can create reviews"
  on reviews for insert with check (auth.role() = 'authenticated');

-- Payment events: deny all by default (service role should be used via server code).

-- =====================
-- INDEXES
-- =====================
create index if not exists idx_products_category on products(category);
create index if not exists idx_products_active on products(is_active);
create index if not exists idx_products_stock on products(stock_quantity);
create index if not exists idx_orders_created_at on orders(created_at desc);
create index if not exists idx_orders_email on orders(email);
create index if not exists idx_orders_user_id on orders(user_id);
create index if not exists idx_orders_order_status on orders(order_status);
create index if not exists idx_orders_payment_status on orders(payment_status);
create index if not exists idx_orders_archived_at on orders(archived_at);
create index if not exists idx_order_items_order_id on order_items(order_id);
create index if not exists idx_reviews_product on reviews(product_id);
create index if not exists idx_cart_session on cart_items(session_id);
create index if not exists idx_cart_user on cart_items(user_id);
create index if not exists idx_payment_events_order_id on payment_events(order_id);
create index if not exists idx_payment_transactions_order_id on payment_transactions(order_id);
create index if not exists idx_payment_transactions_status on payment_transactions(status);

-- =====================
-- OWNER VIEWS
-- =====================
create or replace view owner_pending_payments as
select
  o.id as order_id,
  o.order_number,
  o.customer_name,
  o.email,
  o.total,
  o.currency,
  o.payment_status,
  o.order_status,
  o.created_at,
  o.updated_at
from orders o
where o.payment_status = 'pending';

create or replace view owner_past_orders as
select
  o.id,
  o.order_number,
  o.customer_name,
  o.email,
  o.pickup_date,
  o.pickup_slot,
  o.total,
  o.payment_status,
  o.order_status,
  coalesce(o.archived_at, o.updated_at) as archived_or_updated_at
from orders o
where o.archived_at is not null
   or o.order_status in ('completed', 'cancelled')
order by archived_or_updated_at desc;
