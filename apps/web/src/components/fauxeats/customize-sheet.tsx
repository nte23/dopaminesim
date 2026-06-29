"use client";

import * as React from "react";
import { Check, Minus, Plus } from "lucide-react";
import { Button } from "@dopaminesim/ui";
import { formatKcal, formatUsd } from "@dopaminesim/savings";
import type { MenuItem, ModifierGroup, Restaurant } from "@/lib/menu-types";
import {
  type CartLine,
  type Selections,
  defaultSelections,
  kcalFor,
  makeUid,
  priceFor,
  summarize,
} from "@/lib/cart";
import { useFaux } from "./provider";
import { FoodImage } from "./food-image";
import { Sheet } from "./sheet";

function priceTag(delta?: number) {
  if (!delta) return null;
  const sign = delta > 0 ? "+" : "−";
  return (
    <span className="ml-auto shrink-0 text-sm font-semibold text-muted-foreground tabular-nums">
      {sign}
      {formatUsd(Math.abs(delta), { cents: true })}
    </span>
  );
}

function OptionRow({
  name,
  selected,
  multi,
  disabled,
  delta,
  onClick,
}: {
  name: string;
  selected: boolean;
  multi: boolean;
  disabled?: boolean;
  delta?: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center gap-3 rounded-lg border-2 px-3 py-2.5 text-left transition-colors ${
        selected ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
      } ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center border-2 ${
          multi ? "rounded-md" : "rounded-full"
        } ${selected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"}`}
      >
        {selected ? <Check className="h-3.5 w-3.5" aria-hidden /> : null}
      </span>
      <span className="font-medium">{name}</span>
      {priceTag(delta)}
    </button>
  );
}

function Group({
  group,
  sel,
  onChoose,
  onToggle,
}: {
  group: ModifierGroup;
  sel: Selections;
  onChoose: (gid: string, oid: string) => void;
  onToggle: (gid: string, oid: string, max?: number) => void;
}) {
  const chosen = sel[group.id] ?? [];
  const atMax = group.type === "multi" && group.max ? chosen.length >= group.max : false;
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <h3 className="font-display text-base font-bold">
          {group.name}
          {group.required ? <span className="ml-1 text-xs text-primary">required</span> : null}
        </h3>
        {group.hint ? <span className="text-xs text-muted-foreground">{group.hint}</span> : null}
      </div>
      <div className="space-y-2">
        {group.options.map((o) => {
          const selected = chosen.includes(o.id);
          return (
            <OptionRow
              key={o.id}
              name={o.name}
              selected={selected}
              multi={group.type === "multi"}
              delta={o.priceDelta}
              disabled={group.type === "multi" && atMax && !selected}
              onClick={() =>
                group.type === "single"
                  ? onChoose(group.id, o.id)
                  : onToggle(group.id, o.id, group.max)
              }
            />
          );
        })}
      </div>
    </div>
  );
}

export function CustomizeSheet({
  restaurant,
  item,
  onClose,
}: {
  restaurant: Restaurant;
  item: MenuItem;
  onClose: () => void;
}) {
  const { addLine } = useFaux();
  const [sel, setSel] = React.useState<Selections>(() => defaultSelections(item));
  const [qty, setQty] = React.useState(1);

  const unitPrice = priceFor(item, sel);
  const unitKcal = kcalFor(item, sel);

  const onChoose = (gid: string, oid: string) => setSel((p) => ({ ...p, [gid]: [oid] }));
  const onToggle = (gid: string, oid: string, max?: number) =>
    setSel((p) => {
      const cur = p[gid] ?? [];
      if (cur.includes(oid)) return { ...p, [gid]: cur.filter((x) => x !== oid) };
      if (max && cur.length >= max) return p;
      return { ...p, [gid]: [...cur, oid] };
    });

  function add() {
    const line: CartLine = {
      uid: makeUid(),
      restaurantId: restaurant.id,
      itemId: item.id,
      name: item.name,
      summary: summarize(item, sel),
      selections: sel,
      qty,
      unitPrice,
      unitKcal,
      imageQuery: item.imageQuery,
    };
    addLine(line);
    onClose();
  }

  return (
    <Sheet
      onClose={onClose}
      footer={
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border-2 border-border p-1">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
              className="rounded-full p-1.5 hover:bg-muted"
            >
              <Minus className="h-4 w-4" aria-hidden />
            </button>
            <span className="w-5 text-center font-bold tabular-nums">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              aria-label="Increase quantity"
              className="rounded-full p-1.5 hover:bg-muted"
            >
              <Plus className="h-4 w-4" aria-hidden />
            </button>
          </div>
          <Button className="flex-1" size="lg" onClick={add}>
            Add to bag · {formatUsd(unitPrice * qty, { cents: true })}
          </Button>
        </div>
      }
    >
      <div>
        <FoodImage
          query={item.imageQuery}
          icon={restaurant.logo.icon}
          rounded="rounded-none"
          className="h-40 w-full sm:h-48"
        />
        <div className="p-4">
          <h2 className="font-display text-xl font-bold">{item.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
          <p className="mt-2 text-sm font-semibold text-muted-foreground">
            {formatUsd(unitPrice, { cents: true })} · {formatKcal(unitKcal)}
          </p>

          <div className="mt-5 space-y-6">
            {(item.groups ?? []).map((g) => (
              <Group key={g.id} group={g} sel={sel} onChoose={onChoose} onToggle={onToggle} />
            ))}
          </div>
        </div>
      </div>
    </Sheet>
  );
}
