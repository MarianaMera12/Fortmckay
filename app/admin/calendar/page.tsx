"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { ClassFormModal } from "@/components/admin/ClassFormModal";
import { ReservationsModal } from "@/components/admin/ReservationsModal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { deleteClass, listWeekClasses } from "@/lib/queries/classes";
import type { ClassWithCount } from "@/lib/types";
import {
  DAY_NAMES,
  addDays,
  formatTime,
  startOfWeek,
  toISODate,
  weekLabel,
} from "@/lib/utils";

export default function CalendarPage() {
  const [offset, setOffset] = useState(0);
  const [classes, setClasses] = useState<ClassWithCount[]>([]);
  const [editing, setEditing] = useState<ClassWithCount | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [viewing, setViewing] = useState<ClassWithCount | null>(null);

  const weekStart = useMemo(
    () => addDays(startOfWeek(new Date()), offset * 7),
    [offset]
  );

  const load = useCallback(() => {
    listWeekClasses(weekStart).then(setClasses).catch(() => setClasses([]));
  }, [weekStart]);

  useEffect(load, [load]);

  async function remove(c: ClassWithCount) {
    if (!confirm(`Delete "${c.name}"? Its reservations will be removed too.`)) return;
    await deleteClass(c.id);
    load();
  }

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    const key = toISODate(date);
    return {
      key,
      label: DAY_NAMES[date.getDay()],
      num: date.getDate(),
      items: classes.filter((c) => c.date === key),
    };
  });

  return (
    <>
      <PageHeader title="Classes calendar" subtitle="Here is the weekly classes overview." />

      <div className="flex flex-col gap-5 px-8 py-6">
        <div className="flex flex-wrap items-center gap-3.5">
          <Button variant="ghost" onClick={() => setOffset((o) => o - 1)}>
            ‹
          </Button>
          <span className="text-[15.5px]">{weekLabel(weekStart)}</span>
          <Button variant="ghost" onClick={() => setOffset((o) => o + 1)}>
            ›
          </Button>
          <Button
            variant="gold"
            className="ml-auto"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            ＋ Add class
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {days.map((d) => (
            <div
              key={d.key}
              className="min-h-[200px] rounded-card border border-black/5 bg-white p-3.5"
            >
              <p className="border-b border-black/5 pb-2.5 text-center">
                <span className="block text-[14.5px] text-gold">{d.label}</span>
                <span className="block text-sm text-black/45">{d.num}</span>
              </p>
              <ul className="mt-3 flex flex-col gap-2.5">
                {d.items.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() => setViewing(c)}
                      className="w-full break-words rounded-xl bg-ink p-3 text-left text-white"
                    >
                      <span className="block text-[11px] text-white/60">
                        {formatTime(c.start_time)} – {formatTime(c.end_time)}
                      </span>
                      <span className="block text-[13.5px]">{c.name}</span>
                      <span className="block text-[11px] text-white/45">
                        {c.instructor}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Card>
          <table className="w-full text-left text-[14.5px]">
            <thead>
              <tr className="text-[13px] tracking-widest text-black/45">
                <th className="pb-2.5 font-normal">CLASS</th>
                <th className="pb-2.5 font-normal">DAY</th>
                <th className="pb-2.5 font-normal">TIME</th>
                <th className="pb-2.5 font-normal">INSTRUCTOR</th>
                <th className="pb-2.5 font-normal">RESERVED</th>
                <th className="pb-2.5 text-right font-normal">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((c) => {
                const full = c.reserved >= c.capacity;
                return (
                  <tr key={c.id} className="border-t border-black/5">
                    <td className="py-3.5">{c.name}</td>
                    <td className="py-3.5">
                      {DAY_NAMES[new Date(`${c.date}T12:00:00`).getDay()]}
                    </td>
                    <td className="py-3.5">
                      {formatTime(c.start_time)} – {formatTime(c.end_time)}
                    </td>
                    <td className="py-3.5">{c.instructor}</td>
                    <td className={`py-3.5 ${full ? "text-danger" : "text-ok"}`}>
                      {c.reserved} / {c.capacity}
                    </td>
                    <td className="py-3.5 text-right">
                      <span className="inline-flex gap-4">
                        <button onClick={() => setViewing(c)} title="Reservations">
                          ◉
                        </button>
                        <button
                          onClick={() => {
                            setEditing(c);
                            setFormOpen(true);
                          }}
                          title="Edit"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => void remove(c)}
                          title="Delete"
                          className="text-danger"
                        >
                          ✕
                        </button>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {classes.length === 0 && (
            <p className="py-10 text-center text-[14.5px] text-black/40">
              No classes this week yet.
            </p>
          )}
        </Card>
      </div>

      <ClassFormModal
        open={formOpen}
        gymClass={editing}
        defaultDate={toISODate(weekStart)}
        onClose={() => setFormOpen(false)}
        onSaved={() => {
          setFormOpen(false);
          load();
        }}
      />
      <ReservationsModal gymClass={viewing} onClose={() => setViewing(null)} />
    </>
  );
}
