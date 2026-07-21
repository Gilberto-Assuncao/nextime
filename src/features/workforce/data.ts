import "server-only";

import { createClient } from "@/src/infrastructure/supabase/server";
import { requireActiveCompany } from "@/src/application/session/server";
import { getTeamWorkspace } from "@/src/features/teams";
import type { CompanyRole, EmploymentStatus, EmploymentType, TeamRole, WorkforceMembershipStatus } from "@/src/domain";
import type { WorkforceMemberView, WorkforceTeamView } from "./types";

type UserJoin = { id: string; name: string; email: string } | { id: string; name: string; email: string }[] | null;
type EmployeeRecordJoin = { employment_type: EmploymentType; employment_status: EmploymentStatus } | { employment_type: EmploymentType; employment_status: EmploymentStatus }[] | null;
type RoleJoin = { roles: { key: CompanyRole } | { key: CompanyRole }[] | null }[] | null;
interface TeamMembershipJoin { team_id: string; team_role: TeamRole; left_at: string | null }
interface MembershipRow {
  id: string; status: WorkforceMembershipStatus; joined_at: string | null; starts_at: string;
  users: UserJoin; employee_records: EmployeeRecordJoin; membership_roles: RoleJoin;
  team_memberships: TeamMembershipJoin[] | null;
}

function first<T>(value: T | T[] | null): T | null { return Array.isArray(value) ? (value[0] ?? null) : value; }
function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (parts.length ? parts.slice(0, 2).map((part) => part[0]).join("") : name.slice(0, 2)).toUpperCase();
}

export async function getWorkforceOverview(): Promise<{ members: WorkforceMemberView[]; teams: WorkforceTeamView[] }> {
  const [{ session, companyId }, workspace] = await Promise.all([requireActiveCompany(), getTeamWorkspace()]);
  const current = session.activeCompany!;
  const supabase = await createClient();

  const { data: memberships, error } = await supabase
    .from("company_memberships")
    .select("id,status,joined_at,starts_at,users!company_memberships_user_id_fkey(id,name,email),employee_records!employee_records_company_membership_id_fkey(employment_type,employment_status),membership_roles(roles(key)),team_memberships(team_id,team_role,left_at)")
    .eq("company_id", companyId)
    .order("joined_at", { ascending: false });
  if (error) throw new Error("Unable to load workforce members.");

  const teamNameById = new Map(workspace.teams.map((team) => [team.id, team.name]));

  const members: WorkforceMemberView[] = ((memberships ?? []) as MembershipRow[]).flatMap((row) => {
    const user = first(row.users);
    if (!user) return [];
    const employeeRecord = first(row.employee_records);
    const roleEntry = row.membership_roles?.[0] ?? null;
    const role = roleEntry ? first(roleEntry.roles) : null;
    const activeTeamLink = (row.team_memberships ?? []).find((link) => link.left_at === null) ?? null;
    return [{
      id: row.id,
      name: user.name,
      email: user.email,
      company: current.name,
      role: (role?.key ?? "employee") as CompanyRole,
      team: activeTeamLink ? (teamNameById.get(activeTeamLink.team_id) ?? "Unassigned") : "Unassigned",
      employmentType: employeeRecord?.employment_type ?? "employee",
      membershipStatus: row.status,
      employmentStatus: employeeRecord?.employment_status ?? "pending",
      joinedAt: (row.joined_at ?? row.starts_at).slice(0, 10),
      initials: initials(user.name),
    }];
  });

  const ownMembershipId = current.membershipId;
  const teams: WorkforceTeamView[] = workspace.teams.map((team) => {
    const ownLink = ((memberships ?? []) as MembershipRow[])
      .find((row) => row.id === ownMembershipId)
      ?.team_memberships?.find((link) => link.team_id === team.id && link.left_at === null) ?? null;
    return {
      id: team.id,
      name: team.name,
      description: team.description,
      leader: team.leaderName ?? "Unassigned",
      memberCount: team.memberCount,
      status: team.status,
      currentUserRole: ownLink?.team_role,
    };
  });

  return { members, teams };
}
