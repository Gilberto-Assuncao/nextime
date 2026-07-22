import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/src/infrastructure/supabase/server";
import {
  ACTIVE_COMPANY_COOKIE,
  type AuthenticatedSession,
  type SessionCompany,
} from "./types";

interface MembershipRow {
  id: string;
  company_id: string;
  companies: { id: string; name: string; status: string } | { id: string; name: string; status: string }[] | null;
  membership_roles: {
    roles: { key: string } | { key: string }[] | null;
  }[] | null;
}

function first<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function initials(name: string, email: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (parts.length ? parts.slice(0, 2).map((part) => part[0]).join("") : email.slice(0, 2)).toUpperCase();
}

export const getAuthenticatedSession = cache(async (): Promise<AuthenticatedSession | null> => {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user?.email) return null;

  const [{ data: profile }, { data: memberships, error: membershipError }, cookieStore] = await Promise.all([
    supabase.from("users").select("name").eq("id", authData.user.id).maybeSingle(),
    supabase
      .from("company_memberships")
      .select("id, company_id, companies(id, name, status), membership_roles(roles(key))")
      .eq("user_id", authData.user.id)
      .eq("status", "active"),
    cookies(),
  ]);

  if (membershipError) {
    console.error("Membership query failed", {
  message: membershipError.message,
  code: membershipError.code,
  details: membershipError.details,
  hint: membershipError.hint,
});
    throw new Error("Unable to load company memberships.");
  }

  const companies: SessionCompany[] = ((memberships ?? []) as MembershipRow[]).flatMap((membership) => {
    const company = first(membership.companies);
    if (!company) return [];

    return [{
      id: company.id,
      name: company.name,
      membershipId: membership.id,
      roles: (membership.membership_roles ?? []).flatMap(({ roles }) => {
        const role = first(roles);
        return role ? [role.key] : [];
      }),
      status: company.status as SessionCompany["status"],
    }];
  });

  const requestedCompanyId = cookieStore.get(ACTIVE_COMPANY_COOKIE)?.value;
  const operationalCompanies = companies.filter(({ status }) => status !== "archived");
  const activeCompany = operationalCompanies.find(({ id }) => id === requestedCompanyId) ?? operationalCompanies[0] ?? null;
  const name = typeof profile?.name === "string"
    ? profile.name
    : String(authData.user.user_metadata.full_name ?? authData.user.email.split("@")[0]);

  return {
    user: {
      id: authData.user.id,
      email: authData.user.email,
      name,
      initials: initials(name, authData.user.email),
      provider: (authData.user.app_metadata.provider ?? "email") as AuthenticatedSession["user"]["provider"],
    },
    companies,
    activeCompany,
  };
});

export async function requireAuthenticatedSession() {
  const session = await getAuthenticatedSession();
  if (!session) redirect("/login");
  return session;
}

export async function requireActiveCompany() {
  const session = await requireAuthenticatedSession();
  if (!session.activeCompany) redirect("/dashboard/companies/new");
  return { session, companyId: session.activeCompany.id };
}
