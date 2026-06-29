export type Recruiter = {
  id: string;
  name: string;
  title: string;
  initials: string;
  color: string;
  /** messages surfaced at successive pipeline stages */
  lines: string[];
};

export const RECRUITERS: Recruiter[] = [
  {
    id: "brad",
    name: "Brad",
    title: "Talent Partner",
    initials: "B",
    color: "#2f6fed",
    lines: [
      "Hi! Thanks so much for applying. Your background is super impressive!",
      "We'd love to move you forward — just a quick take-home first.",
      "Great work on that! The team is excited to chat.",
      "Loved the interview. We'll be in touch very soon!",
    ],
  },
  {
    id: "kayleigh",
    name: "Kayleigh",
    title: "People Ops Lead",
    initials: "K",
    color: "#4338ca",
    lines: [
      "So glad you applied!! We move fast here (you'll see).",
      "Quick async exercise — should only take 'a few hours'.",
      "The panel adored you. Synergy was through the roof.",
      "Final step done! Decision coming 'shortly'.",
    ],
  },
  {
    id: "chad",
    name: "Chad",
    title: "Head of Vibes",
    initials: "C",
    color: "#0e7c7b",
    lines: [
      "yo! sick application. very based.",
      "lil take-home for you, no pressure (lots of pressure)",
      "interview was straight fire. no notes.",
      "circling back to circle back. stay tuned!",
    ],
  },
];

export function pickRecruiter(seed: number): Recruiter {
  return RECRUITERS[Math.abs(seed) % RECRUITERS.length];
}
