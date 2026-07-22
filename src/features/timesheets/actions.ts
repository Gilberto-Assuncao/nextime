"use server";

import { revalidatePath } from "next/cache";
import { requireActiveCompany } from "@/src/application/session/server";
import { createClient } from "@/src/infrastructure/supabase/server";

export type TimesheetActionResult = { ok: boolean; message: string };

const managerRoles = ["owner", "admin", "administrator", "manager", "supervisor"];

async function context() {
  const result = await requireActiveCompany();
  return { ...result, isManager: result.session.activeCompany!.roles.some((role) => managerRoles.includes(role)) };
}

function mondayOf(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() + (day === 0 ? -6 : 1) - day);
  d.setHours(0, 0, 0, 0);
  return d;
}
function toDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function submitTimesheetAction(): Promise<TimesheetActionResult> {
  const { session, companyId } = await context();
  const supabase = await createClient();
  const start = mondayOf(new Date());
  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  const { data: sheet } = await supabase
    .from("timesheets")
    .select("id,status")
    .eq("company_id", companyId)
    .eq("user_id", session.user.id)
    .eq("period_start", toDateKey(start))
    .eq("period_end", toDateKey(end))
    .maybeSingle();
  if (!sheet) return { ok: false, message: "There is nothing to submit for this week yet." };
  if (sheet.status !== "draft") return { ok: false, message: "This timesheet was already submitted." };

  const { error } = await supabase.from("timesheets").update({ status: "submitted", submitted_at: new Date().toISOString() }).eq("id", sheet.id);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/dashboard/timesheets");
  return { ok: true, message: "Your timesheet was submitted for approval." };
}

async function reviewTimesheet(timesheetId: string, decision: "approved" | "rejected"): Promise<TimesheetActionResult> {
  const { session, companyId, isManager } = await context();
  if (!isManager) return { ok: false, message: "You do not have permission to review timesheets." };

  const supabase = await createClient();
  const { data: sheet } = await supabase.from("timesheets").select("id,status").eq("id", timesheetId).eq("company_id", companyId).maybeSingle();
  if (!sheet) return { ok: false, message: "Timesheet unavailable." };
  if (sheet.status !== "submitted") return { ok: false, message: "Only submitted timesheets can be reviewed." };

  const now = new Date().toISOString();
  const [{ error: sheetError }, { error: entriesError }] = await Promise.all([
    supabase.from("timesheets").update({ status: decision, reviewed_by: session.user.id, reviewed_at: now }).eq("id", timesheetId),
    supabase.from("timesheet_entries").update({ status: decision }).eq("timesheet_id", timesheetId),
  ]);
  if (sheetError || entriesError) return { ok: false, message: sheetError?.message ?? entriesError?.message ?? "Unable to save the review." };

  revalidatePath("/dashboard/timesheets");
  return { ok: true, message: decision === "approved" ? "Timesheet approved." : "Timesheet rejected." };
}

export async function approveTimesheetAction(timesheetId: string) {
  return reviewTimesheet(timesheetId, "approved");
}
export async function rejectTimesheetAction(timesheetId: string) {
  return reviewTimesheet(timesheetId, "rejected");
}
