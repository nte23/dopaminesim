export type Rank = { min: number; name: string; blurb: string };

/** Career ladder, keyed off number of applications fired into the void. */
export const RANKS: Rank[] = [
  { min: 0, name: "Unemployed Visionary", blurb: "Big dreams, zero responses." },
  { min: 5, name: "Professional Applicant", blurb: "Applying is the job now." },
  { min: 15, name: "Ghosting Survivor", blurb: "You've stopped checking your inbox. Healthy." },
  { min: 30, name: "Rejection Connoisseur", blurb: "You can taste a 'we went another direction' a mile off." },
  { min: 60, name: "Interview Veteran", blurb: "Decorated in unpaid take-homes." },
  { min: 100, name: "Career Limbo Legend", blurb: "Neither hired nor fired. Eternal." },
];

export function rankFor(applied: number): { current: Rank; next: Rank | null; progress: number } {
  let current = RANKS[0];
  let next: Rank | null = RANKS[1] ?? null;
  for (let i = 0; i < RANKS.length; i++) {
    if (applied >= RANKS[i].min) {
      current = RANKS[i];
      next = RANKS[i + 1] ?? null;
    }
  }
  const progress = next ? (applied - current.min) / (next.min - current.min) : 1;
  return { current, next, progress: Math.max(0, Math.min(1, progress)) };
}
