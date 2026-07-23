"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { toggleRosterRoleAction } from "@/src/features/roster/actions";
import type { RosterMember, RosterRoleKey } from "@/lib/types/roster";

const roleLabelKeys: Record<RosterRoleKey, string> = {
  manager: "roleManager",
  accountant: "roleAccountant",
  hr: "roleHr",
  finance: "roleFinance",
};

export default function RosterTable({ members: initialMembers, roleKeys }: { members: RosterMember[]; roleKeys: RosterRoleKey[] }) {
  const t = useTranslations("roster");
  const [members, setMembers] = useState(initialMembers);
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState("");

  function toggle(membershipId: string, roleKey: RosterRoleKey, assign: boolean) {
    setMembers((current) => current.map((member) => {
      if (member.membershipId !== membershipId) return member;
      const roles = assign ? [...member.roles, roleKey] : member.roles.filter((role) => role !== roleKey);
      return { ...member, roles };
    }));
    startTransition(async () => {
      const result = await toggleRosterRoleAction(membershipId, roleKey, assign);
      setFeedback(result.status === "error" ? result.message : t("updated"));
      if (result.status === "error") {
        setMembers((current) => current.map((member) => {
          if (member.membershipId !== membershipId) return member;
          const roles = assign ? member.roles.filter((role) => role !== roleKey) : [...member.roles, roleKey];
          return { ...member, roles };
        }));
      }
    });
  }

  if (members.length === 0) {
    return <div className="rounded-2xl border border-dashed border-white/15 bg-[#161A34] p-8 text-center text-sm text-[#9CA3AF]">{t("noMembers")}</div>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#161A34]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <thead className="border-b border-white/10 bg-[#111827]/60 text-xs uppercase tracking-wide text-[#9CA3AF]">
            <tr>
              <th scope="col" className="px-5 py-4 font-medium">{t("columnMember")}</th>
              {roleKeys.map((roleKey) => (
                <th key={roleKey} scope="col" className="px-5 py-4 text-center font-medium">{t(roleLabelKeys[roleKey])}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {members.map((member) => (
              <tr key={member.membershipId} className="hover:bg-white/[0.03]">
                <th scope="row" className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#22C55E]/10 text-xs font-bold text-[#22C55E]">{member.avatarInitials}</span>
                    <div>
                      <p className="font-semibold text-[#E5E7EB]">{member.name}</p>
                      <p className="text-xs font-normal text-[#9CA3AF]">{member.email}</p>
                    </div>
                  </div>
                </th>
                {roleKeys.map((roleKey) => (
                  <td key={roleKey} className="px-5 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={member.roles.includes(roleKey)}
                      disabled={pending}
                      onChange={(event) => toggle(member.membershipId, roleKey, event.target.checked)}
                      aria-label={`${t(roleLabelKeys[roleKey])} — ${member.name}`}
                      className="h-5 w-5 rounded border-white/20 bg-[#111827] accent-[#22C55E]"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {feedback ? <p aria-live="polite" className="border-t border-white/10 px-5 py-3 text-sm text-[#4ADE80]">{feedback}</p> : null}
    </div>
  );
}
