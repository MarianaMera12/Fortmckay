import { createClient } from "@/lib/supabase/client";
import type { AttendanceTimeframe, DashboardStats } from "@/lib/types";
import { addDays, startOfWeek } from "@/lib/utils";

export async function getDashboardStats(
  timeframe: AttendanceTimeframe = "Daily",
  selectedDate: Date = new Date()
): Promise<DashboardStats> {
  const supabase = createClient();
  const now = new Date();

  const dayStart = new Date(now);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = addDays(dayStart, 1);
  const weekStart = startOfWeek(now);
  const weekEnd = addDays(weekStart, 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const chartStart =
    timeframe === "Weekly"
      ? startOfWeek(selectedDate)
      : timeframe === "Monthly"
        ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
        : new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
  chartStart.setHours(0, 0, 0, 0);
  const chartEnd =
    timeframe === "Weekly"
      ? addDays(chartStart, 7)
      : timeframe === "Monthly"
        ? new Date(chartStart.getFullYear(), chartStart.getMonth() + 1, 1)
        : addDays(chartStart, 1);

  const [occupancy, today, week, month, chartAttendance, reservations] = await Promise.all([
    supabase
      .from("attendance")
      .select("id", { count: "exact", head: true })
      .is("check_out", null),
    supabase
      .from("attendance")
      .select("check_in")
      .gte("check_in", dayStart.toISOString())
      .lt("check_in", dayEnd.toISOString()),
    supabase
      .from("attendance")
      .select("check_in")
      .gte("check_in", weekStart.toISOString())
      .lt("check_in", weekEnd.toISOString()),
    supabase
      .from("attendance")
      .select("check_in")
      .gte("check_in", monthStart.toISOString())
      .lt("check_in", now.toISOString()),
    supabase
      .from("attendance")
      .select("check_in")
      .gte("check_in", chartStart.toISOString())
      .lt("check_in", chartEnd.toISOString()),
    supabase
      .from("reservations")
      .select("class_id, classes(name)")
      .eq("status", "confirmed")
      .gte("created_at", addDays(now, -30).toISOString()),
  ]);

  let chartData: { label: string; visits: number }[] = [];
  const chartRows = chartAttendance.data ?? [];

  if (timeframe === "Daily") {
    const buckets = new Map<number, number>();
    chartRows.forEach((row) => {
      const h = new Date(row.check_in as string).getHours();
      buckets.set(h, (buckets.get(h) ?? 0) + 1);
    });

    chartData = Array.from({ length: 17 }, (_, i) => i + 6).map((h) => ({
      label: `${h % 12 || 12} ${h >= 12 ? "PM" : "AM"}`,
      visits: buckets.get(h) ?? 0,
    }));
  } else if (timeframe === "Weekly") {
    const buckets = new Map<number, number>();
    chartRows.forEach((row) => {
      const d = new Date(row.check_in as string).getDay();
      buckets.set(d, (buckets.get(d) ?? 0) + 1);
    });

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const startDayIndex = chartStart.getDay();

    chartData = Array.from({ length: 7 }, (_, i) => {
      const dayIndex = (startDayIndex + i) % 7;
      return {
        label: days[dayIndex],
        visits: buckets.get(dayIndex) ?? 0,
      };
    });
  } else if (timeframe === "Monthly") {
    const buckets = new Map<number, number>();
    chartRows.forEach((row) => {
      const d = new Date(row.check_in as string).getDate();
      buckets.set(d, (buckets.get(d) ?? 0) + 1);
    });

    const daysInMonth = new Date(
      chartStart.getFullYear(),
      chartStart.getMonth() + 1,
      0
    ).getDate();

    chartData = Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => ({
      label: `${d}`,
      visits: buckets.get(d) ?? 0,
    }));
  }

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

  const visitsThisWeek = (week.data ?? []).length;

  return {
    occupancy: occupancy.count ?? 0,
    visitsToday: (today.data ?? []).length,
    visitsThisWeek,
    visitsThisMonth: (month.data ?? []).length,
    chartVisitCount: chartRows.length,
    chartData,
    topClasses,
  };
}