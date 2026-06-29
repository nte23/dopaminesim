"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Briefcase,
  Check,
  FileText,
  Gauge,
  Hourglass,
  MessageSquare,
  Send,
  Share2,
  Sparkles,
  Trophy,
} from "lucide-react";
import { Button } from "@dopaminesim/ui";
import { formatUsd, useSavings } from "@dopaminesim/savings";
import { INTERVIEW_QS } from "@/data/neverhired/interview";
import { GHOSTS, rollJourney, type Outcome } from "@/data/neverhired/outcomes";
import { pickRecruiter } from "@/data/neverhired/recruiters";
import { pickTakeHome } from "@/data/neverhired/takehome";
import { pickLowball } from "@/data/neverhired/negotiation";
import { rankFor } from "@/data/neverhired/ranks";
import { useNH, type TrackedApplication } from "./provider";

type Phase = "screening" | "takehome" | "interview" | "final" | "negotiation" | "outcome" | "ghosted";

const STEPS = ["Applied", "Screening", "Take-home", "Interview", "Decision"];
function stepIndex(phase: Phase): number {
  switch (phase) {
    case "screening":
      return 1;
    case "takehome":
      return 2;
    case "interview":
      return 3;
    case "final":
    case "negotiation":
      return 4;
    case "outcome":
      return 5;
    case "ghosted":
      return 1;
  }
}

export function PipelineFlow({ tracked }: { tracked: TrackedApplication }) {
  const fast = useSearchParams().get("fast");
  const speed = fast ? 12 : 1;
  const ms = (s: number) => (s * 1000) / speed;

  const seed = tracked.seed;
  const journey = React.useMemo(() => rollJourney(seed), [seed]);
  const recruiter = React.useMemo(() => pickRecruiter(seed), [seed]);
  const takehome = React.useMemo(() => pickTakeHome(seed), [seed]);

  const [phase, setPhase] = React.useState<Phase>("screening");
  const [messages, setMessages] = React.useState<string[]>([]);
  const reveal = (i: number) =>
    setMessages((m) => (m.includes(recruiter.lines[i]) ? m : [...m, recruiter.lines[i]]));

  // Auto-advance the early stages (applied -> received -> screening -> branch)
  React.useEffect(() => {
    const timers: number[] = [];
    const fire = (s: number, fn: () => void) => timers.push(window.setTimeout(fn, ms(s)));
    reveal(0);
    if (journey.reachesInterview) {
      fire(3.5, () => {
        reveal(1);
        setPhase("takehome");
      });
    } else {
      fire(5.5, () => setPhase("ghosted"));
    }
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function submitTakeHome() {
    reveal(2);
    setPhase("interview");
  }
  function finishInterview() {
    reveal(3);
    setPhase("final");
    window.setTimeout(
      () => setPhase(journey.outcome.kind === "offer" ? "negotiation" : "outcome"),
      ms(3),
    );
  }

  const ci = stepIndex(phase);
  const finalOutcome: Outcome =
    phase === "ghosted" ? GHOSTS[Math.abs(seed) % GHOSTS.length] : journey.outcome;

  if (phase === "outcome" || phase === "ghosted") {
    return <OutcomeView tracked={tracked} outcome={finalOutcome} reachedInterview={journey.reachesInterview} />;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-6">
      <div className="flex items-center gap-2">
        <Briefcase className="h-5 w-5 text-primary" aria-hidden />
        <div>
          <h1 className="font-display text-xl font-bold leading-tight">{tracked.app.jobTitle}</h1>
          <p className="text-sm text-muted-foreground">{tracked.app.companyName}</p>
        </div>
      </div>

      {/* Stepper */}
      <ol className="mt-5 flex items-center">
        {STEPS.map((s, i) => {
          const done = ci > i;
          const active = ci === i;
          return (
            <React.Fragment key={s}>
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
                <span className="text-[0.6rem] font-semibold text-muted-foreground">{s}</span>
              </li>
              {i < STEPS.length - 1 ? (
                <span className={`mx-1 mb-4 h-0.5 flex-1 rounded ${ci > i ? "bg-primary" : "bg-border"}`} />
              ) : null}
            </React.Fragment>
          );
        })}
      </ol>

      {/* Recruiter inbox */}
      {messages.length ? (
        <div className="mt-5 rounded-xl border-2 border-border bg-card p-4">
          <div className="mb-3 flex items-center gap-2">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full font-display text-sm font-bold text-white"
              style={{ background: recruiter.color }}
            >
              {recruiter.initials}
            </span>
            <div>
              <p className="text-sm font-bold leading-tight">{recruiter.name}</p>
              <p className="text-xs text-muted-foreground">
                {recruiter.title} · {tracked.app.companyName}
              </p>
            </div>
            <MessageSquare className="ml-auto h-4 w-4 text-muted-foreground" aria-hidden />
          </div>
          <div className="space-y-2">
            {messages.map((m, i) => (
              <p key={i} className="inline-block rounded-2xl rounded-tl-sm bg-muted px-3 py-1.5 text-sm">
                {m}
              </p>
            ))}
          </div>
        </div>
      ) : null}

      {/* Interactive panel */}
      <div className="mt-5">
        {phase === "screening" ? (
          <WaitingPanel
            title="Application under review"
            sub="A recruiter is definitely looking at it. Definitely."
          />
        ) : null}
        {phase === "takehome" ? <TakeHomePanel takehome={takehome} onSubmit={submitTakeHome} /> : null}
        {phase === "interview" ? <InterviewPanel onDone={finishInterview} /> : null}
        {phase === "final" ? (
          <WaitingPanel title="Final round complete" sub="The panel is 'aligning'. Decision coming 'shortly'." />
        ) : null}
        {phase === "negotiation" ? (
          <NegotiationPanel tracked={tracked} onAccept={() => setPhase("outcome")} />
        ) : null}
      </div>
    </div>
  );
}

function WaitingPanel({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border-2 border-dashed border-border bg-card p-5">
      <Hourglass className="h-6 w-6 animate-pulse text-primary" aria-hidden />
      <div>
        <p className="font-display font-bold">{title}</p>
        <p className="text-sm text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}

function TakeHomePanel({
  takehome,
  onSubmit,
}: {
  takehome: ReturnType<typeof pickTakeHome>;
  onSubmit: () => void;
}) {
  const [submitted, setSubmitted] = React.useState(false);
  return (
    <div className="rounded-xl border-2 border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" aria-hidden />
        <h2 className="font-display text-lg font-bold">Take-home assignment</h2>
      </div>
      <p className="mt-2 font-semibold">{takehome.title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{takehome.brief}</p>
      <p className="mt-2 text-xs font-semibold text-primary">{takehome.estimate}</p>
      <Button
        className="mt-4 w-full"
        size="lg"
        disabled={submitted}
        onClick={() => {
          setSubmitted(true);
          window.setTimeout(onSubmit, 700);
        }}
      >
        {submitted ? (
          <>
            <Check className="h-5 w-5" aria-hidden /> Submitted (unpaid)
          </>
        ) : (
          <>
            <Send className="h-5 w-5" aria-hidden /> Submit your free labor
          </>
        )}
      </Button>
    </div>
  );
}

function InterviewPanel({ onDone }: { onDone: () => void }) {
  const [idx, setIdx] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [picked, setPicked] = React.useState<number | null>(null);
  const q = INTERVIEW_QS[idx];

  function pick(i: number) {
    if (picked != null) return;
    setPicked(i);
    setScore((s) => s + q.options[i].score);
  }
  function next() {
    if (idx + 1 < INTERVIEW_QS.length) {
      setIdx(idx + 1);
      setPicked(null);
    } else {
      onDone();
    }
  }

  return (
    <div className="rounded-xl border-2 border-border bg-card p-5">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 font-display text-lg font-bold">
          <MessageSquare className="h-5 w-5 text-primary" aria-hidden /> Interview
        </h2>
        <span className="inline-flex items-center gap-1 text-sm font-semibold">
          <Gauge className="h-4 w-4 text-primary" aria-hidden /> {score}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        Question {idx + 1} of {INTERVIEW_QS.length}
      </p>
      <p className="mt-2 font-semibold">{q.prompt}</p>
      <div className="mt-3 space-y-2">
        {q.options.map((o, i) => {
          const chosen = picked === i;
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={picked != null}
              className={`block w-full rounded-lg border-2 px-3 py-2.5 text-left text-sm transition-colors ${
                chosen ? "border-primary bg-primary/10" : "border-border hover:bg-muted"
              } ${picked != null && !chosen ? "opacity-50" : ""}`}
            >
              {o.text}
            </button>
          );
        })}
      </div>
      {picked != null ? (
        <div className="mt-3">
          <p className="rounded-lg bg-muted px-3 py-2 text-sm italic text-muted-foreground">
            {q.options[picked].quip}
          </p>
          <Button className="mt-3 w-full" onClick={next}>
            {idx + 1 < INTERVIEW_QS.length ? "Next question" : "Finish interview"}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function NegotiationPanel({
  tracked,
  onAccept,
}: {
  tracked: TrackedApplication;
  onAccept: () => void;
}) {
  const [round, setRound] = React.useState(0);
  const [offer, setOffer] = React.useState(tracked.app.salaryAsk);
  const [replies, setReplies] = React.useState<string[]>([]);

  function counter() {
    const lb = pickLowball(tracked.seed + round + 1);
    setReplies((r) => [...r, lb.reply]);
    setOffer((o) => Math.max(0, o + lb.counterDelta));
    setRound((r) => r + 1);
  }

  return (
    <div className="rounded-xl border-2 border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <Trophy className="h-5 w-5 text-amber-500" aria-hidden />
        <h2 className="font-display text-lg font-bold">You got an offer. Now negotiate.</h2>
      </div>
      <div className="mt-3 flex items-center justify-between rounded-lg bg-muted px-3 py-2">
        <span className="text-sm text-muted-foreground">Current offer</span>
        <span className="font-display text-lg font-bold tabular-nums text-primary">
          {offer > 0 ? formatUsd(offer) : "exposure"}
        </span>
      </div>
      <div className="mt-3 space-y-2">
        {replies.map((r, i) => (
          <p key={i} className="rounded-lg bg-muted px-3 py-1.5 text-sm">
            {r}
          </p>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <Button variant="outline" className="flex-1" onClick={counter} disabled={round >= 2}>
          Counter higher
        </Button>
        <Button className="flex-1" onClick={onAccept}>
          Accept the absurd offer
        </Button>
      </div>
      {round >= 2 ? (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          They&apos;ve stopped budging. They always do.
        </p>
      ) : null}
    </div>
  );
}

function OutcomeView({
  tracked,
  outcome,
  reachedInterview,
}: {
  tracked: TrackedApplication;
  outcome: Outcome;
  reachedInterview: boolean;
}) {
  const router = useRouter();
  const { setActive, bumpStats, stats, profile } = useNH();
  const { usd } = useSavings();
  const recorded = React.useRef(false);

  React.useEffect(() => {
    if (recorded.current) return;
    recorded.current = true;
    if (outcome.kind === "offer") bumpStats({ offers: 1, interviews: 1 });
    else if (outcome.kind === "reject") bumpStats({ rejections: 1, interviews: reachedInterview ? 1 : 0 });
    else bumpStats({ ghostings: 1 });
  }, [outcome, reachedInterview, bumpStats]);

  const rank = rankFor(stats.applied);
  const Icon = outcome.icon;
  const name = profile?.name ?? "Applicant";

  function applyMore() {
    setActive(null);
    router.push("/neverhired");
  }

  return (
    <div className="mx-auto max-w-md px-4 pb-16 pt-8 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="h-10 w-10" aria-hidden />
      </div>
      <h1 className="mt-4 font-display text-2xl font-bold">{outcome.title}</h1>
      <p className="mt-2 text-muted-foreground">{outcome.body}</p>

      {/* Letter */}
      <div className="mt-6 rounded-xl border-2 border-border bg-card p-5 text-left">
        <p className="text-sm">Dear {name},</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {outcome.kind === "offer"
            ? `We are thrilled to extend an offer for ${tracked.app.jobTitle} at ${tracked.app.companyName}. ${outcome.body}`
            : outcome.kind === "reject"
              ? `Thank you for applying to ${tracked.app.jobTitle} at ${tracked.app.companyName}. After careful consideration, ${outcome.title.toLowerCase()} We'll keep your résumé on file (we will not).`
              : `[This space intentionally left blank. ${tracked.app.companyName} has not replied and never will.]`}
        </p>
        <p className="mt-3 text-sm">
          {outcome.kind === "ghost" ? "—" : "Sincerely,"}
          <br />
          <span className="font-semibold">{tracked.app.companyName} Talent Team</span>
        </p>
      </div>

      {/* Rank */}
      <div className="mt-5 rounded-xl border-2 border-border bg-card p-4 text-left">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" aria-hidden />
          <p className="font-display font-bold">Rank: {rank.current.name}</p>
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">{rank.current.blurb}</p>
        {rank.next ? (
          <>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.round(rank.progress * 100)}%` }} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {rank.next.min - stats.applied} more application{rank.next.min - stats.applied === 1 ? "" : "s"} to reach{" "}
              <span className="font-semibold text-foreground">{rank.next.name}</span>
            </p>
          </>
        ) : null}
      </div>

      <ShareCard stats={{ applied: stats.applied, ghostings: stats.ghostings, rejections: stats.rejections }} usd={usd} rank={rank.current.name} />

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button size="lg" onClick={applyMore}>
          <Briefcase className="h-5 w-5" aria-hidden /> Apply to more nothing
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

function ShareCard({
  stats,
  usd,
  rank,
}: {
  stats: { applied: number; ghostings: number; rejections: number };
  usd: number;
  rank: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const text = `I've fired ${stats.applied} applications into the void, dodged ${stats.rejections} rejections and survived ${stats.ghostings} ghostings on dopaminesim. Rank: ${rank}.`;

  async function share() {
    const url = typeof window !== "undefined" ? window.location.origin + "/neverhired" : "";
    try {
      if (typeof navigator !== "undefined" && "share" in navigator) {
        await (navigator as Navigator).share({ title: "NeverHired", text, url });
        return;
      }
    } catch {
      /* cancelled */
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
        <p className="text-xs font-semibold uppercase tracking-wide opacity-90">dopaminesim · NeverHired</p>
        <div className="mt-2 flex items-end gap-4">
          <div>
            <p className="font-display text-3xl font-bold leading-none">{stats.applied}</p>
            <p className="text-xs opacity-90">apps into the void</p>
          </div>
          <div>
            <p className="font-display text-3xl font-bold leading-none">{stats.ghostings}</p>
            <p className="text-xs opacity-90">ghostings survived</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span>Dignity preserved: 100%</span>
          <span className="rounded-full bg-white/20 px-2 py-0.5 font-semibold">{rank}</span>
        </div>
      </div>
      <Button variant="outline" className="mt-3 w-full" onClick={share}>
        <Share2 className="h-4 w-4" aria-hidden />
        {copied ? "Copied to clipboard!" : "Share your unemployment"}
      </Button>
    </div>
  );
}
