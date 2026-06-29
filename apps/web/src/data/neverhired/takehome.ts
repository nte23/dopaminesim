export type TakeHome = { title: string; brief: string; estimate: string };

export const TAKEHOMES: TakeHome[] = [
  {
    title: "Just a quick exercise",
    brief: "Redesign our entire brand identity and ship a working MVP. We'll review it 'whenever'.",
    estimate: "Should take ~2 hours (it takes 40)",
  },
  {
    title: "A small async task",
    brief: "Solve this 'simple' problem. (It is provably NP-hard. There is no solution. Good luck!)",
    estimate: "Quick one — due Monday, unpaid",
  },
  {
    title: "Culture exercise",
    brief: "Write a 2,000-word essay on why you are deeply, personally passionate about synergy.",
    estimate: "Whenever works for you (tonight)",
  },
  {
    title: "Light prototype",
    brief: "Build the exact feature we've been trying to build for 8 months. For free. As a 'test'.",
    estimate: "No rush! (Extreme rush.)",
  },
];

export function pickTakeHome(seed: number): TakeHome {
  return TAKEHOMES[Math.abs(seed) % TAKEHOMES.length];
}
