"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireActiveCompany } from "@/src/application/session/server";
import { createClient } from "@/src/infrastructure/supabase/server";
import { validateTeamForm } from "./validation";
import type { TeamActionState, TeamRole } from "./types";

const managerRoles = ["owner", "admin", "administrator", "manager"];
async function context() {
  const result = await requireActiveCompany();
  return { ...result, allowed: result.session.activeCompany!.roles.some((role) => managerRoles.includes(role)) };
}
const denied = (): TeamActionState => ({ status: "error", message: "You do not have permission to manage teams." });

export async function createTeamAction(_: TeamActionState, formData: FormData): Promise<TeamActionState> {
  const ctx = await context();
  if (!ctx.allowed) return denied();
  const validation = validateTeamForm(formData);
  if (!validation.data) return validation.error ?? denied();
  const data = validation.data;
  const members = [...new Set([...data.memberIds, ...(data.leaderMembershipId ? [data.leaderMembershipId] : [])])];
  const supabase = await createClient();
  const { data: id, error } = await supabase.rpc("create_team", {
    company_id_input: ctx.companyId, name_input: data.name, description_input: data.description,
    leader_membership_id_input: data.leaderMembershipId || null, status_input: data.status,
    color_input: data.color || null, icon_input: data.icon || null, member_ids_input: members,
  });
  if (error || typeof id !== "string") return { status: "error", message: error?.message ?? "Team could not be created." };
  revalidatePath("/dashboard/teams");
  redirect(`/dashboard/teams/${id}`);
}

export async function updateTeamAction(teamId: string, _: TeamActionState, formData: FormData): Promise<TeamActionState> {
  const ctx = await context();
  if (!ctx.allowed) return denied();
  const validation = validateTeamForm(formData);
  if (!validation.data) return validation.error ?? denied();
  const data = validation.data;
  const supabase = await createClient();
  const { data: team } = await supabase.from("teams").select("id").eq("id", teamId).eq("company_id", ctx.companyId).maybeSingle();
  if (!team) return denied();
  const { error } = await supabase.rpc("update_team", {
    team_id_input: teamId, name_input: data.name, description_input: data.description,
    leader_membership_id_input: data.leaderMembershipId || null, status_input: data.status,
    color_input: data.color || null, icon_input: data.icon || null,
  });
  if (error) return { status: "error", message: error.message };
  revalidatePath(`/dashboard/teams/${teamId}`);
  revalidatePath("/dashboard/teams");
  return { status: "success", message: "Team updated." };
}

export async function addTeamMemberAction(teamId: string, membershipId: string, role: TeamRole) {
  const ctx = await context();
  if (!ctx.allowed || !["leader", "supervisor", "member"].includes(role)) return { ok: false, message: "Permission denied." };
  const supabase = await createClient();
  const [{ data: team }, { data: membership }, { data: existing }] = await Promise.all([
    supabase.from("teams").select("id,status").eq("id", teamId).eq("company_id", ctx.companyId).maybeSingle(),
    supabase.from("company_memberships").select("id").eq("id", membershipId).eq("company_id", ctx.companyId).eq("status", "active").maybeSingle(),
    supabase.from("team_memberships").select("id").eq("team_id", teamId).eq("company_membership_id", membershipId).is("left_at", null).maybeSingle(),
  ]);
  if (!team || team.status === "archived" || !membership || existing) return { ok: false, message: existing ? "Member already belongs to this team." : "Member cannot be added." };
  const { error } = await supabase.from("team_memberships").insert({ company_id: ctx.companyId, team_id: teamId, company_membership_id: membershipId, team_role: role });
  if (error) return { ok: false, message: error.message };
  revalidatePath(`/dashboard/teams/${teamId}`);
  return { ok: true, message: "Member added." };
}

export async function removeTeamMemberAction(teamId: string, linkId: string) {
  const ctx = await context();
  if (!ctx.allowed) return { ok: false, message: "Permission denied." };
  const supabase = await createClient();
  const { data: link } = await supabase.from("team_memberships").select("id,team_role").eq("id", linkId).eq("team_id", teamId).eq("company_id", ctx.companyId).is("left_at", null).maybeSingle();
  if (!link) return { ok: false, message: "Membership unavailable." };
  if (link.team_role === "leader") return { ok: false, message: "Assign or clear the team leader before removing this member." };
  const now = new Date().toISOString();
  const { error } = await supabase.from("team_memberships").update({ left_at: now, removed_at: now }).eq("id", linkId);
  if (error) return { ok: false, message: error.message };
  revalidatePath(`/dashboard/teams/${teamId}`);
  return { ok: true, message: "Member removed; history was preserved." };
}

export async function archiveTeamAction(teamId: string, archived: boolean) {
  const ctx = await context();
  if (!ctx.allowed) return { ok: false, message: "Permission denied." };
  const supabase = await createClient();
  const { error } = await supabase.from("teams").update({ status: archived ? "archived" : "active", archived_at: archived ? new Date().toISOString() : null }).eq("id", teamId).eq("company_id", ctx.companyId);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/dashboard/teams");
  revalidatePath(`/dashboard/teams/${teamId}`);
  return { ok: true, message: archived ? "Team archived; history was preserved." : "Team reactivated." };
}
