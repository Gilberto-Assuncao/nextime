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
    const appUrl = process.env.APP_URL ?? "http://localhost:3000";
    const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
      data: { full_name: `${firstName} ${lastName}` },
      // Admin-generated links (invite/magic-link/recovery) can't use PKCE —
      // that requires the same browser to both start and finish the flow,
      // which is impossible when the link is emailed to someone else's
      // browser. GoTrue instead delivers tokens in the URL fragment, which
      // only client-side JS can read, so this must NOT route through the
      // server-side /auth/callback (?code=) handler.
      redirectTo: `${appUrl}/accept-invite`,
    });
    if (inviteError || !invited.user) return { status: "error", message: inviteError?.message ?? "Unable to send the invitation." };
    userId = invited.user.id;
    await admin.from("users").update({ first_name: firstName, last_name: lastName, phone: phone || null }).eq("id", userId);
  }

  const { data: membership, error: membershipError } = await admin
    .from("company_memberships")
    .insert({ company_id: companyId, user_id: userId, job_title: jobTitle, status: "invited", pending_team_id: teamRow.id })
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

  // Team assignment happens once the invite is accepted (acceptInviteAction
  // below) — validate_team_operational_membership requires the membership to
  // already be 'active' before it can join a team, so it's stored on
  // pending_team_id above and applied later, not here.

  revalidatePath("/dashboard/employees");
  redirect("/dashboard/employees");
}

export type AcceptInviteState = { status: "idle" | "error" | "success"; message: string };

export async function acceptInviteAction(_: AcceptInviteState, formData: FormData): Promise<AcceptInviteState> {
  const password = String(formData.get("password") ?? "");
  const accessToken = String(formData.get("accessToken") ?? "");
  if (password.length < 8) return { status: "error", message: "Password must be at least 8 characters." };
  if (!accessToken) return { status: "error", message: "Your invite link has expired. Ask for a new one." };

  // Invite links deliver the session via a URL fragment (#access_token=...)
  // that only the browser can read, and @supabase/ssr's cookie sync doesn't
  // reliably pick up a session recovered that way (confirmed by testing: the
  // server kept seeing whoever was already logged in in that browser, not
  // the invitee — once nearly overwriting an admin's own password). The
  // client passes the token explicitly instead, verified here directly
  // against GoTrue rather than trusted from cookies.
  const admin = createAdminClient();
  const { data: tokenUser, error: tokenError } = await admin.auth.getUser(accessToken);
  if (tokenError || !tokenUser.user) return { status: "error", message: "Your invite link has expired. Ask for a new one." };
  const user = tokenUser.user;

  const { error: passwordError } = await admin.auth.admin.updateUserById(user.id, { password });
  if (passwordError) return { status: "error", message: passwordError.message };

  const { data: memberships, error: fetchError } = await admin
    .from("company_memberships")
    .select("id,company_id,pending_team_id")
    .eq("user_id", user.id)
    .eq("status", "invited");
  if (fetchError) return { status: "error", message: fetchError.message };

  for (const membership of memberships ?? []) {
    const { error: activateError } = await admin
      .from("company_memberships")
      .update({ status: "active", starts_at: new Date().toISOString(), pending_team_id: null })
      .eq("id", membership.id);
    if (activateError) return { status: "error", message: activateError.message };

    if (membership.pending_team_id) {
      await admin.from("team_memberships").insert({
        company_id: membership.company_id, team_id: membership.pending_team_id,
        company_membership_id: membership.id, team_role: "member",
      });
    }
  }

  return { status: "success", message: "Account activated." };
}
