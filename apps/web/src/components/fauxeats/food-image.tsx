"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";

const memo = new Map<string, string | null>();

function gradientFor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const a = h % 360;
  const b = (a + 45) % 360;
  return `linear-gradient(135deg, hsl(${a} 68% 70%), hsl(${b} 72% 56%))`;
}

/**
 * A dish/restaurant image backed by the Pixabay route, with a designed
 * gradient + icon fallback when no key is set or the photo can't load.
 */
export function FoodImage({
  query,
  icon: Icon,
  className,
  rounded = "rounded-lg",
}: {
  query: string;
  icon?: LucideIcon;
  className?: string;
  rounded?: string;
}) {
  const [url, setUrl] = React.useState<string | null>(memo.get(query) ?? null);

  React.useEffect(() => {
    let active = true;
    if (memo.has(query)) {
      setUrl(memo.get(query) ?? null);
      return;
    }
    fetch(`/fauxeats/api/img?q=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then((d: { url: string | null }) => {
        memo.set(query, d.url);
        if (active) setUrl(d.url);
      })
      .catch(() => {
        memo.set(query, null);
        if (active) setUrl(null);
      });
    return () => {
      active = false;
    };
  }, [query]);

  return (
    <div
      className={`relative overflow-hidden ${rounded} ${className ?? ""}`}
      style={url ? undefined : { backgroundImage: gradientFor(query) }}
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={query} className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-white/80">
          {Icon ? <Icon className="h-2/5 w-2/5" strokeWidth={1.5} aria-hidden /> : null}
        </div>
      )}
    </div>
  );
}
