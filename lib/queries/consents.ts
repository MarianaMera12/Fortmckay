import { createClient } from "@/lib/supabase/client";
import type { Consent, Member } from "@/lib/types";

export interface ConsentInput {
  member_id: string;
}

export async function createConsent(input: ConsentInput): Promise<Consent> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("consents")
    .insert({
      member_id: input.member_id,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Consent;
}

/** Latest accepted consent on file for a member, if any. */
export async function getConsentByMemberId(memberId: string): Promise<Consent | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("consents")
    .select(
      "id, member_id, accepted_at, members:member_id(id, first_name, last_name, phone, email, member_id, date_of_birth, address, medical_info, membership_status, has_consent)"
    )
    .eq("member_id", memberId)
    .order("accepted_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  if (!data) return null;

  return {
    id: data.id,
    member_id: data.member_id,
    accepted_at: data.accepted_at,
    members: (data.members as Member | null) ?? null,
  };
}
