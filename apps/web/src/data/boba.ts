import type { Selections } from "@/lib/cart";

/** A dedicated builder config for the bubble-tea shop (its own playful UI). */
export type BobaOption = {
  id: string;
  name: string;
  priceDelta?: number;
  kcalDelta?: number;
  /** drink color for the live cup preview (tea base only) */
  color?: string;
  /** topping dot color for the cup preview */
  dot?: string;
};

export type BobaStep = {
  id: string;
  name: string;
  type: "single" | "multi";
  hint?: string;
  max?: number;
  options: BobaOption[];
};

export const BOBA_BASE_PRICE = 4.5;
export const BOBA_BASE_KCAL = 90;

export const BOBA_STEPS: BobaStep[] = [
  {
    id: "tea",
    name: "Tea base",
    type: "single",
    options: [
      { id: "black", name: "Classic Black", color: "#7a4a2b", kcalDelta: 30 },
      { id: "jasmine", name: "Jasmine Green", color: "#9fae62", kcalDelta: 20 },
      { id: "oolong", name: "Roasted Oolong", color: "#8a5a33", kcalDelta: 25 },
      { id: "taro", name: "Taro", color: "#b89bd9", kcalDelta: 110 },
      { id: "matcha", name: "Matcha", color: "#7fa86b", kcalDelta: 90 },
      { id: "thai", name: "Thai Tea", color: "#d98a3d", kcalDelta: 130 },
      { id: "strawberry", name: "Strawberry", color: "#e16b88", kcalDelta: 80 },
    ],
  },
  {
    id: "milk",
    name: "Milk",
    type: "single",
    options: [
      { id: "none", name: "No milk", kcalDelta: 0 },
      { id: "whole", name: "Whole milk", priceDelta: 0, kcalDelta: 70 },
      { id: "oat", name: "Oat milk", priceDelta: 0.5, kcalDelta: 60 },
      { id: "almond", name: "Almond milk", priceDelta: 0.5, kcalDelta: 40 },
      { id: "condensed", name: "Condensed milk", priceDelta: 0.5, kcalDelta: 130 },
    ],
  },
  {
    id: "sweet",
    name: "Sweetness",
    type: "single",
    options: [
      { id: "s0", name: "0%", kcalDelta: 0 },
      { id: "s25", name: "25%", kcalDelta: 25 },
      { id: "s50", name: "50%", kcalDelta: 55 },
      { id: "s75", name: "75%", kcalDelta: 85 },
      { id: "s100", name: "100%", kcalDelta: 120 },
    ],
  },
  {
    id: "ice",
    name: "Ice",
    type: "single",
    options: [
      { id: "none", name: "No ice" },
      { id: "light", name: "Light ice" },
      { id: "regular", name: "Regular ice" },
      { id: "extra", name: "Extra ice" },
    ],
  },
  {
    id: "size",
    name: "Size",
    type: "single",
    options: [
      { id: "m", name: "Medium (500ml)" },
      { id: "l", name: "Large (700ml)", priceDelta: 1, kcalDelta: 60 },
    ],
  },
  {
    id: "toppings",
    name: "Toppings",
    type: "multi",
    hint: "Pick up to 4",
    max: 4,
    options: [
      { id: "tapioca", name: "Tapioca pearls", priceDelta: 0.75, kcalDelta: 120, dot: "#2b2b2b" },
      { id: "popping", name: "Popping boba", priceDelta: 0.75, kcalDelta: 90, dot: "#ff7aa8" },
      { id: "grass", name: "Grass jelly", priceDelta: 0.75, kcalDelta: 40, dot: "#3a3a3a" },
      { id: "pudding", name: "Egg pudding", priceDelta: 0.75, kcalDelta: 110, dot: "#f4d35e" },
      { id: "aloe", name: "Aloe vera", priceDelta: 0.75, kcalDelta: 30, dot: "#cfe8b0" },
      { id: "redbean", name: "Red bean", priceDelta: 0.75, kcalDelta: 130, dot: "#7a2e2e" },
      { id: "cheese", name: "Cheese foam", priceDelta: 1.25, kcalDelta: 160, dot: "#fff3c4" },
    ],
  },
];

export const BOBA_DEFAULTS: Selections = {
  tea: ["black"],
  milk: ["whole"],
  sweet: ["s50"],
  ice: ["regular"],
  size: ["m"],
  toppings: ["tapioca"],
};

function findOpt(stepId: string, optId: string): BobaOption | undefined {
  return BOBA_STEPS.find((s) => s.id === stepId)?.options.find((o) => o.id === optId);
}

export function bobaPrice(sel: Selections): number {
  let p = BOBA_BASE_PRICE;
  for (const step of BOBA_STEPS)
    for (const oid of sel[step.id] ?? []) p += findOpt(step.id, oid)?.priceDelta ?? 0;
  return Math.round(p * 100) / 100;
}

export function bobaKcal(sel: Selections): number {
  let k = BOBA_BASE_KCAL;
  for (const step of BOBA_STEPS)
    for (const oid of sel[step.id] ?? []) k += findOpt(step.id, oid)?.kcalDelta ?? 0;
  return Math.max(0, Math.round(k));
}

export function bobaSummary(sel: Selections): string {
  const parts: string[] = [];
  for (const step of BOBA_STEPS)
    for (const oid of sel[step.id] ?? []) {
      const n = findOpt(step.id, oid)?.name;
      if (n) parts.push(n);
    }
  return parts.join(" · ");
}

export function bobaColor(sel: Selections): string {
  const teaId = sel.tea?.[0];
  return (teaId && findOpt("tea", teaId)?.color) || "#caa46a";
}

export function bobaToppingDots(sel: Selections): string[] {
  return (sel.toppings ?? [])
    .map((id) => findOpt("toppings", id)?.dot)
    .filter((d): d is string => Boolean(d));
}
