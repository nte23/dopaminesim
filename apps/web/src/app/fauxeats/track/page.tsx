"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFaux } from "@/components/fauxeats/provider";
import { DeliveryFlow } from "@/components/fauxeats/delivery-flow";

export default function TrackPage() {
  const { activeOrder, ready } = useFaux();
  const router = useRouter();

  React.useEffect(() => {
    if (ready && !activeOrder) router.replace("/fauxeats");
  }, [ready, activeOrder, router]);

  if (!activeOrder) {
    return (
      <div className="px-4 py-20 text-center">
        <p className="text-muted-foreground">No active order.</p>
        <Link href="/fauxeats" className="mt-3 inline-block font-semibold text-primary">
          Back to FauxEats
        </Link>
      </div>
    );
  }

  return <DeliveryFlow order={activeOrder} />;
}
