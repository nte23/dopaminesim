import { FlaskConical } from "lucide-react";
import { cn } from "./lib/cn";

/**
 * The non-negotiable legal/ethical guardrail: a persistent, always-visible
 * reminder that the entire suite is a simulation. Keeping the product
 * *unmistakably fake* is what keeps it on the right side of fraud, deception,
 * and consumer-protection lines. Render this on every page.
 */
export function SimBanner({ className }: { className?: string }) {
  return (
    <div className={cn("w-full bg-foreground text-background", className)}>
      <p className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-1.5 text-center text-[0.7rem] font-semibold tracking-wide sm:text-xs">
        <FlaskConical className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>
          Simulation — nothing is bought, charged, or delivered. It&apos;s all fake. That&apos;s the
          point.
        </span>
      </p>
    </div>
  );
}
