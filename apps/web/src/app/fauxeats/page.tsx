"use client";

import * as React from "react";
import Link from "next/link";
import { Bike, Clock, Percent, Search, Star, Users } from "lucide-react";
import { Badge } from "@dopaminesim/ui";
import { formatUsd } from "@dopaminesim/savings";
import { RESTAURANTS } from "@/data/catalog";
import { PROMOS } from "@/data/promos";
import { useFaux } from "@/components/fauxeats/provider";
import { FauxHeader } from "@/components/fauxeats/header";
import { LocationSheet } from "@/components/fauxeats/location-sheet";
import { FoodImage } from "@/components/fauxeats/food-image";
import { RestaurantLogo } from "@/components/fauxeats/restaurant-logo";

const CUISINES = Array.from(new Set(RESTAURANTS.flatMap((r) => r.tags))).sort();
type Sort = "reco" | "rating" | "fast" | "fee";

function pseudoDistanceKm(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return Math.round((0.4 + (h % 260) / 100) * 10) / 10;
}

export default function FauxEatsHome() {
  const { ready, location } = useFaux();
  const [locOpen, setLocOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [cuisine, setCuisine] = React.useState<string | null>(null);
  const [sort, setSort] = React.useState<Sort>("reco");
  const [near, setNear] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (ready && !location) setLocOpen(true);
  }, [ready, location]);

  React.useEffect(() => {
    setNear(180 + Math.floor(Math.random() * 130));
    const t = setInterval(
      () => setNear((n) => Math.max(120, (n ?? 220) + Math.floor(Math.random() * 7) - 3)),
      2600,
    );
    return () => clearInterval(t);
  }, []);

  const list = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    let rs = RESTAURANTS.filter((r) => {
      const matchesQ =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.cuisine.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q));
      const matchesC = !cuisine || r.tags.includes(cuisine);
      return matchesQ && matchesC;
    });
    rs = [...rs];
    if (sort === "rating") rs.sort((a, b) => b.rating - a.rating);
    else if (sort === "fast") rs.sort((a, b) => a.etaMin - b.etaMin);
    else if (sort === "fee") rs.sort((a, b) => a.deliveryFee - b.deliveryFee);
    return rs;
  }, [query, cuisine, sort]);

  return (
    <div className="min-h-dvh">
      <FauxHeader onLocation={() => setLocOpen(true)} />

      <main className="mx-auto max-w-5xl px-4 pb-24 pt-6">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          What won&apos;t you eat tonight?
        </h1>
        {near != null ? (
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="h-4 w-4 text-primary" aria-hidden />
            <span className="font-semibold tabular-nums text-foreground">{near}</span> people are
            fake-ordering near you right now
          </p>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">Build an order. Keep the money.</p>
        )}

        {/* Promos */}
        <div className="mt-5 -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
          {PROMOS.map((p) => (
            <div
              key={p.code}
              className="flex min-w-[15rem] shrink-0 items-start gap-3 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 p-3"
            >
              <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Percent className="h-4 w-4" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="font-display text-sm font-bold leading-tight">{p.label}</p>
                <p className="truncate text-xs text-muted-foreground">{p.blurb}</p>
                <p className="mt-0.5 font-mono text-xs font-bold text-primary">{p.code}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="mt-5">
          <div className="flex items-center gap-2 rounded-full border-2 border-border bg-card px-4 py-2.5">
            <Search className="h-5 w-5 text-muted-foreground" aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search restaurants or cuisines you won't eat…"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>

        {/* Cuisine filters + sort */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCuisine(null)}
            className={`rounded-full border-2 px-3 py-1.5 text-sm font-semibold transition-colors ${
              cuisine === null ? "border-primary bg-primary/10" : "border-border hover:bg-muted"
            }`}
          >
            All
          </button>
          {CUISINES.map((c) => (
            <button
              key={c}
              onClick={() => setCuisine((cur) => (cur === c ? null : c))}
              className={`rounded-full border-2 px-3 py-1.5 text-sm font-semibold transition-colors ${
                cuisine === c ? "border-primary bg-primary/10" : "border-border hover:bg-muted"
              }`}
            >
              {c}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-1 text-sm">
            <span className="text-muted-foreground">Sort:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-lg border-2 border-border bg-card px-2 py-1.5 text-sm font-semibold outline-none"
            >
              <option value="reco">Recommended</option>
              <option value="rating">Top rated</option>
              <option value="fast">Fastest</option>
              <option value="fee">Lowest fee</option>
            </select>
          </div>
        </div>

        {/* Restaurant grid */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((r) => (
            <Link
              key={r.id}
              href={`/fauxeats/r/${r.id}`}
              className="group flex flex-col overflow-hidden rounded-xl border-2 border-border bg-card shadow-[0_4px_0_0_rgba(0,0,0,0.06)] transition-transform hover:-translate-y-1"
            >
              <div className="relative">
                <FoodImage
                  query={r.heroQuery}
                  icon={r.logo.icon}
                  rounded="rounded-none"
                  className="h-36 w-full"
                />
                {r.busy ? (
                  <span className="absolute left-2 top-2">
                    <Badge variant="brand">Busy</Badge>
                  </span>
                ) : null}
                <span className="absolute bottom-2 right-2 rounded-full bg-background/90 px-2 py-1 text-xs font-bold tabular-nums">
                  {pseudoDistanceKm(r.id)} km
                </span>
              </div>
              <div className="p-4">
                <RestaurantLogo name={r.name} logo={r.logo} size="sm" />
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
                    {r.rating.toFixed(1)}
                  </span>
                  <span>{r.reviewCount}+</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" aria-hidden /> {r.etaMin}–{r.etaMax} min
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Bike className="h-3.5 w-3.5" aria-hidden /> {formatUsd(r.deliveryFee, { cents: true })}
                  </span>
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">{r.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
        {list.length === 0 ? (
          <p className="mt-10 text-center text-muted-foreground">
            No restaurants match. Even the void has limits.
          </p>
        ) : null}
      </main>

      {locOpen ? <LocationSheet onClose={() => setLocOpen(false)} /> : null}
    </div>
  );
}
