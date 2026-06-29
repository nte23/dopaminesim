"use client";

import * as React from "react";
import Link from "next/link";
import { Clock, MapPin, Search, Users, Zap } from "lucide-react";
import { Badge, Button } from "@dopaminesim/ui";
import { formatUsd } from "@dopaminesim/savings";
import { allJobs } from "@/data/neverhired/companies";
import { easyApplyDraft } from "@/lib/neverhired/application";
import { useNH } from "@/components/neverhired/provider";
import { NHHeader } from "@/components/neverhired/header";
import { ProfileSheet } from "@/components/neverhired/profile-sheet";
import { CompanyLogo } from "@/components/neverhired/company-logo";

const LEVELS = Array.from(new Set(allJobs().map(({ job }) => job.level)));
const LOCS = ["Remote", "Hybrid", "Onsite"] as const;

export default function NeverHiredHome() {
  const { ready, profile, addToQueue } = useNH();
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [level, setLevel] = React.useState<string | null>(null);
  const [loc, setLoc] = React.useState<string | null>(null);
  const [applying, setApplying] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (ready && !profile) setProfileOpen(true);
  }, [ready, profile]);

  const jobs = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return allJobs().filter(({ company, job }) => {
      const matchesQ =
        !q ||
        job.title.toLowerCase().includes(q) ||
        company.name.toLowerCase().includes(q) ||
        job.skills.some((s) => s.toLowerCase().includes(q));
      const matchesL = !level || job.level === level;
      const matchesLoc = !loc || job.locationType === loc;
      return matchesQ && matchesL && matchesLoc;
    });
  }, [query, level, loc]);

  function sprayAll() {
    const easy = allJobs().filter(({ job }) => job.easyApply);
    easy.forEach(({ company, job }) => addToQueue(easyApplyDraft(company, job)));
    setApplying(easy.length);
    window.setTimeout(() => setApplying(null), 4000);
  }

  return (
    <div className="min-h-dvh">
      <NHHeader onProfile={() => setProfileOpen(true)} />

      <main className="mx-auto max-w-5xl px-4 pb-24 pt-6">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Apply to everything. Get nothing.
        </h1>
        <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <Users className="h-4 w-4 text-primary" aria-hidden />
          <span className="font-semibold tabular-nums text-foreground">1,204</span> people are
          fake-applying right now
        </p>

        {/* Easy-Apply spray */}
        <div className="mt-5 flex flex-col gap-3 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Zap className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="font-display font-bold leading-tight">Easy-Apply everything</p>
              <p className="text-sm text-muted-foreground">
                One tap. Fire your application at every open role. Spray, pray, dopamine.
              </p>
            </div>
          </div>
          <Button onClick={sprayAll} className="shrink-0">
            {applying != null ? `Fired ${applying} into the void!` : "Easy-Apply to all"}
          </Button>
        </div>

        {/* Search + filters */}
        <div className="mt-5 flex items-center gap-2 rounded-full border-2 border-border bg-card px-4 py-2.5">
          <Search className="h-5 w-5 text-muted-foreground" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search roles, companies, or buzzwords…"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {LOCS.map((l) => (
            <button
              key={l}
              onClick={() => setLoc((cur) => (cur === l ? null : l))}
              className={`rounded-full border-2 px-3 py-1.5 text-sm font-semibold transition-colors ${
                loc === l ? "border-primary bg-primary/10" : "border-border hover:bg-muted"
              }`}
            >
              {l}
            </button>
          ))}
          <span className="mx-1 h-5 w-px bg-border" />
          {LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => setLevel((cur) => (cur === l ? null : l))}
              className={`rounded-full border-2 px-3 py-1.5 text-sm font-semibold transition-colors ${
                level === l ? "border-primary bg-primary/10" : "border-border hover:bg-muted"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Job list */}
        <div className="mt-6 space-y-3">
          {jobs.map(({ company, job }) => (
            <div
              key={job.id}
              className="flex flex-col gap-3 rounded-xl border-2 border-border bg-card p-4 shadow-[0_3px_0_0_rgba(0,0,0,0.04)] sm:flex-row sm:items-center"
            >
              <Link href={`/neverhired/c/${company.id}`} className="min-w-0 flex-1">
                <CompanyLogo name={company.name} logo={company.logo} size="sm" />
                <p className="mt-2 font-display text-lg font-bold leading-tight">{job.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" aria-hidden /> {job.locationType} · {job.location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" aria-hidden /> {job.postedDays}d ago
                  </span>
                  <span>{job.applicants.toLocaleString()} applicants</span>
                </div>
                <p className="mt-1 font-semibold">
                  {job.salaryMin > 0 ? formatUsd(job.salaryMin) : "$0"} – {formatUsd(job.salaryMax)}
                </p>
              </Link>
              <div className="flex shrink-0 items-center gap-2">
                {job.easyApply ? <Badge variant="accent">Easy Apply</Badge> : null}
                <Link href={`/neverhired/c/${company.id}`}>
                  <Button variant="outline">View</Button>
                </Link>
              </div>
            </div>
          ))}
          {jobs.length === 0 ? (
            <p className="py-10 text-center text-muted-foreground">
              No roles match. The void has standards too.
            </p>
          ) : null}
        </div>
      </main>

      {profileOpen ? <ProfileSheet onClose={() => setProfileOpen(false)} /> : null}
    </div>
  );
}
