import { createClient } from "@/lib/supabase/client";
import type { AttendanceWithMember } from "@/lib/types";

const WITH_MEMBER =
  "id, member_id, check_in, check_out, members(first_name, last_name, phone, member_id)";

export async function getOccupancy(): Promise<number> {
  const supabase = createClient();
  const { count, error } = await supabase
    .from("attendance")
    .select("id", { count: "exact", head: true })
    .is("check_out", null);
  if (error) throw error;
  return count ?? 0;
}

export async function listRecentActivity(limit = 10): Promise<AttendanceWithMember[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("attendance")
    .select(WITH_MEMBER)
    .order("check_in", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as unknown as AttendanceWithMember[];
}

/** Open (not checked out) attendance row ids keyed by member id. */
export async function getOpenSessions(memberIds: string[]): Promise<Record<string, string>> {
  if (memberIds.length === 0) return {};
  const supabase = createClient();
  const { data, error } = await supabase
    .from("attendance")
    .select("id, member_id")
    .is("check_out", null)
    .in("member_id", memberIds);
  if (error) throw error;
  const map: Record<string, string> = {};
  (data ?? []).forEach((row) => {
    map[row.member_id as string] = row.id as string;
  });
  return map;
}

export async function checkIn(memberId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("attendance")
    .insert({ member_id: memberId, check_in: new Date().toISOString() });
  if (error) throw error;
}

export async function checkOut(attendanceId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("attendance")
    .update({ check_out: new Date().toISOString() })
    .eq("id", attendanceId);
  if (error) throw error;
}
