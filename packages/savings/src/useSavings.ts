"use client";

import { useSyncExternalStore } from "react";
import {
  getServerSnapshot,
  getSnapshot,
  record,
  reset,
  subscribe,
  type SavingsSnapshot,
} from "./store";

export type UseSavings = SavingsSnapshot & {
  record: typeof record;
  reset: typeof reset;
};

export function useSavings(): UseSavings {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { ...snapshot, record, reset };
}
