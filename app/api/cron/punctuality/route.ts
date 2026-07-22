import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/src/infrastructure/supabase/admin";

// Background-job decision (2026-07-22): Vercel Cron calls this route on a
// schedule (see vercel.json) instead of using pg_cron, keeping the check's
// logic in the app layer alongside every other feature. Protected by
// CRON_SECRET so it can't be triggered by anyone who finds the URL — Vercel
// Cron sends this automatically as a Bearer token when the env var is set.

interface CompanyRow { id: string; timezone: string; expected_start_time: string; grace_minutes: number }
interface MembershipRow { id: string; user_id: string; users: { name: string } | { name: string }[] | null }

function first<T>(value: T | T[] | null): T | null { return Array.isArray(value) ? (value[0] ?? null) : value; }

function nowInTimezone(timezone: string): { time: string; dateKey: string } {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: timezone, hour12: false, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).formatToParts(new Date());
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return { time: `${get("hour")}:${get("minute")}`, dateKey: `${get("year")}-${get("month")}-${get("day")}` };
}

// "Midnight in Brussels" is not "midnight UTC" — a naive `${dateKey}T00:00:00`
// string is interpreted in the DB connection's timezone (UTC), so any entry
// clocked in during the first couple of hours after local midnight (which is
// still the previous UTC day for timezones ahead of UTC) would be silently
// excluded from "today". Derive the actual UTC instant for local midnight via
// the offset between the timezone's wall-clock time and UTC.
function startOfDayUtcIso(timezone: string): string {
  const now = new Date();
  const zoned = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
  const utc = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }));
  const offsetMs = zoned.getTime() - utc.getTime();
  const localMidnightGuess = new Date(`${nowInTimezone(timezone).dateKey}T00:00:00Z`);
  return new Date(localMidnightGuess.getTime() - offsetMs).toISOString();
}

function minutesSinceMidnight(hhmm: string): number {
  const [hours, minutes] = hhmm.split(":").map(Number);
  return hours * 60 + minutes;
}

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: companyRows, error: companiesError } = await admin
    .from("company_settings")
    .select("company_id,companies!inner(id,timezone),expected_start_time,grace_minutes")
    .eq("punctuality_reminders_enabled", true)
    .not("expected_start_time", "is", null);
  if (companiesError) return NextResponse.json({ error: companiesError.message }, { status: 500 });

  let notified = 0;
  for (const row of (companyRows ?? []) as unknown as { company_id: string; companies: { id: string; timezone: string }; expected_start_time: string; grace_minutes: number }[]) {
    const company: CompanyRow = { id: row.company_id, timezone: row.companies.timezone, expected_start_time: row.expected_start_time, grace_minutes: row.grace_minutes };
    const { time, dateKey } = nowInTimezone(company.timezone);
    const deadline = minutesSinceMidnight(company.expected_start_time.slice(0, 5)) + company.grace_minutes;
    if (minutesSinceMidnight(time) < deadline) continue;

    const [{ data: memberRows }, { data: clockedInRows }, { data: alreadyNotified }] = await Promise.all([
      admin.from("company_memberships").select("id,user_id,users!company_memberships_user_id_fkey(name)").eq("company_id", company.id).eq("status", "active"),
      admin.from("timesheet_entries").select("timesheets!inner(user_id)").eq("company_id", company.id).gte("starts_at", startOfDayUtcIso(company.timezone)),
      admin.from("notifications").select("user_id").eq("company_id", company.id).eq("metadata->>date", dateKey).eq("metadata->>kind", "late_clock_in"),
    ]);

    const clockedInUserIds = new Set(
      (clockedInRows ?? []).flatMap((entry) => {
        const timesheet = first(entry.timesheets as { user_id: string } | { user_id: string }[] | null);
        return timesheet ? [timesheet.user_id] : [];
      }),
    );
    const alreadyNotifiedUserIds = new Set((alreadyNotified ?? []).map((n) => n.user_id));

    const toNotify = ((memberRows ?? []) as MembershipRow[]).filter(
      (member) => !clockedInUserIds.has(member.user_id) && !alreadyNotifiedUserIds.has(member.user_id),
    );
    if (!toNotify.length) continue;

    const { error: insertError } = await admin.from("notifications").insert(
      toNotify.map((member) => ({
        company_id: company.id,
        user_id: member.user_id,
        type: "ACTION_REQUIRED",
        title: "You haven't clocked in yet",
        message: `Expected start time was ${company.expected_start_time.slice(0, 5)}. Log your time when you start working.`,
        metadata: { kind: "late_clock_in", date: dateKey },
      })),
    );
    if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
    notified += toNotify.length;
  }

  return NextResponse.json({ ok: true, notified });
}
