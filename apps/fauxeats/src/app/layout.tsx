import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SimBanner } from "@dopaminesim/ui";
import "./globals.css";

export const metadata: Metadata = {
  title: "FauxEats — order food that never comes",
  description:
    "Order anything. Watch the courier cross the map. Eat nothing. A fake food-delivery sim from dopaminesim.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SimBanner />
        {children}
      </body>
    </html>
  );
}
