import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SimBanner } from "@dopaminesim/ui";
import "./globals.css";

export const metadata: Metadata = {
  title: "dopaminesim — guilt-free dopamine",
  description:
    "A suite of openly-fake dopamine sites. Order, shop, and spend — and nothing ever arrives. All the hit, none of the regret.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=Lobster&family=Bebas+Neue&family=Righteous&family=Fredoka:wght@500;600;700&family=Playfair+Display:wght@700&family=Pacifico&display=swap"
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
