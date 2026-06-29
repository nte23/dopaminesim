export type Rank = { min: number; name: string; blurb: string };

export const RANKS: Rank[] = [
  { min: 0, name: "Window Shopper", blurb: "Just browsing the void." },
  { min: 25, name: "Phantom Foodie", blurb: "Orders ghosts, eats nothing." },
  { min: 100, name: "Calorie Ninja", blurb: "Dodging meals like shuriken." },
  { min: 250, name: "Void Gourmet", blurb: "Refined taste in absolutely nothing." },
  { min: 500, name: "Hunger Whisperer", blurb: "The cravings fear you now." },
  { min: 1000, name: "Saint of Restraint", blurb: "Canonized for not ordering." },
  { min: 2500, name: "Dopamine Sommelier", blurb: "Pairs anticipation with a regret-free finish." },
];

export function rankFor(usd: number): { current: Rank; next: Rank | null; progress: number } {
  let current = RANKS[0];
  let next: Rank | null = RANKS[1] ?? null;
  for (let i = 0; i < RANKS.length; i++) {
    if (usd >= RANKS[i].min) {
      current = RANKS[i];
      next = RANKS[i + 1] ?? null;
    }
  }
  const progress = next ? (usd - current.min) / (next.min - current.min) : 1;
  return { current, next, progress: Math.max(0, Math.min(1, progress)) };
}
