"use client";

import * as React from "react";
import { Check, Gauge, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@dopaminesim/ui";
import { formatUsd } from "@dopaminesim/savings";
import type { Company, Job } from "@/lib/neverhired/types";
import { type DraftApplication, atsScore, defaultSalaryAsk, makeUid } from "@/lib/neverhired/application";
import { SKILL_BANK, generateBuzzLine } from "@/data/neverhired/buzzwords";
import { useNH } from "./provider";
import { Sheet } from "@/components/fauxeats/sheet";

export function ApplicationBuilder({
  company,
  job,
  onClose,
  onAdded,
}: {
  company: Company;
  job: Job;
  onClose: () => void;
  onAdded?: () => void;
}) {
  const { addToQueue, profile } = useNH();
  const skillChoices = React.useMemo(
    () => Array.from(new Set([...job.skills, ...SKILL_BANK])).slice(0, 14),
    [job.skills],
  );
  const [skills, setSkills] = React.useState<string[]>(job.skills.slice(0, 3));
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [salaryAsk, setSalaryAsk] = React.useState(defaultSalaryAsk(job));
  const [cover, setCover] = React.useState("");
  const [pulls, setPulls] = React.useState(0);

  const score = atsScore(skills.length, cover.length, pulls);
  const salaryChips = Array.from(
    new Set([job.salaryMin, Math.round((job.salaryMin + job.salaryMax) / 2), job.salaryMax, profile?.dreamSalary ?? 0]),
  ).filter((s) => s > 0);

  function toggleSkill(s: string) {
    setSkills((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }
  function generate() {
    setPulls((p) => p + 1);
    setCover((c) => (c ? `${c} ${generateBuzzLine(c.length + pulls)}` : generateBuzzLine(pulls + 1)));
  }
  function submit() {
    const app: DraftApplication = {
      uid: makeUid(),
      companyId: company.id,
      jobId: job.id,
      jobTitle: job.title,
      companyName: company.name,
      emphasizedSkills: skills,
      answers,
      salaryAsk,
      coverLetter: cover,
      atsScore: score,
    };
    addToQueue(app);
    onAdded?.();
    onClose();
  }

  return (
    <Sheet
      onClose={onClose}
      title={
        <div className="min-w-0">
          <h2 className="truncate font-display text-lg font-bold leading-tight">{job.title}</h2>
          <p className="truncate text-xs text-muted-foreground">
            {company.name} · {job.location}
          </p>
        </div>
      }
      footer={
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm">
            <Gauge className="h-4 w-4 text-primary" aria-hidden />
            <span className="font-semibold tabular-nums">ATS {score}</span>
          </div>
          <Button className="flex-1" size="lg" onClick={submit}>
            Add to queue
          </Button>
        </div>
      }
    >
      <div className="space-y-6 p-4">
        {/* ATS score meter */}
        <div>
          <div className="mb-1 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <span>Applicant-tracking-system score</span>
            <span className="tabular-nums">{score}/99</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${score}%` }} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            A meaningless number that nonetheless feels great when it goes up.
          </p>
        </div>

        {/* Skills */}
        <div>
          <h3 className="mb-2 font-display text-base font-bold">Emphasize your skills</h3>
          <div className="flex flex-wrap gap-2">
            {skillChoices.map((s) => {
              const on = skills.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSkill(s)}
                  className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-sm font-medium transition-colors ${
                    on ? "border-primary bg-primary/10" : "border-border hover:bg-muted"
                  }`}
                >
                  {on ? <Check className="h-3.5 w-3.5" aria-hidden /> : null}
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cover letter + buzz generator */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-display text-base font-bold">Cover letter</h3>
            <button
              type="button"
              onClick={generate}
              className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-secondary-foreground"
            >
              <Wand2 className="h-3.5 w-3.5" aria-hidden /> Generate buzzwords
            </button>
          </div>
          <textarea
            value={cover}
            onChange={(e) => setCover(e.target.value)}
            rows={4}
            placeholder="Dear Hiring Manager, I am a results-driven…"
            className="w-full resize-none rounded-lg border-2 border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3" aria-hidden /> Pulled the lever {pulls}×
          </p>
        </div>

        {/* Screening questions */}
        {job.screening.length ? (
          <div className="space-y-5">
            <h3 className="font-display text-base font-bold">Screening questions</h3>
            {job.screening.map((q) => (
              <div key={q.id}>
                <p className="mb-2 text-sm font-semibold">
                  {q.prompt}
                  {q.required ? <span className="ml-1 text-xs text-primary">required</span> : null}
                </p>
                {q.type === "single" ? (
                  <div className="flex flex-wrap gap-2">
                    {q.options.map((o) => {
                      const on = answers[q.id] === o.id;
                      return (
                        <button
                          key={o.id}
                          type="button"
                          onClick={() => setAnswers((a) => ({ ...a, [q.id]: o.id }))}
                          className={`rounded-full border-2 px-3 py-1.5 text-sm font-medium transition-colors ${
                            on ? "border-primary bg-primary/10" : "border-border hover:bg-muted"
                          }`}
                        >
                          {o.name}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <input
                    value={answers[q.id] ?? ""}
                    onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                    placeholder={q.placeholder}
                    className="w-full rounded-lg border-2 border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                )}
              </div>
            ))}
          </div>
        ) : null}

        {/* Salary expectation */}
        <div>
          <h3 className="mb-2 font-display text-base font-bold">Salary expectation</h3>
          <div className="flex flex-wrap gap-2">
            {salaryChips.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSalaryAsk(s)}
                className={`rounded-full border-2 px-3 py-1.5 text-sm font-semibold transition-colors ${
                  salaryAsk === s ? "border-primary bg-primary/10" : "border-border hover:bg-muted"
                }`}
              >
                {formatUsd(s)}
              </button>
            ))}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            They will lowball this regardless. Dream big anyway.
          </p>
        </div>
      </div>
    </Sheet>
  );
}
