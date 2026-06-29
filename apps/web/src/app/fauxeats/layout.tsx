import type { Metadata } from "next";
import type { ReactNode } from "react";
import { FauxProvider } from "@/components/fauxeats/provider";

export const metadata: Metadata = {
  title: "FauxEats — order food that never comes",
  description:
    "Order anything. Watch the courier cross the map. Eat nothing. A fake food-delivery sim from dopaminesim.",
};

/**
 * Route-group theming: everything under /fauxeats is wrapped in the
 * `.theme-fauxeats` token overrides (see globals.css), so this sub-app gets
 * its own warm "delivery" look while sharing one component library, one
 * origin, and one "money saved" total with the rest of the suite. The
 * FauxProvider holds the cart + chosen location across the sub-app's routes.
 */
export default function FauxEatsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="theme-fauxeats min-h-dvh bg-background text-foreground">
      <FauxProvider>{children}</FauxProvider>
    </div>
  );
}
