import { createClient } from "@/lib/supabase/client";
import { WAIVER_VERSION } from "@/lib/waiver";
import type { Consent } from "@/lib/types";

export interface ConsentInput {
  member_id: string;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  address: string;
  medical_info: string;
}

export async function createConsent(input: ConsentInput): Promise<Consent> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("consents")
    .insert({
      member_id: input.member_id,
      full_name: input.full_name,
      email: input.email || null,
      phone: input.phone,
      date_of_birth: input.date_of_birth || null,
      address: input.address || null,
      medical_info: input.medical_info || null,
      waiver_version: WAIVER_VERSION,
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
    .select("*")
    .eq("member_id", memberId)
    .order("accepted_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return (data as Consent) ?? null;
}
