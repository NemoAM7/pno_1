# TECH — Sports Ecommerce Brand Website

> **Status:** Draft v1
> **Last Updated:** Aug 14 2026
> **Supersedes:** none — initial architecture
> **Related:** [PRD.md](./PRD.md)

All versions below were verified as the current **stable** release on npm as of **Aug 08 2026**. Patch versions drift frequently — confirm with `npm show <pkg> version` before scaffolding, but pin within the listed majors.

---

## 1. Tech Stack Summary

| Layer | Technology | Version (stable) | Notes |
|-------|-----------|------------------|-------|
| Runtime | Node.js | **24 LTS** (`24.19.x`, "Krypton") | Active LTS; supported until Apr 2028. Node 22 is maintenance LTS. |
| Framework | Next.js | **16.x** (App Router) | `16.3.0` current. Active LTS. Turbopack default. Static export target. |
| UI library | React | **19.2.x** | Ships with Next 16. |
| Language | TypeScript | **^6.0** (`6.0.3`) | Last JS-based compiler line. See §3.1 for the TS 7 note. |
| Styling | Tailwind CSS | **4.3.x** | v4 stable; CSS-first config (no `tailwind.config.js`). |
| State (cart) | Zustand | **5.0.14** | `persist` middleware → localStorage. |
| Validation | Zod | **4.4.x** | Checkout/contact forms + product fixture schemas. |
| Icons | lucide-react | latest stable | Optional; tree-shaken SVG icon set. |
| Linting | ESLint | **9.x** | Flat config (`eslint.config.mjs`). Next 16's `eslint-config-next` doesn't support ESLint 10 yet. |
| Formatting | Prettier | **3.9.x** | Pin exact version (Prettier changes formatting between releases). |
| Testing | Vitest | **4.1.x** | v5 is still beta — do **not** use. |
| UI testing | React Testing Library | latest stable | Component tests. |
| Package manager | npm | bundled with Node 24 | Lockfile: `package-lock.json`. |

---

## 2. Platform Decisions

### 2.1 Framework: Next.js 16 (App Router)
- **Why:** Industry-standard choice for storefronts; static export satisfies the "no backend, static hosting" constraint from the PRD, and it has the cleanest growth path — when real payments/accounts/inventory are added later, Server Actions/API routes slot in without a rewrite.
- **Rendering:** Server Components by default (fast, static); `"use client"` only for interactive islands (cart drawer, checkout, forms, gallery).
- **Export:** `output: 'export'` for a fully static build deployable to Netlify / Vercel / GitHub Pages.
- **Bundler:** Turbopack (default in Next 16 for dev and build). Do not add custom webpack config.

### 2.2 Data: local JSON fixtures plus managed customization storage
- Product/category/copy data lives in `data/*.json`, imported at build time.
- Every fixture is validated at runtime with a Zod schema so a bad entry fails loudly, not silently.
- Customization requests are submitted to an external managed form/CRM endpoint. The provider is the durable system of record for these leads and exposes owner-facing review/notification tools.

### 2.3 Cart / checkout state: client-only
- Zustand store persisted to `localStorage`.
- Payment is **mocked** behind a small interface (`lib/checkout/payment.ts`) so a real provider (e.g., Stripe) swaps in later with one implementation change.

### 2.4 Customization request persistence
- The storefront remains statically exportable; it does not add a database or Next.js runtime API route for this feature.
- A client adapter submits a Zod-validated request to a configured managed form/CRM endpoint.
- Web3Forms activation is complete for customization and contact submissions; both access keys and owner notification settings must remain configured in each deployment environment.
- The endpoint configuration is supplied through `NEXT_PUBLIC_CUSTOMIZATION_ENDPOINT`; provider credentials must never be embedded in the client bundle.
- The selected provider is Web3Forms. It receives requests through `https://api.web3forms.com/submit`, provides email delivery, and uses separate public access keys for customization (`NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`) and contact (`NEXT_PUBLIC_CONTACT_WEB3FORMS_ACCESS_KEY`).
- The provider must support HTTPS, spam protection/rate limiting, owner notifications, and export/deletion of submissions.
- If the selected provider later requires a secret server-side credential, add a serverless proxy as a deliberate hosting change rather than putting the secret in the browser.

### 2.5 Typography
- Body copy uses `DM Sans` and headings use `Space Grotesk`, loaded through `next/font` and self-hosted by Next.js.
- Typography is applied globally through `app/layout.tsx` and `app/globals.css` rather than relying on platform-specific Arial/Helvetica fallbacks.

---

## 3. Language & Compatibility Notes

### 3.1 TypeScript: use `^6.0`, not 7.x (for now)
- TypeScript **7.0.2** is the current `latest` tag and is stable, but it is a brand-new native (Go) rewrite released July 2026. Next.js 15.5.x rejects TS ≥ 7; Next 16.3 added TS 7 support, but ecosystem plugins are still catching up.
- **Recommendation:** scaffold with `typescript@^6.0.3`. Revisit TS 7 once it has shipped for 2+ months and tooling is confirmed compatible.

### 3.2 React version alignment
- Use the React/ReactDOM versions Next.js 16 pins (React **19.2.x**). Do not hand-pin React independently.

### 3.3 Node.js requirement
- Next 16 requires Node ≥ 20.9; React Router v8 (alternative stack) requires Node ≥ 22.22. Using **Node 24 LTS** covers everything with a supported line.
- Add `"engines": { "node": ">=24 <25" }` and an `.nvmrc` / `.node-version` (`24`).

---

## 4. Deprecated / Avoid List

| Avoid | Reason / Replacement |
|-------|----------------------|
| `react-router-dom` | Package removed in React Router v8; import from `react-router`. (N/A here — Next App Router is used.) |
| ESLint `.eslintrc.*` / legacy config | Removed in ESLint 9+. Use `eslint.config.mjs` (flat config). |
| Tailwind `tailwind.config.js` (JS/TS) | Tailwind v4 is CSS-first: `@import "tailwindcss"` + `@theme` tokens in `globals.css`. |
| Custom webpack config in Next | Turbopack is the default bundler; webpack-specific plugins need review before use. |
| Prettier `^3.9.x` range in `package.json` | Prettier changes formatting across releases — pin exact (no caret). |
| Vitest 5 / any `-beta`/`-rc`/`-canary` | Not stable. Stay on Vitest 4.1.x until v5 is tagged `latest`. |
| `fetch()` default caching assumptions | Next 16 uses explicit caching (Cache Components); don't rely on implicit fetch caching. |
| JS `import ... assert {}` | Deprecated; use `import ... with { type: "json" }` (also required by Prettier 3.9 parser). |

---

## 5. Core Libraries & Their Jobs

### 5.1 Zustand 5 — cart state
- Single `useCartStore` with `persist` middleware → `localStorage` key e.g. `grabin-cart`.
- Actions: `addItem`, `removeItem`, `updateQuantity`, `clear`.
- Derived selectors: item count (for header badge), subtotal. Keep money math in one `lib/money.ts` util.

### 5.2 Zod 4 — validation
- `lib/schemas/product.ts` — `ProductSchema`, `VariantSchema` (validates fixtures + typed as the source of truth via `z.infer`).
- `lib/schemas/checkout.ts` — shipping address, shipping method, (mock) payment.
- `lib/schemas/contact.ts` — contact form.
- `lib/schemas/customization.ts` — product customization request form and submission contract.
- Product fixtures use `isCustomizable` to control whether an existing-product request CTA is shown.
- Checkout steps run `.safeParse()` and render field-level errors.

### 5.3 Tailwind 4 — styling
- Design tokens (colors, type scale, spacing) defined as CSS variables in `@theme` inside `app/globals.css`.
- No runtime; purge handled by the build.

### 5.4 lucide-react — icons
- Only used for cart/search/menu icons; imports are tree-shaken.

---

## 6. Design Patterns

### 6.1 Server / Client boundary
- Default: **Server Components**. No interactivity needed → no `"use client"`.
- Interactive only: cart drawer, add-to-cart, quantity controls, checkout form, mobile nav, gallery, and customization request form. Mark those files `"use client"`.
- Keep client bundles small — a cart store hook is shared, but page shells stay server-rendered.

### 6.2 Feature-based folder structure (App Router)

```
app/
  layout.tsx            # root layout: header + footer shell
  page.tsx              # home
  explore/
    page.tsx            # category listing (filters via searchParams)
    [category]/page.tsx
    [category]/[slug]/page.tsx   # product detail
  cart/page.tsx
  checkout/
    layout.tsx
    page.tsx            # multi-step form (client component)
    success/page.tsx    # order confirmation
  customize/page.tsx    # customization request entry point
  policies/page.tsx     # shipping, returns, privacy, terms
  about/page.tsx
  contact/page.tsx
  globals.css
components/
  ui/                   # primitives: Button, Input, Badge, Skeleton...
  product/              # ProductCard, ProductGallery, VariantPicker, AddToCart
  cart/                 # CartDrawer, CartLineItem, CartPageContent, QtyStepper
  checkout/             # CheckoutForm, OrderSummary, PaymentSection
  customization/        # CustomizationRequestForm
  contact/              # ContactForm, FaqSection
  layout/               # Header, Footer, MobileNav
data/
  products.json
  categories.json
  faqs.json
lib/
  money.ts              # currency formatting + arithmetic (cents-based)
  checkout/payment.ts   # PaymentProvider interface + MockPaymentProvider
  customization/client.ts # managed form/CRM submission adapter
  schemas/              # zod schemas
stores/
  cart.ts               # zustand store (+ persist)
hooks/
  useMediaQuery.ts
```

### 6.3 Composition
- Build small primitives in `components/ui/` and compose domain components (product/cart/checkout) on top.
- One component per file; named exports; co-located `.test.tsx`.

### 6.4 Money handling
- Store prices as **integer minor units (paise for INR)** in fixtures (`priceCents`). Format with `Intl.NumberFormat('en-IN')` in `lib/money.ts`. Never do float math on prices.

### 6.5 Mock payment interface (future-proofing)
- `PaymentProvider` interface: `createPaymentIntent(order) → { id, status }`, `confirmPayment(id)`.
- v1 ships `MockPaymentProvider` (2s delay, always succeeds).
- Later: swap in `StripeProvider` implementing the same interface. No UI/flow changes.

### 6.6 Accessible forms
- Native `<form>` + real labels, `aria-invalid` on errors, client-side validation before submit.
- Contact and customization forms submit through the configured Web3Forms endpoint; success/error states are handled client-side.

### 6.7 Error boundaries & states
- Each client island gets loading/skeleton and empty states (empty cart, no search results, unavailable variant).
- `not-found.tsx` and `error.tsx` at route-group level.

---

## 7. Scripts (`package.json`)

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `next dev` | Dev server (Turbopack). |
| `build` | `next build` | Production build → static export. |
| `serve` | `npx serve out` | Serve the static export locally. |
| `lint` | `eslint .` | Lint (flat config). |
| `format` | `prettier --write .` | Format. |
| `format:check` | `prettier --check .` | CI format gate. |
| `typecheck` | `tsc --noEmit` | Type check. |
| `test` | `vitest run` | Unit/component tests. |
| `test:watch` | `vitest` | Watch mode. |

CI (later milestone) should run: `lint` → `typecheck` → `test` → `build`.

---

## 8. Version Policy

- **Pin, don't guess:** exact or caret-pinned within supported majors, lockfile committed.
- **Support boundaries:** only versions listed as stable on npm (`latest` tag) and within their support window (Next 16 LTS, Node 24 LTS, Vite/Vitest supported branches).
- **Upgrade cadence:** minor/patch bumps on a schedule; major upgrades planned as explicit milestones (React/Next majors roughly yearly).
- **Deprecation hygiene:** no `-beta`, `-rc`, `-canary`, or alpha tags. No packages that are EOL (e.g., Next 14, React Router v6, ESLint legacy config).

---

## 9. Alternative Stack (documented, not chosen)

If a lighter SPA is preferred later, the parallel stack is:

| Layer | Version |
|-------|---------|
| Vite | **8.2.x** |
| React | 19.2.x |
| React Router | **8.3.x** (ESM-only; `react-router` package, not `react-router-dom`; needs Node ≥ 22.22, React ≥ 19.2) |
| Tailwind CSS | 4.3.x |
| Zustand | 5.0.14 |
| Vitest | 4.1.x |

Everything else (state, data, validation, patterns) is identical, so this is a swap of the framework layer only.

---

## 10. Open Questions
- Final brand name/identity (affects design tokens in `@theme`).
- Confirmed target: static export on which host (affects build config/CI).
- Product data volume and whether to keep fixtures in JSON vs. generated from a spreadsheet.
