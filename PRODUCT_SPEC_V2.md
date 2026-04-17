# 赤松 Health & Lifestyle — Product Specification Document
## Version 2.0 · April 2026

---

## 1. Project Overview

**Product Name:** 赤松 Health & Lifestyle (Akamatsu Health & Lifestyle)  
**Type:** E-commerce web app — Phase 1 (Browse & In-store Pickup)  
**Primary Market:** Local Japanese residents + Korean & European tourists in Tokyo  
**Live URL (dev):** http://localhost:3000  
**Build Status:** ✅ 28/28 pages compiled, 0 errors, 0 warnings  

### Implementation Reality (April 2026)

The current production codebase includes several post-Phase-1 enhancements. These are intentional and currently active:

1. Checkout persistence is API-backed (`/api/orders`) rather than `sessionStorage` as source of truth.
2. Fulfillment supports both pickup and delivery (delivery uses estimated fee for now).
3. Confirmation email is sent via Resend when configured.
4. Owner/admin workflow includes status updates (packed, delivered, paid), archive/reopen, and pending payments queue.
5. Order confirmation lookup requires both `orderId` and `orderNumber` for safer public access.

---

## 2. Brand Identity

| Token | Value |
|---|---|
| Primary Red | `#C0392B` (brand-red) |
| Dark Red | `#922B21` (brand-red-dark) |
| Cream | `#FAF7F2` (brand-cream) |
| Cream Dark | `#F0EBE3` (brand-cream-dark) |
| Stone | `#8D6E63` (brand-stone) |
| Gold | `#D4A017` (brand-gold) |
| Foreground | `#1A1A1A` |
| Serif Font | Noto Serif JP (Google Fonts) |
| Sans Font | Noto Sans JP (Google Fonts) |

**Aesthetic:** Warm Japanese apothecary / Muji editorial. Clean whites, warm creams, confident red accents. Bilingual — Japanese primary, English secondary on all UI.

---

## 3. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js App Router | 16.2.4 |
| Runtime | React | 19.2.4 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS v4 | ^4.2.2 |
| i18n | next-intl | ^4.9.1 |
| State | Zustand | ^5.0.12 |
| Database | Supabase (PostgreSQL + RLS) | @supabase/ssr ^0.10.2 |
| Icons | lucide-react | ^1.8.0 |
| Build/Bundler | Turbopack | (built into Next 16) |
| Deployment Target | Vercel | — |

### Key Framework Notes
- **Tailwind v4**: CSS-based config via `@theme {}` block in `globals.css`. No `tailwind.config.js` theme keys. All brand tokens live in CSS.
- **Next.js 16 Proxy**: `proxy.ts` (not `middleware.ts`) with `export function proxy()` — reads locale cookie, sets `x-locale` header.
- **next-intl v4**: Cookie-based locale switching (no URL segments). `getRequestConfig` in `lib/i18n/request.ts`. `useTranslations()` works in both server and client components.
- **lucide-react v1.8.0**: `Instagram` and `Twitter` icons removed — replaced with custom inline SVGs in Footer.

---

## 4. Pages & Routes

| Route | Component | Type | Description |
|---|---|---|---|
| `/` | `app/page.tsx` | Server | Landing page |
| `/shop` | `app/shop/page.tsx` | Server shell + Client | Product listing with filters |
| `/product/[id]` | `app/product/[id]/page.tsx` | Server shell + Client | Product detail page |
| `/cart` | `app/cart/page.tsx` | Client | Full cart page |
| `/checkout` | `app/checkout/page.tsx` | Client | 4-step checkout wizard |
| `/order-confirmation` | `app/order-confirmation/page.tsx` | Client | Post-order screen |
| `/legal/privacy` | `app/legal/privacy/page.tsx` | Server | Privacy Policy (JP) |
| `/legal/tokusho` | `app/legal/tokusho/page.tsx` | Server | 特定商取引法表記 (JP) |

---

## 5. Page Specifications

### 5.1 Landing Page (`/`)

**Sections (top to bottom):**

1. **HeroSection** — Full-viewport red hero with SVG organic pattern, JAS badge eyebrow, bilingual headline, two CTAs (Shop Now / Learn More), social proof strip (avatars + star rating + free pickup threshold).

2. **TrustBar** — 5-column grid: Free Pickup · Organic · Gluten-Free · Secure Payment · 4.7/5 Rating. All text via `useTranslations("trust")`.

3. **InStoreNow** — "今週のおすすめ / In-Store Picks" — 3-column card grid showing the 3 real product photos (local JPEGs). Locale-aware: product names and descriptions switch between JP and EN. Certification badges use translation keys.

4. **CategoryGrid** — 5 category cards (Health, Beauty, Supplements, Wellness, Lifestyle) with hover color fill. Heading and descriptions fully translated.

5. **ProductRail** — Horizontal-scrolling (mobile) / 4-column grid (desktop) of top 8 bestselling products. "View All" link translated.

6. **Story/Editorial Section** — Inline section with JAS badge, headline, two body paragraphs, stat grid (15+ categories, 100% organic, 1,200+ customers), and visual emoji grid. All text via `useTranslations("landing")`.

---

### 5.2 Shop Page (`/shop`)

**URL params:** `?category=`, `?sort=`, `?q=`, `?price=`, `?rating=`, `?inStock=`

**Filters (sidebar desktop / drawer mobile):**
- Category multi-select (health, beauty, supplements, wellness, lifestyle)
- Price range radio (all / under ¥1,000 / ¥1,000–3,000 / over ¥3,000)
- Minimum rating radio (all / 3★+ / 4★+)
- In-stock checkbox

**Sort options:** Best Selling · Price Low→High · Price High→Low · Newest · Highest Rated

**Product grid:** 2-col (mobile) / 3-col (tablet) / 4-col (desktop). Animated fade-in with CSS `opacity-0 → opacity-1`.

**Empty state:** Translated "No products found" message with clear-filters button.

All filter panel labels, sort labels, result counts, and empty state use `useTranslations("filters")`.

---

### 5.3 Product Detail Page (`/product/[id]`)

**Above the fold:**
- Breadcrumb (Home → Shop → Category → Product name) — all translated
- Image gallery with thumbnail strip (`ProductGallery`)
- Product name (locale-aware: EN mode shows English name primary)
- Star rating with review count (clickable → jumps to Reviews tab)
- Price with sale badge (% OFF)
- Short description (locale-aware)
- Certification badges (`CertBadges`)
- **NutritionPanel** accordion (see §6.1)
- Quantity stepper (min 1, max stock_quantity)
- Add to Cart (turns green "✓ Added!" for 2s) + Buy Now buttons
- Free pickup callout box (store address, hours) — translated

**Below the fold — Tab panel:**
| Tab | Content |
|---|---|
| Description | JP + EN description paragraphs |
| Ingredients & Details | ingredients_ja, certifications list |
| How to Use | how_to_use field |
| Reviews (N) | Rating histogram + review list with verified badges |

**Related Products:** 4-column grid of same-category products.

**JSON-LD:** Product schema injected server-side for SEO.

---

### 5.4 Cart

**CartDrawer** (slide-in from right, triggered by header cart icon):
- Item list with image, name, quantity stepper, remove button
- Subtotal / Shipping (Free) / Total
- "Proceed to Checkout" button
- Persist state via Zustand + localStorage

**Cart Page** (`/cart`): Full-page version of the drawer for deep-link access.

---

### 5.5 Checkout (`/checkout`)

4-step wizard (single page, state machine — no URL routing between steps):

| Step | Fields |
|---|---|
| 1. Customer Info | 姓/Last Name, 名/First Name, Email, Phone. Guest or Create Account radio. |
| 2. Pickup | Store info card + Google Maps link. Business-day date picker (Mon–Sat, 3-day advance). Time slot radio: 10–12 / 12–14 / 14–16 / 16–18. |
| 3. Payment | AirPay logo + card fields. Card number auto-spaces every 4 digits. Expiry formats MM/YY. 1.5s simulated processing delay. |
| 4. Confirmation | Auto-navigates to `/order-confirmation`. |

Order saved to `sessionStorage` as `lastOrder` for the confirmation page to read.

---

### 5.6 Order Confirmation (`/order-confirmation`)

- Animated ✓ checkmark with ping ring
- Order number (ORD-XXXXXXXX random)
- Visual QR code mock (CSS grid pattern)
- Pickup date / time slot / store address
- Itemized order summary
- Confirmation email notice
- "Continue Shopping" button → `/shop`

---

### 5.7 Legal Pages

- `/legal/privacy` — Privacy Policy in Japanese
- `/legal/tokusho` — 特定商取引法に基づく表記 (Specified Commercial Transactions Act disclosure)

---

## 6. Key Components

### 6.1 NutritionPanel

**File:** `components/product/NutritionPanel.tsx`  
**Trigger:** Shown on PDP only when `product.nutrition_per_serving` is not null.

**Behavior:**
- Collapsed by default with chevron toggle
- `max-height` CSS transition: `0 → 1000px` over 500ms cubic-bezier(0.4, 0, 0.2, 1)
- Background: `#FAF7F2` cream with `4px` left red border

**Sections:**
1. **Calories row** — 36px Noto Serif, large and prominent
2. **Macro pills** — 4 colored pills: Carbs (red), Protein (green), Fat (amber), Fiber (blue). Each shows grams + mini bar.
3. **Nutrient table** — Full nutrient rows (Fat, Sat. Fat, Trans Fat, Carbs, Fiber, Sugars, Protein, Sodium, Potassium, Iron) with animated width bars. Staggered animation: 55ms delay per row on open.
4. **Active Compounds** — Key bioactive ingredients with ★ KEY badge for primary compound.
5. **Ingredients List** — Raw ingredients string; organic ingredients highlighted in green.
6. **Certifications** — CertBadges component.

---

### 6.2 ProductCard

**File:** `components/product/ProductCard.tsx`  
**Type:** Client component (`"use client"`)

- Locale-aware name display: EN locale → `name_en` primary, `name_ja` secondary (and vice versa for JP)
- Badges: Bestseller (red), New (gold), Sale (green) — all translated
- Out-of-stock overlay (blur + label)
- Inline "Add to Cart" button (red circle, ShoppingCart icon) — opens CartDrawer
- Low-stock warning text when `stock_quantity < 5`

---

### 6.3 LocaleSwitcher

**File:** `components/layout/LocaleSwitcher.tsx`  
**Type:** Client component

- JP / EN toggle pill in header
- Sets `locale` cookie (`max-age: 31536000`)
- Calls `router.refresh()` inside `startTransition()` to trigger full RSC re-render
- All server components re-render with new locale; all client components receive updated `NextIntlClientProvider` messages

---

### 6.4 Header

**File:** `components/layout/Header.tsx`  
**Type:** Client component

- Top trust bar (brand-red bg) with organic/gluten-free/pickup/reviews copy
- Logo (赤松 leaf icon + wordmark)
- Desktop nav: 5 category links (all translated via `useTranslations("categories")`)
- Search bar (inline expand on click)
- LocaleSwitcher
- Cart icon with item count badge
- Mobile hamburger menu

---

### 6.5 Footer

**File:** `components/layout/Footer.tsx`  
**Type:** Server component

4-column grid: Brand (tagline + social icons) · Shop categories · Information (legal links, contact) · Store info (address, hours, closed days, tel). All text via `useTranslations("footer")` and `useTranslations("trust")`. Social icons are inline SVG (Instagram + X/Twitter).

---

## 7. i18n Architecture

### Locale Detection
```
Request → proxy.ts → reads `locale` cookie → sets `x-locale` header
                    ↓
lib/i18n/request.ts → getRequestConfig → reads cookie → loads messages/[locale].json
                    ↓
app/layout.tsx → getLocale() + getMessages() → NextIntlClientProvider
```

### Supported Locales
| Code | Language | Default |
|---|---|---|
| `ja` | 日本語 (Japanese) | ✅ Yes |
| `en` | English | No |

### Message Files
- `messages/ja.json` — Japanese translations (primary)
- `messages/en.json` — English translations

### Namespaces
| Namespace | Used In |
|---|---|
| `hero` | HeroSection |
| `categories` | Header, CategoryGrid |
| `landing` | page.tsx, InStoreNow, ProductRail |
| `product` | ProductCard, ProductDetailClient, InStoreNow |
| `cart` | CartDrawer |
| `checkout` | checkout/page.tsx |
| `confirmation` | order-confirmation/page.tsx |
| `trust` | Header (trust bar), TrustBar, Footer |
| `footer` | Footer |
| `nutrition` | NutritionPanel |
| `filters` | ShopClientPage |
| `badges` | InStoreNow, CertBadges |
| `errors` | not-found, error states |

### Locale-Aware Product Fields
When locale = `en`, these product fields switch:
- `name_en` → primary display name (was `name_ja`)
- `description_en` → body copy (was `description_ja`)
- `name_ja` → shown as secondary/subtitle

---

## 8. Data Layer

### 8.1 Mock Data (`lib/mock-data.ts`)

18 total products: 15 with Unsplash images + 3 with real local photos.

**Real product photos** (`public/products/`):

| ID | Name (JA) | Name (EN) | Price | Photo File |
|---|---|---|---|---|
| r1 | いっぷく家 米粉のおやつセット | Ippukuya Rice Flour Snack Set | ¥1,800 | `ippukuya-rice-snacks.jpg` |
| r2 | グルテンフリー食パン | Gluten-Free White Bread | ¥1,200 | `gf-shokupan-bread.jpg` |
| r3 | まるみそ 吟醸 | Maru Miso Ginjo | ¥980 | `maru-miso.jpg` |

**Product schema fields:**
```typescript
{
  id: string
  name_ja: string
  name_en: string
  description_ja: string
  description_en: string
  price: number
  sale_price: number | null
  category: "health" | "beauty" | "supplements" | "wellness" | "lifestyle"
  certifications: string[]        // "organic" | "gluten_free" | "vegan" | "no_additives"
  image_urls: string[]
  stock_quantity: number
  rating_avg: number
  review_count: number
  is_bestseller: boolean
  is_new: boolean
  nutrition_per_serving: NutritionData | null
  serving_size: string | null
  ingredients: string
  ingredients_ja: string
  ingredients_en: string
  how_to_use: string
  active_compounds: ActiveCompound[]
}
```

### 8.2 Supabase Schema (`supabase/schema.sql`)

Tables: `products`, `orders`, `cart_items`, `reviews`  
RLS policies enabled on all tables.  
Connection: `createServerClient` (RSC) / `createBrowserClient` (client components) via `@supabase/ssr`.

### 8.3 Cart Store (`lib/store/cart.ts`)

Zustand `persist` middleware with `localStorage`. Serialized as `akamatsu-cart`.  
Key methods: `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `itemCount()`, `subtotal()`.

---

## 9. Styling System

All tokens defined in `app/globals.css` via Tailwind v4 `@theme {}` block:

```css
@theme {
  --color-brand-red: #C0392B;
  --color-brand-red-dark: #922B21;
  --color-brand-cream: #FAF7F2;
  --color-brand-cream-dark: #F0EBE3;
  --color-brand-gold: #D4A017;
  --color-brand-stone: #8D6E63;
  --color-foreground: #1A1A1A;
  --color-muted-foreground: #6B7280;
  --font-sans: "Noto Sans JP", sans-serif;
  --font-serif: "Noto Serif JP", serif;
}
```

**Component utility classes** defined in `@layer components {}`:

| Class | Description |
|---|---|
| `.btn-primary` | Red pill button (brand-red bg, white text, hover scale) |
| `.btn-secondary` | Outlined button (brand-red border, hover fill) |
| `.container-padded` | Max-w-7xl + horizontal padding |
| `.section-title` | Noto Serif 2xl bold |
| `.product-card` | Rounded-xl card with shadow-sm hover |
| `.product-grid-item` | Stagger-ready wrapper |
| `.badge-organic` | Green pill |
| `.badge-gluten-free` | Amber pill |
| `.badge-vegan` | Purple pill |
| `.badge-no-additives` | Blue pill |

---

## 10. Non-Functional Requirements

| Requirement | Implementation |
|---|---|
| WCAG 2.1 AA | Semantic HTML, `aria-label`, `aria-labelledby`, `role="list"`, focus-visible rings |
| Performance | Turbopack, Next.js Image optimization (AVIF + WebP), `priority` flag on above-fold images |
| SEO | `Metadata` API on every page, JSON-LD Product schema on PDP, `metadataBase` set |
| Mobile-first | All grids collapse to 1-2 columns, horizontal-scroll product rail, slide-in cart drawer |
| Accessibility | Keyboard-navigable tabs, Escape closes cart drawer, `aria-pressed` on locale switcher |
| Payments | AirPay stub with 1.5s simulated delay — no real payment processing in Phase 1 |

---

## 11. File Structure

```
akamatsu-system/
├── app/
│   ├── layout.tsx                    # Root layout (NextIntlClientProvider)
│   ├── globals.css                   # Tailwind v4 @theme, @layer components
│   ├── page.tsx                      # Landing page
│   ├── cart/page.tsx
│   ├── checkout/page.tsx             # 4-step wizard
│   ├── order-confirmation/page.tsx
│   ├── product/[id]/
│   │   ├── page.tsx                  # Server shell + JSON-LD
│   │   └── ProductDetailClient.tsx   # Client-side PDP
│   ├── shop/
│   │   ├── page.tsx
│   │   └── ShopClientPage.tsx        # Client-side filters + grid
│   └── legal/
│       ├── privacy/page.tsx
│       └── tokusho/page.tsx
├── components/
│   ├── cart/CartDrawer.tsx
│   ├── landing/
│   │   ├── HeroSection.tsx
│   │   ├── TrustBar.tsx
│   │   ├── InStoreNow.tsx            # Real product photos
│   │   ├── CategoryGrid.tsx
│   │   └── ProductRail.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── LocaleSwitcher.tsx        # JP/EN cookie toggle
│   ├── product/
│   │   ├── ProductCard.tsx           # Locale-aware name display
│   │   ├── NutritionPanel.tsx        # Accordion w/ animated bars
│   │   ├── ProductGallery.tsx
│   │   ├── CertBadges.tsx
│   │   └── StarRating.tsx
│   └── ui/toaster.tsx
├── lib/
│   ├── i18n/request.ts               # next-intl getRequestConfig
│   ├── mock-data.ts                  # 18 products incl. 3 real photos
│   ├── store/cart.ts                 # Zustand persist store
│   ├── supabase/client.ts
│   ├── supabase/server.ts
│   └── utils.ts
├── messages/
│   ├── ja.json                       # Japanese translations (primary)
│   └── en.json                       # English translations
├── public/
│   └── products/
│       ├── ippukuya-rice-snacks.jpg
│       ├── gf-shokupan-bread.jpg
│       └── maru-miso.jpg
├── supabase/schema.sql
├── next.config.ts                    # next-intl plugin + image domains
├── proxy.ts                          # Next.js 16 locale middleware
├── tailwind.config.ts                # Content paths only (theming in CSS)
└── tsconfig.json
```

---

## 12. Known Constraints & Phase 2 Backlog

| Item | Notes |
|---|---|
| No real payments | AirPay stub only. Phase 2: integrate real AirPay SDK |
| No auth | Guest checkout only. Phase 2: Supabase Auth + account history |
| Mock data only | No live Supabase reads yet. Phase 2: replace mock-data with real DB queries |
| No order persistence | Orders saved to sessionStorage only. Phase 2: write to `orders` table |
| No email | Confirmation email is UI-only. Phase 2: Resend or SendGrid integration |
| No admin dashboard | Phase 2: Supabase Studio + custom admin for inventory |
| EN product content | `name_en` and `description_en` exist on all 18 products. Translation quality varies. |
| No search backend | Search is client-side string match on mock data. Phase 2: Supabase full-text search |

---

*Document generated: April 2026 · 赤松 Health & Lifestyle Phase 1*
