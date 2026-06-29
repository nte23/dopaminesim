# dopaminesim

A Western suite of **openly-fake "dopamine" simulation sites** — fake online shopping, fake food delivery with a live courier on a map, and ~20+ other toys that reproduce the *anticipation* of a transaction but deliver nothing. No money moves, nothing arrives. It's entertainment, and it's unmistakably fake.

Inspired by the South Korean "dopamine site" (도파민 사이트) trend that hit Western mainstream media in June 2026.

> **Guilt-free dopamine — all the hit, none of the regret.**

## Status

Shell + first flagship are **live and running locally**:

- **`portal`** — the dopaminesim "arcade" home: brand, the cross-app **money-saved counter**, and the app grid.
- **`fauxeats`** — fake food delivery: browse fictional restaurants → build a cart → checkout with a disabled demo card → watch a courier animate along a real map route → it vanishes → a shareable "you saved $X · Y kcal" receipt that bumps your suite-wide total.

**[Read the full strategy memo →](docs/STRATEGY.md)** — Korean phenomenon & news hook, 28 sub-app ideas, legal image sourcing, architecture, monetization, and risk guardrails. Based on a 25-agent, fact-checked deep-research run.

## Getting started

```bash
pnpm install
pnpm dev          # portal on :3000, fauxeats on :3001
# or build everything:
pnpm build
```

Then open <http://localhost:3000> (the arcade) and click **Try FauxEats**.

## Monorepo layout

```
apps/
  portal/      # dopaminesim.com — the arcade home (Next.js 15)
  fauxeats/    # flagship fake food-delivery sim (Next.js 15)
packages/
  ui/          # shared component library (Button, Card, ReceiptCard, AppTile, SimBanner…)
  theme/       # Tailwind v4 design tokens; per-app re-skin via CSS variables
  savings/     # the "money saved" store + useSavings hook (localStorage now, Supabase-ready)
  map/         # CourierMap — MapLibre + a courier animated along a route
```

## Stack

Next.js 15 (App Router) · pnpm + Turborepo monorepo · Tailwind v4 + a small shadcn-style UI kit · MapLibre GL with an inline raster style (swap for self-hosted PMTiles in production) · client-side scripted "realtime" (no backend, no websockets) · Vercel-ready.

### Design notes

- **One component library, N looks.** `packages/theme` defines semantic tokens as CSS variables and Tailwind v4 `@theme inline`; each app overrides `:root` to re-skin (the portal is hot-pink, FauxEats is delivery-orange) without forking components.
- **The map is a simulation.** The courier is animated client-side with `@turf/along` + `requestAnimationFrame` over a synthesized route — no routing API, no websockets, no key. It renders even if the basemap provider is unreachable.
- **The money-saved spine.** Every fake order calls `record({ usd, kcal })` in `packages/savings`. The total persists locally and is built to sync to an account later — it's the cross-app progression and the harm-reduction framing (a fun stat, never a clinical claim).

### Guardrails (kept unmistakably fake)

- A persistent "Simulation — nothing is bought, charged, or delivered" banner on every page.
- No real payment fields — the checkout shows a disabled demo card.
- Fictional brands only (no real logos/trademarks), which is also the legal-safe path for imagery.

## Configuration

Optional env vars (cross-linking the apps when not on localhost):

- `NEXT_PUBLIC_FAUXEATS_URL` (portal → fauxeats link), default `http://localhost:3001`
- `NEXT_PUBLIC_PORTAL_URL` (fauxeats → portal link), default `http://localhost:3000`

## Deploying to Vercel

This is a Turborepo monorepo with **two separate Next.js apps**, so deploy them as **two Vercel projects** — not one project pointed at the repo root. Pointing a project at the repo root is what triggers the **"No Output Directory named 'public' found"** error: Vercel can't tell which app to build, so it falls back to a static-site preset and looks for a `public/` folder.

For **each** app, create a Vercel project from this repo and:

1. Set **Root Directory** to the app folder:
   - portal → `apps/portal`
   - fauxeats → `apps/fauxeats`
2. Leave **Framework Preset = Next.js** (auto-detected once the root directory is the app) and keep Build Command / Output Directory at their defaults. Vercel runs the pnpm-workspace install from the repo root automatically.
3. Add the cross-link env var so the apps point at each other's deployed URLs:
   - portal project: `NEXT_PUBLIC_FAUXEATS_URL = https://<your-fauxeats-domain>`
   - fauxeats project: `NEXT_PUBLIC_PORTAL_URL = https://<your-portal-domain>`

Point `dopaminesim.com` at the portal project; sub-apps can live on subdomains (e.g. `fauxeats.dopaminesim.com`) or be merged under one domain via Next.js Multi-Zones later.
