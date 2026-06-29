import type { MenuItem } from "./menu-types";

export type Selections = Record<string, string[]>;

export type CartLine = {
  uid: string;
  restaurantId: string;
  itemId: string;
  name: string;
  summary: string;
  selections: Selections;
  qty: number;
  unitPrice: number;
  unitKcal: number;
  imageQuery: string;
};

export function defaultSelections(item: MenuItem): Selections {
  const sel: Selections = {};
  for (const g of item.groups ?? []) {
    if (g.defaultIds && g.defaultIds.length) sel[g.id] = [...g.defaultIds];
    else if (g.type === "single" && g.required && g.options[0]) sel[g.id] = [g.options[0].id];
    else sel[g.id] = [];
  }
  return sel;
}

export function priceFor(item: MenuItem, selections: Selections): number {
  let p = item.basePrice;
  for (const g of item.groups ?? []) {
    for (const oid of selections[g.id] ?? []) {
      const opt = g.options.find((o) => o.id === oid);
      if (opt?.priceDelta) p += opt.priceDelta;
    }
  }
  return Math.round(p * 100) / 100;
}

export function kcalFor(item: MenuItem, selections: Selections): number {
  let k = item.baseKcal;
  for (const g of item.groups ?? []) {
    for (const oid of selections[g.id] ?? []) {
      const opt = g.options.find((o) => o.id === oid);
      if (opt?.kcalDelta) k += opt.kcalDelta;
    }
  }
  return Math.max(0, Math.round(k));
}

export function summarize(item: MenuItem, selections: Selections): string {
  const parts: string[] = [];
  for (const g of item.groups ?? []) {
    const names = (selections[g.id] ?? [])
      .map((oid) => g.options.find((o) => o.id === oid)?.name)
      .filter((n): n is string => Boolean(n));
    parts.push(...names);
  }
  return parts.join(" · ");
}

export function lineTotals(lines: CartLine[]) {
  const itemCount = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0);
  const kcal = lines.reduce((s, l) => s + l.unitKcal * l.qty, 0);
  return { itemCount, subtotal: Math.round(subtotal * 100) / 100, kcal };
}

export function makeUid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export const FEES = {
  service: 1.49,
  tip: 3.0,
};
