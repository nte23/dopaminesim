"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Check, FileStack, MapPin, Sparkles, Star, Users, Zap } from "lucide-react";
import { Badge, Button, Card } from "@dopaminesim/ui";
import { formatUsd } from "@dopaminesim/savings";
import { findCompany } from "@/data/neverhired/companies";
import type { Job } from "@/lib/neverhired/types";
import { easyApplyDraft } from "@/lib/neverhired/application";
import { useNH } from "@/components/neverhired/provider";
import { NHHeader } from "@/components/neverhired/header";
import { ProfileSheet } from "@/components/neverhired/profile-sheet";
import { CompanyLogo } from "@/components/neverhired/company-logo";
import { ApplicationBuilder } from "@/components/neverhired/application-builder";

export default function CompanyPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const company = findCompany(params.id);
  const { queue, addToQueue } = useNH();
  const [openJob, setOpenJob] = React.useState<Job | null>(null);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [justAdded, setJustAdded] = React.useState<string | null>(null);

  if (!company) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Company not found</h1>
        <Link href="/neverhired" className="mt-4 inline-block font-semibold text-primary">
          Back to NeverHired
        </Link>
      </div>
    );
  }

  function easyApply(job: Job) {
    addToQueue(easyApplyDraft(company!, job));
    setJustAdded(job.id);
    window.setTimeout(() => setJustAdded((x) => (x === job.id ? null : x)), 2500);
  }

  return (
    <div className="min-h-dvh">
      <NHHeader onProfile={() => setProfileOpen(true)} />

      {/* Hero band */}
      <div className="relative" style={{ background: company.logo.bg }}>
        <div className="mx-auto max-w-3xl px-4 py-6">
          <button
            onClick={() => router.push("/neverhired")}
            className="mb-3 inline-flex items-center gap-1 text-sm font-semibold"
            style={{ color: company.logo.color }}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> all jobs
          </button>
          <CompanyLogo name={company.name} logo={company.logo} size="lg" />
          <p className="mt-2 max-w-xl text-sm" style={{ color: company.logo.color }}>
            {company.blurb}
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-4 pb-28">
        <div className="-mt-4 rounded-2xl border-2 border-border bg-card p-5 shadow-[0_4px_0_0_rgba(0,0,0,0.06)]">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <span className="inline-flex items-center gap-1 font-semibold">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
              {company.rating.toFixed(1)}
              <span className="font-normal text-muted-foreground">
                ({company.reviewCount.toLocaleString()} reviews)
              </span>
            </span>
            <span className="text-muted-foreground">{company.industry}</span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Users className="h-4 w-4" aria-hidden /> {company.size}
            </span>
          </div>
          <div className="mt-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Perks
            </p>
            <div className="flex flex-wrap gap-2">
              {company.perks.map((p) => (
                <span key={p} className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold">
                  <Sparkles className="h-3 w-3 text-primary" aria-hidden /> {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <h2 className="mt-6 font-display text-lg font-bold tracking-tight">Employee reviews</h2>
        <div className="mt-3 -mx-4 flex gap-3 overflow-x-auto px-4">
          {company.reviews.map((rev, i) => (
            <div key={i} className="min-w-[17rem] shrink-0 rounded-xl border-2 border-border bg-card p-4">
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: rev.stars }).map((_, s) => (
                  <Star key={s} className="h-3.5 w-3.5 fill-current" aria-hidden />
                ))}
                {Array.from({ length: 5 - rev.stars }).map((_, s) => (
                  <Star key={`e${s}`} className="h-3.5 w-3.5 text-muted-foreground/30" aria-hidden />
                ))}
              </div>
              <p className="mt-1 font-display text-sm font-bold">{rev.title}</p>
              <p className="text-xs text-muted-foreground">{rev.role}</p>
              <p className="mt-2 text-sm">
                <span className="font-semibold text-emerald-600">Pros:</span> {rev.pros}
              </p>
              <p className="mt-1 text-sm">
                <span className="font-semibold text-rose-500">Cons:</span> {rev.cons}
              </p>
            </div>
          ))}
        </div>

        {/* Open roles */}
        <h2 className="mt-7 font-display text-lg font-bold tracking-tight">Open roles</h2>
        <ul className="mt-3 space-y-3">
          {company.jobs.map((job) => (
            <li key={job.id}>
              <Card className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-display text-lg font-bold leading-tight">{job.title}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" aria-hidden /> {job.locationType} · {job.location}
                      </span>
                      <span>{job.level}</span>
                      <span>{job.applicants.toLocaleString()} applicants</span>
                    </div>
                    <p className="mt-1 font-semibold">
                      {job.salaryMin > 0 ? formatUsd(job.salaryMin) : "$0"} – {formatUsd(job.salaryMax)}
                    </p>
                  </div>
                  {job.easyApply ? <Badge variant="accent">Easy Apply</Badge> : null}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{job.summary}</p>

                <details className="mt-2 text-sm">
                  <summary className="cursor-pointer font-semibold text-primary">
                    Requirements (good luck)
                  </summary>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                    {job.requirements.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </details>

                <div className="mt-3 flex gap-2">
                  <Button className="flex-1" onClick={() => setOpenJob(job)}>
                    Tailor &amp; apply
                  </Button>
                  {job.easyApply ? (
                    <Button variant="outline" onClick={() => easyApply(job)}>
                      {justAdded === job.id ? (
                        <>
                          <Check className="h-4 w-4" aria-hidden /> Queued
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4" aria-hidden /> Easy Apply
                        </>
                      )}
                    </Button>
                  ) : null}
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </main>

      {queue.length > 0 ? (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-border bg-background/95 p-3 backdrop-blur">
          <div className="mx-auto max-w-3xl">
            <Button className="w-full" size="lg" onClick={() => router.push("/neverhired/queue")}>
              <FileStack className="h-5 w-5" aria-hidden />
              Review queue ({queue.length})
            </Button>
          </div>
        </div>
      ) : null}

      {openJob ? (
        <ApplicationBuilder company={company} job={openJob} onClose={() => setOpenJob(null)} />
      ) : null}
      {profileOpen ? <ProfileSheet onClose={() => setProfileOpen(false)} /> : null}
    </div>
  );
}
