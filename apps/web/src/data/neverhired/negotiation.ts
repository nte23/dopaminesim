export type Lowball = { reply: string; counterDelta: number };

/** Every negotiation ends absurdly — countering never actually wins. */
export const LOWBALLS: Lowball[] = [
  { reply: "We can't budge on salary, but we'll throw in unlimited snacks.", counterDelta: 0 },
  { reply: "How about equity instead? (Pre-revenue. Post-vibes.)", counterDelta: -5000 },
  { reply: "We pay primarily in 'exposure' and 'experience'.", counterDelta: -8000 },
  { reply: "Final offer: what you asked, minus 35%, plus 'growth opportunities'.", counterDelta: -12000 },
  { reply: "Our budget is tight, but morale is high. Mostly ours.", counterDelta: -3000 },
  { reply: "We'll revisit comp at your 6-month review (the company won't exist by then).", counterDelta: 0 },
];

export function pickLowball(seed: number): Lowball {
  return LOWBALLS[Math.abs(seed) % LOWBALLS.length];
}
