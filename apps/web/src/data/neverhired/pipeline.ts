export type StageId =
  | "applied"
  | "received"
  | "screening"
  | "takehome"
  | "interview"
  | "final"
  | "outcome";

export const STAGE_ORDER: StageId[] = [
  "applied",
  "received",
  "screening",
  "takehome",
  "interview",
  "final",
  "outcome",
];

export const STAGE_LABELS: Record<StageId, string> = {
  applied: "Applied",
  received: "Received",
  screening: "Screening",
  takehome: "Take-home",
  interview: "Interview",
  final: "Final round",
  outcome: "Decision",
};
