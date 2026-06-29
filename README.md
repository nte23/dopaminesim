# dopaminesim

A Western suite of **openly-fake "dopamine" simulation sites** — fake online shopping, fake food delivery with a live courier on a map, and ~20+ other toys that reproduce the *anticipation* of a transaction but deliver nothing. No money moves, nothing arrives. It's entertainment, and it's unmistakably fake.

Inspired by the South Korean "dopamine site" (도파민 사이트) trend that hit Western mainstream media in June 2026.

> **Guilt-free dopamine — all the hit, none of the regret.**

## Status

The suite is **one Next.js app**, with each sub-app as a route. Live so far:

- **`/`** — the dopaminesim "arcade" home: brand, the cross-app **money-saved counter**, and the app grid.
- **`/fauxeats`** — fake food delivery: browse fictional restaurants → build a cart → checkout with a disabled demo card → watch a courier animate along a real map route → it vanishes → a shareable "you saved $X · Y kcal" receipt that bumps your suite-wide total.

Because every sub-app lives on **one origin**, the "money saved" total is shared across the whole suite with no login required.

**[Read the full strategy memo →](docs/STRATEGY.md)** — Korean phenomenon & news hook, 28 sub-app ideas, legal image sourcing, architecture, monetization, and risk guardrails. Based on a 25-agent, fact-checked deep-research run.

## Getting started

```bash
pnpm install
pnpm dev          # http://localhost:3000  (arcade at /, FauxEats at /fauxeats)
# or build:
pnpm build
```

## Monorepo layout

```
apps/
  web/                          # the whole suite — ONE Next.js app, ONE Vercel project
    src/app/
      page.tsx                  # arcade home               ->  /
      fauxeats/
        layout.tsx              # orange theme + cart/location provider
        page.tsx                # marketplace home          ->  /fauxeats
        r/[id]/page.tsx         # restaurant detail + menu  ->  /fauxeats/r/:id
        checkout/page.tsx       # cart, promo, tip, fees    ->  /fauxeats/checkout
        track/page.tsx          # live phased delivery       ->  /fauxeats/track
        api/img/route.ts        # Pixabay image proxy (cached, server-side key)
    src/components/fauxeats/     # provider, customize sheet, boba builder, delivery flow…
    src/data/                    # fictional restaurants, boba, couriers, finales, ranks, promos
    src/lib/                     # cart engine, menu types, geo helpers
packages/
  ui/          # shared component library (Button, Card, ReceiptCard, AppTile, SimBanner…)
  theme/       # Tailwind v4 design tokens; per-app re-skin via CSS variables
  savings/     # the "money saved" store + useSavings hook (localStorage now, Supabase-ready)
  map/         # CourierMap — MapLibre + a courier animated along a route
```

Adding a sub-app later = a new folder under `apps/web/src/app/<name>/` with a `layout.tsx` that sets its `.theme-<name>` class. No new project, no new domain.

### FauxEats (the flagship)

A near-real food-delivery sim: pick a delivery location (geolocation or a preset city), browse restaurants with font-wordmark logos, open a restaurant, customize items (pizza toppings, a dedicated bubble-tea **cup builder**, etc.), check out with promos/tips, then watch a **phased delivery** — the courier sits at the restaurant while it "prepares", then moves along the map route only once it's *On the way*, with staged toasts and a named courier. It ends in a **randomized finale** (a portal, geese, escape velocity…), a shareable receipt + card, and a savings **rank-up**.

## Configuration

Optional environment variable:

- `PIXABAY_KEY` — a free [Pixabay API](https://pixabay.com/api/docs/) key. When set, dish/restaurant images are fetched (server-side, cached) from Pixabay; without it, the UI shows designed gradient + icon fallbacks and everything still works. Pixabay's license asks you to cache results and re-host on your own CDN for production.

## Stack

Next.js 15 (App Router) · pnpm + Turborepo monorepo · Tailwind v4 + a small shadcn-style UI kit · Lucide icons · MapLibre GL with an inline raster style (swap for self-hosted PMTiles in production) · client-side scripted "realtime" (no backend) · Vercel-ready.

### Design notes

- **One app, one origin, N looks.** Each sub-app is a route group whose `layout.tsx` wraps it in a `.theme-*` class that overrides the shared semantic tokens (the arcade is hot-pink, FauxEats is delivery-orange). One component library, distinct looks, no separate deployments.
- **The map is a simulation.** The courier is animated client-side with `@turf/along` + `requestAnimationFrame` over a synthesized route — no routing API, no websockets, no key. It renders even if the basemap provider is unreachable.
- **The money-saved spine.** Every fake order calls `record({ usd, kcal })` in `packages/savings`. Because the whole suite is one origin, the total persists and is shared across sub-apps via `localStorage`; it's built to sync to an account later. It's the cross-app progression and the harm-reduction framing (a fun stat, never a clinical claim).

### Guardrails (kept unmistakably fake)

- A persistent "Simulation — nothing is bought, charged, or delivered" banner on every page.
- No real payment fields — the checkout shows a disabled demo card.
- Fictional brands only (no real logos/trademarks), which is also the legal-safe path for imagery.

## Deploying to Vercel

It's one Next.js app, so it's **one Vercel project** — no monorepo gymnastics.

1. Import this repo as a new Vercel project.
2. Set **Root Directory** to `apps/web`.
3. Leave **Framework Preset = Next.js** (auto-detected) and keep Build / Output Directory at their defaults. Vercel runs the pnpm-workspace install from the repo root automatically.
4. Point `dopaminesim.com` at the project. Every sub-app is just a path (`/fauxeats`, etc.).

> Setting Root Directory to `apps/web` is what lets Vercel detect Next.js. Pointing a project at the repo root instead is what triggers the "No Output Directory named 'public' found" error.
