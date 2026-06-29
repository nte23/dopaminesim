"use client";

import * as React from "react";
import { Sparkles, UserRound } from "lucide-react";
import { Button } from "@dopaminesim/ui";
import { formatUsd } from "@dopaminesim/savings";
import { useNH } from "./provider";
import { Sheet } from "@/components/fauxeats/sheet";

const HEADLINES = [
  "Results-driven Synergy Architect",
  "10x Full-Stack Visionary | Open to Work",
  "Passionate Change Agent & Vibe Engineer",
  "Disruptive Thought Leader (Ex-Nowhere)",
  "Self-Starting Rockstar Ninja Guru",
];
const SALARIES = [80000, 120000, 200000, 1000000];

export function ProfileSheet({ onClose }: { onClose: () => void }) {
  const { profile, setProfile } = useNH();
  const [name, setName] = React.useState(profile?.name ?? "");
  const [headline, setHeadline] = React.useState(profile?.headline ?? HEADLINES[0]);
  const [salary, setSalary] = React.useState(profile?.dreamSalary ?? 120000);

  function generate() {
    setHeadline(HEADLINES[Math.floor(Math.random() * HEADLINES.length)]);
  }
  function save(e: React.FormEvent) {
    e.preventDefault();
    setProfile({ name: name.trim() || "You", headline, dreamSalary: salary });
    onClose();
  }

  return (
    <Sheet
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <UserRound className="h-5 w-5 text-primary" aria-hidden />
          <div>
            <h2 className="font-display text-lg font-bold leading-tight">Your applicant profile</h2>
            <p className="text-xs text-muted-foreground">It&apos;s fake. It will still get ghosted.</p>
          </div>
        </div>
      }
    >
      <form onSubmit={save} className="space-y-5 p-4">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alex Applicant"
            className="w-full rounded-lg border-2 border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Headline
            </label>
            <button
              type="button"
              onClick={generate}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary"
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden /> Generate
            </button>
          </div>
          <input
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="w-full rounded-lg border-2 border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Dream salary
          </label>
          <div className="flex flex-wrap gap-2">
            {SALARIES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSalary(s)}
                className={`rounded-full border-2 px-3 py-1.5 text-sm font-semibold transition-colors ${
                  salary === s ? "border-primary bg-primary/10" : "border-border hover:bg-muted"
                }`}
              >
                {formatUsd(s)}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full">
          Save profile
        </Button>
      </form>
    </Sheet>
  );
}
