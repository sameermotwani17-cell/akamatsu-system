<p align="center"><img src="assets/banner.svg" alt="Akamatsu Health and Lifestyle" width="100%" /></p>

<p align="center">
  <a href="https://akamatsu-system.vercel.app"><img alt="Live" src="https://img.shields.io/badge/live-akamatsu--system.vercel.app-c0392b?style=for-the-badge&labelColor=0b0d11" /></a>
  <img alt="Next.js 16" src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs" />
  <img alt="React 19" src="https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black" />
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-3ecf8e?style=for-the-badge&logo=supabase&logoColor=white" />
</p>

## What it is

An online shop for **赤松 Health & Lifestyle**, a Japanese organic and gluten-free food and lifestyle store. Phase 1 is browse, order, and collect in store or have it delivered. It serves local Japanese residents and Korean and European tourists in Tokyo, so every screen is **bilingual**: Japanese first, English second.

**In plain English:** customers browse the shop, place an order and choose pickup or delivery. The owner sees every order in a simple admin and moves it from packed to delivered to paid.

## What it does

- **Browse and cart** with a Zustand store and Radix UI components, in Japanese and English through `next-intl`.
- **Checkout saves to the server** through `/api/orders`, not to browser storage, so an order survives a closed tab.
- **Pickup or delivery.** Delivery uses an estimated fee for now.
- **Confirmation email** through Resend when it is configured.
- **Owner admin.** Update an order's status (packed, delivered, paid), archive or reopen it, and work a queue of pending payments.
- **Safer public lookup.** Viewing an order confirmation needs both the order id and the order number.

## Stack

| Layer | Tools |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| UI | Tailwind, Radix UI, lucide-react, Noto Serif JP and Noto Sans JP |
| State and i18n | Zustand, next-intl |
| Data | Supabase (`@supabase/ssr`) |
| Email | Resend |

The brand is a warm Japanese apothecary look: cream and stone neutrals, a confident red `#C0392B` and a touch of gold.

## Docs in this repo

- [`PRODUCT_SPEC_V2.md`](PRODUCT_SPEC_V2.md) is the full product spec, brand tokens and phase plan.
- [`AGENTS.md`](AGENTS.md) and [`CLAUDE.md`](CLAUDE.md) hold the working rules for AI-assisted development.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
```

<p align="center"><img src="assets/divider.svg" alt="" width="100%" /></p>

<p align="center"><sub>Built by <a href="https://github.com/sameermotwani17-cell">Sameer Motwani</a> · <a href="https://portfolio-sameermotwani17-cells-projects.vercel.app">portfolio</a></sub></p>
