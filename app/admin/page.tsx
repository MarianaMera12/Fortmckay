"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { AttendanceChart } from "@/components/admin/AttendanceChart";
import { QuickCheckIn } from "@/components/admin/QuickCheckIn";
import { Card, CardTitle } from "@/components/ui/Card";
import { StatusChip } from "@/components/ui/StatusChip";
import { listRecentActivity } from "@/lib/queries/attendance";
import { listClassesForDate } from "@/lib/queries/classes";
import { getDashboardStats } from "@/lib/queries/stats";
import type { AttendanceWithMember, ClassWithCount, DashboardStats } from "@/lib/types";
import { formatTime, formatTimestamp } from "@/lib/utils";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<AttendanceWithMember[]>([]);
  const [todayClasses, setTodayClasses] = useState<ClassWithCount[]>([]);

  const load = useCallback(async () => {
    const [s, a, c] = await Promise.all([
      getDashboardStats(),
      listRecentActivity(8),
      listClassesForDate(new Date()),
    ]);
    setStats(s);
    setActivity(a);
    setTodayClasses(c);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const kpis = [
    { label: "Currently inside", value: stats?.occupancy, note: "live occupancy" },
    { label: "Visits today", value: stats?.visitsToday, note: "check-ins recorded" },
    { label: "Visits this week", value: stats?.visitsThisWeek, note: "since Monday" },
    { label: "Avg. daily visits", value: stats?.avgDailyVisits, note: "this week" },
  ];

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Here is today's gym overview." />

      <div className="flex flex-col gap-5 px-8 py-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((k) => (
            <Card key={k.label}>
              <p className="text-[13px] text-black/50">{k.label}</p>
              <p className="mt-1 text-3xl font-medium">{k.value ?? "—"}</p>
              <p className="text-[12.5px] text-black/35">{k.note}</p>
            </Card>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
          <Card>
            <CardTitle>Recent check-ins</CardTitle>
            <ul className="divide-y divide-black/5">
              {activity.map((row) => (
                <li key={row.id} className="flex items-center gap-3 py-3">
                  <span className="h-9 w-9 shrink-0 rounded-full bg-black/5" aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14.5px]">
                      {row.members
                        ? `${row.members.first_name} ${row.members.last_name}`
                        : "Member"}
                    </span>
                    <span className="block text-[12.5px] text-black/40">
                      {row.members?.member_id ?? ""}
                    </span>
                  </span>
                  <span className="text-sm text-black/60">
                    {formatTimestamp(row.check_in)}
                  </span>
                  <StatusChip inside={!row.check_out} />
                </li>
              ))}
              {activity.length === 0 && (
                <li className="py-8 text-center text-sm text-black/40">
                  No check-ins yet today.
                </li>
              )}
            </ul>
          </Card>

          <div className="flex flex-col gap-5">
            <Card>
              <CardTitle>Quick check-in</CardTitle>
              <QuickCheckIn onChanged={load} />
            </Card>

            <Card>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-medium">Today&apos;s classes</h2>
                <Link href="/admin/calendar" className="text-[13.5px] text-blue">
                  View schedule
                </Link>
              </div>
              <ul className="flex flex-col gap-3">
                {todayClasses.map((c, i) => (
                  <li
                    key={c.id}
                    className={`rounded-xl p-4 text-white ${i % 2 ? "bg-gold" : "bg-blue"}`}
                  >
                    <p className="text-[13.5px] opacity-90">
                      ◷ {formatTime(c.start_time)} · ◍ {c.instructor}
                    </p>
                    <p className="mt-1.5 flex justify-between text-base font-medium">
                      {c.name}
                      <span className="text-[13px] font-normal">
                        {c.reserved >= c.capacity
                          ? "Full"
                          : `${c.capacity - c.reserved} of ${c.capacity} left`}
                      </span>
                    </p>
                  </li>
                ))}
                {todayClasses.length === 0 && (
                  <li className="text-sm text-black/40">No classes scheduled today.</li>
                )}
              </ul>
            </Card>

            {stats && stats.topClasses.length > 0 && (
              <Card>
                <CardTitle>Most popular classes</CardTitle>
                <ol className="flex flex-col gap-2.5">
                  {stats.topClasses.map((c, i) => (
                    <li key={c.name} className="flex justify-between text-[14.5px]">
                      <span>
                        {i + 1}. {c.name}
                      </span>
                      <span className="text-black/45">{c.reservations} reservations</span>
                    </li>
                  ))}
                </ol>
              </Card>
            )}
          </div>
        </div>

        <Card>
          <CardTitle>Attendance activity — today</CardTitle>
          <AttendanceChart data={stats?.hourly ?? []} />
        </Card>
      </div>
    </>
  );
}
