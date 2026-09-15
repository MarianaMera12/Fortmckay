import { createClient } from "@/lib/supabase/client";
import type { ClassInput, ClassWithCount, Reservation } from "@/lib/types";
import { addDays, toISODate } from "@/lib/utils";

interface RawClass {
  id: string;
  name: string;
  instructor: string;
  date: string;
  start_time: string;
  end_time: string;
  capacity: number;
  created_at: string;
  reservations: { status: "confirmed" | "cancelled" }[];
}

function withCount(row: RawClass): ClassWithCount {
  const { reservations, ...rest } = row;
  const reserved = reservations?.filter((reservation) => reservation.status === "confirmed").length ?? 0;
  return { ...rest, reserved };
}

/** All classes for the week starting at `weekStart` (Monday), with reservation counts. */
export async function listWeekClasses(weekStart: Date): Promise<ClassWithCount[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("classes")
    .select("*, reservations(status)")
    .gte("date", toISODate(weekStart))
    .lte("date", toISODate(addDays(weekStart, 6)))
    .order("date", { ascending: true })
    .order("start_time", { ascending: true });
  if (error) throw error;
  return ((data ?? []) as unknown as RawClass[]).map(withCount);
}

export async function listClassesForDate(date: Date): Promise<ClassWithCount[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("classes")
    .select("*, reservations(status)")
    .eq("date", toISODate(date))
    .order("start_time", { ascending: true });
  if (error) throw error;
  return ((data ?? []) as unknown as RawClass[]).map(withCount);
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
