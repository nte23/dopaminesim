"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Gauge, Send, Trash2 } from "lucide-react";
import { Button, Card } from "@dopaminesim/ui";
import { formatUsd, record } from "@dopaminesim/savings";
import { useNH } from "@/components/neverhired/provider";
import { NHHeader } from "@/components/neverhired/header";
import { ProfileSheet } from "@/components/neverhired/profile-sheet";

export default function QueuePage() {
  const router = useRouter();
  const { queue, removeFromQueue, clearQueue, setActive, bumpStats } = useNH();
  const [profileOpen, setProfileOpen] = React.useState(false);

  function submitAll() {
    const n = queue.length;
    if (!n) return;
    const focus = queue[0];
    bumpStats({ applied: n, ghostings: Math.max(0, n - 1) });
    record({
      app: "neverhired",
      label: `${n} application${n === 1 ? "" : "s"} fired into the void`,
      usd: 25 + n * 6,
      kcal: 0,
    });
    setActive({ app: focus, seed: Math.floor(Math.random() * 100000), createdAt: Date.now() });
    clearQueue();
    router.push("/neverhired/track");
  }

  if (queue.length === 0) {
    return (
      <div className="min-h-dvh">
        <NHHeader onProfile={() => setProfileOpen(true)} />
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <h1 className="font-display text-2xl font-bold">Your queue is empty</h1>
          <p className="mt-2 text-muted-foreground">Go fire some applications into the void.</p>
          <Link href="/neverhired" className="mt-5 inline-block">
            <Button size="lg">Browse jobs</Button>
          </Link>
        </div>
        {profileOpen ? <ProfileSheet onClose={() => setProfileOpen(false)} /> : null}
      </div>
    );
  }

  return (
    <div className="min-h-dvh">
      <NHHeader onProfile={() => setProfileOpen(true)} />
      <main className="mx-auto max-w-xl px-4 pb-28 pt-6">
        <button
          onClick={() => router.push("/neverhired")}
          className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden /> keep browsing
        </button>
        <h1 className="mt-3 font-display text-2xl font-bold">Application queue</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {queue.length} ready to fire. We&apos;ll follow one through the pipeline; the rest vanish
          instantly (realistic).
        </p>

        <div className="mt-4 space-y-3">
          {queue.map((a) => (
            <Card key={a.uid} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display font-bold leading-tight">{a.jobTitle}</p>
                  <p className="text-sm text-muted-foreground">{a.companyName}</p>
                </div>
                <button
                  onClick={() => removeFromQueue(a.uid)}
                  aria-label="Remove"
                  className="shrink-0 rounded-full p-1.5 text-muted-foreground hover:bg-muted"
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                <span className="inline-flex items-center gap-1 font-semibold">
                  <Gauge className="h-3.5 w-3.5 text-primary" aria-hidden /> ATS {a.atsScore}
                </span>
                <span className="text-muted-foreground">Asking {formatUsd(a.salaryAsk)}</span>
                {a.emphasizedSkills.length ? (
                  <span className="truncate text-muted-foreground">
                    {a.emphasizedSkills.slice(0, 4).join(" · ")}
                  </span>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-border bg-background/95 p-3 backdrop-blur">
        <div className="mx-auto max-w-xl">
          <Button className="w-full" size="lg" onClick={submitAll}>
            <Send className="h-5 w-5" aria-hidden />
            Submit {queue.length} application{queue.length === 1 ? "" : "s"}
          </Button>
        </div>
      </div>

      {profileOpen ? <ProfileSheet onClose={() => setProfileOpen(false)} /> : null}
    </div>
  );
}
