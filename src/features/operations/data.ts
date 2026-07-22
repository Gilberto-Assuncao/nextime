import "server-only";

import { createClient } from "@/src/infrastructure/supabase/server";
import { requireActiveCompany } from "@/src/application/session/server";

type RelatedOne<T> = T | T[] | null;
function first<T>(value: RelatedOne<T>): T | null { return Array.isArray(value) ? (value[0] ?? null) : value; }

export type LiveOperationsPoint = { userId: string; name: string; siteName: string | null; latitude: number; longitude: number; startedAt: string };

interface EntryRow {
  starts_at: string;
  start_latitude: number | null;
  start_longitude: number | null;
  timesheets: RelatedOne<{ user_id: string; users: RelatedOne<{ name: string }> }>;
  sites: RelatedOne<{ name: string }>;
}

export async function getLiveOperationsOverview(): Promise<LiveOperationsPoint[]> {
  const { companyId } = await requireActiveCompany();
  const supabase = await createClient();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { data: rows, error } = await supabase
    .from("timesheet_entries")
    .select("starts_at,start_latitude,start_longitude,timesheets!inner(user_id,users!timesheets_user_id_fkey(name)),sites(name)")
    .eq("company_id", companyId)
    .gte("starts_at", todayStart.toISOString())
    .not("start_latitude", "is", null)
    .not("start_longitude", "is", null)
    .order("starts_at", { ascending: false });
  if (error) throw new Error("Unable to load live operations data.");

  const latestByUser = new Map<string, LiveOperationsPoint>();
  for (const row of (rows ?? []) as EntryRow[]) {
    const timesheet = first(row.timesheets);
    const user = timesheet ? first(timesheet.users) : null;
    const site = first(row.sites);
    if (!timesheet || !user || row.start_latitude == null || row.start_longitude == null) continue;
    if (latestByUser.has(timesheet.user_id)) continue; // rows are ordered newest-first
    latestByUser.set(timesheet.user_id, {
      userId: timesheet.user_id, name: user.name, siteName: site?.name ?? null,
      latitude: row.start_latitude, longitude: row.start_longitude, startedAt: row.starts_at,
    });
  }

  return [...latestByUser.values()];
}
