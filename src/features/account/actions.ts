"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/src/infrastructure/supabase/server";
import { requireAuthenticatedSession } from "@/src/application/session/server";

export async function updateLocationConsentAction(consent: boolean): Promise<{ ok: boolean; message: string }> {
  const session = await requireAuthenticatedSession();
  const supabase = await createClient();
  const { error } = await supabase
    .from("user_settings")
    .update({ location_consent: consent, location_consent_at: consent ? new Date().toISOString() : null })
    .eq("user_id", session.user.id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/dashboard/settings");
  return { ok: true, message: consent ? "Location sharing enabled." : "Location sharing disabled." };
}
