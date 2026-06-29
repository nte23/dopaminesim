import type { LogoSpec } from "@/lib/neverhired/types";

/** Font-wordmark "logo" for a fictional company (no real trademarks). */
export function CompanyLogo({
  name,
  logo,
  size = "md",
}: {
  name: string;
  logo: LogoSpec;
  size?: "sm" | "md" | "lg";
}) {
  const fontSize = size === "lg" ? "1.7rem" : size === "sm" ? "1rem" : "1.3rem";
  const badge = size === "lg" ? "h-12 w-12" : size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const iconSize = size === "lg" ? "h-6 w-6" : size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const Icon = logo.icon;
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`flex ${badge} shrink-0 items-center justify-center rounded-xl`}
        style={{ background: logo.bg, color: logo.color }}
      >
        <Icon className={iconSize} aria-hidden />
      </span>
      <span
        className="leading-none"
        style={{
          fontFamily: logo.font,
          color: logo.color,
          fontSize,
          fontWeight: logo.weight ?? 400,
          letterSpacing: logo.tracking,
        }}
      >
        {name}
      </span>
    </span>
  );
}
