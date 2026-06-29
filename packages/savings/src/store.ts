/*
 * The "money saved" spine.
 *
 * A tiny framework-agnostic store, persisted to localStorage, that every
 * sub-app writes to whenever a fake purchase/order "happens" (and nothing
 * arrives). The running total — dollars dodged, calories avoided — is the
 * brand's core flex and the thing worth syncing to an account later.
 *
 * The Supabase sync seam lives here: swap `persist`/`readStorage` for a
 * remote-backed implementation once optional accounts ship. The public API
 * (subscribe / getSnapshot / record / reset) stays identical.
 */

export type SavingEvent = {
  id: string;
  /** which sub-app produced it, e.g. "fauxeats" */
  app: string;
  /** human label, e.g. "Phantom Pad Thai ×2" */
  label: string;
  /** dollars not spent */
  usd: number;
  /** calories not eaten */
  kcal: number;
  /** unix ms */
  ts: number;
};

export type SavingsSnapshot = {
  usd: number;
  kcal: number;
  count: number;
  events: SavingEvent[];
};

const STORAGE_KEY = "dopaminesim:savings:v1";
const EMPTY: SavingsSnapshot = Object.freeze({ usd: 0, kcal: 0, count: 0, events: [] });
const MAX_EVENTS = 250;

let snapshot: SavingsSnapshot = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function compute(events: SavingEvent[]): SavingsSnapshot {
  let usd = 0;
  let kcal = 0;
  for (const e of events) {
    usd += e.usd;
    kcal += e.kcal;
  }
  return { usd, kcal, count: events.length, events };
}

function readStorage(): SavingEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is SavingEvent =>
        !!e && typeof e === "object" && typeof (e as SavingEvent).usd === "number",
    );
  } catch {
    return [];
  }
}

function persist(events: SavingEvent[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {
    /* storage unavailable (private mode, quota) — stay in-memory */
  }
}

function emit(): void {
  for (const listener of listeners) listener();
}

function ensureHydrated(): void {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  snapshot = compute(readStorage());
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) {
      snapshot = compute(readStorage());
      emit();
    }
  });
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function subscribe(listener: () => void): () => void {
  ensureHydrated();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot(): SavingsSnapshot {
  ensureHydrated();
  return snapshot;
}

/** Stable empty snapshot for SSR / hydration (avoids server/client mismatch). */
export function getServerSnapshot(): SavingsSnapshot {
  return EMPTY;
}

export type RecordInput = {
  app: string;
  label: string;
  usd: number;
  kcal?: number;
};

export function record(input: RecordInput): SavingEvent {
  ensureHydrated();
  const event: SavingEvent = {
    id: uid(),
    app: input.app,
    label: input.label,
    usd: Math.max(0, Math.round(input.usd * 100) / 100),
    kcal: Math.max(0, Math.round(input.kcal ?? 0)),
    ts: Date.now(),
  };
  const events = [event, ...snapshot.events].slice(0, MAX_EVENTS);
  snapshot = compute(events);
  persist(events);
  emit();
  return event;
}

export function reset(): void {
  ensureHydrated();
  snapshot = EMPTY;
  persist([]);
  emit();
}
