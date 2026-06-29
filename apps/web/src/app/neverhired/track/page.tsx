"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useNH } from "@/components/neverhired/provider";
import { PipelineFlow } from "@/components/neverhired/pipeline-flow";

export default function TrackPage() {
  const { active, ready } = useNH();
  const router = useRouter();

  React.useEffect(() => {
    if (ready && !active) router.replace("/neverhired");
  }, [ready, active, router]);

  if (!active) {
    return (
      <div className="px-4 py-20 text-center">
        <p className="text-muted-foreground">No active application.</p>
        <Link href="/neverhired" className="mt-3 inline-block font-semibold text-primary">
          Back to NeverHired
        </Link>
      </div>
    );
  }

  return <PipelineFlow tracked={active} />;
}
