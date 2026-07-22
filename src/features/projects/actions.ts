"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireActiveCompany } from "@/src/application/session/server";
import { createClient } from "@/src/infrastructure/supabase/server";

export type CreateProjectState = { status: "idle" | "error"; message: string };

const managerRoles = ["owner", "admin", "administrator", "manager"];
const validStatuses = ["planning", "active", "paused", "completed", "cancelled"];
const validPriorities = ["low", "medium", "high", "critical"];

export async function createProjectAction(_: CreateProjectState, formData: FormData): Promise<CreateProjectState> {
  const { session, companyId } = await requireActiveCompany();
  const isManager = session.activeCompany!.roles.some((role) => managerRoles.includes(role));
  if (!isManager) return { status: "error", message: "You do not have permission to create projects." };

  const name = String(formData.get("name") ?? "").trim();
  const clientId = String(formData.get("clientId") ?? "").trim();
  const status = String(formData.get("status") ?? "planning");
  const priority = String(formData.get("priority") ?? "medium");
  const description = String(formData.get("description") ?? "").trim();
  const estimatedHours = String(formData.get("estimated-hours") ?? "");
  const budget = String(formData.get("budget") ?? "");
  const startDate = String(formData.get("start-date") ?? "");
  const endDate = String(formData.get("end-date") ?? "");

  if (name.length < 2 || !clientId || !description || !startDate || !endDate) {
    return { status: "error", message: "Fill in all required fields." };
  }
  if (!validStatuses.includes(status) || !validPriorities.includes(priority)) {
    return { status: "error", message: "Invalid status or priority." };
  }
  if (new Date(endDate) < new Date(startDate)) {
    return { status: "error", message: "End date must be after the start date." };
  }

  // Not re-validated via a `companies` select: a client legitimately isn't
  // always readable by the creating company under RLS (companies_read_member
  // requires membership — see the Projects/Clients gap documented in
  // DATABASE_ARCHITECTURE.md), the same reason getProjects() synthesizes a
  // placeholder client instead of dropping the project. The projects.client_
  // company_id foreign key still rejects a genuinely invalid id.
  if (!/^[0-9a-f-]{36}$/i.test(clientId)) return { status: "error", message: "Select a valid client." };

  const supabase = await createClient();
  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      company_id: companyId, client_company_id: clientId, name, description, status, priority,
      starts_at: startDate, ends_at: endDate,
      estimated_hours: estimatedHours ? Number(estimatedHours) : null,
      budget_amount: budget ? Number(budget) : null,
    })
    .select("id")
    .single();
  if (error || !project) return { status: "error", message: error?.message ?? "Unable to create the project." };

  revalidatePath("/dashboard/projects");
  redirect(`/dashboard/projects/${project.id}`);
}
