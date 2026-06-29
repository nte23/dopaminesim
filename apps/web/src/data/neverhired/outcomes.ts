import { Ghost, MailX, PartyPopper, Skull, ThumbsDown, Trophy, type LucideIcon } from "lucide-react";

export type OutcomeKind = "ghost" | "reject" | "offer";
export type Outcome = {
  id: string;
  kind: OutcomeKind;
  icon: LucideIcon;
  title: string;
  body: string;
};

export const REJECTIONS: Outcome[] = [
  { id: "direction", kind: "reject", icon: ThumbsDown, title: "We went a different direction.", body: "(That direction was a circle. We're back where we started, just without you.)" },
  { id: "stronger", kind: "reject", icon: ThumbsDown, title: "We had stronger candidates.", body: "There was one other candidate. They were a cousin." },
  { id: "paused", kind: "reject", icon: ThumbsDown, title: "We're pausing the role.", body: "Indefinitely. The role has been sent to a farm upstate." },
  { id: "overqualified", kind: "reject", icon: ThumbsDown, title: "You're overqualified.", body: "Translation: we got scared." },
  { id: "culture", kind: "reject", icon: ThumbsDown, title: "Not a culture fit.", body: "Our culture is chaos and you seemed too well-adjusted." },
];

export const GHOSTS: Outcome[] = [
  { id: "void", kind: "ghost", icon: Ghost, title: "You've been ghosted.", body: "Your application is 'still under review' and always will be. Forever." },
  { id: "seen", kind: "ghost", icon: MailX, title: "Seen. Not replied.", body: "The recruiter viewed your profile 4 times. Said nothing. Ever." },
  { id: "blackhole", kind: "ghost", icon: Skull, title: "Your application entered the void.", body: "It is now part of a 40,000-application backlog nobody will ever open." },
];

export const OFFERS: Outcome[] = [
  { id: "exposure", kind: "offer", icon: Trophy, title: "Offer: Chief Vibes Officer", body: "Compensation: exposure, snacks, and 'massive upside'. Equity: vibes." },
  { id: "void-ceo", kind: "offer", icon: PartyPopper, title: "Offer: CEO of Voidstartup", body: "$1,000,000/yr to do absolutely nothing. The catch: the company does not exist." },
  { id: "start-never", kind: "offer", icon: PartyPopper, title: "We'd love to have you!", body: "Start date: never. Onboarding: a vibe. Welcome aboard the ghost ship." },
];

export function rollJourney(seed: number): {
  reachesInterview: boolean;
  reachesFinal: boolean;
  outcome: Outcome;
} {
  const r = Math.abs(seed) % 100;
  // ~12% ghosted early (before interview), ~62% rejected after the loop, ~26% offer
  if (r < 12) {
    return { reachesInterview: false, reachesFinal: false, outcome: GHOSTS[seed % GHOSTS.length] };
  }
  if (r < 74) {
    return { reachesInterview: true, reachesFinal: true, outcome: REJECTIONS[seed % REJECTIONS.length] };
  }
  return { reachesInterview: true, reachesFinal: true, outcome: OFFERS[seed % OFFERS.length] };
}
