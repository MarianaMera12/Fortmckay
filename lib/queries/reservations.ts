import { createClient } from "@/lib/supabase/client";
import type { ReservationInput } from "@/lib/types";

export class ClassFullError extends Error {
  constructor() {
    super("This class has reached maximum capacity.");
    this.name = "ClassFullError";
  }
}

/**
 * Public reservation. Capacity is enforced by the `reserve_class` Postgres
 * function (see supabase/schema.sql) so two simultaneous requests can never
 * overbook the class.
 */
export async function reserveClass(
  classId: string,
  input: ReservationInput
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.rpc("reserve_class", {
    p_class_id: classId,
    p_name: input.name,
    p_phone: input.phone,
    p_email: input.email,
  });
  if (error) {
    if (error.message.includes("CLASS_FULL")) throw new ClassFullError();
    throw error;
  }
}
