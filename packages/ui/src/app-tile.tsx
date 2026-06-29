import * as React from "react";
import { cn } from "./lib/cn";
import { Badge } from "./badge";

export type AppStatus = "live" | "soon";

/**
 * A tile in the dopaminesim "arcade" portal. Live tiles link out to a
 * sub-app; "soon" tiles are inert teasers.
 */
export function AppTile({
  title,
  tagline,
  emoji,
  href,
  status = "soon",
  className,
}: {
  title: string;
  tagline: string;
  emoji: string;
  href?: string;
  status?: AppStatus;
  className?: string;
}) {
  const live = status === "live" && !!href;
  const sharedClass = cn(
    "group relative flex flex-col gap-3 overflow-hidden rounded-xl border-2 border-border bg-card p-5 text-left transition-[transform,box-shadow]",
    live
      ? "cursor-pointer shadow-[0_4px_0_0_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:shadow-[0_10px_0_0_rgba(0,0,0,0.10)]"
      : "opacity-70",
    className,
  );

  const inner = (
    <>
      <div className="flex items-start justify-between">
        <span className="text-4xl" aria-hidden>
          {emoji}
        </span>
        {live ? (
          <Badge variant="success">live</Badge>
        ) : (
          <Badge variant="outline">soon</Badge>
        )}
      </div>
      <div>
        <h3 className="font-display text-lg font-bold leading-tight">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{tagline}</p>
      </div>
      {live ? (
        <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-primary">
          Open <span aria-hidden>→</span>
        </span>
      ) : null}
    </>
  );

  if (live) {
    return (
      <a href={href} className={sharedClass}>
        {inner}
      </a>
    );
  }
  return <div className={sharedClass}>{inner}</div>;
}
