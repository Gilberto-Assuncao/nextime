"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ACTIVE_COMPANY_COOKIE } from "@/src/application/session/types";
import { requireAuthenticatedSession } from "@/src/application/session/server";
import { createClient } from "@/src/infrastructure/supabase/server";
import { lookupVat } from "@/src/infrastructure/vies/client";
import { validateCompanyForm, validateSettingsForm } from "./validation";
import type { CompanyActionState } from "./types";

export async function lookupVatAction(countryCode: string, vatNumber: string) {
  await requireAuthenticatedSession();
  return lookupVat(countryCode, vatNumber);
}

async function authorize(companyId: string, roles: string[]) {
  const session = await requireAuthenticatedSession();
  const company = session.companies.find(({ id }) => id === companyId);
  return company && company.roles.some((role) => roles.includes(role)) ? company : null;
}

function serverError(message = "The company could not be saved. Try again."): CompanyActionState {
  return { status: "error", message };
}

export async function createCompanyAction(_: CompanyActionState, formData: FormData): Promise<CompanyActionState> {
  await requireAuthenticatedSession();
  const validation = validateCompanyForm(formData);
  if (!validation.data) return validation.error ?? serverError();
  const data = validation.data;
  const supabase = await createClient();
  const { data: companyId, error } = await supabase.rpc("create_company", {
    legal_name_input: data.legalName, display_name_input: data.displayName, country_code_input: data.countryCode,
    default_language_input: data.defaultLanguage, timezone_input: data.timezone, currency_code_input: data.currencyCode,
    registration_number_input: data.registrationNumber || null, vat_number_input: data.vatNumber || null,
    email_input: data.email || null, phone_input: data.phone || null, city_input: data.city || null, website_input: data.website || null,
  });
  if (error || typeof companyId !== "string") return serverError(error?.message);
  (await cookies()).set(ACTIVE_COMPANY_COOKIE, companyId, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 });
  revalidatePath("/dashboard", "layout");
  redirect(`/dashboard/companies/${companyId}`);
}

export async function updateCompanyAction(companyId: string, _: CompanyActionState, formData: FormData): Promise<CompanyActionState> {
  if (!await authorize(companyId, ["owner", "admin", "administrator"])) return serverError("You do not have permission to edit this company.");
  const validation = validateCompanyForm(formData);
  if (!validation.data) return validation.error ?? serverError();
  const data = validation.data;
  const supabase = await createClient();
  const { error } = await supabase.from("companies").update({
    name: data.displayName, display_name: data.displayName, legal_name: data.legalName,
    registration_number: data.registrationNumber || null, vat_number: data.vatNumber || null, vat: data.vatNumber || null,
    country_code: data.countryCode, country: data.countryCode, default_language: data.defaultLanguage,
    timezone: data.timezone, currency: data.currencyCode, phone: data.phone || null, email: data.email || null,
    website: data.website || null, address_line_1: data.addressLine1 || null, address_line_2: data.addressLine2 || null,
    postal_code: data.postalCode || null, city: data.city || null, region: data.region || null,
  }).eq("id", companyId);
  if (error) return serverError(error.message);
  revalidatePath(`/dashboard/companies/${companyId}`);
  revalidatePath("/dashboard", "layout");
  return { status: "success", message: "Company profile updated." };
}

export async function updateCompanySettingsAction(companyId: string, _: CompanyActionState, formData: FormData): Promise<CompanyActionState> {
  const membership = await authorize(companyId, ["owner", "admin", "administrator"]);
  if (!membership) return serverError("You do not have permission to edit company settings.");
  const validation = validateSettingsForm(formData);
  if (!validation.data) return validation.error ?? serverError();
  const data = validation.data;
  if (data.status === "archived" && !membership.roles.includes("owner")) return serverError("Only an owner can archive a company.");
  const supabase = await createClient();
  const [companyResult, settingsResult] = await Promise.all([
    supabase.from("companies").update({ default_language: data.defaultLanguage, timezone: data.timezone, currency: data.currencyCode, status: data.status }).eq("id", companyId),
    supabase.from("company_settings").upsert({
      company_id: companyId, week_starts_on: Number(data.weekStartsOn), date_format: data.dateFormat, time_format: data.timeFormat,
      expected_start_time: data.expectedStartTime || null, expected_end_time: data.expectedEndTime || null,
      grace_minutes: Number(data.graceMinutes), punctuality_reminders_enabled: data.punctualityRemindersEnabled,
    }),
  ]);
  const error = companyResult.error ?? settingsResult.error;
  if (error) return serverError(error.message);
  revalidatePath(`/dashboard/companies/${companyId}`);
  revalidatePath("/dashboard", "layout");
  return { status: "success", message: "Company settings updated." };
}

export async function setCompanyArchivedAction(companyId: string, archived: boolean): Promise<{ ok: boolean; message: string }> {
  if (!await authorize(companyId, ["owner"])) return { ok: false, message: "Only a company owner can perform this action." };
  const supabase = await createClient();
  const { error } = await supabase.from("companies").update({ status: archived ? "archived" : "active" }).eq("id", companyId);
  if (error) return { ok: false, message: error.message };
  if (archived) (await cookies()).delete(ACTIVE_COMPANY_COOKIE);
  revalidatePath("/dashboard", "layout");
  revalidatePath("/dashboard/companies");
  return { ok: true, message: archived ? "Company archived. Its history has been preserved." : "Company reactivated." };
}
