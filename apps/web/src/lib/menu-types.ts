import type { LucideIcon } from "lucide-react";

export type LngLat = [number, number];

export type ModifierOption = {
  id: string;
  name: string;
  priceDelta?: number;
  kcalDelta?: number;
};

export type ModifierGroup = {
  id: string;
  name: string;
  /** single = choose one (radio); multi = choose many (checkbox) */
  type: "single" | "multi";
  required?: boolean;
  /** for multi groups */
  min?: number;
  max?: number;
  options: ModifierOption[];
  /** preselected option ids */
  defaultIds?: string[];
  /** short helper line under the group title */
  hint?: string;
};

export type MenuItem = {
  id: string;
  name: string;
  desc: string;
  basePrice: number;
  baseKcal: number;
  /** query used to fetch a Pixabay photo */
  imageQuery: string;
  tag?: string;
  popular?: boolean;
  groups?: ModifierGroup[];
  /** opens a dedicated builder instead of the generic customizer */
  builder?: "boba";
};

export type MenuSection = {
  id: string;
  name: string;
  items: MenuItem[];
};

export type Review = { name: string; stars: number; text: string };

export type LogoSpec = {
  /** font-family CSS value (loaded via the suite's font links) */
  font: string;
  color: string;
  bg: string;
  icon: LucideIcon;
  tagline: string;
  weight?: number;
  tracking?: string;
};

export type Restaurant = {
  id: string;
  name: string;
  logo: LogoSpec;
  cuisine: string;
  tags: string[];
  blurb: string;
  rating: number;
  reviewCount: number;
  etaMin: number;
  etaMax: number;
  deliveryFee: number;
  minOrder: number;
  priceLevel?: 1 | 2 | 3;
  busy?: boolean;
  heroQuery: string;
  reviews: Review[];
  sections: MenuSection[];
};
