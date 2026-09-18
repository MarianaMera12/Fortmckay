import { createClient } from "@/lib/supabase/client";
import type { Member, MemberInput } from "@/lib/types";

export const MEMBERS_PAGE_SIZE = 20;

export interface MembersQuery {
  search?: string;
  status?: "all" | Member["membership_status"];
  page?: number;
}

export async function listMembers({
  search = "",
  status = "all",
  page = 0,
}: MembersQuery): Promise<{ rows: Member[]; total: number }> {
  const supabase = createClient();
  let query = supabase
    .from("members")
    .select("*", { count: "exact" })
    .order("first_name", { ascending: true })
    .range(page * MEMBERS_PAGE_SIZE, page * MEMBERS_PAGE_SIZE + MEMBERS_PAGE_SIZE - 1);

  if (status !== "all") query = query.eq("membership_status", status);

  const term = search.trim();
  if (term) {
    const like = `%${term}%`;
    query = query.or(
      `first_name.ilike.${like},last_name.ilike.${like},member_id.ilike.${like},phone.ilike.${like}`
    );
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { rows: (data ?? []) as Member[], total: count ?? 0 };
}

export async function searchMembers(term: string, limit = 6): Promise<Member[]> {
  const trimmed = term.trim();
  if (!trimmed) return [];
  const supabase = createClient();
  const like = `%${trimmed}%`;
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .or(
      `first_name.ilike.${like},last_name.ilike.${like},member_id.ilike.${like},phone.ilike.${like}`
    )
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Member[];
}

function toRow(input: MemberInput) {
  const { date_of_birth: _dateOfBirth, ...rest } = input;

  return {
    ...rest,
    email: input.email || null,
    member_id: input.member_id || null,
    address: input.address || null,
    medical_info: input.medical_info || null,
    has_consent: Boolean(input.has_consent),
  };
}

export async function createMember(input: MemberInput): Promise<Member> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("members")
    .insert(toRow(input))
    .select()
    .single();
  if (error) throw error;
  return data as Member;
}

export async function updateMember(id: string, input: MemberInput): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("members").update(toRow(input)).eq("id", id);
  if (error) throw error;
}

/** Soft delete: keeps attendance history intact. */
export async function deactivateMember(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("members")
    .update({ membership_status: "inactive" })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteMember(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("members").delete().eq("id", id);
  if (error) throw error;
}
