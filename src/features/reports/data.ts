import "server-only";

import { createClient } from "@/src/infrastructure/supabase/server";
import { requireActiveCompany } from "@/src/application/session/server";

type RelatedOne<T> = T | T[] | null;
function first<T>(value: RelatedOne<T>): T | null { return Array.isArray(value) ? (value[0] ?? null) : value; }

export type DivergenceRow = { membershipId: string; member: string; team: string; hours: number; teamAverageHours: number; divergencePercent: number; flagged: boolean };
export type SiteHoursRow = { site: string; hours: number };

interface TeamMembershipRow {
  team_id: string; left_at: string | null;
  teams: RelatedOne<{ name: string }>;
  company_memberships: RelatedOne<{ id: string; user_id: string; users: RelatedOne<{ name: string }> }>;
}
interface EntryRow {
  starts_at: string; ends_at: string; break_minutes: number;
  timesheets: RelatedOne<{ user_id: string }>;
  sites: RelatedOne<{ name: string }>;
}

function mondayOf(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() + (day === 0 ? -6 : 1) - day);
  d.setHours(0, 0, 0, 0);
  return d;
}
function workedMinutes(row: { starts_at: string; ends_at: string; break_minutes: number }): number {
  const minutes = Math.round((new Date(row.ends_at).getTime() - new Date(row.starts_at).getTime()) / 60000);
  return Math.max(0, minutes - row.break_minutes);
}

export async function getHoursDivergenceReport(): Promise<{ teams: string[]; divergence: DivergenceRow[]; siteHours: SiteHoursRow[] }> {
  const { companyId } = await requireActiveCompany();
  const supabase = await createClient();

  const weekStart = mondayOf(new Date());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const [{ data: teamMembershipRows, error: teamError }, { data: entryRows, error: entryError }] = await Promise.all([
    supabase
      .from("team_memberships")
      .select("team_id,left_at,teams(name),company_memberships!team_memberships_company_membership_id_fkey(id,user_id,users!company_memberships_user_id_fkey(name))")
      .eq("company_id", companyId)
      .is("left_at", null),
    supabase
      .from("timesheet_entries")
      .select("starts_at,ends_at,break_minutes,timesheets!inner(user_id),sites(name)")
      .eq("company_id", companyId)
      .gte("starts_at", weekStart.toISOString())
      .lt("starts_at", weekEnd.toISOString()),
  ]);
  if (teamError) throw new Error("Unable to load team memberships.");
  if (entryError) throw new Error("Unable to load time entries.");

  const membershipRows = (teamMembershipRows ?? []) as TeamMembershipRow[];
  const entries = (entryRows ?? []) as EntryRow[];

  const minutesByUserId = new Map<string, number>();
  const hoursBySite = new Map<string, number>();
  for (const row of entries) {
    const timesheet = first(row.timesheets);
    const site = first(row.sites);
    const minutes = workedMinutes(row);
    if (site) hoursBySite.set(site.name, (hoursBySite.get(site.name) ?? 0) + minutes);
    if (!timesheet) continue;
    minutesByUserId.set(timesheet.user_id, (minutesByUserId.get(timesheet.user_id) ?? 0) + minutes);
  }

  const teamGroups = new Map<string, { membershipId: string; member: string; hours: number }[]>();
  for (const row of membershipRows) {
    const team = first(row.teams);
    const membership = first(row.company_memberships);
    const user = membership ? first(membership.users) : null;
    if (!team || !membership || !user) continue;
    const hours = Math.round(((minutesByUserId.get(membership.user_id) ?? 0) / 60) * 100) / 100;
    const list = teamGroups.get(team.name) ?? [];
    list.push({ membershipId: membership.id, member: user.name, hours });
    teamGroups.set(team.name, list);
  }

  const divergence: DivergenceRow[] = [];
  for (const [team, members] of teamGroups) {
    const teamAverageHours = Math.round((members.reduce((sum, m) => sum + m.hours, 0) / members.length) * 100) / 100;
    for (const member of members) {
      const divergencePercent = teamAverageHours > 0 ? Math.round(((member.hours - teamAverageHours) / teamAverageHours) * 1000) / 10 : 0;
      divergence.push({
        membershipId: member.membershipId, member: member.member, team, hours: member.hours, teamAverageHours,
        divergencePercent, flagged: teamAverageHours > 0 && Math.abs(divergencePercent) >= 20,
      });
    }
  }
  divergence.sort((a, b) => Math.abs(b.divergencePercent) - Math.abs(a.divergencePercent));

  const siteHours: SiteHoursRow[] = [...hoursBySite.entries()]
    .map(([site, minutes]) => ({ site, hours: Math.round((minutes / 60) * 100) / 100 }))
    .sort((a, b) => b.hours - a.hours);

  return { teams: [...teamGroups.keys()].sort(), divergence, siteHours };
}
