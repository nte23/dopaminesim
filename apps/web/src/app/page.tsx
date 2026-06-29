import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Bike,
  Briefcase,
  ChevronsUp,
  Coffee,
  Package,
  ShoppingCart,
  Sparkles,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { AppTile, Badge, Button, SavingsCounter } from "@dopaminesim/ui";

type Tile = {
  title: string;
  tagline: string;
  icon: LucideIcon;
  status: "live" | "soon";
  href?: string;
};

const TILES: Tile[] = [
  {
    title: "FauxEats",
    tagline: "Order anything. Watch the courier. Eat nothing.",
    icon: Bike,
    status: "live",
    href: "/fauxeats",
  },
  {
    title: "NeverHired",
    tagline: "Apply to everything. Get nothing. Feel productive.",
    icon: Briefcase,
    status: "live",
    href: "/neverhired",
  },
  { title: "NeverCart", tagline: "Add to cart. Check out. Pay $0.", icon: ShoppingCart, status: "soon" },
  { title: "Unbox It", tagline: "Tap to open the package you didn't buy.", icon: Package, status: "soon" },
  { title: "Spend a Billionaire", tagline: "Blow a fortune in 60 seconds.", icon: Banknote, status: "soon" },
  { title: "Break Room", tagline: "Take a fake break with strangers, live.", icon: Coffee, status: "soon" },
  { title: "Level Up", tagline: "Gain XP for literally existing.", icon: ChevronsUp, status: "soon" },
  { title: "Verified", tagline: "Get the blue check you'll never get.", icon: BadgeCheck, status: "soon" },
  { title: "Calm Down Corner", tagline: "Bubble wrap, slime, and a fake candle.", icon: Wind, status: "soon" },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-5 pb-20">
      {/* Hero */}
      <section className="flex flex-col items-center pt-14 text-center sm:pt-20">
        <Badge variant="accent" className="mb-5">
          <Sparkles className="h-3.5 w-3.5" aria-hidden /> all the hit · none of the regret
        </Badge>
        <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-7xl">
          dopamine<span className="text-primary">sim</span>
        </h1>
        <p className="mt-5 max-w-xl text-balance text-lg text-muted-foreground sm:text-xl">
          A little arcade of <span className="font-semibold text-foreground">openly-fake</span>{" "}
          dopamine toys. Order food, fill a cart, spend a fortune — and nothing ever arrives. The
          rush is real. The receipt is $0.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href="/fauxeats">
            <Button size="lg" variant="primary">
              <Bike className="h-5 w-5" aria-hidden /> Try FauxEats
            </Button>
          </a>
          <a href="#arcade">
            <Button size="lg" variant="outline">
              Browse the arcade
            </Button>
          </a>
        </div>
      </section>

      {/* The money-saved spine */}
      <section className="mx-auto mt-14 max-w-xl">
        <SavingsCounter title="Across the suite, you haven't spent" />
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Every fake order bumps your total. It follows you across the arcade — and saves to your
          account once you sign up. A fun stat, not financial advice.
        </p>
      </section>

      {/* Arcade grid */}
      <section id="arcade" className="mt-20 scroll-mt-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">The arcade</h2>
          <span className="text-sm text-muted-foreground">2 live · more loading…</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TILES.map((tile) => (
            <AppTile
              key={tile.title}
              title={tile.title}
              tagline={tile.tagline}
              icon={tile.icon}
              status={tile.status}
              href={tile.href}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-24 border-t-2 border-border pt-8 text-center text-sm text-muted-foreground">
        <p className="font-semibold text-foreground">
          dopaminesim is a simulation. It is not a real store and sells nothing.
        </p>
        <p className="mx-auto mt-2 max-w-md">
          All brands, prices, and couriers are fictional. No payments are accepted, no orders are
          fulfilled, and nothing is ever delivered.
        </p>
      </footer>
    </main>
  );
}
