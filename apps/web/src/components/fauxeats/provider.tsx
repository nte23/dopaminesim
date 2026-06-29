"use client";

import * as React from "react";
import type { CartLine } from "@/lib/cart";
import { lineTotals } from "@/lib/cart";

export type FauxLocation = { label: string; point: [number, number]; cityId?: string };

export type ActiveOrder = {
  restaurantId: string;
  restaurantName: string;
  lines: CartLine[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  tip: number;
  discount: number;
  total: number;
  kcal: number;
  location: FauxLocation;
  restaurantPoint: [number, number];
  seed: number;
  createdAt: number;
};

type Ctx = {
  ready: boolean;
  location: FauxLocation | null;
  setLocation: (l: FauxLocation) => void;
  cart: CartLine[];
  cartRestaurantId: string | null;
  addLine: (l: CartLine) => void;
  setQty: (uid: string, qty: number) => void;
  removeLine: (uid: string) => void;
  clearCart: () => void;
  totals: { itemCount: number; subtotal: number; kcal: number };
  promoCode: string | null;
  setPromoCode: (c: string | null) => void;
  activeOrder: ActiveOrder | null;
  setActiveOrder: (o: ActiveOrder | null) => void;
};

const FauxContext = React.createContext<Ctx | null>(null);

const LOC_KEY = "faux:loc:v1";
const CART_KEY = "faux:cart:v1";
const ORDER_KEY = "faux:order:v1";

function read<T>(key: string, storage: Storage): T | null {
  try {
    const raw = storage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function FauxProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = React.useState(false);
  const [location, setLocationState] = React.useState<FauxLocation | null>(null);
  const [cart, setCart] = React.useState<CartLine[]>([]);
  const [promoCode, setPromoCodeState] = React.useState<string | null>(null);
  const [activeOrder, setActiveOrderState] = React.useState<ActiveOrder | null>(null);

  React.useEffect(() => {
    setLocationState(read<FauxLocation>(LOC_KEY, localStorage));
    setCart(read<CartLine[]>(CART_KEY, localStorage) ?? []);
    setActiveOrderState(read<ActiveOrder>(ORDER_KEY, sessionStorage));
    setReady(true);
  }, []);

  const setLocation = React.useCallback((l: FauxLocation) => {
    setLocationState(l);
    try {
      localStorage.setItem(LOC_KEY, JSON.stringify(l));
    } catch {}
  }, []);

  const persistCart = React.useCallback((next: CartLine[]) => {
    setCart(next);
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const addLine = React.useCallback(
    (l: CartLine) => {
      setCart((prev) => {
        // one restaurant at a time, like a real delivery app
        const base = prev.length && prev[0].restaurantId !== l.restaurantId ? [] : prev;
        const next = [...base, l];
        try {
          localStorage.setItem(CART_KEY, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    [],
  );

  const setQty = React.useCallback(
    (uid: string, qty: number) => {
      setCart((prev) => {
        const next = prev
          .map((l) => (l.uid === uid ? { ...l, qty } : l))
          .filter((l) => l.qty > 0);
        try {
          localStorage.setItem(CART_KEY, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    [],
  );

  const removeLine = React.useCallback((uid: string) => {
    setCart((prev) => {
      const next = prev.filter((l) => l.uid !== uid);
      try {
        localStorage.setItem(CART_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const clearCart = React.useCallback(() => persistCart([]), [persistCart]);

  const setPromoCode = React.useCallback((c: string | null) => {
    setPromoCodeState(c);
  }, []);

  const setActiveOrder = React.useCallback((o: ActiveOrder | null) => {
    setActiveOrderState(o);
    try {
      if (o) sessionStorage.setItem(ORDER_KEY, JSON.stringify(o));
      else sessionStorage.removeItem(ORDER_KEY);
    } catch {}
  }, []);

  const totals = React.useMemo(() => lineTotals(cart), [cart]);
  const cartRestaurantId = cart.length ? cart[0].restaurantId : null;

  const value: Ctx = {
    ready,
    location,
    setLocation,
    cart,
    cartRestaurantId,
    addLine,
    setQty,
    removeLine,
    clearCart,
    totals,
    promoCode,
    setPromoCode,
    activeOrder,
    setActiveOrder,
  };

  return <FauxContext.Provider value={value}>{children}</FauxContext.Provider>;
}

export function useFaux(): Ctx {
  const ctx = React.useContext(FauxContext);
  if (!ctx) throw new Error("useFaux must be used within FauxProvider");
  return ctx;
}
