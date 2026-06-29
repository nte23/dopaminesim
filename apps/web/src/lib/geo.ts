import type { LngLat } from "./menu-types";

export type City = { id: string; name: string; country: string; center: LngLat };

/** Move a point by an approximate number of meters east (dx) and north (dy). */
export function offset(point: LngLat, dxMeters: number, dyMeters: number): LngLat {
  const dLng = dxMeters / (111320 * Math.cos((point[1] * Math.PI) / 180));
  const dLat = dyMeters / 110540;
  return [point[0] + dLng, point[1] + dLat];
}

/** Stable pseudo-random offset from a string seed (so a restaurant always sits in the same spot). */
export function seededPoint(center: LngLat, seed: string, minM = 600, spanM = 1500): LngLat {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const ang = (h % 360) * (Math.PI / 180);
  const dist = minM + (h % spanM);
  return offset(center, Math.cos(ang) * dist, Math.sin(ang) * dist);
}

export function distanceKm(a: LngLat, b: LngLat): number {
  const R = 6371;
  const dLat = ((b[1] - a[1]) * Math.PI) / 180;
  const dLng = ((b[0] - a[0]) * Math.PI) / 180;
  const lat1 = (a[1] * Math.PI) / 180;
  const lat2 = (b[1] * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(h));
}
