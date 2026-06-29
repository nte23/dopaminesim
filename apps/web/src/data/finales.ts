import { Bird, CloudFog, Ghost, PartyPopper, Rocket, Sparkles, type LucideIcon } from "lucide-react";

export type Finale = { id: string; icon: LucideIcon; title: string; blurb: string };

export const FINALES: Finale[] = [
  {
    id: "void",
    icon: Ghost,
    title: "Your courier vanished into the void.",
    blurb: "Nothing is coming. That's the point.",
  },
  {
    id: "portal",
    icon: CloudFog,
    title: "A portal opened and swallowed the order.",
    blurb: "Your meal is now in a parallel universe, eating itself.",
  },
  {
    id: "geese",
    icon: Bird,
    title: "A flock of geese intercepted your courier.",
    blurb: "They've formed a committee. Negotiations are ongoing.",
  },
  {
    id: "rocket",
    icon: Rocket,
    title: "Your courier achieved escape velocity.",
    blurb: "Last seen leaving the atmosphere, still clutching your bag.",
  },
  {
    id: "ate",
    icon: PartyPopper,
    title: "The courier ate it himself.",
    blurb: "He left a five-star review. For himself. Bold.",
  },
  {
    id: "evaporated",
    icon: Sparkles,
    title: "The order spontaneously evaporated.",
    blurb: "Thermodynamically inevitable, apparently.",
  },
];

export function pickFinale(seed: number): Finale {
  return FINALES[Math.abs(seed) % FINALES.length];
}
