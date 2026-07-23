import "server-only";

import { createClient } from "@/src/infrastructure/supabase/server";
import { requireActiveCompany } from "@/src/application/session/server";
import type { RosterMember, RosterRoleKey } from "@/lib/types/roster";

const ROSTER_ROLE_KEYS: RosterRoleKey[] = ["manager", "accountant", "hr", "finance"];

type RelatedOne<T> = T | T[] | null;
function first<T>(value: RelatedOne<T>): T | null { return Array.isArray(value) ? (value[0] ?? null) : value; }

interface UserRow { first_name: string | null; last_name: string | null; email: string }
interface RoleRow { key: string }
interface MembershipRoleRow { roles: RelatedOne<RoleRow> }
interface MembershipRow {
  id: string;
  users: RelatedOne<UserRow>;
  membership_roles: MembershipRoleRow[] | null;
}

function initials(firstName: string, lastName: string, email: string): string {
  const value = `${firstName.charAt(0)}${lastName.charAt(0)}`.trim();
  return (value || email.slice(0, 2)).toUpperCase();
}

export async function getCompanyRoster(): Promise<{ members: RosterMember[]; roleKeys: RosterRoleKey[] }> {
  const { companyId } = await requireActiveCompany();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("company_memberships")
    .select("id,users!company_memberships_user_id_fkey(first_name,last_name,email),membership_roles(roles(key))")
    .eq("company_id", companyId)
    .eq("status", "active");
  if (error) throw new Error("Unable to load the company roster.");

  const members: RosterMember[] = ((data ?? []) as MembershipRow[]).flatMap((row) => {
    const user = first(row.users);
    if (!user) return [];
    const firstName = user.first_name ?? user.email.split("@")[0];
    const lastName = user.last_name ?? "";
    const roles = (row.membership_roles ?? [])
      .map((membershipRole) => first(membershipRole.roles)?.key)
      .filter((key): key is RosterRoleKey => !!key && (ROSTER_ROLE_KEYS as string[]).includes(key));
    return [{
      membershipId: row.id,
      name: `${firstName} ${lastName}`.trim(),
      email: user.email,
      avatarInitials: initials(firstName, lastName, user.email),
      roles,
    }];
  });

  members.sort((a, b) => a.name.localeCompare(b.name));
  return { members, roleKeys: ROSTER_ROLE_KEYS };
}
