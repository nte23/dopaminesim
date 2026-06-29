# Strategy Memo — dopaminesim.com

**A Western suite of openly-fake "dopamine" simulation sites**
Prepared: 2026-06-29 · Status: Decision-oriented draft

> **One-line thesis:** The Korean "dopamine site" trend is days old in the Western press and has no Western suite-owner. The whitespace is *tone*: ship the Neal.fun register (playful, satirical, shareable) rather than the bleak FoodNeverComes utility register, bundle ~20+ fake-interaction toys under one brand, keep it unambiguously fake, and monetize like an idle game (free + ads + light premium) — not like a paywalled app.

> **Sourcing & verification note:** This memo is the synthesis of a multi-agent deep-research run (25 agents, ~860k tokens) with an adversarial fact-check pass. Where verification marked a claim **refuted** or **uncertain**, it is flagged inline in **bold** rather than asserted. Several primary Korean sites and major outlets returned HTTP 403 to automated fetching; figures from search snippets are noted as such.

---

## 0. Decisions locked (2026-06-29)

| Decision | Choice | Implication |
|---|---|---|
| **Build order** | **Shared shell + design system first**, then drop apps in | Validate the shell by building the FauxEats flagship immediately after — you can't design good shared packages without one real app exercising them. |
| **Depth** | **Optional accounts** — instant anonymous play, sign up to save history/streaks/achievements | Most apps stay client-only; one Supabase project covers the few that need accounts. The cross-app "money saved" total is the thing worth syncing. |
| **Vibe** | **All four** (cozy/ASMR · meme-viral · anti-consumerism art · harmless real outlet) **+ a "money saved" counter** | The savings counter is the brand spine: gives the anti-addiction narrative *without clinical claims*, drives screenshot virality, and justifies optional accounts. |
| **Monetization** | **Free for now, grow first** | Phase 0/1 = 100% free + tip jar; ads/premium layer on only after traffic. |

**The "money saved" spine.** Every fake purchase/order that never arrives bumps a running tally — *"You've avoided $4,212 in impulse purchases · 1,800 kcal dodged."* This is independently validated by the research: FoodNeverComes itself ends on "You saved 1,800 kcal," and "harm-reduction framing" is the single clearest ethical differentiator. Make it a first-class cross-app primitive, not a per-app bolt-on. **Guardrail:** frame it as entertainment/a fun stat (like a step counter), never as financial advice or a treatment claim.

---

## 1. The Korean "dopamine-site" phenomenon & the news hook

**What it is.** A "dopamine site" (도파민 사이트) faithfully reproduces the *anticipation loop* of a real transaction — browse, customize, add to cart, "pay," track a courier — but deliberately delivers nothing. No money moves, no product arrives, no account needed. The premise repeated across coverage: **dopamine fires in anticipation of a reward, not on receipt** — so the ritual of ordering is itself the payoff ([Psychology Today](https://www.psychologytoday.com/us/blog/positively-media/202606/dopamine-sites-the-emotional-pay-off-of-fake-food-orders)).

**The etymology chain that frames it** ([굿모닝충청](https://www.goodmorningcc.com/news/articleView.html?idxno=408968)):
- 도파민 (dopamine) → **도파밍 (dopaming = dopamine + "farming")** — gaming-style farming of pleasure hits, a Keyword of the Year in *Trend Korea 2024* by Seoul National University's Consumer Trend Analysis Center (Prof. Rando Kim) ([하이닥](https://news.hidoc.co.kr/news/articleView.html?idxno=31379)).
- → 도파민 중독 (addiction) → 도파민 디톡스/단식 (detox/fasting) → **독파민 (dok-pamin, "poison-pamine")** — the backlash coinage reframing dopamine-seeking as self-poisoning ([Kyunghyang Shinmun](https://www.khan.co.kr/en/article/202404291740307)).
- Dopamine sites sit at the intersection: a "farming" tool that *also* poses as a spending/calorie **detox** (the 절약/짠테크 thrift framing).

**Why now (the news hook).** Two anchor dates:
1. **Domestic break-out** — Hankook Ilbo, May 21 2026 ([link](https://www.hankookilbo.com/news/article/A2026052116520004512)); Korea Times (EN), May 27 2026 ([link](https://www.koreatimes.co.kr/lifestyle/trends/20260527/gen-z-turn-to-dopamine-sites-for-quick-comfort)).
2. **Global mainstream pickup** — The Times (UK) and CNN both **June 24 2026** ([CNN](https://edition.cnn.com/2026/06/24/world/video/dopamine-sites-in-south-korea-feature-fake-cigarettes-and-food-deliveries-digvid-hnk)), plus Fast Company, Vice, TechSpot, NewsNation, The Print, Psychology Today.

Today is **2026-06-29** — the trend is roughly five days into Western virality. **The category-naming window is open right now.**

**Cultural driver.** Coping for Korean Gen Z facing high costs, stagnant wages, a punishing job market, and loneliness — the ritual "without the receipt" ([The Print](https://theprint.in/feature/young-south-koreans-burnout-loneliness-anxiety/2955246/)).

**⚠️ Data-gap flag (verification: the blanket "no numbers exist" claim was *refuted*).** Primary-source counts *do* exist for two named sites: MoneyToday reported **~30,000 cumulative visitors** for 온라인 담타 ([머니투데이, 2026-04-22](https://www.mt.co.kr/society/2026/04/22/2026042208385329222)); MBC reported **~200–300 daily users** for 음식만안와요 pre-virality ([MBC](https://imnews.imbc.com/replay/2026/nwtoday/article/6816760_37012.html)). But **no verified count exists for the English-branded FoodNeverComes** — its "viral" status is qualitative. Treat the larger damta figures (≈20k daily, ~130k DAU) as **unconfirmed** — they trace to the site's own marketing page.

---

## 2. Concrete examples — Korea + Western analogues — and the dopamine mechanic

### Korean originals (the load-bearing three + one adjacent)

| Site | What it does | The dopamine mechanic |
|---|---|---|
| **FoodNeverComes / 음식만안와요** ([KR site](https://www.xn--lz2bv9nd1bm2a9lo9a.com/); [about](https://foodnevercomes.com/about.html)) | Browse dishes from ~10 countries, customize, "pay" with a pre-filled obviously-fake demo card; an **animated rabbit rider** crosses a live map toward you. Nothing arrives. Ends on **"You saved 1,800 kcal!"** | High-fidelity mimicry of a real super-app + a cute mascot for the human + a "savings/avoidance" payoff that reframes *not* consuming as a win. |
| **온라인 담타 (damta.world)** ([site](https://www.damta.world/)) | Auto nickname, a cigarette "lights," you watch it burn ~3 min while leaving one-line anonymous messages in a live chat with a **counter of who else is "online"**. | Co-presence/loneliness relief — the live "who's online" counter is the cheapest, most emotionally resonant feature. |
| **"Dopamine shopping" stores (도파민 매장)** ([Vice](https://www.vice.com/en/article/these-fake-online-stores-are-letting-people-shop-without-spending-money-heres-why/)) | Full e-commerce flow — product cards, fake reviews, filters, promos, cart, checkout, shipping tracker — no charge. | Illusion of choice + virtual discounts + order-anticipation. *A category, not one dominant branded product.* |
| **Zeta (Scatter Lab)** — *adjacent* ([Korea Herald](https://www.koreaherald.com/article/10572091)) | Design an anime character, shape its personality, chat in branching romance arcs. ~1.5M MAU. | Parasocial intimacy + narrative anticipation. **Not "fake" (a real AI companion)** — listed only as the simulated-relationship loop. Same firm as the 2021 "Lee Luda" scandal — a reputational cautionary tale. |

**Authorship (verification: *supported*).** FoodNeverComes and 음식만안와요 are **one app by one developer** — handle "Malhee" (@malheeelife), named in Korean press as a 21-year-old student. **The "built with ChatGPT / vibe-coding" detail is press-only, not on any primary source** — unverified.

**❌ Do NOT attribute to Korea (verification: category does not exist).** There is **no** named Korean dopamine site for fake stock/crypto trading or idle "raising toys." Those itches are served by generic paper-trading sims and the **US-made** Stimulation Clicker — not the Korean trend.

### Western analogues that already work (the proof points)

| Western analogue | What makes it work |
|---|---|
| **Neal.fun — Stimulation Clicker** (Jan 2025) ([neal.fun](https://neal.fun/stimulation-clicker/)) | The tonal template: **satire of the dopamine economy as entertainment**, not an earnest coping tool. Critically praised. |
| **"Spend a billionaire's money" sims** ([Neal.fun Spend](https://neal.fun/spend/)) | Evergreen, ad-monetized, **screenshot-and-brag virality built in.** But all single-purpose and shallow — none bundle the theme. |
| **BitLife** (50M+ downloads) | Proves text-based simulation monetizes long-term. *Revenue estimates are unaudited Sensor Tower rolling-30-day figures — directional only.* |
| **ASMR/fidget + "useless web" toys** ([The Useless Web](https://uselessweb.org/)) | Strong sensory-soothing & novelty demand — but commodity, fragmented, ad-driven. |

---

## 3. Positioning & opportunity

**The single clearest whitespace is TONE.** Western reception of the Korean originals has been **divided-to-negative** — "depressing," "window shopping for people who can't touch grass," "late-stage capitalism," "the internet's bleakest new obsession" ([Fast Company](https://www.fastcompany.com/91560432/dopamine-sites-fake-online-shopping-apps-let-you-pretend-to-buy-things-foodnevercomes)). The earnest-utility framing did not travel.

**Differentiation thesis — four moves:**
1. **Reframe bleak → playful.** Neal.fun register: ironic, self-aware, share-native. Hook: *"Guilt-free dopamine — all the hit, none of the regret."*
2. **Build a SUITE, not a sad single-purpose app.** No Western player owns the *unified* category. The suite is the moat and the cross-promotion engine.
3. **Engineer share-virality from day one** — shareable "receipts," the "cash/calories saved" counter, streaks, leaderboards.
4. **Add a light co-presence layer** — a live "*N people are taking a fake break right now*" counter is the cheapest moat (network effect + loneliness relief); it's exactly what spiked 온라인 담타.

**Brand tailwind & trap.** "Dopamine" is already primed in the West via "dopamine detox" apps and "dopamine design." It pulls two ways — *detox (abstinence)* vs. *dopamine-as-treat (indulgence)*. Exploit the irony but **avoid being mistaken for a detox/blocker app.**

**Market substrate.** Idle/incremental games are large and monetizing (**~$13.2B in 2025** per report-mill vendors). **⚠️ Verification (*supported* as a caution):** that figure is from DataIntelo, opaque methodology; Sensor Tower/Newzoo publish no comparable aggregate. Directional only — don't put it in a deck without an independent source.

**⚠️ neal.fun traffic flag (*supported*).** Figures vary wildly (Semrush ~13.8M, Similarweb ~9.6M, blogs ~4M). Lock to one source + period before citing.

---

## 4. Sub-app IDEA MENU (28 ideas)

Each: hook + the specific dopamine mechanic. ★ = the two flagships to build first (chosen to harden the shared packages — see §6).

### A. Commerce sims
1. **NeverCart ★** — "Add everything to cart. Check out. Pay $0. Feel the rush." → Full e-commerce flow + a celebratory "You saved $342" receipt.
2. **Wishlist Roulette** — "Spin to 'win' the thing you wanted." → Variable-reward anticipation, no purchase.
3. **Drop Hype** — "Camp a fake sneaker drop with 4,000 strangers." → Scarcity + countdown + live queue counter.
4. **Unbox It** — "Tap to open the package you didn't buy." → Unboxing-reveal dopamine, pure animation.
5. **Refund Simulator** — "Return everything. Watch the money 'come back.'" → Numbers-go-up in reverse.

### B. Food / delivery sims
6. **FauxEats ★** — "Order anything. Watch the courier. Eat nothing." → Real-delivery mimicry + a cute courier on a live map + "saved 1,800 kcal" payoff (the flagship Korean mechanic, playful re-skin).
7. **Driver Cam** — "Ride along with your fake courier in first person." → ETA bar ticking down is the hit.
8. **Midnight Snack** — "It's 2am. Order the whole menu. Zero regret." → Late-night impulse ritual + "calories dodged" streak.
9. **Tip Your Rabbit** — "Send your fake driver a fake tip and a fake 5-star." → Pro-social micro-reward loop.
10. **Buffet Mode** — "Build the most absurd order. Share the receipt." → Maximalist over-ordering as comedy; share-native receipt.

### C. Social / relationship sims
11. **Break Room** (★-candidate) — "A live counter of everyone taking a fake break right now." → Co-presence relief + anonymous one-liners (the 온라인 담타 mechanic; cheapest network-effect moat).
12. **Read Receipts** — "Send a text into the void and watch '…typing.'" → Reply anticipation with no rejection risk.
13. **Group Chat (You're the Star)** — "A fake group chat that hypes only you." → Validation loop, scripted notifications.
14. **Standing Ovation** — "Press the button. A crowd roars for you." → Instant social-approval hit.
15. **Streak Buddy** — "Keep a streak with a friend who never lets you down." → Honest streak mechanic (rewards, never guilt — see §8).

### D. Status / achievement sims
16. **Level Up** — "Gain XP for literally existing." → Numbers-go-up + level-up fanfare + confetti.
17. **Verified** — "Get the blue check you'll never get." → Status-symbol fantasy, instant grant, shareable card.
18. **Trophy Case** — "Earn an absurd badge every 10 seconds." → Achievement cadence tuned to dopamine intervals.
19. **Follower Count Go Brrr** — "Watch your fake follower count climb forever." → Idle vanity metric, tap-to-accelerate.
20. **Promotion Simulator** — "Get promoted to CEO in 90 seconds." → Career-ladder fantasy + title reveals.

### E. Finance / gambling-FEEL sims (no real money, no randomized *paid* boxes — see §8)
21. **Spend a Billionaire** — "Blow a fortune on aircraft carriers and Big Macs." → Fake-spend + screenshot-brag (proven evergreen).
22. **Portfolio Pump** — "A fake stock that only goes up." → Green-candle euphoria, zero loss risk (cosmetic; no real tickers).
23. **Jackpot (No Stakes)** — "Pull the lever. Always win confetti, never money." → Slot-machine *feel*, **decoupled from any payment** — a toy, not gambling.
24. **Paycheck Drop** — "Feel the 'salary deposited' notification, on demand." → The most satisfying money notification, simulated.
25. **Tip Jar Reverse** — "Strangers 'tip' YOU all day." → Inbound-reward loop.

### F. Absurd / chaos
26. **Stimulation Overload** — "Turn on everything at once until it's gloriously too much." → Satirical maximalism à la Stimulation Clicker — the self-aware centerpiece that signals "this is a joke/art toy."
27. **Big Red Button** — "Don't press it. (Press it.)" → Forbidden-fruit + escalating absurd consequences.

### G. Relaxation / ASMR
28. **Calm Down Corner** — "Bubble wrap, slime, sand, and a burning fake candle — on tap." → Sensory-soothing fidget loop (the harm-reduction, low-arousal counterweight that makes the brand defensible as wellness-adjacent).

---

## 5. Legal image & content sourcing — the clean path (ranked)

There is a **near-zero-cost, clean legal path.**

**Images — ranked by friction (lowest first):**
1. **Pixabay API (Content License) — PRIMARY.** Free, commercial, **NO attribution required even via API**, AI uploads allowed ([license](https://pixabay.com/service/license-summary/); [API](https://pixabay.com/api/docs/)). **Traps:** no mass-scraping, **cache results ~24h**, **re-host on your own CDN** (no permanent hotlinking), no standalone resale.
2. **Pexels API — SECONDARY (esp. food).** Free commercial, attribution appreciated not required; **hard ban on using content/API to train ML/AI**; 200 req/hr, 20k/mo default ([license](https://www.pexels.com/license/)).
3. **AI-generated (Midjourney paid / DALL·E) — for gaps.** Output assigned to you, but: (a) **pure AI output is NOT copyrightable in the US** (Thaler v. Perlmutter; [Copyright Office AI Report, Jan 2025](https://www.copyright.gov/ai/)) — others can copy it; (b) **never prompt for real brands/logos/characters** ([Disney & Universal v. Midjourney, June 2025](https://www.npr.org/2025/06/12/nx-s1-5431684/ai-disney-universal-midjourney-copyright-infringement-lawsuit)).
4. **Unsplash API — only if you accept the burden.** Permissive license BUT the **API Terms make attribution + photographer back-link MANDATORY**, require hotlinking, and require firing the `download_location` trigger (else 401). Prefer Pixabay.
5. **Lorem Picsum / Foodish — dev placeholders only.** Re-host clean Pixabay images for production.

**Catalog DATA (safe, free):** **Faker** (MIT) for names/prices/menus/addresses; **FakeStoreAPI** / **DummyJSON** (MIT) for structure — but re-host their **images** from a clean source.

**❌ License traps to AVOID:**
- **Amazon Berkeley Objects (ABO)** — AWS registry lists it **CC BY-NC 4.0 (non-commercial)**; the registry controls — do not use commercially.
- **DeepFashion** — research-only, signed release.
- **Paid stock unnecessary.** Adobe Stock API is Enterprise-only since Nov 2024 (*supported*).

**🔴 The dominant legal risk is BRAND/TRADEMARK, not photo licensing.** A stock license does **not** grant rights to logos/trademarks in an image. For an openly-fake suite: **invent fictional brand names (Faker), avoid all real logos, reject any image containing a visible mark or identifiable person, and ship a persistent "simulated/demo app — not a real store; all brands fictional" disclaimer.** Keep a per-image manifest (source, license, URL, date). Statutory damages reach **$150,000/work** for willful infringement.

**Cleanest end-to-end stack:** Faker (data) + Pixabay API (re-hosted, no attribution) + AI for gaps, all under fictional brands with a visible "simulated app" disclaimer. **Licensing cost ≈ $0.** *Have an IP attorney sign off before commercial launch — this is informational, not legal advice.*

---

## 6. Recommended technical architecture & stack (Vercel)

**Framing that drives every decision:** these are **simulations**. The "live moving driver" and "realtime" behavior are **scripted client-side** — so the core experience needs **no real backend, no websockets, no paid routing/map subscription.**

| Layer | Choice | Reasoning |
|---|---|---|
| **Repo** | **pnpm workspaces + Turborepo** monorepo | Standard for many shared TS packages; remote caching cuts CI. `apps/*` (one Next.js 15 App Router app each) + `packages/*` (`ui`, `theme`, `map`, `savings`, `config`). |
| **Domain composition** | **Per-app Vercel projects on subdomains/paths by default; Multi-Zones only if one apex domain is required** | Turborepo (build/sharing) and Multi-Zones (runtime routing) solve *different* problems. Per-app projects give best fault isolation. |
| **Design system** | **Tailwind v4 (`@theme` CSS-first tokens) + shadcn/ui**, per-app CSS-variable overrides | One base token package + a small per-app `theme.css` → one component library, N distinct looks. Directly serves the "different design per sub-app" goal. |
| **Map** | **MapLibre GL JS (BSD-3, free, no key)** | Open-source fork of pre-proprietary Mapbox GL JS. Smooth GPU rendering for a polished moving driver. **Avoid Mapbox GL JS v2+** (proprietary, bills per load). |
| **Tiles** | **Dev: MapTiler free tier; Prod: self-hosted PMTiles** | MapLibre renders but doesn't provide tiles. **MapTiler free is non-commercial/R&D only.** Ship a single static **`.pmtiles`** archive → zero per-request cost, no lock-in, no non-commercial restriction. This neutralizes the only variable cost that can quietly scale. |
| **Moving driver** | **Client-side: `turf.along()` + `requestAnimationFrame` over a pre-fetched route** | Official MapLibre pattern. Pre-compute the route once (OSRM or one build-time call), ship as **static GeoJSON** → no runtime routing, no backend. |
| **Realtime** | **Client timers only. No websockets.** | **Vercel functions don't support persistent WebSockets** (*supported*). For the *one* genuinely-multiplayer feature (Break Room "who's online"), offload to **Supabase Realtime / Ably / PartyKit**. |
| **Auth / persistence** | **Most apps: none. When needed: Supabase** (50k MAU free + Postgres + Realtime) **or Auth.js + Neon** | The "money saved" total + optional accounts live here. Supabase free projects **pause after 7 days idle**; Auth.js + Neon (scales to zero) dodges the pause. |
| **Plan** | **Vercel Pro ($20/seat) from day one** | **Hobby is non-commercial only** — a monetized suite requires Pro per ToS. Mostly-static sim apps keep the bill near base. |

**The "money saved" data layer.** A tiny `packages/savings` primitive: client-side store (localStorage) for anonymous users, synced to Supabase on login. Every app emits a `saved({ usd, kcal, label })` event; the portal + each app render the running total and a shareable receipt card. This is the cross-app progression that makes "optional accounts" worth having.

**Build order (shell-first, then ★ flagships):**
1. **Shell:** Turborepo scaffold + `packages/ui` (shadcn + Tailwind tokens) + `packages/theme` + `packages/savings` + the **portal/landing** (the suite home, brand, "money saved" global counter).
2. **FauxEats ★** — exercises `packages/map` (MapLibre + driver animation + route GeoJSON) and proves the savings primitive with kcal + $.
3. **NeverCart ★** — exercises `packages/ui` (product grid, cart, checkout, Pixabay images, optional Supabase persistence).
4. Everything the other ~26 apps need falls out of these two.

---

## 7. Monetization

**Reality check:** early web money is small and **traffic-gated** — revenue is a function of volume, not pricing cleverness. The proven solo model (Neal.fun) is **ads + tips/Patreon + small merch at millions of visitors**, core kept 100% free. Your "free for now, grow first" call matches this exactly.

| Lever | When | Economics | Notes |
|---|---|---|---|
| **Tip jar (Ko-fi / BMC)** | Day 1 | Flat ~5%, no traffic minimum | Fastest first dollar; Ko-fi 0% on one-time tips. |
| **Google AdSense** | Day 1 | No floor, low **~$1–3 CPM** | Live immediately; novelty/games at the bottom of CPM. |
| **Ezoic** | Early | **~$8–15 CPM**, no floor | Good bridge above AdSense. |
| **Mediavine Journey** | ≥1,000 sessions/mo | **70% rev share**, threshold dropped to 1k Jan 2026 (*supported*) | Reachable early. |
| **Raptive** | ≥25k pageviews/mo | Premium | Floor cut from 100k→25k Oct 2025. |
| **Web premium** (remove-ads / all-access sub + cosmetics) | After repeat visitors | 2–5% paying; ARPPU ~$8–15/mo | Stripe / Lemon Squeezy. Don't paywall the core hit. |
| **B2B / white-label widgets** | Once brand exists | Higher margin | Embeddable "fun break" widget; Slack/Teams novelty. |
| **iOS IAP/subscriptions** | Phase 4 only | Default over ads; Small Business Program = **15%** under $1M/yr | See §8 — highest-risk leg. |

**Realistic forecast:** at ~50k monthly visits in a low-CPM novelty niche (~$3–5 EPMV), roughly **$150–250/mo from ads** plus sporadic tips. The business case is a *portfolio of shareable toys compounding traffic*, not any single lever.

**Phased plan:**
- **Phase 0 (week 1):** Ship free + Ko-fi button + apply for AdSense.
- **Phase 1 (0–10k visits):** Distribution *is* the job. Build share-native toys; post on X/Reddit/TikTok. Keep everything free.
- **Phase 2 (1k–25k+ sessions):** AdSense → Ezoic → Mediavine Journey → evaluate Raptive at 25k+.
- **Phase 3:** Add a cheap all-access "remove ads + bonus modes" sub + one-time cosmetics. Add B2B/white-label.
- **Phase 4 (iOS):** Only if web proves demand, and only as a *substantial* app (see §8).

---

## 8. Risks & guardrails

### A. Keeping it unambiguously FAKE (fraud / deception / consumer-protection)
- **Persistent on-screen disclaimer** on every commerce/delivery sim: *"Simulation — nothing is bought, charged, or delivered."*
- **Never collect real payment data.** Pre-filled obviously-fake demo card; no fields that accept real card input.
- **No real brand names or logos** — fictional brands only (Faker). Fixes both trademark and passing-off exposure.
- **No real addresses stored** beyond what a client-side map animation needs.
- **Honest "savings" framing** — entertainment stat, not financial advice or a guaranteed outcome.

### B. The App Store is the highest-risk leg (Phase 4)
- **Guideline 1.1.6 bans "trick/joke functionality"** and says labeling an app "for entertainment purposes" will **NOT** overcome the rule. A thin "fake" gag gets rejected.
- **Guideline 4.3(b)** (expanded June 2026 — verification: *uncertain* only on coupling; **1.1.6 was not changed, only 4.3(b)**) lets Apple **reject and remove** low-effort/novelty apps "indistinguishable from what's already available."
- **Mitigation:** an iOS build must be a **genuinely substantial, distinctive product** — not a port of the gag. Default to IAP; Small Business Program (15%).

### C. The "dopamine" theme makes retention dark patterns legally radioactive
- **Streaks/daily-rewards exploit loss aversion** and are increasingly treated as dark patterns. FTC enforcement is active (~$2.5B Amazon dark-patterns settlement, Sept 2025). *(The FTC "click-to-cancel" rule was struck down on appeal in 2025 — confirm current status before designing cancellation flows.)*
- **Randomized PAID loot boxes — avoid entirely.** Belgium/Netherlands ban them; EU Digital Fairness Act incoming; PEGI min-16 for loot-box games from June 2026; Brazil bans sales to under-18s. This is why §4's "Jackpot"/"Portfolio Pump" are **decoupled from any payment** — slot/stock *feel* with no money in or out is a toy, not gambling.

### D. Ethics of a "dopamine" product
- Experts cite **both relief and a compulsive-loop dark side.** **Lean into harm-reduction** as a differentiator (the non-alcoholic-beer / nicotine-patch analogy users themselves raised). Make streaks **reward, not punish**; make cancellation **one-click**; surface the honest "money/calories saved" framing; include "Calm Down Corner" as a genuine off-ramp.
- **Scientific framing:** "dopamine detox" is a misnamed fad ([Harvard Health](https://www.health.harvard.edu/blog/dopamine-fasting-misunderstanding-science-spawns-a-maladaptive-fad-2020022618917)). Use "dopamine" as a **brand/metaphor**, not a clinical claim.

### E. Competitive risk
**No successful Western "dopaminesim" clone existed as of 2026-06-29** — but the trend is days old and fast-followers are likely. **Re-scan app stores, Product Hunt, and X weekly.** Move fast on a web-first MVP; the suite + co-presence layer + playful tone is the defensible position, and the category-naming window is open *now*.

---

## Bottom line
Ship a **playful, satirical, share-native web suite** of openly-fake dopamine toys — shell + design system first, then flagships **FauxEats + NeverCart** — on a **Turborepo + Next.js 15 + MapLibre/PMTiles** stack with **client-side scripted "realtime"** (no backend, no websockets). Source from **Pixabay + Faker + AI under fictional brands** (≈$0 licensing). Keep it **free first**, monetize idle-game style later. Make the **"money saved" counter** the brand spine and the harm-reduction angle. Keep it **unmistakably fake**, **avoid all randomized paid loot boxes**, and **defer iOS** until web proves demand and only as a *substantial* app.
