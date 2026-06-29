import { formatKcal, formatUsd } from "@dopaminesim/savings";
import { cn } from "./lib/cn";

export type ReceiptLine = { label: string; amount: number };

/**
 * The shareable payoff screen. A faux-thermal receipt that turns restraint
 * into a brag — built to be screenshotted ("I just saved $43 on dinner I
 * never ate").
 */
export function ReceiptCard({
  usd,
  kcal,
  lines,
  brand = "DOPAMINESIM",
  note,
  className,
}: {
  usd: number;
  kcal: number;
  lines?: ReceiptLine[];
  brand?: string;
  note?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-sm rounded-md border-2 border-dashed border-foreground/40 bg-card p-6 font-mono text-sm text-card-foreground shadow-[0_2px_0_0_rgba(0,0,0,0.06)]",
        className,
      )}
    >
      <div className="text-center">
        <p className="font-display text-base font-bold tracking-[0.2em]">{brand}</p>
        <p className="text-[0.7rem] uppercase tracking-wide text-muted-foreground">
          official non-receipt
        </p>
      </div>

      <div className="my-4 border-t-2 border-dotted border-foreground/30" />

      {lines && lines.length > 0 ? (
        <ul className="space-y-1">
          {lines.map((line, i) => (
            <li key={i} className="flex items-baseline justify-between gap-3">
              <span className="truncate text-muted-foreground">{line.label}</span>
              <span className="tabular-nums">{formatUsd(line.amount, { cents: true })}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="my-4 border-t-2 border-dotted border-foreground/30" />

      <div className="flex items-baseline justify-between">
        <span className="font-display text-sm font-bold uppercase">You saved</span>
        <span className="font-display text-2xl font-bold tabular-nums text-primary">
          {formatUsd(usd, { cents: true })}
        </span>
      </div>
      <div className="mt-1 flex items-baseline justify-between text-muted-foreground">
        <span className="text-xs uppercase tracking-wide">Calories dodged</span>
        <span className="tabular-nums">{formatKcal(kcal)}</span>
      </div>

      <div className="my-4 border-t-2 border-dotted border-foreground/30" />
      <p className="text-center text-[0.7rem] leading-relaxed text-muted-foreground">
        {note ?? "Paid: $0.00 · Delivered: nothing · Regret: none"}
      </p>
    </div>
  );
}
