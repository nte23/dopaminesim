"use client";

import * as React from "react";
import type { DraftApplication, Profile } from "@/lib/neverhired/application";

export type TrackedApplication = {
  app: DraftApplication;
  seed: number;
  createdAt: number;
};

export type NHStats = {
  applied: number;
  rejections: number;
  ghostings: number;
  interviews: number;
  offers: number;
};

const EMPTY_STATS: NHStats = { applied: 0, rejections: 0, ghostings: 0, interviews: 0, offers: 0 };

type Ctx = {
  ready: boolean;
  profile: Profile | null;
  setProfile: (p: Profile) => void;
  queue: DraftApplication[];
  addToQueue: (a: DraftApplication) => void;
  removeFromQueue: (uid: string) => void;
  clearQueue: () => void;
  active: TrackedApplication | null;
  setActive: (t: TrackedApplication | null) => void;
  stats: NHStats;
  bumpStats: (patch: Partial<NHStats>) => void;
};

const NHContext = React.createContext<Ctx | null>(null);

const P_KEY = "nh:profile:v1";
const Q_KEY = "nh:queue:v1";
const A_KEY = "nh:active:v1";
const S_KEY = "nh:stats:v1";

function read<T>(key: string, storage: Storage): T | null {
  try {
    const raw = storage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}
function write(key: string, value: unknown, storage: Storage) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function NHProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = React.useState(false);
  const [profile, setProfileState] = React.useState<Profile | null>(null);
  const [queue, setQueue] = React.useState<DraftApplication[]>([]);
  const [active, setActiveState] = React.useState<TrackedApplication | null>(null);
  const [stats, setStats] = React.useState<NHStats>(EMPTY_STATS);

  React.useEffect(() => {
    setProfileState(read<Profile>(P_KEY, localStorage));
    setQueue(read<DraftApplication[]>(Q_KEY, localStorage) ?? []);
    setActiveState(read<TrackedApplication>(A_KEY, sessionStorage));
    setStats(read<NHStats>(S_KEY, localStorage) ?? EMPTY_STATS);
    setReady(true);
  }, []);

  const setProfile = React.useCallback((p: Profile) => {
    setProfileState(p);
    write(P_KEY, p, localStorage);
  }, []);

  const persistQueue = React.useCallback((next: DraftApplication[]) => {
    setQueue(next);
    write(Q_KEY, next, localStorage);
  }, []);

  const addToQueue = React.useCallback((a: DraftApplication) => {
    setQueue((prev) => {
      const next = [...prev.filter((x) => x.jobId !== a.jobId), a];
      write(Q_KEY, next, localStorage);
      return next;
    });
  }, []);

  const removeFromQueue = React.useCallback((uid: string) => {
    setQueue((prev) => {
      const next = prev.filter((x) => x.uid !== uid);
      write(Q_KEY, next, localStorage);
      return next;
    });
  }, []);

  const clearQueue = React.useCallback(() => persistQueue([]), [persistQueue]);

  const setActive = React.useCallback((t: TrackedApplication | null) => {
    setActiveState(t);
    try {
      if (t) sessionStorage.setItem(A_KEY, JSON.stringify(t));
      else sessionStorage.removeItem(A_KEY);
    } catch {}
  }, []);

  const bumpStats = React.useCallback((patch: Partial<NHStats>) => {
    setStats((prev) => {
      const next: NHStats = {
        applied: prev.applied + (patch.applied ?? 0),
        rejections: prev.rejections + (patch.rejections ?? 0),
        ghostings: prev.ghostings + (patch.ghostings ?? 0),
        interviews: prev.interviews + (patch.interviews ?? 0),
        offers: prev.offers + (patch.offers ?? 0),
      };
      write(S_KEY, next, localStorage);
      return next;
    });
  }, []);

  const value: Ctx = {
    ready,
    profile,
    setProfile,
    queue,
    addToQueue,
    removeFromQueue,
    clearQueue,
    active,
    setActive,
    stats,
    bumpStats,
  };

  return <NHContext.Provider value={value}>{children}</NHContext.Provider>;
}

export function useNH(): Ctx {
  const ctx = React.useContext(NHContext);
  if (!ctx) throw new Error("useNH must be used within NHProvider");
  return ctx;
}
