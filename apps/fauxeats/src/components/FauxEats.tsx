"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  ArrowRight,
  Bike,
  ChefHat,
  CreditCard,
  Ghost,
  MapPin,
  Minus,
  Package,
  Plus,
  Star,
  type LucideIcon,
} from "lucide-react";
import { Badge, Button, Card, ReceiptCard, type ReceiptLine } from "@dopaminesim/ui";
import { formatKcal, formatUsd, record, useSavings } from "@dopaminesim/savings";
import type { CourierMapProps } from "@dopaminesim/map";
import { FEES, RESTAURANTS, findRestaurant, type Dish, type Restaurant } from "@/data/catalog";

const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL ?? "http://localhost:3000";

// Load the map (and maplibre) only on the client — it touches `window` on import.
const CourierMap = dynamic<CourierMapProps>(
  () => import("@dopaminesim/map").then((m) => ({ default: m.CourierMap })),
  { ssr: false, loading: () => <MapSkeleton /> },
);

type Step = "browse" | "menu" | "checkout" | "tracking" | "done";
type Cart = Record<string, number>;
type CartItem = { dish: Dish; qty: number };
type TrackStatus = { icon: LucideIcon; text: string };

const TRACK_STATUS: TrackStatus[] = [
  { icon: Package, text: "Bagging up a whole lot of nothing…" },
  { icon: ChefHat, text: "A chef is pretending to cook your order" },
  { icon: Bike, text: "Your courier grabbed an imaginary bag" },
  { icon: Bike, text: "On the way — smells like absolutely nothing" },
  { icon: MapPin, text: "Almost there! Two minutes away…" },
];

function statusIndex(fraction: number): number {
  if (fraction < 0.08) return 0;
  if (fraction < 0.25) return 1;
  if (fraction < 0.5) return 2;
  if (fraction < 0.78) return 3;
  return 4;
}

export function FauxEats() {
  const [step, setStep] = React.useState<Step>("browse");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [cart, setCart] = React.useState<Cart>({});
  const [statusIdx, setStatusIdx] = React.useState(0);
  const lastIdxRef = React.useRef(0);
  const recordedRef = React.useRef(false);

  const restaurant = selectedId ? findRestaurant(selectedId) : undefined;

  const cartItems = React.useMemo<CartItem[]>(() => {
    if (!restaurant) return [];
    return restaurant.dishes
      .map((dish) => ({ dish, qty: cart[dish.id] ?? 0 }))
      .filter((item) => item.qty > 0);
  }, [restaurant, cart]);

  const itemCount = cartItems.reduce((n, i) => n + i.qty, 0);
  const subtotal = cartItems.reduce((s, i) => s + i.dish.price * i.qty, 0);
  const totalKcal = cartItems.reduce((s, i) => s + i.dish.kcal * i.qty, 0);
  const total = cartItems.length ? subtotal + FEES.delivery + FEES.service + FEES.tip : 0;

  function chooseRestaurant(id: string) {
    setSelectedId(id);
    setCart({});
    setStep("menu");
  }

  function setQty(dishId: string, delta: number) {
    setCart((prev) => {
      const next = { ...prev };
      const q = (next[dishId] ?? 0) + delta;
      if (q <= 0) delete next[dishId];
      else next[dishId] = q;
      return next;
    });
  }

  function backToBrowse() {
    setSelectedId(null);
    setCart({});
    setStep("browse");
  }

  function startOrder() {
    setStatusIdx(0);
    lastIdxRef.current = 0;
    recordedRef.current = false;
    setStep("tracking");
  }

  function handleProgress(fraction: number) {
    const idx = statusIndex(fraction);
    if (idx !== lastIdxRef.current) {
      lastIdxRef.current = idx;
      setStatusIdx(idx);
    }
  }

  function handleVanish() {
    if (recordedRef.current || !restaurant) return;
    recordedRef.current = true;
    record({
      app: "fauxeats",
      label: `${restaurant.name} · ${itemCount} item${itemCount === 1 ? "" : "s"}`,
      usd: total,
      kcal: totalKcal,
    });
    setStep("done");
  }

  return (
    <div className="min-h-dvh">
      <TopBar />
      <main className="mx-auto max-w-5xl px-5 pb-24 pt-8">
        {step === "browse" && <BrowseView onPick={chooseRestaurant} />}

        {step === "menu" && restaurant && (
          <MenuView
            restaurant={restaurant}
            cart={cart}
            cartItems={cartItems}
            subtotal={subtotal}
            itemCount={itemCount}
            onSetQty={setQty}
            onBack={backToBrowse}
            onCheckout={() => setStep("checkout")}
          />
        )}

        {step === "checkout" && restaurant && (
          <CheckoutView
            cartItems={cartItems}
            subtotal={subtotal}
            total={total}
            onBack={() => setStep("menu")}
            onPlace={startOrder}
          />
        )}

        {step === "tracking" && restaurant && (
          <TrackingView
            restaurant={restaurant}
            status={TRACK_STATUS[statusIdx] ?? TRACK_STATUS[0]}
            onProgress={handleProgress}
            onVanish={handleVanish}
          />
        )}

        {step === "done" && restaurant && (
          <DoneView
            cartItems={cartItems}
            total={total}
            totalKcal={totalKcal}
            onAgain={backToBrowse}
          />
        )}
      </main>
    </div>
  );
}

function TopBar() {
  const { usd } = useSavings();
  return (
    <header className="sticky top-0 z-10 border-b-2 border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-5 py-3">
        <a
          href={PORTAL_URL}
          className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden /> dopaminesim
        </a>
        <span className="font-display text-lg font-bold tracking-tight">
          Faux<span className="text-primary">Eats</span>
        </span>
        <span className="rounded-full bg-muted px-3 py-1 text-sm font-bold tabular-nums text-foreground">
          {formatUsd(usd)} saved
        </span>
      </div>
    </header>
  );
}

function BrowseView({ onPick }: { onPick: (id: string) => void }) {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
        What won&apos;t you eat tonight?
      </h1>
      <p className="mt-2 text-muted-foreground">
        Pick a place, build an order, and watch it never arrive. Keep the money. Keep the calories.
      </p>
      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {RESTAURANTS.map((r) => {
          const Icon = r.icon;
          return (
            <button
              key={r.id}
              onClick={() => onPick(r.id)}
              className="group flex cursor-pointer flex-col gap-3 rounded-xl border-2 border-border bg-card p-5 text-left shadow-[0_4px_0_0_rgba(0,0,0,0.06)] transition-transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-primary">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <Badge variant="muted">
                  <Star className="h-3 w-3 fill-current" aria-hidden /> {r.rating.toFixed(1)}
                </Badge>
              </div>
              <div>
                <h3 className="font-display text-lg font-bold leading-tight">{r.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {r.cuisine} · {r.eta}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{r.blurb}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MenuView({
  restaurant,
  cart,
  cartItems,
  subtotal,
  itemCount,
  onSetQty,
  onBack,
  onCheckout,
}: {
  restaurant: Restaurant;
  cart: Cart;
  cartItems: CartItem[];
  subtotal: number;
  itemCount: number;
  onSetQty: (dishId: string, delta: number) => void;
  onBack: () => void;
  onCheckout: () => void;
}) {
  const RestaurantIcon = restaurant.icon;
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden /> all restaurants
        </button>
        <div className="mt-3 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-primary">
            <RestaurantIcon className="h-6 w-6" aria-hidden />
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold leading-tight">{restaurant.name}</h1>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              {restaurant.cuisine} · {restaurant.eta} · {restaurant.rating.toFixed(1)}
              <Star className="h-3.5 w-3.5 fill-current" aria-hidden />
            </p>
          </div>
        </div>

        <ul className="mt-5 space-y-3">
          {restaurant.dishes.map((dish) => {
            const qty = cart[dish.id] ?? 0;
            const DishIcon = dish.icon;
            return (
              <li key={dish.id}>
                <Card className="flex items-center justify-between gap-4 p-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                      <DishIcon className="h-5 w-5" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold leading-tight">{dish.name}</p>
                      <p className="text-sm text-muted-foreground">{dish.desc}</p>
                      <p className="mt-1 text-sm font-semibold">
                        {formatUsd(dish.price, { cents: true })} · {formatKcal(dish.kcal)}
                      </p>
                    </div>
                  </div>
                  {qty > 0 ? (
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => onSetQty(dish.id, -1)}
                        aria-label={`Remove one ${dish.name}`}
                      >
                        <Minus className="h-4 w-4" aria-hidden />
                      </Button>
                      <span className="w-5 text-center font-bold tabular-nums">{qty}</span>
                      <Button
                        size="icon"
                        variant="primary"
                        onClick={() => onSetQty(dish.id, 1)}
                        aria-label={`Add one ${dish.name}`}
                      >
                        <Plus className="h-4 w-4" aria-hidden />
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => onSetQty(dish.id, 1)}>
                      Add
                    </Button>
                  )}
                </Card>
              </li>
            );
          })}
        </ul>
      </div>

      <aside className="lg:sticky lg:top-20 lg:h-fit">
        <Card className="p-5">
          <h2 className="font-display text-lg font-bold">Your fake bag</h2>
          {cartItems.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Empty. Add something you definitely won&apos;t eat.
            </p>
          ) : (
            <>
              <ul className="mt-3 space-y-2">
                {cartItems.map(({ dish, qty }) => (
                  <li key={dish.id} className="flex justify-between gap-2 text-sm">
                    <span className="truncate text-muted-foreground">
                      {qty}× {dish.name}
                    </span>
                    <span className="tabular-nums">
                      {formatUsd(dish.price * qty, { cents: true })}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="my-3 border-t-2 border-dashed border-border" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold tabular-nums">
                  {formatUsd(subtotal, { cents: true })}
                </span>
              </div>
              <Button className="mt-4 w-full" size="lg" onClick={onCheckout}>
                Checkout ({itemCount})
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </>
          )}
        </Card>
      </aside>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

function CheckoutView({
  cartItems,
  subtotal,
  total,
  onBack,
  onPlace,
}: {
  cartItems: CartItem[];
  subtotal: number;
  total: number;
  onBack: () => void;
  onPlace: () => void;
}) {
  return (
    <div className="mx-auto max-w-xl">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden /> back to menu
      </button>
      <h1 className="mt-3 font-display text-2xl font-bold">Checkout</h1>

      <Card className="mt-4 p-5">
        <h2 className="font-display font-bold">Deliver to</h2>
        <input
          className="mt-2 w-full rounded-md border-2 border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          defaultValue="Your couch, Apt. YOU"
          aria-label="Delivery address"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Don&apos;t worry — we won&apos;t use this. Nothing is coming here.
        </p>
      </Card>

      <Card className="mt-4 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold">Payment</h2>
          <Badge variant="outline">demo card · disabled</Badge>
        </div>
        <div className="mt-3 rounded-lg bg-muted p-4 font-mono text-sm">
          <div className="flex items-center justify-between">
            <span>4242 4242 4242 4242</span>
            <CreditCard className="h-5 w-5 text-muted-foreground" aria-hidden />
          </div>
          <div className="mt-2 flex justify-between gap-3 text-muted-foreground">
            <span>DEMO PLAYER</span>
            <span>00 / 00</span>
            <span>CVC •••</span>
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          This card is fake and disabled. dopaminesim never accepts real payment.
        </p>
      </Card>

      <Card className="mt-4 p-5">
        <ul className="space-y-1 text-sm">
          {cartItems.map(({ dish, qty }) => (
            <li key={dish.id} className="flex justify-between gap-2">
              <span className="truncate text-muted-foreground">
                {qty}× {dish.name}
              </span>
              <span className="tabular-nums">{formatUsd(dish.price * qty, { cents: true })}</span>
            </li>
          ))}
        </ul>
        <div className="my-3 border-t-2 border-dashed border-border" />
        <SummaryRow label="Subtotal" value={formatUsd(subtotal, { cents: true })} />
        <SummaryRow label="Delivery fee" value={formatUsd(FEES.delivery, { cents: true })} />
        <SummaryRow label="Service fee" value={formatUsd(FEES.service, { cents: true })} />
        <SummaryRow label="Tip your courier" value={formatUsd(FEES.tip, { cents: true })} />
        <div className="my-3 border-t-2 border-dashed border-border" />
        <div className="flex justify-between font-display text-lg font-bold">
          <span>Total you won&apos;t pay</span>
          <span className="tabular-nums text-primary">{formatUsd(total, { cents: true })}</span>
        </div>
      </Card>

      <Button className="mt-5 w-full" size="lg" onClick={onPlace}>
        Place fake order · {formatUsd(total)}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Button>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        By placing this order you agree that no order is being placed.
      </p>
    </div>
  );
}

function TrackingView({
  restaurant,
  status,
  onProgress,
  onVanish,
}: {
  restaurant: Restaurant;
  status: TrackStatus;
  onProgress: (fraction: number) => void;
  onVanish: () => void;
}) {
  const StatusIcon = status.icon;
  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-muted text-primary">
          <StatusIcon className="h-6 w-6" aria-hidden />
        </span>
        <div>
          <h1 className="font-display text-xl font-bold leading-tight">{status.text}</h1>
          <p className="text-sm text-muted-foreground">
            From {restaurant.name} to your door (allegedly)
          </p>
        </div>
      </div>
      <div className="mt-5 h-[58vh] min-h-[360px] w-full overflow-hidden rounded-xl border-2 border-border">
        <CourierMap
          from={restaurant.from}
          to={restaurant.to}
          durationMs={15000}
          stopAt={0.92}
          routeColor="#ff5a1f"
          onProgress={onProgress}
          onVanish={onVanish}
          className="h-full w-full"
        />
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Heads up: it never actually arrives. Watching is the whole meal.
      </p>
    </div>
  );
}

function DoneView({
  cartItems,
  total,
  totalKcal,
  onAgain,
}: {
  cartItems: CartItem[];
  total: number;
  totalKcal: number;
  onAgain: () => void;
}) {
  const lines: ReceiptLine[] = cartItems.map(({ dish, qty }) => ({
    label: `${qty}× ${dish.name}`,
    amount: dish.price * qty,
  }));
  return (
    <div className="mx-auto max-w-md text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Ghost className="h-10 w-10" aria-hidden />
      </div>
      <h1 className="mt-4 font-display text-2xl font-bold">Your courier vanished into the void.</h1>
      <p className="mt-2 text-muted-foreground">
        Nothing is coming. That&apos;s the point. Here&apos;s what you saved by not eating it.
      </p>
      <ReceiptCard className="mt-6" usd={total} kcal={totalKcal} lines={lines} brand="FAUXEATS" />
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button size="lg" onClick={onAgain}>
          <Bike className="h-5 w-5" aria-hidden /> Order more nothing
        </Button>
        <a href={PORTAL_URL}>
          <Button size="lg" variant="outline">
            Back to the arcade
          </Button>
        </a>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Your savings were added to your dopaminesim total.
      </p>
    </div>
  );
}

function MapSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-muted">
      <span className="animate-pulse text-sm font-semibold text-muted-foreground">
        Summoning your courier…
      </span>
    </div>
  );
}
