# Grabin

Grabin is an India-first sports ecommerce storefront for considered footwear, apparel, and accessories.

**Live site:** [grabin.shop](https://grabin.shop)

## V1 Status

V1 is complete and released as `v1.0.0`.

- Static Next.js storefront with catalog, product pages, cart, and checkout.
- Cart state persisted in localStorage with Zustand.
- Checkout uses a mock payment provider.
- Customization and contact submissions use Web3Forms.
- Initial metadata, Open Graph/Twitter defaults, sitemap, and robots file are implemented.
- Responsive, accessibility, performance, and deployment reviews are complete.
- Final production content remains intentionally deferred.

## Stack

- Next.js 16 App Router with static export
- React 19 and TypeScript 6
- Tailwind CSS 4
- Zustand 5
- Zod 4
- Vitest 4

## Local Development

Requirements: Node.js 24 and npm.

```bash
npm install
npm run dev
```

Create `.env.local` from `.env.example` when testing site metadata or form submissions:

```text
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_CUSTOMIZATION_ENDPOINT=
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=
NEXT_PUBLIC_CONTACT_WEB3FORMS_ACCESS_KEY=
```

## Verification

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

The production build is exported to `out/`. Serve it locally with:

```bash
npm run serve
```

## Deployment

The app is configured for static hosting and is currently deployed/tested with Vercel. Configure the environment variables from `.env.example` in the hosting environment. The production site URL is used to generate metadata, `sitemap.xml`, and `robots.txt`.

## Documentation

- `PRD.md` - product requirements and milestone status
- `TECH.md` - stack and platform decisions
- `ARCHITECTURE.md` - module boundaries and data flow
- `AGENTS.md` - repository guidance for AI-assisted development

## V2

V2 should be planned separately from the stable V1 release. Preserve V1 behavior while deciding whether real payments, orders, inventory, accounts, or admin operations require a backend and new infrastructure.
