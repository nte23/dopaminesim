/*
 * Fully fictional companies and roles. No real brands. Logos are font
 * wordmarks. Everything here is satire of the job hunt.
 */

import { Boxes, Building2, Cpu, Flame, Rocket, Sparkles } from "lucide-react";
import type { Company } from "@/lib/neverhired/types";

const Q_PASSION = {
  id: "passion",
  type: "single" as const,
  required: true,
  prompt: "On a scale of 1–10, how passionate are you about this role?",
  options: [
    { id: "10", name: "11. I dream in your logo." },
    { id: "8", name: "8 — genuinely excited" },
    { id: "5", name: "5 — I need a job" },
    { id: "1", name: "1 — Brad, please" },
  ],
};

const Q_SELF = {
  id: "self",
  type: "single" as const,
  required: true,
  prompt: "Which best describes you?",
  options: [
    { id: "rockstar", name: "Rockstar" },
    { id: "ninja", name: "Ninja" },
    { id: "wizard", name: "Wizard" },
    { id: "guru", name: "10x Guru" },
  ],
};

const Q_WEAKNESS = {
  id: "weakness",
  type: "short" as const,
  prompt: "Describe your biggest weakness (that's secretly a strength).",
  placeholder: "I care too much…",
};

export const COMPANIES: Company[] = [
  {
    id: "synergyze",
    name: "Synergyze",
    logo: { font: "'Righteous', sans-serif", color: "#2f6fed", bg: "#e2ecff", icon: Rocket },
    industry: "B2B SaaS",
    size: "201–500",
    rating: 3.4,
    reviewCount: 1842,
    blurb: "We're not a company, we're a family. (That occasionally restructures the family.)",
    perks: ["Unlimited PTO (peer-pressured into 4 days)", "Free kombucha", "Equity (vibes)", "Ping-pong nobody plays"],
    tags: ["SaaS", "Hybrid", "Mid-level"],
    reviews: [
      { title: "Great mission, fuzzy comp", stars: 3, role: "Software Engineer", pros: "Smart people, free snacks.", cons: "'We'll circle back on your raise' (they won't)." },
      { title: "Synergy overload", stars: 2, role: "PM", pros: "Lots of synergy.", cons: "Too much synergy. Send help." },
      { title: "Family until layoffs", stars: 4, role: "Designer", pros: "Cool product.", cons: "The 'family' had a reorg on a Friday." },
    ],
    jobs: [
      {
        id: "synergyze-fe",
        title: "Senior Frontend Engineer",
        level: "Senior",
        locationType: "Hybrid",
        location: "New York, NY",
        type: "Full-time",
        salaryMin: 130000,
        salaryMax: 175000,
        postedDays: 2,
        applicants: 487,
        easyApply: true,
        summary: "Own the frontend of a product that pivots quarterly. Wear many hats. The hats are also pivoting.",
        responsibilities: [
          "Ship features nobody asked for, fast",
          "Refactor the refactor of last quarter's refactor",
          "Attend 6 hours of stand-ups daily",
        ],
        requirements: [
          "12+ years of React (a 12-year-old library)",
          "Must thrive in 'ambiguity' (chaos)",
          "Willing to relocate to our metaverse office",
        ],
        skills: ["React", "TypeScript", "Synergy", "Grit", "Agile"],
        screening: [Q_PASSION, Q_SELF, Q_WEAKNESS],
      },
      {
        id: "synergyze-pm",
        title: "Product Manager (10x)",
        level: "Mid",
        locationType: "Hybrid",
        location: "New York, NY",
        type: "Full-time",
        salaryMin: 120000,
        salaryMax: 160000,
        postedDays: 5,
        applicants: 902,
        easyApply: true,
        summary: "Define the roadmap. Then redefine it. Then apologize to engineering.",
        responsibilities: ["Write specs nobody reads", "Say 'it depends' with confidence", "Own outcomes, not authority"],
        requirements: ["Must 'wear many hats'", "Fluent in roadmap-ese", "Comfortable being blamed"],
        skills: ["Leadership", "Storytelling", "Pivoting", "Excel", "Vibes"],
        screening: [Q_PASSION, Q_WEAKNESS],
      },
    ],
  },

  {
    id: "unicorn-labs",
    name: "Unicorn Labs",
    logo: { font: "'Fredoka', sans-serif", color: "#7c3aed", bg: "#efe4ff", icon: Sparkles, weight: 600 },
    industry: "Startup (Seed)",
    size: "11–50",
    rating: 3.9,
    reviewCount: 213,
    blurb: "Pre-revenue, post-vibes. We're going to change the world (or run out of runway by Q3).",
    perks: ["Equity!! (lots of zeroes)", "Founder energy", "Free standing desk (you assemble it)", "Catered lunch (once)"],
    tags: ["Startup", "Remote", "Equity"],
    reviews: [
      { title: "Rocketship or ditch", stars: 4, role: "Founding Engineer", pros: "Huge ownership.", cons: "Also huge everything-else." },
      { title: "Runway anxiety", stars: 3, role: "Growth", pros: "Move fast.", cons: "Break things, including payroll timing." },
      { title: "Equity is a feeling", stars: 2, role: "Ops", pros: "Free hoodie.", cons: "The hoodie is the comp." },
    ],
    jobs: [
      {
        id: "unicorn-founding",
        title: "Founding Full-Stack Wizard",
        level: "Senior",
        locationType: "Remote",
        location: "Remote (US)",
        type: "Full-time",
        salaryMin: 90000,
        salaryMax: 140000,
        postedDays: 1,
        applicants: 156,
        easyApply: true,
        summary: "Be employee #4. Do everything. Sleep is a Series-A problem.",
        responsibilities: ["Build the product", "Build the company", "Build your own desk", "Manifest revenue"],
        requirements: ["10x energy minimum", "OK with 'equity-heavy' comp", "Must love ramen"],
        skills: ["React", "Hustle", "Manifestation", "Grit", "Kubernetes"],
        screening: [Q_PASSION, Q_SELF, Q_WEAKNESS],
      },
    ],
  },

  {
    id: "megadyne",
    name: "Megadyne",
    logo: { font: "'Bebas Neue', sans-serif", color: "#334155", bg: "#e2e8f0", icon: Cpu, tracking: "0.05em" },
    industry: "Big Tech",
    size: "10,000+",
    rating: 4.1,
    reviewCount: 28431,
    blurb: "We optimize humanity. (For ads.) Bring your whole self; we'll A/B test it.",
    perks: ["Free gourmet food", "Nap pods (monitored)", "Stock (4-year cliff)", "Free swag you'll never wear"],
    tags: ["Big Tech", "Onsite", "Senior"],
    reviews: [
      { title: "Golden handcuffs", stars: 4, role: "SWE", pros: "Comp is real.", cons: "So is the soul-erosion." },
      { title: "Process, process, process", stars: 3, role: "TPM", pros: "Stability.", cons: "Ship one button in 9 months." },
      { title: "Free food slaps", stars: 5, role: "Intern", pros: "The food.", cons: "I gained 'the Megadyne 15'." },
    ],
    jobs: [
      {
        id: "megadyne-staff",
        title: "Staff Software Engineer",
        level: "Staff",
        locationType: "Onsite",
        location: "Mountain View, CA",
        type: "Full-time",
        salaryMin: 230000,
        salaryMax: 360000,
        postedDays: 9,
        applicants: 3120,
        easyApply: false,
        summary: "Move a metric by 0.02%. Get promoted. Repeat for a decade.",
        responsibilities: ["Optimize ad relevance", "Write a 14-page design doc for a checkbox", "Survive performance reviews"],
        requirements: ["PhD or equivalent suffering", "Must invert a binary tree on a whiteboard", "Comfortable with 11 rounds of interviews"],
        skills: ["Kubernetes", "Leadership", "Grit", "Excel", "Storytelling"],
        screening: [Q_SELF, Q_WEAKNESS],
      },
    ],
  },

  {
    id: "hustle-co",
    name: "Hustle & Co",
    logo: { font: "'Pacifico', cursive", color: "#dc2626", bg: "#ffe4e0", icon: Flame },
    industry: "Creative Agency",
    size: "51–200",
    rating: 2.6,
    reviewCount: 640,
    blurb: "We work hard so you can work harder. Rise and grind. The grind never stops. Ever.",
    perks: ["Energy drinks on tap", "'Flexible' hours (all of them)", "Hustle culture", "Foosball (mandatory bonding)"],
    tags: ["Agency", "Onsite", "Junior"],
    reviews: [
      { title: "Rise and grind (forever)", stars: 2, role: "Junior Designer", pros: "Free Red Bull.", cons: "Free Red Bull is the only sleep substitute." },
      { title: "Passion = unpaid OT", stars: 1, role: "Copywriter", pros: "Um.", cons: "'We're like a family' = no boundaries." },
      { title: "Great portfolio builder", stars: 3, role: "Intern", pros: "Learned a lot.", cons: "At 2am. Every night." },
    ],
    jobs: [
      {
        id: "hustle-rockstar",
        title: "Ninja Rockstar Developer",
        level: "Junior",
        locationType: "Onsite",
        location: "Austin, TX",
        type: "Full-time",
        salaryMin: 55000,
        salaryMax: 70000,
        postedDays: 14,
        applicants: 1411,
        easyApply: true,
        summary: "Wear 12 hats. Be a 'self-starter'. Start yourself, repeatedly, at all hours.",
        responsibilities: ["Do the work of 3 people", "Be 'passionate' (visibly)", "Grind"],
        requirements: ["Must hustle", "Must grind", "Must love 'the grind'", "Snacks are not provided but vibes are"],
        skills: ["Hustle", "Grit", "Vibes", "Buzzwords", "Manifestation"],
        screening: [Q_PASSION, Q_SELF, Q_WEAKNESS],
      },
    ],
  },

  {
    id: "blandcorp",
    name: "Blandcorp",
    logo: { font: "'Playfair Display', serif", color: "#475569", bg: "#e9edf2", icon: Building2, weight: 700 },
    industry: "Enterprise",
    size: "5,001–10,000",
    rating: 3.2,
    reviewCount: 9120,
    blurb: "Trusted by no one you've heard of, for decades. Stable. Beige. Eternal.",
    perks: ["Pension (in theory)", "Casual Fridays (business casual)", "Predictable", "A real chair"],
    tags: ["Enterprise", "Hybrid", "Mid-level"],
    reviews: [
      { title: "It's a job", stars: 3, role: "Analyst", pros: "Leaves at 5. Genuinely.", cons: "The fluorescent hum haunts my dreams." },
      { title: "Stable and beige", stars: 3, role: "Engineer", pros: "Work-life balance!", cons: "Tech stack from 2009." },
      { title: "Quietly fine", stars: 4, role: "Manager", pros: "No surprises.", cons: "No anything, really." },
    ],
    jobs: [
      {
        id: "blandcorp-analyst",
        title: "Business Systems Analyst II",
        level: "Mid",
        locationType: "Hybrid",
        location: "Columbus, OH",
        type: "Full-time",
        salaryMin: 78000,
        salaryMax: 96000,
        postedDays: 21,
        applicants: 210,
        easyApply: true,
        summary: "Maintain a spreadsheet that runs a $4B business. Touch nothing. Pray.",
        responsibilities: ["Update the spreadsheet", "Attend the recurring meeting about the meeting", "Do not break the spreadsheet"],
        requirements: ["5 years Excel", "Tolerance for stability", "Must not be 'disruptive'"],
        skills: ["Excel", "Leadership", "Storytelling", "Grit"],
        screening: [Q_WEAKNESS],
      },
    ],
  },

  {
    id: "voidstartup",
    name: "Voidstartup",
    logo: { font: "'Lobster', cursive", color: "#0e7c7b", bg: "#d8f3f2", icon: Boxes },
    industry: "Web3 / AI",
    size: "2–10",
    rating: 4.6,
    reviewCount: 38,
    blurb: "Disrupting the concept of employment itself. Fully remote. Fully async. Fully theoretical.",
    perks: ["Paid in tokens", "Metaverse office", "Async (you're never offline)", "Founder is 'building in public'"],
    tags: ["Web3", "Remote", "Equity"],
    reviews: [
      { title: "Visionary or vapor?", stars: 5, role: "Believer", pros: "We're SO early.", cons: "Possibly to a thing that won't exist." },
      { title: "Tokens go down too", stars: 2, role: "Ex-employee", pros: "Cool Discord.", cons: "Comp vested into a -94% chart." },
      { title: "The vibes are immaculate", stars: 5, role: "Anon", pros: "WAGMI.", cons: "We are not, in fact, gonna make it." },
    ],
    jobs: [
      {
        id: "void-evangelist",
        title: "Chief Vibes Officer",
        level: "Lead",
        locationType: "Remote",
        location: "Remote (Metaverse)",
        type: "Full-time",
        salaryMin: 0,
        salaryMax: 250000,
        postedDays: 3,
        applicants: 77,
        easyApply: true,
        summary: "Lead the vibes. Tokenize the culture. Comp is a range from $0 to 'generational wealth'.",
        responsibilities: ["Maintain the vibes", "Tweet thoughtfully", "Believe", "Manifest the roadmap"],
        requirements: ["Must be 'extremely online'", "Comfortable being paid in volatility", "Believe unconditionally"],
        skills: ["Vibes", "Manifestation", "Blockchain", "Storytelling", "Buzzwords"],
        screening: [Q_PASSION, Q_SELF, Q_WEAKNESS],
      },
    ],
  },
];

export function findCompany(id: string): Company | undefined {
  return COMPANIES.find((c) => c.id === id);
}

export function allJobs() {
  return COMPANIES.flatMap((c) => c.jobs.map((j) => ({ company: c, job: j })));
}

export function findJob(jobId: string) {
  for (const c of COMPANIES) {
    const job = c.jobs.find((j) => j.id === jobId);
    if (job) return { company: c, job };
  }
  return undefined;
}
