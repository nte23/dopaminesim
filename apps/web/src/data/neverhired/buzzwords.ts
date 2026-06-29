const OPENERS = [
  "As a results-driven",
  "Being a deeply passionate",
  "As a synergistic",
  "Speaking as a battle-tested",
  "In my journey as a",
  "As a famously humble",
];
const ADJ = [
  "dynamic",
  "agile",
  "scalable",
  "disruptive",
  "holistic",
  "next-gen",
  "data-driven",
  "blockchain-enabled",
  "AI-powered",
  "ninja-level",
  "hyper-growth",
  "10x",
];
const NOUN = [
  "thought leader",
  "change agent",
  "growth hacker",
  "full-stack visionary",
  "rockstar",
  "team player",
  "self-starter",
  "brand evangelist",
  "vibe architect",
  "synergy wrangler",
];
const VERB = [
  "leverage core competencies",
  "move the needle",
  "circle back at scale",
  "boil the ocean responsibly",
  "ideate beyond the box",
  "drive holistic alignment",
  "unlock stakeholder value",
  "operationalize my passion",
];

/** The cover-letter slot machine: pull the lever, get a jargon line. */
export function generateBuzzLine(seed: number): string {
  const pick = <T,>(arr: T[], salt: number) => arr[Math.abs((seed + salt) * 2654435761) % arr.length];
  return `${pick(OPENERS, 1)} ${pick(ADJ, 2)} ${pick(NOUN, 3)}, I ${pick(VERB, 4)} to ${pick(VERB, 5)}.`;
}

export const SKILL_BANK = [
  "React",
  "Synergy",
  "Blockchain",
  "Leadership",
  "Grit",
  "Hustle",
  "Manifestation",
  "Excel",
  "Vibes",
  "Agile",
  "Kubernetes",
  "Storytelling",
  "Pivoting",
  "Buzzwords",
];
