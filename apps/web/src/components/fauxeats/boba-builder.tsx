"use client";

import * as React from "react";
import { Button } from "@dopaminesim/ui";
import { formatKcal, formatUsd } from "@dopaminesim/savings";
import type { MenuItem, Restaurant } from "@/lib/menu-types";
import { type CartLine, type Selections, makeUid } from "@/lib/cart";
import {
  BOBA_DEFAULTS,
  BOBA_STEPS,
  bobaColor,
  bobaKcal,
  bobaPrice,
  bobaSummary,
  bobaToppingDots,
} from "@/data/boba";
import { useFaux } from "./provider";
import { Sheet } from "./sheet";

const PRESETS: Record<string, Selections> = {
  "classic-milk": { tea: ["black"], milk: ["whole"], sweet: ["s50"], ice: ["regular"], size: ["m"], toppings: ["tapioca"] },
  "taro-dream": { tea: ["taro"], milk: ["whole"], sweet: ["s50"], ice: ["regular"], size: ["m"], toppings: ["tapioca"] },
};

function CupPreview({ color, dots }: { color: string; dots: string[] }) {
  const beads = dots.length
    ? Array.from({ length: 16 }, (_, i) => dots[i % dots.length])
    : [];
  return (
    <svg viewBox="0 0 100 150" className="h-44 w-auto drop-shadow-sm" aria-hidden>
      <defs>
        <clipPath id="cup">
          <path d="M24 44 L76 44 L70 132 Q68 138 62 138 L38 138 Q32 138 30 132 Z" />
        </clipPath>
      </defs>
      <path
        d="M24 44 L76 44 L70 132 Q68 138 62 138 L38 138 Q32 138 30 132 Z"
        fill="#ffffff"
        stroke="#1d1410"
        strokeWidth="2.5"
      />
      <g clipPath="url(#cup)">
        <rect x="22" y="60" width="56" height="80" fill={color} opacity="0.92" />
        {beads.map((d, i) => (
          <circle key={i} cx={34 + (i % 6) * 6.2} cy={130 - Math.floor(i / 6) * 7} r="3.4" fill={d} />
        ))}
      </g>
      <path d="M22 44 Q50 26 78 44 Z" fill="#ffffff" stroke="#1d1410" strokeWidth="2.5" />
      <rect
        x="55"
        y="16"
        width="8"
        height="46"
        rx="3"
        fill="#ff5a1f"
        stroke="#1d1410"
        strokeWidth="2.5"
        transform="rotate(9 59 39)"
      />
    </svg>
  );
}

export function BobaBuilder({
  restaurant,
  item,
  onClose,
}: {
  restaurant: Restaurant;
  item: MenuItem;
  onClose: () => void;
}) {
  const { addLine } = useFaux();
  const [sel, setSel] = React.useState<Selections>(() => ({
    ...BOBA_DEFAULTS,
    ...(PRESETS[item.id] ?? {}),
  }));

  const price = bobaPrice(sel);
  const kcal = bobaKcal(sel);
  const color = bobaColor(sel);
  const dots = bobaToppingDots(sel);

  function choose(stepId: string, optId: string, type: "single" | "multi", max?: number) {
    setSel((p) => {
      if (type === "single") return { ...p, [stepId]: [optId] };
      const cur = p[stepId] ?? [];
      if (cur.includes(optId)) return { ...p, [stepId]: cur.filter((x) => x !== optId) };
      if (max && cur.length >= max) return p;
      return { ...p, [stepId]: [...cur, optId] };
    });
  }

  function add() {
    const line: CartLine = {
      uid: makeUid(),
      restaurantId: restaurant.id,
      itemId: item.id,
      name: item.name,
      summary: bobaSummary(sel),
      selections: sel,
      qty: 1,
      unitPrice: price,
      unitKcal: kcal,
      imageQuery: item.imageQuery,
    };
    addLine(line);
    onClose();
  }

  return (
    <Sheet
      onClose={onClose}
      title={
        <div>
          <h2 className="font-display text-lg font-bold leading-tight">{item.name}</h2>
          <p className="text-xs text-muted-foreground">Build your cup, layer by layer</p>
        </div>
      }
      footer={
        <Button className="w-full" size="lg" onClick={add}>
          Add to bag · {formatUsd(price, { cents: true })} · {formatKcal(kcal)}
        </Button>
      }
    >
      <div className="flex flex-col items-center bg-muted/40 py-5">
        <CupPreview color={color} dots={dots} />
        <p className="mt-1 max-w-xs px-4 text-center text-xs text-muted-foreground">
          {bobaSummary(sel)}
        </p>
      </div>

      <div className="space-y-6 p-4">
        {BOBA_STEPS.map((step) => {
          const chosen = sel[step.id] ?? [];
          const atMax = step.type === "multi" && step.max ? chosen.length >= step.max : false;
          return (
            <div key={step.id}>
              <div className="mb-2 flex items-baseline justify-between gap-2">
                <h3 className="font-display text-base font-bold">{step.name}</h3>
                {step.hint ? (
                  <span className="text-xs text-muted-foreground">{step.hint}</span>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                {step.options.map((o) => {
                  const selected = chosen.includes(o.id);
                  const disabled = step.type === "multi" && atMax && !selected;
                  return (
                    <button
                      key={o.id}
                      type="button"
                      disabled={disabled}
                      onClick={() => choose(step.id, o.id, step.type, step.max)}
                      className={`inline-flex items-center gap-2 rounded-full border-2 px-3 py-1.5 text-sm font-medium transition-colors ${
                        selected
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border hover:bg-muted"
                      } ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
                    >
                      {o.color ? (
                        <span
                          className="h-3.5 w-3.5 rounded-full border border-black/10"
                          style={{ background: o.color }}
                        />
                      ) : null}
                      {o.name}
                      {o.priceDelta ? (
                        <span className="text-xs text-muted-foreground">
                          +{formatUsd(o.priceDelta, { cents: true })}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Sheet>
  );
}
