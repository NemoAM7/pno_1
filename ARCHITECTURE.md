# ARCHITECTURE — Sports Ecommerce Brand Website

> **Status:** Draft v1
> **Last Updated:** Aug 14 2026
> **Related:** [PRD.md](./PRD.md) · [TECH.md](./TECH.md)

## 0. Core Principle

**v1 ships with no commerce runtime backend.** The site remains a statically exported Next.js app, with one external lead-capture integration:
- Product data is read from local JSON fixtures at **build time**.
- Cart and checkout run entirely in the browser.
- Payment is a mocked in-browser provider.
- Product customization requests are submitted over HTTPS to a managed form/CRM service, which stores the lead and provides owner-facing notifications/review.

**The architecture is designed so a backend can be added later without a rewrite** (per PRD §4 and TECH §6.5). The DB schema and HTTP API in §4 and §5 are the **target design for v2+** — documented now so the v1 data shapes and interfaces align with them. They are **not implemented in v1**.

```
                        ┌─────────────────────────────┐
                        │   STATIC HOSTING (CDN)      │
                        │   serves built HTML/JS/CSS  │
                        └──────────────┬──────────────┘
                                       │
                        ┌──────────────▼──────────────┐
                        │         NEXT.JS 16 APP      │
                        │   Server Components (SSG)   │
                        │   Client islands (cart/     │
                        │   checkout/forms)           │
                        └──────┬───────────────┬──────┘
                               │               │
                 ┌─────────────▼───┐   ┌───────▼──────────┐
                 │  data/*.json    │   │  localStorage    │
                 │  (build-time)   │   │  (cart, zustand) │
                 └─────────────────┘   └──────────────────┘
                                │
             ┌──────────────────▼──────────────────┐
             │ MANAGED FORM/CRM SERVICE (v1 leads) │
             │ durable storage + owner dashboard   │
             └─────────────────────────────────────┘

             ┌──────────────────▼──────────────────┐
             │ FUTURE (v2+): Node backend + DB     │
             │ first-party commerce and lead APIs  │
             └─────────────────────────────────────┘
```

---

## 1. Project File Tree (v1)

```
grabin/
├── package.json
├── package-lock.json
├── tsconfig.json
├── next.config.ts               # output: 'export'
├── eslint.config.mjs            # flat config
├── .prettierrc                  # pinned formatter settings
├── .prettierignore
├── .gitignore
├── .nvmrc                       # 24
├── vitest.config.ts
├── next-env.d.ts
├── PRD.md
├── TECH.md
├── ARCHITECTURE.md
│
├── public/
│   └── images/                  # product + brand imagery (static)
│       ├── products/…
│       └── brand/…
│
├── app/
│   ├── layout.tsx               # root layout: Header + Footer shell
│   ├── page.tsx                 # home
│   ├── globals.css              # Tailwind 4 @theme tokens
│   ├── not-found.tsx
│   ├── error.tsx
│   │
│   ├── explore/
│   │   ├── page.tsx             # category index / all products (filters)
│   │   └── [category]/
│   │       ├── page.tsx         # filtered listing
│   │       └── [slug]/
│   │           └── page.tsx     # product detail (PDP)
│   │
│   ├── cart/
│   │   └── page.tsx
│   │
│   ├── checkout/
│   │   ├── layout.tsx
│   │   ├── page.tsx             # multi-step checkout (client)
│   │   └── success/
│   │       └── page.tsx         # order confirmation
│   │
│   ├── customize/
│   │   └── page.tsx              # customization request entry point
│   │
│   ├── policies/
│   │   └── page.tsx              # shipping, returns, privacy, terms
│   │
│   ├── about/
│   │   └── page.tsx
│   │
│   └── contact/
│       └── page.tsx
│
├── components/
│   ├── ui/                      # primitives (no business logic)
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── Skeleton.tsx
│   │   └── …
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── MobileNav.tsx
│   ├── contact/
│   │   ├── ContactForm.tsx
│   │   └── FaqSection.tsx
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGallery.tsx
│   │   ├── VariantPicker.tsx
│   │   └── AddToCartButton.tsx
│   ├── cart/
│   │   ├── CartDrawer.tsx
│   │   ├── CartLineItem.tsx
│   │   ├── CartPageContent.tsx
│   │   └── QuantityStepper.tsx
│   └── checkout/
│       ├── CheckoutForm.tsx
│       ├── OrderSummary.tsx
│       └── PaymentSection.tsx
│   └── customization/
│       └── CustomizationRequestForm.tsx
│
├── data/
│   ├── products.json
│   ├── categories.json
│   ├── shipping-methods.json
│   └── faqs.json
│
├── lib/
│   ├── money.ts                 # cents-based arithmetic + formatting
│   ├── api.ts                   # v1: no-op resolver (see §5.1)
│   └── schemas/
│   │   ├── product.ts
│   │   ├── checkout.ts
│   │   ├── contact.ts
│   │   ├── customization.ts
│   │   └── order.ts
│   └── checkout/
│       └── payment.ts           # PaymentProvider + MockPaymentProvider
│   └── customization/
│       └── client.ts             # managed form/CRM submission adapter
│   └── web3forms/
│       └── client.ts             # shared Web3Forms transport
│   └── schemas/
│       └── newsletter.ts          # newsletter signup contract
│
├── stores/
│   └── cart.ts                  # zustand + persist (localStorage)
│
├── hooks/
│   └── useMediaQuery.ts
│
└── __tests__/                   # or co-located *.test.tsx
    └── …
```

**Future (v2+) additions to this tree (not in v1):**
```
app/api/                         # Route Handlers
│   ├── products/route.ts
│   ├── products/[id]/route.ts
│   ├── categories/route.ts
│   ├── checkout/route.ts
│   ├── orders/[id]/payment/route.ts
│   └── contact/route.ts
lib/db/                          # DB client (e.g., @prisma/client or Postgres)
lib/auth/                        # session handling
```

---

## 2. Module Boundaries & Dependency Rules

### 2.1 Dependency direction
Dependencies may only point **down** this list; nothing points up.

```
app/   (pages, routes — composition only)
 │
 ├─►  components/  (presentational + feature components)
 │      │
 │      ├─►  lib/          (money, schemas, payment, api)
 │      ├─►  stores/       (cart state)
 │      └─►  hooks/
 │
 ├─►  lib/
 ├─►  stores/
 └─►  data/   (JSON fixtures — build-time only)
```

### 2.2 Rules
1. **`components/ui/`** — props-driven primitives. No store access, no `data/` imports, no fetching.
2. **`components/product|cart|checkout/`** — feature components. May read `stores/` and `lib/`. May **not** import `data/*.json` directly; they receive data as props.
3. **`app/`** — the only place that reads `data/*.json` (in Server Components) and passes data down as props.
4. **`lib/schemas/`** — the single source of truth for shared types (`z.infer`). Both fixtures and API payloads are validated against them.
5. **`lib/checkout/payment.ts`** — exports the `PaymentProvider` interface + `MockPaymentProvider`. Nothing else in the app should touch "payment" concerns.
6. **`stores/cart.ts`** — client-only. Imported only by client components (`"use client"`).
7. **Client/Server rule** — pages and shells are Server Components by default; files marked `"use client"` only where interactivity exists (cart, checkout, forms, gallery, nav).
8. **No circular imports** between `lib/`, `stores/`, `components/`.
9. **Customization submissions** go through `lib/customization/client.ts`; UI components must not call a provider endpoint directly or store requests in localStorage.
10. **Customer data** must be validated with `lib/schemas/customization.ts`; never log raw phone numbers or request contents in production.

---

## 3. Data Layer (v1: fixtures)

All fixtures live in `data/*.json` and are typed/validated by Zod schemas in `lib/schemas/`.

### 3.1 `products.json` shape
```json
{
  "products": [
    {
      "id": "run-racer-2",
      "slug": "run-racer-2",
      "name": "Run Racer 2",
      "categoryId": "footwear",
      "description": "…",
      "priceCents": 1079900,
      "compareAtPriceCents": 1329900,
      "currency": "INR",
      "images": ["/images/products/run-racer-2-1.jpg", "…"],
      "materials": ["…"],
      "isFeatured": true,
      "isInStock": true,
      "variants": [
         { "id": "run-racer-2-uk10-black", "color": "Black", "size": "UK 10", "sku": "RR2-BLK-10" }
      ]
    }
  ]
}
```

### 3.2 Other fixtures
- `categories.json` — `{ id, name, slug, description }`
- `shipping-methods.json` — `{ id, label, priceCents, etaDays }`, with `priceCents` representing INR paise (static, no carrier integration in v1)
- `faqs.json` — `{ question, answer }`

### 3.3 Customization request shape
Customization requests are not local fixtures. They are validated before submission and stored by the managed form/CRM provider:
```json
{
  "requestType": "existing-product",
  "productId": "aero-racer-jersey",
  "variantId": "aero-racer-jersey-medium-blue",
  "name": "Ayaan Khan",
  "email": "ayaan@example.com",
  "phone": "+91 98765 43210",
  "request": "Add initials AK on the left chest",
  "consent": true
}
```

New-product requests use `requestType: "new-product"`, omit `productId` and `variantId`, and include `productType`, `preferredSize`, and `preferredColor` instead.

---

## 4. DB Schema (v2+ target — NOT built in v1)

PostgreSQL. Documented now so v1 fixtures/types already match the eventual tables.

```sql
CREATE TABLE categories (
  id            text PRIMARY KEY,          -- "footwear"
  name          text NOT NULL,
  slug          text NOT NULL UNIQUE,
  description   text
);

CREATE TABLE products (
  id                text PRIMARY KEY,
  slug              text NOT NULL UNIQUE,
  name              text NOT NULL,
  category_id       text REFERENCES categories(id),
  description       text,
  price_cents       integer NOT NULL,       -- CHECK (price_cents >= 0)
  compare_at_cents  integer,
   currency          char(3) NOT NULL DEFAULT 'INR',
  is_featured       boolean NOT NULL DEFAULT false,
  is_in_stock       boolean NOT NULL DEFAULT true,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE product_images (
  id          bigserial PRIMARY KEY,
  product_id  text REFERENCES products(id) ON DELETE CASCADE,
  url         text NOT NULL,
  sort_order  integer NOT NULL DEFAULT 0
);

CREATE TABLE product_variants (
  id         text PRIMARY KEY,             -- "run-racer-2-us10-black"
  product_id text REFERENCES products(id) ON DELETE CASCADE,
  sku        text UNIQUE,
  color      text,
  size       text,
  UNIQUE (product_id, color, size)
);

CREATE TABLE customers (                    -- added with accounts
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email       citext UNIQUE NOT NULL,
  first_name  text,
  last_name   text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE orders (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number    text UNIQUE NOT NULL,    -- human-friendly "GRB-2026-0001"
  customer_id     uuid REFERENCES customers(id),  -- NULL for guest checkout
  status          text NOT NULL DEFAULT 'placed',
                  CHECK (status IN ('placed','paid','shipped','delivered','cancelled')),
  subtotal_cents  integer NOT NULL,
  shipping_cents  integer NOT NULL,
  tax_cents       integer NOT NULL DEFAULT 0,
  total_cents     integer NOT NULL,
  currency        char(3) NOT NULL DEFAULT 'INR',
  shipping        jsonb NOT NULL,          -- name, address, city, zip, country, method
  placed_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
  id          bigserial PRIMARY KEY,
  order_id    uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id  text REFERENCES products(id),
  variant_id  text REFERENCES product_variants(id),
  name        text NOT NULL,               -- snapshot at purchase time
  color       text,
  size        text,
  quantity    integer NOT NULL CHECK (quantity > 0),
  unit_cents  integer NOT NULL             -- snapshot of price at purchase
);

CREATE TABLE contact_messages (             -- contact form submissions
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  email      citext NOT NULL,
  subject    text NOT NULL,
  message    text NOT NULL,
  status     text NOT NULL DEFAULT 'new',  -- new | responded | archived
  created_at timestamptz NOT NULL DEFAULT now()
);
```

### 4.1 Future tables (later iterations)
- `promo_codes` + `order_promo_redemptions` — when promo codes ship.
- `carts` / `cart_items` — when carts become server-backed (accounts).
- `inventory` — per-variant stock levels, when live inventory ships.

---

## 5. API Schemas

### 5.1 v1: catalog has no first-party HTTP API
- `lib/api.ts` is a **thin resolver** used by v1. It loads fixtures synchronously at build time and exposes typed functions (`getProducts()`, `getProductBySlug()`, `getCategories()`) so pages have a single data access point.
- In v2+, this same file becomes the client for the HTTP API (§5.2), **keeping the same function signatures** — pages don't change.

```ts
// lib/api.ts (v1 — build-time, static)
export function getProducts(): Product[] { … }
export function getProductBySlug(slug: string): Product | undefined { … }
export function getCategories(): Category[] { … }
```

### 5.2 v2+ HTTP API (target — NOT built in v1)

Base: `/api`. Content type: `application/json`. Errors: `{ "error": { "code": string, "message": string } }` with appropriate status.

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| GET | `/api/products` | List products (query: `category`, `sort`, `page`) | – |
| GET | `/api/products/:id` | Product detail incl. variants/images | – |
| GET | `/api/categories` | Category list | – |
| POST | `/api/checkout` | Validate + create order (mock-pay) | guest ok |
| POST | `/api/orders/:id/payment` | Run payment provider for an order | – |
| POST | `/api/contact` | Submit contact message | – |
| POST | `/api/auth/*` | Accounts (future iteration) | – |

**GET `/api/products` → 200**
```json
{
  "data": [ { "id": "run-racer-2", "slug": "run-racer-2", "name": "Run Racer 2",
               "categoryId": "footwear", "priceCents": 1079900, "currency": "INR",
              "isInStock": true, "images": ["/images/products/run-racer-2-1.jpg"] } ],
  "meta": { "page": 1, "pageSize": 24, "total": 42 }
}
```

**POST `/api/checkout`**
Request:
```json
{
  "items": [
    { "productId": "run-racer-2", "variantId": "run-racer-2-us10-black", "quantity": 1 }
  ],
  "shipping": {
    "firstName": "Ayaan", "lastName": "Khan",
    "address1": "1 Main St", "address2": "", "city": "London",
    "postalCode": "400001", "country": "IN"
  },
  "shippingMethodId": "standard",
  "payment": { "token": "mock_123" }     // never store raw card data
}
```
Response `201`:
```json
{
  "data": {
    "orderId": "1e9f0a2c-…",
    "orderNumber": "GRB-2026-0001",
    "status": "paid",
    "subtotalCents": 12900,
    "shippingCents": 500,
    "taxCents": 0,
    "totalCents": 13400,
    "currency": "INR",
    "placedAt": "2026-08-08T12:00:00Z"
  }
}
```

**POST `/api/contact`**
Request: `{ "name", "email", "subject", "message" }` → Response `201`: `{ "data": { "id": "…", "status": "new" } }`

### 5.3 v1 external customization submission
- Provider activation is deferred until the Web3Forms access key and owner notification settings are configured. The current form/adapter contract is development-only until then.
- The selected provider is Web3Forms. The client sends validated customization requests to `https://api.web3forms.com/submit` over HTTPS with `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`; contact uses `NEXT_PUBLIC_CONTACT_WEB3FORMS_ACCESS_KEY`.
- The provider is responsible for persistence, spam controls, owner notifications, and owner access.
- The UI only treats an accepted provider response as success; it must show a retryable error when submission fails.
- The provider's exact payload adapter belongs in `lib/customization/client.ts` so switching providers does not change the form component.

### 5.4 Contract source of truth
The **Zod schemas in `lib/schemas/`** are the contract for both fixtures and API payloads:
- `product.ts` → `Product`, `Variant`, `Category` (defines §3.1 JSON and §5.2 list item)
- `checkout.ts` → `CheckoutRequest`, `ShippingAddress` (defines §5.2 POST body)
- `order.ts` → `Order`, `OrderLine` (defines §5.2 response + DB §4 `orders`)
- `contact.ts` → `ContactMessage`
- `customization.ts` → `CustomizationRequest`

The DB tables in §4 are generated from these same shapes, so **fixture → API → DB** never drift.

---

## 6. State Flow (v1)

```
[PDP] VariantPicker ──▶ AddToCartButton ──▶ useCartStore.addItem()
                                                │
                                persist middleware ──▶ localStorage["grabin-cart"]
                                                │
[Header] cart count ◀── selector(itemCount) ◀───┘
[CartDrawer] ◀── useCartStore  (remove/updateQuantity/clear)
[Checkout]  reads cart snapshot ──▶ builds CheckoutRequest
              ──▶ lib/checkout/payment.ts (Mock) ──▶ success page (order number)
[PDP] customization CTA ──▶ CustomizationRequestForm ──▶ Zod validation
              ──▶ lib/customization/client.ts ──▶ managed form/CRM service
```

- Single source of truth for the cart: `stores/cart.ts`.
- All money values are integers (cents); formatting happens only at render via `lib/money.ts`.

---

## 7. Future-Fit Rules (how v2+ attaches without rewriting)

| Concern | v1 (this build) | v2+ (later) | What stays the same |
|---------|-----------------|-------------|---------------------|
| Products | `data/products.json` via `lib/api.ts` | `GET /api/products` via `lib/api.ts` | Function signatures; `Product` type |
| Cart | Zustand + localStorage | Server cart / account cart | Store API (`addItem`/`removeItem`/`updateQuantity`) |
| Payment | `MockPaymentProvider` | `StripeProvider` | `PaymentProvider` interface |
| Checkout | client-only, mock | `POST /api/checkout` | `CheckoutRequest` schema |
| Contact | Web3Forms submission | Web3Forms endpoint | `ContactMessage` schema |
| Customization | managed form/CRM submission | first-party lead endpoint + database | `CustomizationRequest` schema |
| Hosting | static export (CDN) | Node runtime (Vercel etc.) | App Router structure |

---

## 8. Open Questions
- Confirm whether the target v2 backend will use Prisma + PostgreSQL (default assumption here) or another stack.
- Whether order numbers should be sequential (`GRB-2026-0001`) vs. random.
- Currency: single INR in v1; multi-currency later (affects `currency` columns).
- Which managed form/CRM provider will store customization requests and send owner notifications.
- Retention, consent wording, and deletion workflow for customer contact details.
