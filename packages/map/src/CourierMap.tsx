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
  onProgress?: (fraction: number) => void;
  onVanish?: () => void;
  className?: string;
}

// Lucide (ISC) icon geometry, inlined so markers need no React render pass.
const ICON_CHEF =
  '<path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z"/><path d="M6 17h12"/>';
const ICON_HOUSE =
  '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>';
const ICON_BIKE =
  '<circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/>';

function iconMarker(
  inner: string,
  opts: { bg: string; fg: string; border: string; size: number; icon: number },
): HTMLDivElement {
  const el = document.createElement("div");
  el.style.width = `${opts.size}px`;
  el.style.height = `${opts.size}px`;
  el.style.display = "flex";
  el.style.alignItems = "center";
  el.style.justifyContent = "center";
  el.style.borderRadius = "9999px";
  el.style.background = opts.bg;
  el.style.color = opts.fg;
  el.style.border = `2px solid ${opts.border}`;
  el.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
  el.style.userSelect = "none";
  el.innerHTML =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${opts.icon}" height="${opts.icon}" viewBox="0 0 24 24" ` +
    `fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
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

      new maplibregl.Marker({
        element: iconMarker(ICON_CHEF, {
          bg: "#ffffff",
          fg: "#1d1410",
          border: "#1d1410",
          size: 34,
          icon: 18,
        }),
        anchor: "bottom",
      })
        .setLngLat(from)
        .addTo(map);
      new maplibregl.Marker({
        element: iconMarker(ICON_HOUSE, {
          bg: "#ffffff",
          fg: "#1d1410",
          border: "#1d1410",
          size: 34,
          icon: 18,
        }),
        anchor: "bottom",
      })
        .setLngLat(to)
        .addTo(map);
      courierRef.current = new maplibregl.Marker({
        element: iconMarker(ICON_BIKE, {
          bg: routeColor,
          fg: "#ffffff",
          border: "#ffffff",
          size: 40,
          icon: 22,
        }),
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
