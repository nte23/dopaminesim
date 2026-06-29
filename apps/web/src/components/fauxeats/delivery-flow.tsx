"use client";

import * as React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Bike,
  Check,
  ChefHat,
  MapPin,
  Package,
  Share2,
  Star,
  Trophy,
} from "lucide-react";
import { Button, ReceiptCard, type ReceiptLine } from "@dopaminesim/ui";
import { formatKcal, formatUsd, useSavings } from "@dopaminesim/savings";
import type { CourierMapProps } from "@dopaminesim/map";
import type { Courier } from "@/data/couriers";
import { pickCourier } from "@/data/couriers";
import { pickFinale } from "@/data/finales";
import { rankFor } from "@/data/ranks";
import { useFaux, type ActiveOrder } from "./provider";

const CourierMap = dynamic<CourierMapProps>(
  () => import("@dopaminesim/map").then((m) => ({ default: m.CourierMap })),
  { ssr: false, loading: () => <MapSkeleton /> },
);

type Phase = "placed" | "accepted" | "preparing" | "picked_up" | "enroute" | "finale";
const ORDER: Phase[] = ["placed", "accepted", "preparing", "picked_up", "enroute", "finale"];

type Toast = { id: number; icon: React.ComponentType<{ className?: string }>; text: string };

const STEPS = [
  { key: "placed", label: "Placed" },
  { key: "accepted", label: "Accepted" },
  { key: "preparing", label: "Preparing" },
  { key: "enroute", label: "On the way" },
  { key: "finale", label: "Delivered?" },
] as const;

const TOTAL_SEC = 320;

export function DeliveryFlow({ order }: { order: ActiveOrder }) {
  const fast = useSearchParams().get("fast");
  const speed = fast ? 16 : 1;
  const ms = React.useCallback((s: number) => (s * 1000) / speed, [speed]);
  const ENROUTE_MS = ms(150);

  const courier = React.useMemo(() => pickCourier(order.seed), [order.seed]);
  const finale = React.useMemo(() => pickFinale(order.seed + 7), [order.seed]);

  const [phase, setPhase] = React.useState<Phase>("placed");
  const [progress, setProgress] = React.useState(0);
  const [msgIdx, setMsgIdx] = React.useState(0);
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const [, setTick] = React.useState(0);

  const mountMs = React.useRef(0);
  const toastId = React.useRef(0);
  const nearbyRef = React.useRef(false);

  const pushToast = React.useCallback(
    (icon: Toast["icon"], text: string) => {
      const id = ++toastId.current;
      setToasts((t) => [...t, { id, icon, text }]);
      window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), ms(4.2));
    },
    [ms],
  );

  // Phase timeline
  React.useEffect(() => {
    mountMs.current = Date.now();
    const timers: number[] = [];
    const fire = (s: number, fn: () => void) => timers.push(window.setTimeout(fn, ms(s)));

    pushToast(Check, "Order placed — sending it into the void");
    fire(4, () => {
      setPhase("accepted");
      pushToast(ChefHat, `${order.restaurantName} accepted your order`);
    });
    fire(12, () => {
      setPhase("preparing");
      pushToast(ChefHat, "The kitchen started preparing your order");
    });
    fire(80, () => pushToast(Bike, `${courier.name} is assigned to your order`));
    fire(165, () => {
      setPhase("picked_up");
      pushToast(Package, `${courier.name} picked up your order`);
    });
    fire(172, () => setPhase("enroute"));

    const interval = window.setInterval(() => setTick((n) => n + 1), 1000);
    return () => {
      timers.forEach(clearTimeout);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onProgress(f: number) {
    setProgress(f);
    const idx = Math.min(courier.texts.length - 1, Math.floor(f * courier.texts.length));
    setMsgIdx(idx);
    if (f > 0.82 && !nearbyRef.current) {
      nearbyRef.current = true;
      pushToast(MapPin, `${courier.name} is almost at your door`);
    }
  }

  const phaseIdx = ORDER.indexOf(phase);
  const remainingSec = Math.max(
    0,
    TOTAL_SEC - ((Date.now() - (mountMs.current || Date.now())) * speed) / 1000,
  );
  const etaMin = Math.max(1, Math.ceil(remainingSec / 60));

  if (phase === "finale") {
    return <Finale order={order} finale={finale} />;
  }

  const status = statusFor(phase, progress, order.restaurantName);
  const StatusIcon = status.icon;
  const showCourier = phaseIdx >= ORDER.indexOf("picked_up");

  return (
    <div className="mx-auto max-w-3xl px-4 pb-12 pt-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <StatusIcon className="h-6 w-6" aria-hidden />
          </span>
          <div>
            <h1 className="font-display text-xl font-bold leading-tight">{status.title}</h1>
            <p className="text-sm text-muted-foreground">{status.sub}</p>
          </div>
        </div>
        <div className="shrink-0 rounded-full bg-muted px-3 py-1.5 text-center">
          <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
            ETA
          </p>
          <p className="font-display text-lg font-bold leading-none tabular-nums">{etaMin} min</p>
        </div>
      </div>

      {/* Stepper */}
      <ol className="mt-5 flex items-center">
        {STEPS.map((s, i) => {
          const sIdx = ORDER.indexOf(s.key as Phase);
          const done = phaseIdx > sIdx;
          const active = phaseIdx === sIdx || (s.key === "enroute" && phase === "enroute");
          return (
            <React.Fragment key={s.key}>
              <li className="flex flex-col items-center gap-1">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold ${
                    done
                      ? "border-primary bg-primary text-primary-foreground"
                      : active
                        ? "border-primary text-primary"
                        : "border-border text-muted-foreground"
                  }`}
                >
                  {done ? <Check className="h-4 w-4" aria-hidden /> : i + 1}
                </span>
                <span className="text-[0.65rem] font-semibold text-muted-foreground">{s.label}</span>
              </li>
              {i < STEPS.length - 1 ? (
                <span
                  className={`mx-1 mb-4 h-0.5 flex-1 rounded ${
                    phaseIdx > sIdx ? "bg-primary" : "bg-border"
                  }`}
                />
              ) : null}
            </React.Fragment>
          );
        })}
      </ol>

      {/* Map */}
      <div className="mt-5 h-[48vh] min-h-[320px] w-full overflow-hidden rounded-xl border-2 border-border">
        <CourierMap
          from={order.restaurantPoint}
          to={order.location.point}
          durationMs={ENROUTE_MS}
          running={phase === "enroute"}
          stopAt={0.92}
          routeColor="#ff5a1f"
          onProgress={onProgress}
          onVanish={() => setPhase("finale")}
          className="h-full w-full"
        />
      </div>

      {showCourier ? (
        <div className="mt-4">
          <CourierCard
            courier={courier}
            message={phase === "enroute" ? courier.texts[msgIdx] : "Heading to your address now."}
          />
        </div>
      ) : (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Your courier is waiting at {order.restaurantName} while the kitchen pretends to cook.
        </p>
      )}

      {/* Toasts */}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-30 flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => {
          const Icon = t.icon;
          return (
            <div
              key={t.id}
              className="pointer-events-auto flex items-center gap-2 rounded-full border-2 border-border bg-card px-4 py-2 text-sm font-semibold shadow-lg"
            >
              <Icon className="h-4 w-4 text-primary" aria-hidden />
              {t.text}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function statusFor(phase: Phase, progress: number, restaurant: string) {
  switch (phase) {
    case "placed":
      return { icon: Check, title: "Order placed", sub: "Sending your order into the void…" };
    case "accepted":
      return { icon: ChefHat, title: "Order accepted", sub: `${restaurant} is firing up the (fake) stove` };
    case "preparing":
      return { icon: ChefHat, title: "Preparing your order", sub: "A chef is pretending to cook" };
    case "picked_up":
      return { icon: Package, title: "Picked up", sub: "Your courier has the (empty) bag" };
    case "enroute":
      return progress > 0.82
        ? { icon: MapPin, title: "Almost there", sub: "Two minutes away… allegedly" }
        : { icon: Bike, title: "On the way", sub: "Smells like absolutely nothing" };
    default:
      return { icon: Bike, title: "On the way", sub: "" };
  }
}

function CourierCard({ courier, message }: { courier: Courier; message?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border-2 border-border bg-card p-3">
      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display text-lg font-bold text-white"
        style={{ background: courier.color }}
      >
        {courier.initials}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold leading-tight">
          {courier.name} <span className="text-muted-foreground">· {courier.vehicle}</span>
        </p>
        <p className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
          {courier.rating.toFixed(1)}
        </p>
        {message ? (
          <p className="mt-1 inline-block rounded-2xl rounded-tl-sm bg-muted px-3 py-1.5 text-sm">
            {message}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function MapSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-muted">
      <span className="animate-pulse text-sm font-semibold text-muted-foreground">
        Summoning the map…
      </span>
    </div>
  );
}

function Finale({ order, finale }: { order: ActiveOrder; finale: ReturnType<typeof pickFinale> }) {
  const router = useRouter();
  const { setActiveOrder } = useFaux();
  const { usd, record } = useSavings();
  const recorded = React.useRef(false);

  React.useEffect(() => {
    if (recorded.current) return;
    recorded.current = true;
    const items = order.lines.reduce((n, l) => n + l.qty, 0);
    record({
      app: "fauxeats",
      label: `${order.restaurantName} · ${items} item${items === 1 ? "" : "s"}`,
      usd: order.total,
      kcal: order.kcal,
    });
  }, [order, record]);

  const lines: ReceiptLine[] = order.lines.map((l) => ({
    label: `${l.qty}× ${l.name}`,
    amount: l.unitPrice * l.qty,
  }));
  const rank = rankFor(usd);
  const FinaleIcon = finale.icon;

  function orderAgain() {
    setActiveOrder(null);
    router.push(`/fauxeats/r/${order.restaurantId}`);
  }

  return (
    <div className="mx-auto max-w-md px-4 pb-16 pt-8 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <FinaleIcon className="h-10 w-10" aria-hidden />
      </div>
      <h1 className="mt-4 font-display text-2xl font-bold">{finale.title}</h1>
      <p className="mt-2 text-muted-foreground">{finale.blurb}</p>

      <ReceiptCard
        className="mt-6"
        usd={order.total}
        kcal={order.kcal}
        lines={lines}
        brand="FAUXEATS"
      />

      <RankCard rank={rank} usd={usd} />
      <ShareCard usd={order.total} kcal={order.kcal} rankName={rank.current.name} />

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button size="lg" onClick={orderAgain}>
          <Bike className="h-5 w-5" aria-hidden /> Order more nothing
        </Button>
        <Link href="/">
          <Button size="lg" variant="outline">
            Back to the arcade
          </Button>
        </Link>
      </div>
    </div>
  );
}

function RankCard({ rank, usd }: { rank: ReturnType<typeof rankFor>; usd: number }) {
  return (
    <div className="mt-5 rounded-xl border-2 border-border bg-card p-4 text-left">
      <div className="flex items-center gap-2">
        <Trophy className="h-5 w-5 text-amber-500" aria-hidden />
        <p className="font-display font-bold">
          Rank: {rank.current.name}
        </p>
      </div>
      <p className="mt-0.5 text-sm text-muted-foreground">{rank.current.blurb}</p>
      {rank.next ? (
        <>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${Math.round(rank.progress * 100)}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatUsd(Math.max(0, rank.next.min - usd))} more dodged to reach{" "}
            <span className="font-semibold text-foreground">{rank.next.name}</span>
          </p>
        </>
      ) : (
        <p className="mt-2 text-xs font-semibold text-primary">Max rank. Untouchable.</p>
      )}
    </div>
  );
}

function ShareCard({ usd, kcal, rankName }: { usd: number; kcal: number; rankName: string }) {
  const [copied, setCopied] = React.useState(false);
  const text = `I just "saved" ${formatUsd(usd)} and ${formatKcal(kcal)} by ordering food that never came on dopaminesim. Rank: ${rankName}.`;

  async function share() {
    const url = typeof window !== "undefined" ? window.location.origin + "/fauxeats" : "";
    try {
      if (typeof navigator !== "undefined" && "share" in navigator) {
        await (navigator as Navigator).share({ title: "FauxEats", text, url });
        return;
      }
    } catch {
      /* user cancelled */
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="mt-5">
      <div className="overflow-hidden rounded-2xl border-2 border-border bg-gradient-to-br from-primary to-secondary p-5 text-left text-white">
        <p className="text-xs font-semibold uppercase tracking-wide opacity-90">dopaminesim · FauxEats</p>
        <p className="mt-2 font-display text-3xl font-bold leading-none">{formatUsd(usd)}</p>
        <p className="text-sm opacity-90">not spent on food that never came</p>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span>{formatKcal(kcal)} dodged</span>
          <span className="rounded-full bg-white/20 px-2 py-0.5 font-semibold">{rankName}</span>
        </div>
      </div>
      <Button variant="outline" className="mt-3 w-full" onClick={share}>
        <Share2 className="h-4 w-4" aria-hidden />
        {copied ? "Copied to clipboard!" : "Share your restraint"}
      </Button>
    </div>
  );
}
