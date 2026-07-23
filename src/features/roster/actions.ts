"use server";

import { revalidatePath } from "next/cache";
import { requireActiveCompany } from "@/src/application/session/server";
import { createClient } from "@/src/infrastructure/supabase/server";
import type { RosterRoleKey } from "@/lib/types/roster";

export type RosterActionState = { status: "idle" | "success" | "error"; message: string };

const adminRoles = ["owner", "admin", "administrator"];
const ROSTER_ROLE_KEYS: RosterRoleKey[] = ["manager", "accountant", "hr", "finance"];

export async function toggleRosterRoleAction(
  membershipId: string,
  roleKey: RosterRoleKey,
  assign: boolean,
): Promise<RosterActionState> {
  const { session, companyId } = await requireActiveCompany();
  const isAdmin = session.activeCompany!.roles.some((role) => adminRoles.includes(role));
  if (!isAdmin) return { status: "error", message: "Only owners and administrators can manage the roster." };
  if (!ROSTER_ROLE_KEYS.includes(roleKey)) return { status: "error", message: "Unknown role." };

  const supabase = await createClient();

  const [{ data: membership }, { data: roleRow }] = await Promise.all([
    supabase.from("company_memberships").select("id").eq("id", membershipId).eq("company_id", companyId).maybeSingle(),
    supabase.from("roles").select("id").eq("key", roleKey).maybeSingle(),
  ]);
  if (!membership) return { status: "error", message: "Member not found in this company." };
  if (!roleRow) return { status: "error", message: "Unable to resolve the role." };

  if (assign) {
    const { error } = await supabase.from("membership_roles").insert({ membership_id: membershipId, role_id: roleRow.id });
    if (error && error.code !== "23505") {
      console.error("Roster role insert failed", { message: error.message, code: error.code, details: error.details, hint: error.hint });
      return { status: "error", message: "Unable to update this role." };
    }
  } else {
    const { error } = await supabase.from("membership_roles").delete().eq("membership_id", membershipId).eq("role_id", roleRow.id);
    if (error) return { status: "error", message: "Unable to update this role." };
  }

  revalidatePath("/dashboard/companies/roster");
  return { status: "success", message: "Updated." };
}
