import "server-only";

import { createClient } from "@/src/infrastructure/supabase/server";
import { requireAuthenticatedSession } from "@/src/application/session/server";

export async function getLocationConsent(): Promise<boolean> {
  const session = await requireAuthenticatedSession();
  const supabase = await createClient();
  const { data } = await supabase.from("user_settings").select("location_consent").eq("user_id", session.user.id).maybeSingle();
  return data?.location_consent ?? false;
}
