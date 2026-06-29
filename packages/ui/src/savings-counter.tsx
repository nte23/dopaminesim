"use client";

import { formatCount, formatKcal, formatUsd, useSavings } from "@dopaminesim/savings";
import { cn } from "./lib/cn";

function Stat({
  value,
  label,
  highlight,
}: {
  value: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <span
        className={cn(
          "font-display text-2xl font-bold tabular-nums leading-none sm:text-3xl",
          highlight ? "text-primary" : "text-foreground",
        )}
      >
        {value}
      </span>
      <span className="mt-1 text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

/**
 * The "money saved" flex — the cross-app progression and the harm-reduction
 * framing (a fun stat, never a clinical claim). Reads from the shared store;
 * anonymous-safe via localStorage, account-syncable later.
 */
export function SavingsCounter({
  className,
  title = "You haven't spent",
}: {
  className?: string;
  title?: string;
}) {
  const { usd, kcal, count } = useSavings();
  return (
    <div
      className={cn(
        "rounded-xl border-2 border-border bg-card p-5 shadow-[0_2px_0_0_rgba(0,0,0,0.05)]",
        className,
      )}
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
        <Stat value={formatUsd(usd)} label="dollars dodged" highlight />
        <Stat value={formatKcal(kcal)} label="calories avoided" />
        <Stat value={formatCount(count)} label="fake orders" />
      </div>
    </div>
  );
}
