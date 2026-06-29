import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NHProvider } from "@/components/neverhired/provider";

export const metadata: Metadata = {
  title: "NeverHired — apply to everything, get nothing",
  description:
    "A fake job-application sim. Apply to fictional companies, do absurd take-homes and interviews, and get ghosted in style. From dopaminesim.",
};

/** Corporate-blue route-group theme + the application/profile provider. */
export default function NeverHiredLayout({ children }: { children: ReactNode }) {
  return (
    <div className="theme-neverhired min-h-dvh bg-background text-foreground">
      <NHProvider>{children}</NHProvider>
    </div>
  );
}
