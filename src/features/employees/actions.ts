"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireActiveCompany } from "@/src/application/session/server";
import { createClient } from "@/src/infrastructure/supabase/server";
import { createAdminClient } from "@/src/infrastructure/supabase/admin";

export type InviteEmployeeState = { status: "idle" | "error"; message: string };

const managerRoles = ["owner", "admin", "administrator", "manager"];
const roleKeyByEmploymentType: Record<string, string> = { employee: "employee", contractor: "contractor", temporary: "employee" };

export async function inviteEmployeeAction(_: InviteEmployeeState, formData: FormData): Promise<InviteEmployeeState> {
  const { session, companyId } = await requireActiveCompany();
  const isManager = session.activeCompany!.roles.some((role) => managerRoles.includes(role));
  if (!isManager) return { status: "error", message: "You do not have permission to invite employees." };

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const jobTitle = String(formData.get("jobTitle") ?? "").trim();
  const team = String(formData.get("team") ?? "").trim();
  const employmentType = String(formData.get("employmentType") ?? "employee");
  const startDate = String(formData.get("startDate") ?? "");

  if (!firstName || !lastName || !email || !jobTitle || !team || !startDate) {
    return { status: "error", message: "Fill in all required fields." };
  }

  const supabase = await createClient();
  const admin = createAdminClient();

  const [{ data: teamRow }, { data: roleRow }, { data: existingUser }] = await Promise.all([
    supabase.from("teams").select("id").eq("company_id", companyId).eq("name", team).maybeSingle(),
    supabase.from("roles").select("id").eq("key", roleKeyByEmploymentType[employmentType] ?? "employee").maybeSingle(),
    admin.from("users").select("id").eq("email", email).maybeSingle(),
  ]);
  if (!teamRow) return { status: "error", message: "Select a valid team." };
  if (!roleRow) return { status: "error", message: "Unable to resolve the employee role." };

  let userId = existingUser?.id as string | undefined;
  if (userId) {
    const { data: existingMembership } = await admin.from("company_memberships").select("id").eq("company_id", companyId).eq("user_id", userId).maybeSingle();
    if (existingMembership) return { status: "error", message: "This person is already part of your company." };
    await admin.from("users").update({ first_name: firstName, last_name: lastName, phone: phone || null }).eq("id", userId);
  } else {
    const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, { data: { full_name: `${firstName} ${lastName}` } });
    if (inviteError || !invited.user) return { status: "error", message: inviteError?.message ?? "Unable to send the invitation." };
    userId = invited.user.id;
    await admin.from("users").update({ first_name: firstName, last_name: lastName, phone: phone || null }).eq("id", userId);
  }

  const { data: membership, error: membershipError } = await admin
    .from("company_memberships")
    .insert({ company_id: companyId, user_id: userId, job_title: jobTitle, status: "invited" })
    .select("id")
    .single();
  if (membershipError || !membership) return { status: "error", message: membershipError?.message ?? "Unable to create the membership." };

  const { error: roleError } = await admin.from("membership_roles").insert({ membership_id: membership.id, role_id: roleRow.id });
  if (roleError) return { status: "error", message: roleError.message };

  const { error: recordError } = await admin.from("employee_records").insert({
    company_id: companyId, company_membership_id: membership.id, job_title: jobTitle,
    employment_type: employmentType, employment_status: "pending", start_date: startDate,
  });
  if (recordError) return { status: "error", message: recordError.message };

  // Team assignment is intentionally deferred: validate_team_operational_membership
  // (202607190006_team_management.sql) requires the membership to already be
  // 'active' before it can join a team, so an invited-but-not-yet-accepted
  // member can't be linked to teamRow.id yet. Wire this once an "accept
  // invitation" flow exists to flip the membership to active.

  revalidatePath("/dashboard/employees");
  redirect("/dashboard/employees");
}
