"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Minus, Plus, Tag, Trash2 } from "lucide-react";
import { Badge, Button, Card } from "@dopaminesim/ui";
import { formatKcal, formatUsd } from "@dopaminesim/savings";
import { findRestaurant } from "@/data/catalog";
import { findCity } from "@/data/cities";
import { findPromo } from "@/data/promos";
import { FEES } from "@/lib/cart";
import { seededPoint } from "@/lib/geo";
import { useFaux, type ActiveOrder } from "@/components/fauxeats/provider";
import { FauxHeader } from "@/components/fauxeats/header";
import { LocationSheet } from "@/components/fauxeats/location-sheet";
import { FoodImage } from "@/components/fauxeats/food-image";

const TIPS = [0, 3, 5, 8];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totals, location, setQty, removeLine, clearCart, setActiveOrder } = useFaux();
  const restaurant = cart.length ? findRestaurant(cart[0].restaurantId) : undefined;
  const [tip, setTip] = React.useState(3);
  const [code, setCode] = React.useState("");
  const [applied, setApplied] = React.useState<ReturnType<typeof findPromo>>(undefined);
  const [codeErr, setCodeErr] = React.useState<string | null>(null);
  const [locOpen, setLocOpen] = React.useState(false);

  if (!restaurant || cart.length === 0) {
    return (
      <div className="min-h-dvh">
        <FauxHeader onLocation={() => setLocOpen(true)} />
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <h1 className="font-display text-2xl font-bold">Your bag is empty</h1>
          <p className="mt-2 text-muted-foreground">Go order something you&apos;ll never eat.</p>
          <Link href="/fauxeats" className="mt-5 inline-block">
            <Button size="lg">Browse restaurants</Button>
          </Link>
        </div>
        {locOpen ? <LocationSheet onClose={() => setLocOpen(false)} /> : null}
      </div>
    );
  }

  const deliveryFee = applied?.kind === "freedelivery" ? 0 : restaurant.deliveryFee;
  const discount =
    applied?.kind === "percent" && applied.value
      ? Math.round(totals.subtotal * (applied.value / 100) * 100) / 100
      : 0;
  const total = Math.max(0, totals.subtotal - discount + deliveryFee + FEES.service + tip);

  function applyCode(e: React.FormEvent) {
    e.preventDefault();
    const p = findPromo(code);
    if (!p) {
      setApplied(undefined);
      setCodeErr("That code is as real as the food.");
      return;
    }
    setApplied(p);
    setCodeErr(null);
  }

  function placeOrder() {
    if (!location) {
      setLocOpen(true);
      return;
    }
    const restaurantPoint = seededPoint(location.point, restaurant!.id, 900, 1400);
    const order: ActiveOrder = {
      restaurantId: restaurant!.id,
      restaurantName: restaurant!.name,
      lines: cart,
      subtotal: totals.subtotal,
      deliveryFee,
      serviceFee: FEES.service,
      tip,
      discount,
      total,
      kcal: totals.kcal,
      location,
      restaurantPoint,
      seed: Math.floor(Math.random() * 100000),
      createdAt: Date.now(),
    };
    setActiveOrder(order);
    clearCart();
    router.push("/fauxeats/track");
  }

  return (
    <div className="min-h-dvh">
      <FauxHeader onLocation={() => setLocOpen(true)} />
      <main className="mx-auto max-w-xl px-4 pb-28 pt-6">
        <button
          onClick={() => router.push(`/fauxeats/r/${restaurant.id}`)}
          className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden /> back to {restaurant.name}
        </button>
        <h1 className="mt-3 font-display text-2xl font-bold">Checkout</h1>

        <Card className="mt-4 p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold">Deliver to</h2>
            <button
              onClick={() => setLocOpen(true)}
              className="text-sm font-semibold text-primary"
            >
              Change
            </button>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {location?.label ?? "No address set — tap Change"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Estimated arrival: {restaurant.etaMin}–{restaurant.etaMax} min (give or take a void).
          </p>
        </Card>

        {/* Items */}
        <Card className="mt-4 divide-y-2 divide-border p-0">
          {cart.map((l) => (
            <div key={l.uid} className="flex gap-3 p-4">
              <FoodImage query={l.imageQuery} className="h-16 w-16 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold leading-tight">{l.name}</p>
                {l.summary ? (
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{l.summary}</p>
                ) : null}
                <p className="mt-1 text-sm font-semibold">{formatUsd(l.unitPrice, { cents: true })}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center gap-2 rounded-full border-2 border-border p-0.5">
                    <button
                      onClick={() => setQty(l.uid, l.qty - 1)}
                      aria-label="Decrease"
                      className="rounded-full p-1 hover:bg-muted"
                    >
                      <Minus className="h-3.5 w-3.5" aria-hidden />
                    </button>
                    <span className="w-4 text-center text-sm font-bold tabular-nums">{l.qty}</span>
                    <button
                      onClick={() => setQty(l.uid, l.qty + 1)}
                      aria-label="Increase"
                      className="rounded-full p-1 hover:bg-muted"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </div>
                  <button
                    onClick={() => removeLine(l.uid)}
                    aria-label="Remove"
                    className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </div>
              <p className="shrink-0 font-semibold tabular-nums">
                {formatUsd(l.unitPrice * l.qty, { cents: true })}
              </p>
            </div>
          ))}
        </Card>

        {/* Promo */}
        <Card className="mt-4 p-4">
          <h2 className="mb-2 inline-flex items-center gap-2 font-display font-bold">
            <Tag className="h-4 w-4 text-primary" aria-hidden /> Promo code
          </h2>
          {applied ? (
            <div className="flex items-center justify-between rounded-lg bg-primary/10 px-3 py-2 text-sm">
              <span className="font-semibold">
                {applied.code} — {applied.label}
              </span>
              <button
                onClick={() => setApplied(undefined)}
                className="font-semibold text-muted-foreground"
              >
                Remove
              </button>
            </div>
          ) : (
            <form onSubmit={applyCode} className="flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="NOTHING20"
                className="w-full rounded-lg border-2 border-border bg-background px-3 py-2 text-sm uppercase outline-none focus:border-primary"
              />
              <Button type="submit" variant="outline">
                Apply
              </Button>
            </form>
          )}
          {codeErr ? <p className="mt-1 text-xs text-destructive">{codeErr}</p> : null}
        </Card>

        {/* Tip */}
        <Card className="mt-4 p-4">
          <h2 className="font-display font-bold">Tip your courier</h2>
          <p className="text-xs text-muted-foreground">They&apos;ll deliver nothing, beautifully.</p>
          <div className="mt-2 flex gap-2">
            {TIPS.map((t) => (
              <button
                key={t}
                onClick={() => setTip(t)}
                className={`flex-1 rounded-lg border-2 py-2 text-sm font-semibold transition-colors ${
                  tip === t ? "border-primary bg-primary/10" : "border-border hover:bg-muted"
                }`}
              >
                {t === 0 ? "None" : formatUsd(t)}
              </button>
            ))}
          </div>
        </Card>

        {/* Payment */}
        <Card className="mt-4 p-4">
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
            Disabled on purpose. dopaminesim never accepts real payment.
          </p>
        </Card>

        {/* Summary */}
        <Card className="mt-4 p-4">
          <Row label="Subtotal" value={formatUsd(totals.subtotal, { cents: true })} />
          {discount > 0 ? (
            <Row label={`Discount (${applied?.code})`} value={`−${formatUsd(discount, { cents: true })}`} />
          ) : null}
          <Row label="Delivery fee" value={formatUsd(deliveryFee, { cents: true })} />
          <Row label="Service fee" value={formatUsd(FEES.service, { cents: true })} />
          <Row label="Tip" value={formatUsd(tip, { cents: true })} />
          <div className="my-3 border-t-2 border-dashed border-border" />
          <div className="flex items-center justify-between font-display text-lg font-bold">
            <span>Total you won&apos;t pay</span>
            <span className="tabular-nums text-primary">{formatUsd(total, { cents: true })}</span>
          </div>
          <p className="mt-1 text-right text-xs text-muted-foreground">{formatKcal(totals.kcal)} on the line</p>
        </Card>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-border bg-background/95 p-3 backdrop-blur">
        <div className="mx-auto max-w-xl">
          <Button className="w-full" size="lg" onClick={placeOrder}>
            Place fake order · {formatUsd(total)}
          </Button>
        </div>
      </div>

      {locOpen ? <LocationSheet onClose={() => setLocOpen(false)} /> : null}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-0.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
