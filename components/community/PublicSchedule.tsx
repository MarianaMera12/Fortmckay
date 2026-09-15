"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ReserveModal } from "@/components/community/ReserveModal";
import { Button } from "@/components/ui/Button";
import { listWeekClasses } from "@/lib/queries/classes";
import type { ClassWithCount } from "@/lib/types";
import {
  DAY_NAMES,
  MONTHS,
  addDays,
  formatTime,
  startOfWeek,
  toISODate,
  weekLabel,
} from "@/lib/utils";

export function PublicSchedule() {
  const [offset, setOffset] = useState(0);
  const [classes, setClasses] = useState<ClassWithCount[]>([]);
  const [selected, setSelected] = useState<ClassWithCount | null>(null);

  const weekStart = useMemo(
    () => addDays(startOfWeek(new Date()), offset * 7),
    [offset]
  );

  const load = useCallback(() => {
    listWeekClasses(weekStart).then(setClasses).catch(() => setClasses([]));
  }, [weekStart]);

  useEffect(load, [load]);

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    const key = toISODate(date);
    return {
      key,
      label: DAY_NAMES[date.getDay()],
      dateLabel: `${MONTHS[date.getMonth()]} ${date.getDate()}`,
      items: classes.filter((c) => c.date === key),
    };
  });

  return (
    <>
      <div className="my-6 flex items-center gap-3.5">
        <Button variant="ghost" onClick={() => setOffset((o) => o - 1)} aria-label="Previous week">
          ‹
        </Button>
        <span className="text-[15.5px]">{weekLabel(weekStart)}</span>
        <Button variant="ghost" onClick={() => setOffset((o) => o + 1)} aria-label="Next week">
          ›
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {days.map((d) => (
          <section
            key={d.key}
            className="rounded-card border border-black/5 bg-white p-4"
          >
            <h2 className="flex items-baseline justify-between border-b border-black/5 pb-3">
              <span className="text-base text-gold">{d.label}</span>
              <span className="text-sm text-black/45">{d.dateLabel}</span>
            </h2>
            <ul className="mt-3.5 flex flex-col gap-3">
              {d.items.map((c) => {
                const full = c.reserved >= c.capacity;
                return (
                  <li key={c.id} className="rounded-xl border border-black/5 p-3.5">
                    <p className="text-base font-medium">{c.name}</p>
                    <p className="mt-0.5 text-[13.5px] text-black/50">
                      {formatTime(c.start_time)} – {formatTime(c.end_time)} · {c.instructor}
                    </p>
                    <div className="mt-3 flex items-center justify-between gap-2.5">
                      <span className={`text-[13px] ${full ? "text-danger" : "text-ok"}`}>
                        {full ? "Class full" : `${c.capacity - c.reserved} of ${c.capacity} left`}
                      </span>
                      <Button
                        variant="gold"
                        disabled={full}
                        onClick={() => setSelected(c)}
                      >
                        Reserve
                      </Button>
                    </div>
                  </li>
                );
              })}
              {d.items.length === 0 && (
                <li className="py-2 text-[13.5px] text-black/35">No classes scheduled.</li>
              )}
            </ul>
          </section>
        ))}
      </div>

      <ReserveModal
        gymClass={selected}
        onClose={() => setSelected(null)}
        onReserved={() => {
          setSelected(null);
          load();
        }}
      />
    </>
  );
}
