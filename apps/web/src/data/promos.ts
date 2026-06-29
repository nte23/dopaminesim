export type Promo = {
  code: string;
  label: string;
  kind: "percent" | "freedelivery";
  value?: number;
  blurb: string;
};

export const PROMOS: Promo[] = [
  {
    code: "NOTHING20",
    label: "20% off your nothing",
    kind: "percent",
    value: 20,
    blurb: "Two-fifths of zero is still a great deal.",
  },
  {
    code: "FREEVOID",
    label: "Free delivery, forever",
    kind: "freedelivery",
    blurb: "We waive the fee for the food we won't bring.",
  },
  {
    code: "PLACEBO50",
    label: "50% off everything",
    kind: "percent",
    value: 50,
    blurb: "Half price, full fantasy.",
  },
];

export function findPromo(code: string): Promo | undefined {
  const c = code.trim().toUpperCase();
  return PROMOS.find((p) => p.code === c);
}
