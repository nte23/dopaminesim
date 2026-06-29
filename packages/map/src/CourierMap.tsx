"use client";

import * as React from "react";
import maplibregl, { type StyleSpecification } from "maplibre-gl";
import { along } from "@turf/along";
import { length as turfLength } from "@turf/length";
import { lineString } from "@turf/helpers";
import "maplibre-gl/dist/maplibre-gl.css";

export type LngLat = [number, number];

/**
 * Free, no-key raster basemap. Using an *inline* style (rather than a remote
 * style URL) means the map's `load` event fires immediately even when the tile
 * provider is unreachable — so the route and the courier always render. Swap
 * `tilesUrl` for self-hosted PMTiles / a keyed provider in production.
 */
const DEFAULT_TILES = "https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png";

function baseStyle(tilesUrl: string): StyleSpecification {
  return {
    version: 8,
    sources: {
      base: {
        type: "raster",
        tiles: [tilesUrl],
        tileSize: 256,
        attribution: "© OpenStreetMap contributors © CARTO",
      },
    },
    layers: [
      { id: "bg", type: "background", paint: { "background-color": "#e9e4da" } },
      { id: "base", type: "raster", source: "base" },
    ],
  };
}

export interface CourierMapProps {
  /** restaurant / origin */
  from: LngLat;
  /** the user's "home" / destination */
  to: LngLat;
  /** optional explicit route; otherwise a gently-bowed path is synthesized */
  route?: LngLat[];
  /** full trip duration in ms */
  durationMs?: number;
  /** drive the animation */
  running?: boolean;
  /** fraction (0..1) at which the courier gives up and vanishes */
  stopAt?: number;
  /** override with a full style URL (e.g. PMTiles) */
  styleUrl?: string;
  /** raster tile template used by the default inline style */
  tilesUrl?: string;
  routeColor?: string;
  courierEmoji?: string;
  onProgress?: (fraction: number) => void;
  onVanish?: () => void;
  className?: string;
}

function emojiMarker(emoji: string, size: number): HTMLDivElement {
  const el = document.createElement("div");
  el.textContent = emoji;
  el.style.fontSize = `${size}px`;
  el.style.lineHeight = "1";
  el.style.userSelect = "none";
  el.style.filter = "drop-shadow(0 2px 3px rgba(0,0,0,0.35))";
  return el;
}

/** Synthesize a believable street-ish path between two points when no route is given. */
function buildRoute(from: LngLat, to: LngLat, route?: LngLat[]): LngLat[] {
  if (route && route.length >= 2) return route;
  const steps = 28;
  const pts: LngLat[] = [];
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const len = Math.hypot(dx, dy) || 1;
  const px = -dy / len;
  const py = dx / len;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const bow = Math.sin(t * Math.PI) * 0.5;
    const wiggle = Math.sin(t * Math.PI * 5) * 0.06;
    const offset = (bow + wiggle) * len * 0.22;
    pts.push([from[0] + dx * t + px * offset, from[1] + dy * t + py * offset]);
  }
  return pts;
}

export function CourierMap(props: CourierMapProps) {
  const {
    from,
    to,
    route,
    durationMs = 16000,
    running = true,
    stopAt = 0.93,
    styleUrl,
    tilesUrl = DEFAULT_TILES,
    routeColor = "#ff2d9b",
    courierEmoji = "🛵",
    onProgress,
    onVanish,
    className,
  } = props;

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const mapRef = React.useRef<maplibregl.Map | null>(null);
  const courierRef = React.useRef<maplibregl.Marker | null>(null);

  const line = React.useMemo(() => lineString(buildRoute(from, to, route)), [from, to, route]);
  const totalKm = React.useMemo(() => turfLength(line, { units: "kilometers" }), [line]);

  const rafRef = React.useRef<number | null>(null);
  const startRef = React.useRef<number | null>(null);
  const vanishedRef = React.useRef(false);
  const onProgressRef = React.useRef(onProgress);
  const onVanishRef = React.useRef(onVanish);
  onProgressRef.current = onProgress;
  onVanishRef.current = onVanish;

  // Initialize the map once.
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const coords = line.geometry.coordinates as LngLat[];
    let map: maplibregl.Map;
    try {
      map = new maplibregl.Map({
        container,
        style: styleUrl ?? baseStyle(tilesUrl),
        center: from,
        zoom: 13,
        attributionControl: { compact: true },
      });
    } catch {
      return;
    }
    mapRef.current = map;

    const addOverlay = () => {
      if (map.getSource("route")) return;
      map.addSource("route", { type: "geojson", data: line as never });
      map.addLayer({
        id: "route-casing",
        type: "line",
        source: "route",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": "#ffffff", "line-width": 9, "line-opacity": 0.95 },
      });
      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": routeColor, "line-width": 5, "line-dasharray": [1.4, 1.1] },
      });

      new maplibregl.Marker({ element: emojiMarker("🧑‍🍳", 26), anchor: "bottom" })
        .setLngLat(from)
        .addTo(map);
      new maplibregl.Marker({ element: emojiMarker("🏠", 26), anchor: "bottom" })
        .setLngLat(to)
        .addTo(map);
      courierRef.current = new maplibregl.Marker({
        element: emojiMarker(courierEmoji, 34),
        anchor: "center",
      })
        .setLngLat(from)
        .addTo(map);

      const lons = coords.map((c) => c[0]);
      const lats = coords.map((c) => c[1]);
      map.fitBounds(
        [
          [Math.min(...lons), Math.min(...lats)],
          [Math.max(...lons), Math.max(...lats)],
        ],
        { padding: 70, duration: 600, maxZoom: 16 },
      );
    };

    if (map.isStyleLoaded()) addOverlay();
    else map.on("load", addOverlay);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      map.remove();
      mapRef.current = null;
      courierRef.current = null;
    };
    // Re-initialize only if the basemap changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [styleUrl, tilesUrl]);

  // Drive the courier.
  React.useEffect(() => {
    if (!running) return;
    let active = true;
    vanishedRef.current = false;
    startRef.current = null;

    const tick = (ts: number) => {
      if (!active) return;
      if (startRef.current == null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const raw = Math.min(elapsed / durationMs, 1);
      const fraction = Math.min(raw, stopAt);

      const pt = along(line, totalKm * fraction, { units: "kilometers" });
      const c = pt.geometry.coordinates as LngLat;
      courierRef.current?.setLngLat(c);
      onProgressRef.current?.(fraction);

      if (raw >= stopAt) {
        if (!vanishedRef.current) {
          vanishedRef.current = true;
          const el = courierRef.current?.getElement();
          if (el) {
            el.style.transition = "opacity 1.4s ease, transform 1.4s ease";
            el.style.opacity = "0";
            el.style.transform = "scale(0.3) rotate(20deg)";
          }
          onVanishRef.current?.();
        }
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      active = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [running, durationMs, stopAt, line, totalKm]);

  return <div ref={containerRef} className={className} style={{ width: "100%", height: "100%" }} />;
}
