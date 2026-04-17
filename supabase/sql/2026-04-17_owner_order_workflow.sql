-- Owner workflow + payment skeleton migration
-- Run this once in Supabase SQL Editor for existing projects.

begin;

alter table if exists orders
  add column if not exists packed_at timestamptz,
  add column if not exists delivered_at timestamptz,
  add column if not exists archived_at timestamptz;

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

alter table payment_transactions enable row level security;

create index if not exists idx_orders_order_status on orders(order_status);
create index if not exists idx_orders_payment_status on orders(payment_status);
create index if not exists idx_orders_archived_at on orders(archived_at);
create index if not exists idx_payment_transactions_order_id on payment_transactions(order_id);
create index if not exists idx_payment_transactions_status on payment_transactions(status);

create or replace view owner_pending_payments as
select
  o.id as order_id,
  o.order_number,
  o.customer_name,
  o.email,
  o.total,
  o.payment_status,
  o.order_status,
  o.created_at
from orders o
where o.payment_status = 'pending'
order by o.created_at desc;

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

commit;
