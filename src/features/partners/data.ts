import "server-only";

import { createClient } from "@/src/infrastructure/supabase/server";
import { requireActiveCompany } from "@/src/application/session/server";

export type RelationshipType = "client" | "contractor" | "subcontractor" | "partner";
export type RelationshipStatus = "pending" | "active" | "rejected";

export type PartnerRelationship = {
  id: string;
  direction: "outgoing" | "incoming";
  companyId: string;
  companyName: string;
  relationshipType: RelationshipType;
  status: RelationshipStatus;
  createdAt: string;
};

export type CompanyDirectoryEntry = { id: string; name: string; vatNumber: string | null };

interface RelationshipRow {
  id: string;
  source_company_id: string;
  target_company_id: string;
  relationship_type: RelationshipType;
  status: RelationshipStatus;
  created_at: string;
}

export async function getCompanyPartners(): Promise<PartnerRelationship[]> {
  const { companyId } = await requireActiveCompany();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("company_relationships")
    .select("id,source_company_id,target_company_id,relationship_type,status,created_at")
    .or(`source_company_id.eq.${companyId},target_company_id.eq.${companyId}`)
    .order("created_at", { ascending: false });
  if (error) throw new Error("Unable to load company partners.");

  const rows = (data ?? []) as RelationshipRow[];
  const otherIds = [...new Set(rows.map((row) => (row.source_company_id === companyId ? row.target_company_id : row.source_company_id)))];
  const names = new Map<string, string>();
  if (otherIds.length > 0) {
    // company_directory (not `companies`) on purpose: the other company in a
    // relationship isn't necessarily one this user is a member of, and the
    // `companies` table's own RLS would silently hide its name in that case.
    const { data: directoryRows } = await supabase.from("company_directory").select("id,name").in("id", otherIds);
    for (const row of directoryRows ?? []) names.set(row.id, row.name);
  }

  return rows.map((row) => {
    const isOutgoing = row.source_company_id === companyId;
    const otherId = isOutgoing ? row.target_company_id : row.source_company_id;
    return {
      id: row.id,
      direction: isOutgoing ? "outgoing" : "incoming",
      companyId: otherId,
      companyName: names.get(otherId) ?? "—",
      relationshipType: row.relationship_type,
      status: row.status,
      createdAt: row.created_at,
    };
  });
}

export async function searchCompanyDirectory(query: string): Promise<CompanyDirectoryEntry[]> {
  const { companyId } = await requireActiveCompany();
  if (query.trim().length < 2) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("company_directory")
    .select("id,name,vat_number")
    .ilike("name", `%${query.trim()}%`)
    .neq("id", companyId)
    .limit(8);
  if (error) return [];
  return (data ?? []).map((row) => ({ id: row.id, name: row.name, vatNumber: row.vat_number }));
}
