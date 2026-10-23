import { createClient } from "@/lib/supabase/client";
import type { ClassInput, ClassWithCount, GymClass, Reservation } from "@/lib/types";
import { addDays, toISODate } from "@/lib/utils";

/**
 * Confirmed-reservation counts come from the `class_availability` view, not
 * from embedding `reservations`: RLS hides that table from public visitors,
 * so an embedded count is always 0 for them. The view exposes only the
 * aggregate, never personal data, and is readable by anon and staff alike.
 */
async function withCounts(rows: GymClass[]): Promise<ClassWithCount[]> {
  if (rows.length === 0) return [];
  const supabase = createClient();
  const { data, error } = await supabase
    .from("class_availability")
    .select("class_id, reserved")
    .in(
      "class_id",
      rows.map((r) => r.id)
    );
  if (error) throw error;
  const reservedById = new Map(
    ((data ?? []) as { class_id: string; reserved: number }[]).map((r) => [
      r.class_id,
      Number(r.reserved),
    ])
  );
  return rows.map((row) => ({ ...row, reserved: reservedById.get(row.id) ?? 0 }));
}

/** All classes for the week starting at `weekStart` (Monday), with reservation counts. */
export async function listWeekClasses(weekStart: Date): Promise<ClassWithCount[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .gte("date", toISODate(weekStart))
    .lte("date", toISODate(addDays(weekStart, 6)))
    .order("date", { ascending: true })
    .order("start_time", { ascending: true });
  if (error) throw error;
  return withCounts((data ?? []) as GymClass[]);
}

export async function listClassesForDate(date: Date): Promise<ClassWithCount[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .eq("date", toISODate(date))
    .order("start_time", { ascending: true });
  if (error) throw error;
  return withCounts((data ?? []) as GymClass[]);
}

export async function createClass(input: ClassInput): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("classes").insert(input);
  if (error) throw error;
}

export async function updateClass(id: string, input: ClassInput): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("classes").update(input).eq("id", id);
  if (error) throw error;
}

export async function deleteClass(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("classes").delete().eq("id", id);
  if (error) throw error;
}

export async function listReservations(classId: string): Promise<Reservation[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("class_id", classId)
    .eq("status", "confirmed")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Reservation[];
}
