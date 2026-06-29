# dopaminesim

A Western suite of **openly-fake "dopamine" simulation sites** — fake online shopping, fake food delivery with a live courier on a map, and ~20+ other toys that reproduce the *anticipation* of a transaction but deliver nothing. No money moves, nothing arrives. It's entertainment, and it's unmistakably fake.

Inspired by the South Korean "dopamine site" (도파민 사이트) trend that hit Western mainstream media in June 2026.

> **Guilt-free dopamine — all the hit, none of the regret.**

## Status

Pre-build. Brainstorm & strategy stage.

📄 **[Read the full strategy memo →](docs/STRATEGY.md)** — Korean phenomenon & news hook, 28 sub-app ideas, legal image sourcing, the Vercel/Turborepo/MapLibre architecture, monetization, and risk guardrails. Based on a 25-agent, fact-checked deep-research run.

## Core ideas

- **Suite, not a single app.** One brand, many fake-interaction toys, sharing a design system and a cross-app **"money saved" counter** ("You've avoided $4,212 in impulse purchases").
- **Playful, not bleak.** Neal.fun register — satirical, self-aware, built to be screenshotted and shared.
- **Unmistakably fake.** Fictional brands, demo-only payments, persistent "this is a simulation" disclaimers.
- **Free first.** Grow on virality; layer ads/light premium only once there's traffic.

## Planned stack

Next.js 15 (App Router) · pnpm + Turborepo monorepo · Tailwind v4 + shadcn/ui · MapLibre GL + static PMTiles · client-side scripted "realtime" (no backend) · Supabase for the few features that need accounts · Vercel hosting.

## Flagships (build order)

1. **Shell** — monorepo, design system, "money saved" primitive, suite portal
2. **FauxEats** — fake food delivery with a courier animated along a live map route
3. **NeverCart** — fake online shopping: browse → cart → checkout → never arrives
