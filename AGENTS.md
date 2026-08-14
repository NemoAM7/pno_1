# AGENTS.md

Guidance for AI agents working in this repo. Read this before making changes.

## Current state

- **M1, M2, M3, M5, and M6 complete.** M4A customization UI/schema work is implemented; M4B provider activation is deferred pending provider selection. Checkout uses a mock payment provider. Lint/typecheck/test/build pass.
- Docs are the source of truth: `PRD.md` (scope/features), `TECH.md` (stack/versions), `ARCHITECTURE.md` (structure/data/API).
- Follow `ARCHITECTURE.md` §1 (file tree) and §2 (module rules) exactly — do not invent a different layout.

### Milestone progress (PRD §6)

| # | Milestone | Status |
|---|-----------|--------|
| M1 | Scaffold + design system | ✅ Done |
| M2 | Catalog & Explore (home, category, listing, PDP) | ✅ Done |
| M3 | Cart (add/remove/update, persisted state) | ✅ Done |
| M4A | Customization request UI and contract (jersey form, validation) | ✅ Done |
| M4B | Customization provider activation (managed submission and persistence) | ⏸ Deferred |
| M5 | Checkout (address, shipping, payment mock, confirmation) | ✅ Done |
| M6 | Content pages (About, Contact, FAQ, footer/policies) | ✅ Done |
| M7 | Polish & launch (responsive QA, performance, privacy/accessibility, deploy) | 🔲 Not started |

## Stack (decided in TECH.md — do not deviate)

- **Next.js 16** (App Router), **static export** (`output: 'export'`). No commerce backend, DB, or runtime server in v1; customization requests are the documented exception and submit to an external managed form/CRM service.
- **TypeScript ^6.0** — do NOT install TypeScript 7.x (too new for the toolchain).
- React 19 (use the version Next pins), **Tailwind CSS 4** (CSS-first config; no `tailwind.config.js`).
- **Zustand 5** (cart, persisted to localStorage), **Zod 4** (validation + contract types).
- Tooling: ESLint 9 (flat config, `eslint.config.mjs`), Prettier 3.9 (pin exact), **Vitest 4.1** (NOT 5 — still beta).
- Never install `-beta`/`-rc`/`-canary` packages. Never use `react-router-dom`, legacy ESLint config, or custom webpack config.

## Commands (once scaffolded)

```
npm run dev            # Next dev server (Turbopack)
npm run build          # production build → static export
npm run serve          # serve the static export locally
npm run lint           # eslint
npm run typecheck      # tsc --noEmit
npm run test           # vitest run
npm run format         # prettier --write
```

Verification order before finishing work: **lint → typecheck → test → build**.

## Architecture rules (ARCHITECTURE.md §2 — hard constraints)

- Dependency direction is one-way: `app/ → components/ → lib|stores|hooks → data/`.
- Only `app/` reads `data/*.json` (in Server Components); components receive data as props.
- `components/ui/` primitives must not touch stores, `data/`, or payment.
- Interactive code (cart, checkout, forms, gallery, mobile nav) is `"use client"`; everything else stays a Server Component.
- Customization submissions go through a provider adapter and must not be stored in localStorage.
- `lib/schemas/*.ts` (Zod) is the single source of shared types for fixtures, forms, and API payloads.

## Conventions

- **Money is integer minor units (paise for INR)** (`priceCents`) everywhere; format only at render via `lib/money.ts` using the `en-IN` locale. Never float math.
- Payment is mocked behind `PaymentProvider` in `lib/checkout/payment.ts` — nothing else touches payment concerns.
- Cart state lives only in `stores/cart.ts` (Zustand + persist). Do not add a second cart store.
- Product data comes from `data/products.json` via `lib/api.ts`. Adding products = editing fixtures (JSON + Zod-validated).
- The DB schema and HTTP API in ARCHITECTURE.md §4–§5 are **v2+ targets, not implemented**. Do not add a database, API routes, auth, or real payments in v1.
- The customization provider endpoint is external infrastructure, not a new local API route or database.
- When editing docs, update the `Last Updated` header. Version tracking is via git, not doc folders.

## Gotchas

- Prettier changes output between releases — pin exact version in `package.json` (no caret).
- Next.js 16 uses Turbopack by default; custom webpack config will not work.
- ESLint 9 required — `eslint-config-next` bundles plugins that don't support ESLint 10 yet.
- `output: 'export'` requires `generateStaticParams()` in dynamic routes with at least one param set.
- Use `@/` path alias for imports — relative paths break with `[bracket]` directories in PowerShell.
- Vitest config must use `.mjs` extension to avoid ESM-in-CJS warning.
