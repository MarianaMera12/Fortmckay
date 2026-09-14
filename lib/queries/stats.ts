import { createClient } from "@/lib/supabase/client";
import type { DashboardStats } from "@/lib/types";
import { addDays, startOfWeek } from "@/lib/utils";

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createClient();
  const now = new Date();
  const dayStart = new Date(now);
  dayStart.setHours(0, 0, 0, 0);
  const weekStart = startOfWeek(now);

  const [occupancy, today, week, reservations] = await Promise.all([
    supabase
      .from("attendance")
      .select("id", { count: "exact", head: true })
      .is("check_out", null),
    supabase
      .from("attendance")
      .select("check_in")
      .gte("check_in", dayStart.toISOString()),
    supabase
      .from("attendance")
      .select("id", { count: "exact", head: true })
      .gte("check_in", weekStart.toISOString()),
    supabase
      .from("reservations")
      .select("class_id, classes(name)")
      .eq("status", "confirmed")
      .gte("created_at", addDays(now, -30).toISOString()),
  ]);

  const todayRows = today.data ?? [];
  const buckets = new Map<number, number>();
  todayRows.forEach((row) => {
    const h = new Date(row.check_in as string).getHours();
    buckets.set(h, (buckets.get(h) ?? 0) + 1);
  });

  const hourly = Array.from({ length: 17 }, (_, i) => i + 6).map((h) => ({
    hour: `${h % 12 || 12} ${h >= 12 ? "PM" : "AM"}`,
    visits: buckets.get(h) ?? 0,
  }));

  const tally = new Map<string, number>();
  ((reservations.data ?? []) as unknown as { classes: { name: string } | null }[]).forEach(
    (row) => {
      const name = row.classes?.name;
      if (name) tally.set(name, (tally.get(name) ?? 0) + 1);
    }
  );
  const topClasses = Array.from(tally, ([name, count]) => ({ name, reservations: count }))
    .sort((a, b) => b.reservations - a.reservations)
    .slice(0, 3);

  const visitsThisWeek = week.count ?? 0;
  const daysElapsed = Math.max(1, Math.round((now.getTime() - weekStart.getTime()) / 86_400_000) + 1);

  return {
    occupancy: occupancy.count ?? 0,
    visitsToday: todayRows.length,
    visitsThisWeek,
    avgDailyVisits: Math.round(visitsThisWeek / daysElapsed),
    hourly,
    topClasses,
  };
}
