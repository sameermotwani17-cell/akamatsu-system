# Supabase Skeleton Setup

This folder is now in skeleton mode so development can continue before final inventory data is ready.

## Files

- `schema.sql`: table structure and RLS policies.
- `seed.sql`: minimal placeholder data for UI/dev validation.

## Step-by-Step

1. Run `schema.sql` in Supabase SQL editor.
2. Run `seed.sql` in Supabase SQL editor.
3. For existing projects, run `sql/2026-04-17_owner_order_workflow.sql` once.
4. Confirm sample products exist in `products` table.
5. Build backend order creation against `orders` and `order_items`.
6. Replace sample rows in `seed.sql` when real inventory master is available.

## Tables Included

- `products`: product catalog.
- `orders`: order header data.
- `order_items`: normalized line items per order.
- `cart_items`: optional server-side cart sync.
- `reviews`: customer reviews.
- `payment_events`: future payment webhook/event logging.
- `payment_transactions`: admin/payment operation records.

## Owner Workflow Pages

- `/owner/orders`: active + past orders.
- `/owner/payments`: pending payment queue.

## What To Fill Later

- Real inventory rows in `seed.sql`.
- `order_number` generation strategy.
- Production-ready RLS for guest order lookup and admin access.
- Payment provider integration writing into `payment_events`.
