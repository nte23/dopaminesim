"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, MapPin, ShoppingBag } from "lucide-react";
import { formatUsd, useSavings } from "@dopaminesim/savings";
import { useFaux } from "./provider";

export function FauxHeader({ onLocation }: { onLocation: () => void }) {
  const { location, totals } = useFaux();
  const { usd } = useSavings();
  const router = useRouter();
  return (
    <header className="sticky top-0 z-30 border-b-2 border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-2.5">
        <Link href="/fauxeats" className="font-display text-lg font-bold tracking-tight">
          Faux<span className="text-primary">Eats</span>
        </Link>

        <button
          onClick={onLocation}
          className="flex min-w-0 items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-sm font-semibold"
        >
          <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          <span className="max-w-[34vw] truncate sm:max-w-xs">
            {location?.label ?? "Set your address"}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        </button>

        <div className="flex items-center gap-2">
          <span className="hidden rounded-full bg-muted px-3 py-1.5 text-sm font-bold tabular-nums sm:inline">
            {formatUsd(usd)} saved
          </span>
          <button
            onClick={() => router.push("/fauxeats/checkout")}
            className="relative rounded-full bg-primary p-2.5 text-primary-foreground"
            aria-label="View bag"
          >
            <ShoppingBag className="h-5 w-5" aria-hidden />
            {totals.itemCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-foreground px-1 text-xs font-bold text-background">
                {totals.itemCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  );
}
