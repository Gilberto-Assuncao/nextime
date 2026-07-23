"use server";

import { revalidatePath } from "next/cache";
import { requireActiveCompany } from "@/src/application/session/server";
import { createClient } from "@/src/infrastructure/supabase/server";
import { searchCompanyDirectory, type CompanyDirectoryEntry, type RelationshipType } from "@/src/features/partners/data";

export type PartnerActionResult = { ok: boolean; message: string };

export async function searchCompanyDirectoryAction(query: string): Promise<CompanyDirectoryEntry[]> {
  return searchCompanyDirectory(query);
}

const adminRoles = ["owner", "admin", "administrator"];

export async function requestPartnershipAction(targetCompanyId: string, relationshipType: RelationshipType): Promise<PartnerActionResult> {
  const { session, companyId } = await requireActiveCompany();
  const isAdmin = session.activeCompany!.roles.some((role) => adminRoles.includes(role));
  if (!isAdmin) return { ok: false, message: "Only owners and administrators can request a partnership." };
  if (targetCompanyId === companyId) return { ok: false, message: "A company cannot partner with itself." };

  const supabase = await createClient();
  const { error } = await supabase.from("company_relationships").insert({
    source_company_id: companyId,
    target_company_id: targetCompanyId,
    relationship_type: relationshipType,
    status: "pending",
  });
  if (error) {
    if (error.code === "23505") return { ok: false, message: "A relationship with this company already exists." };
    return { ok: false, message: "Unable to send the partnership request." };
  }

  revalidatePath("/dashboard/companies");
  return { ok: true, message: "Partnership request sent." };
}

async function respond(relationshipId: string, status: "active" | "rejected"): Promise<PartnerActionResult> {
  const { session, companyId } = await requireActiveCompany();
  const isAdmin = session.activeCompany!.roles.some((role) => adminRoles.includes(role));
  if (!isAdmin) return { ok: false, message: "Only owners and administrators can respond to partnership requests." };

  const supabase = await createClient();
  const { data: relationship } = await supabase.from("company_relationships").select("id,target_company_id,status").eq("id", relationshipId).maybeSingle();
  if (!relationship) return { ok: false, message: "Request not found." };
  if (relationship.target_company_id !== companyId) return { ok: false, message: "Only the invited company can respond to this request." };
  if (relationship.status !== "pending") return { ok: false, message: "This request was already answered." };

  const { error } = await supabase.from("company_relationships").update({ status }).eq("id", relationshipId);
  if (error) return { ok: false, message: "Unable to update the request." };

  revalidatePath("/dashboard/companies");
  return { ok: true, message: status === "active" ? "Partnership accepted." : "Partnership rejected." };
}

export async function acceptPartnershipAction(relationshipId: string) {
  return respond(relationshipId, "active");
}
export async function rejectPartnershipAction(relationshipId: string) {
  return respond(relationshipId, "rejected");
}
