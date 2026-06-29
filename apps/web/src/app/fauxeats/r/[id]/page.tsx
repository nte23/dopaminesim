"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Bike, Clock, Plus, ShoppingBag, Star } from "lucide-react";
import { Badge, Button } from "@dopaminesim/ui";
import { formatKcal, formatUsd } from "@dopaminesim/savings";
import { findRestaurant } from "@/data/catalog";
import type { MenuItem } from "@/lib/menu-types";
import { type CartLine, defaultSelections, kcalFor, makeUid, priceFor } from "@/lib/cart";
import { useFaux } from "@/components/fauxeats/provider";
import { FauxHeader } from "@/components/fauxeats/header";
import { LocationSheet } from "@/components/fauxeats/location-sheet";
import { FoodImage } from "@/components/fauxeats/food-image";
import { RestaurantLogo } from "@/components/fauxeats/restaurant-logo";
import { CustomizeSheet } from "@/components/fauxeats/customize-sheet";
import { BobaBuilder } from "@/components/fauxeats/boba-builder";

export default function RestaurantPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const restaurant = findRestaurant(params.id);
  const { addLine, totals, cartRestaurantId } = useFaux();
  const [openItem, setOpenItem] = React.useState<MenuItem | null>(null);
  const [locOpen, setLocOpen] = React.useState(false);

  if (!restaurant) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Restaurant not found</h1>
        <Link href="/fauxeats" className="mt-4 inline-block font-semibold text-primary">
          Back to FauxEats
        </Link>
      </div>
    );
  }

  function onItemClick(item: MenuItem) {
    if (item.builder === "boba" || (item.groups && item.groups.length)) {
      setOpenItem(item);
      return;
    }
    // no options — add directly
    const sel = defaultSelections(item);
    const line: CartLine = {
      uid: makeUid(),
      restaurantId: restaurant!.id,
      itemId: item.id,
      name: item.name,
      summary: "",
      selections: sel,
      qty: 1,
      unitPrice: priceFor(item, sel),
      unitKcal: kcalFor(item, sel),
      imageQuery: item.imageQuery,
    };
    addLine(line);
  }

  const showCartBar = cartRestaurantId === restaurant.id && totals.itemCount > 0;

  return (
    <div className="min-h-dvh">
      <FauxHeader onLocation={() => setLocOpen(true)} />

      {/* Hero */}
      <div className="relative">
        <FoodImage
          query={restaurant.heroQuery}
          icon={restaurant.logo.icon}
          rounded="rounded-none"
          className="h-48 w-full sm:h-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
        <button
          onClick={() => router.push("/fauxeats")}
          aria-label="Back"
          className="absolute left-3 top-3 rounded-full bg-background/90 p-2 shadow"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <main className="mx-auto max-w-3xl px-4 pb-28">
        <div className="-mt-8 rounded-2xl border-2 border-border bg-card p-5 shadow-[0_4px_0_0_rgba(0,0,0,0.06)]">
          <RestaurantLogo name={restaurant.name} logo={restaurant.logo} size="lg" />
          <p className="mt-2 text-sm text-muted-foreground">{restaurant.logo.tagline}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <span className="inline-flex items-center gap-1 font-semibold">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
              {restaurant.rating.toFixed(1)}
              <span className="font-normal text-muted-foreground">({restaurant.reviewCount}+)</span>
            </span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" aria-hidden /> {restaurant.etaMin}–{restaurant.etaMax} min
            </span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Bike className="h-4 w-4" aria-hidden /> {formatUsd(restaurant.deliveryFee, { cents: true })} delivery
            </span>
            <span className="text-muted-foreground">
              {formatUsd(restaurant.minOrder, { cents: true })} min
            </span>
            {restaurant.busy ? <Badge variant="brand">Busy right now</Badge> : null}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {restaurant.tags.map((t) => (
              <span key={t} className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-5 -mx-4 flex gap-3 overflow-x-auto px-4">
          {restaurant.reviews.map((rev, i) => (
            <div
              key={i}
              className="min-w-[16rem] shrink-0 rounded-xl border-2 border-border bg-card p-4"
            >
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: rev.stars }).map((_, s) => (
                  <Star key={s} className="h-3.5 w-3.5 fill-current" aria-hidden />
                ))}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">&ldquo;{rev.text}&rdquo;</p>
              <p className="mt-2 text-xs font-semibold">— {rev.name}</p>
            </div>
          ))}
        </div>

        {/* Menu */}
        {restaurant.sections.map((section) => (
          <section key={section.id} className="mt-8">
            <h2 className="font-display text-xl font-bold tracking-tight">{section.name}</h2>
            <ul className="mt-3 space-y-3">
              {section.items.map((item) => {
                const sel = defaultSelections(item);
                const from = priceFor(item, sel);
                const customizable = item.builder === "boba" || (item.groups?.length ?? 0) > 0;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onItemClick(item)}
                      className="flex w-full items-center gap-4 rounded-xl border-2 border-border bg-card p-3 text-left transition-colors hover:bg-muted/50"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold leading-tight">{item.name}</p>
                          {item.popular ? <Badge variant="accent">Popular</Badge> : null}
                        </div>
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.desc}</p>
                        <p className="mt-1 text-sm font-semibold">
                          {customizable ? "from " : ""}
                          {formatUsd(from, { cents: true })} · {formatKcal(kcalFor(item, sel))}
                        </p>
                      </div>
                      <div className="relative shrink-0">
                        <FoodImage
                          query={item.imageQuery}
                          icon={restaurant.logo.icon}
                          className="h-20 w-20"
                        />
                        <span className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground shadow">
                          <Plus className="h-4 w-4" aria-hidden />
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </main>

      {/* Sticky cart bar */}
      {showCartBar ? (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-border bg-background/95 p-3 backdrop-blur">
          <div className="mx-auto max-w-3xl">
            <Button className="w-full" size="lg" onClick={() => router.push("/fauxeats/checkout")}>
              <ShoppingBag className="h-5 w-5" aria-hidden />
              View bag ({totals.itemCount}) · {formatUsd(totals.subtotal, { cents: true })}
            </Button>
          </div>
        </div>
      ) : null}

      {openItem && openItem.builder === "boba" ? (
        <BobaBuilder restaurant={restaurant} item={openItem} onClose={() => setOpenItem(null)} />
      ) : null}
      {openItem && openItem.builder !== "boba" ? (
        <CustomizeSheet restaurant={restaurant} item={openItem} onClose={() => setOpenItem(null)} />
      ) : null}
      {locOpen ? <LocationSheet onClose={() => setLocOpen(false)} /> : null}
    </div>
  );
}
