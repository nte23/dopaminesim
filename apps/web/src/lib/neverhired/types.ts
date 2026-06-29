import type { LucideIcon } from "lucide-react";

export type LogoSpec = {
  font: string;
  color: string;
  bg: string;
  icon: LucideIcon;
  weight?: number;
  tracking?: string;
};

export type ScreeningQuestion =
  | {
      id: string;
      type: "single";
      prompt: string;
      options: { id: string; name: string }[];
      required?: boolean;
    }
  | { id: string; type: "short"; prompt: string; placeholder?: string; required?: boolean };

export type Job = {
  id: string;
  title: string;
  level: string;
  locationType: "Remote" | "Hybrid" | "Onsite";
  location: string;
  type: string;
  salaryMin: number;
  salaryMax: number;
  postedDays: number;
  applicants: number;
  easyApply: boolean;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  screening: ScreeningQuestion[];
};

export type CompanyReview = {
  title: string;
  stars: number;
  role: string;
  pros: string;
  cons: string;
};

export type Company = {
  id: string;
  name: string;
  logo: LogoSpec;
  industry: string;
  size: string;
  rating: number;
  reviewCount: number;
  blurb: string;
  perks: string[];
  tags: string[];
  reviews: CompanyReview[];
  jobs: Job[];
};
