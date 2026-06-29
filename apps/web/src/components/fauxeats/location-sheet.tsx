"use client";

import * as React from "react";
import { LocateFixed, MapPin } from "lucide-react";
import { Button } from "@dopaminesim/ui";
import { CITIES } from "@/data/cities";
import { offset, type City } from "@/lib/geo";
import { useFaux } from "./provider";
import { Sheet } from "./sheet";

export function LocationSheet({ onClose }: { onClose: () => void }) {
  const { setLocation, location } = useFaux();
  const [addr, setAddr] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  function chooseCity(c: City) {
    setLocation({ label: `${c.name}, ${c.country}`, point: offset(c.center, 350, -250), cityId: c.id });
    onClose();
  }

  function useMyLocation() {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setErr("Geolocation isn't available here — pick a city.");
      return;
    }
    setBusy(true);
    setErr(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setBusy(false);
        setLocation({
          label: "Your current location",
          point: [pos.coords.longitude, pos.coords.latitude],
        });
        onClose();
      },
      () => {
        setBusy(false);
        setErr("Couldn't get your location — pick a city below.");
      },
      { timeout: 8000 },
    );
  }

  function submitAddr(e: React.FormEvent) {
    e.preventDefault();
    const a = addr.trim();
    if (!a) return;
    const c = CITIES.find((x) => x.id === location?.cityId) ?? CITIES[0];
    setLocation({ label: a, point: offset(c.center, 300, -200), cityId: c.id });
    onClose();
  }

  return (
    <Sheet
      onClose={onClose}
      title={
        <div>
          <h2 className="font-display text-lg font-bold leading-tight">Where to?</h2>
          <p className="text-xs text-muted-foreground">
            We won&apos;t deliver here. We just want the map to feel like home.
          </p>
        </div>
      }
    >
      <div className="space-y-5 p-4">
        <Button variant="outline" size="lg" className="w-full" onClick={useMyLocation} disabled={busy}>
          <LocateFixed className="h-5 w-5" aria-hidden />
          {busy ? "Locating…" : "Use my current location"}
        </Button>
        {err ? <p className="text-sm text-destructive">{err}</p> : null}

        <form onSubmit={submitAddr}>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Type an address
          </label>
          <div className="flex gap-2">
            <input
              value={addr}
              onChange={(e) => setAddr(e.target.value)}
              placeholder="221B Baker Street…"
              className="w-full rounded-lg border-2 border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <Button type="submit">Set</Button>
          </div>
        </form>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Or pick a city
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {CITIES.map((c) => (
              <button
                key={c.id}
                onClick={() => chooseCity(c)}
                className={`flex items-center gap-2 rounded-lg border-2 px-3 py-2 text-left text-sm font-medium transition-colors ${
                  location?.cityId === c.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
                }`}
              >
                <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{c.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{c.country}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Sheet>
  );
}
