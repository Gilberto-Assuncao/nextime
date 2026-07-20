import "server-only";

import { createClient } from "@/src/infrastructure/supabase/server";
import { requireActiveCompany } from "@/src/application/session/server";
import type { AvailableMember, TeamDetails, TeamMember, TeamPermission, TeamSummary, TeamStatus } from "./types";

type UserJoin = { id: string; name: string; email: string } | { id: string; name: string; email: string }[] | null;
type MembershipJoin = { id: string; job_title: string | null; users: UserJoin } | { id: string; job_title: string | null; users: UserJoin }[] | null;
interface TeamRow {
  id: string; company_id: string; name: string; description: string | null; status: TeamStatus;
  color: string | null; icon: string | null; leader_membership_id: string | null;
  created_at: string; updated_at: string; leader: MembershipJoin;
  team_memberships: { id: string; left_at: string | null }[] | null;
}

function first<T>(value: T | T[] | null): T | null { return Array.isArray(value) ? value[0] ?? null : value; }
function permissions(roles: string[]): TeamPermission[] {
  return roles.some((role) => ["owner", "admin", "administrator", "manager"].includes(role)) ? ["view", "manage", "archive"] : ["view"];
}

export async function getTeamWorkspace() {
  const { session, companyId } = await requireActiveCompany();
  const current = session.activeCompany!;
  const supabase = await createClient();
  const [{ data: teams, error }, { data: members }] = await Promise.all([
    supabase.from("teams").select("id,company_id,name,description,status,color,icon,leader_membership_id,created_at,updated_at,leader:company_memberships!teams_leader_membership_id_fkey(id,job_title,users(id,name,email)),team_memberships(id,left_at)").eq("company_id", companyId).order("updated_at", { ascending: false }),
    supabase.from("company_memberships").select("id,job_title,users(id,name,email)").eq("company_id", companyId).eq("status", "active"),
  ]);
  if (error) throw new Error("Unable to load teams.");

  const availableMembers: AvailableMember[] = ((members ?? []) as { id: string; job_title: string | null; users: UserJoin }[]).flatMap((row) => {
    const user = first(row.users);
    return user ? [{ membershipId: row.id, name: user.name, email: user.email, jobTitle: row.job_title ?? "Member" }] : [];
  });
  const summaries: TeamSummary[] = ((teams ?? []) as TeamRow[]).map((row) => {
    const leaderMembership = first(row.leader);
    const leader = leaderMembership ? first(leaderMembership.users) : null;
    return {
      id: row.id, name: row.name, description: row.description ?? "", status: row.status,
      color: row.color ?? "#22C55E", icon: row.icon ?? "team", leaderName: leader?.name ?? null,
      memberCount: row.team_memberships?.filter((link) => link.left_at === null).length ?? 0,
      updatedAt: row.updated_at,
    };
  });
  return { companyId, companyName: current.name, permissions: permissions(current.roles), teams: summaries, availableMembers };
}

export async function getTeamDetails(teamId: string): Promise<TeamDetails | null> {
  const workspace = await getTeamWorkspace();
  const summary = workspace.teams.find((team) => team.id === teamId);
  if (!summary) return null;
  const supabase = await createClient();
  const [{ data: team }, { data: links }] = await Promise.all([
    supabase.from("teams").select("id,leader_membership_id,created_at").eq("id", teamId).eq("company_id", workspace.companyId).maybeSingle(),
    supabase.from("team_memberships").select("id,company_membership_id,team_role,joined_at,company_memberships(id,job_title,users(id,name,email))").eq("team_id", teamId).eq("company_id", workspace.companyId).is("left_at", null),
  ]);
  if (!team) return null;
  const members: TeamMember[] = ((links ?? []) as { id: string; company_membership_id: string; team_role: TeamMember["role"]; joined_at: string; company_memberships: MembershipJoin }[]).flatMap((link) => {
    const membership = first(link.company_memberships);
    const user = membership ? first(membership.users) : null;
    return membership && user ? [{ id: link.id, membershipId: link.company_membership_id, name: user.name, email: user.email, jobTitle: membership.job_title ?? "Member", role: link.team_role, joinedAt: link.joined_at }] : [];
  });
  const existing = new Set(members.map((member) => member.membershipId));
  return {
    ...summary, companyId: workspace.companyId, companyName: workspace.companyName,
    leaderMembershipId: team.leader_membership_id, createdAt: team.created_at,
    permissions: workspace.permissions, members,
    availableMembers: workspace.availableMembers.filter((member) => !existing.has(member.membershipId)),
  };
}
