"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getOccupancy } from "@/lib/queries/attendance";

/** Header with the live occupancy pill (Supabase Realtime on `attendance`). */
export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  const [occupancy, setOccupancy] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    const load = () => {
      getOccupancy()
        .then((n) => active && setOccupancy(n))
        .catch(() => active && setOccupancy(null));
    };
    load();

    const channel = createClient()
      .channel("occupancy")
      .on("postgres_changes", { event: "*", schema: "public", table: "attendance" }, load)
      .subscribe();

    return () => {
      active = false;
      channel.unsubscribe();
    };
  }, []);

  return (
    <header className="flex flex-wrap items-start gap-6 border-b border-black/5 bg-white px-8 py-6">
      <div className="min-w-[200px] flex-1">
        <h1 className="text-[25px] font-medium">{title}</h1>
        <p className="mt-1 max-w-sm text-[14.5px] text-black/50">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2.5 rounded-full bg-sidebar px-5 py-3 text-sm text-white">
        <span className="h-2 w-2 rounded-full bg-gold" aria-hidden />
        Live gym occupancy:
        <strong className="font-medium text-gold">
          {occupancy === null ? "—" : `${occupancy} inside`}
        </strong>
      </div>
    </header>
  );
}
