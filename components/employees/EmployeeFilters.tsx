"use client";

import { useTranslations } from "next-intl";
import type { EmployeeStatus } from "@/lib/types/employee";

export type StatusFilter = "all" | EmployeeStatus;
type Props = { search: string; status: StatusFilter; team: string; teams: string[]; onSearch: (value: string) => void; onStatus: (value: StatusFilter) => void; onTeam: (value: string) => void; onClear: () => void; hasFilters: boolean };

const control = "min-h-11 rounded-lg border border-white/10 bg-[#161A34] px-3 text-sm text-[#E5E7EB] outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20";
export default function EmployeeFilters(props: Props) {
  const t = useTranslations("employees");
  return <div className="grid gap-3 rounded-2xl border border-white/10 bg-[#161A34]/60 p-4 md:grid-cols-[minmax(12rem,1fr)_11rem_11rem_auto] md:items-end"><div><label htmlFor="employee-search" className="text-xs font-medium text-[#9CA3AF]">{t("searchEmployeesLabel")}</label><input id="employee-search" type="search" value={props.search} onChange={(event) => props.onSearch(event.target.value)} placeholder={t("searchPlaceholder")} className={`${control} mt-2 w-full`} /></div><div><label htmlFor="employee-status" className="text-xs font-medium text-[#9CA3AF]">{t("status")}</label><select id="employee-status" value={props.status} onChange={(event) => props.onStatus(event.target.value as StatusFilter)} className={`${control} mt-2 w-full`}><option value="all">{t("allStatuses")}</option><option value="active">{t("statusActive")}</option><option value="invited">{t("statusInvited")}</option><option value="inactive">{t("statusInactive")}</option></select></div><div><label htmlFor="employee-team" className="text-xs font-medium text-[#9CA3AF]">{t("teamLabel")}</label><select id="employee-team" value={props.team} onChange={(event) => props.onTeam(event.target.value)} className={`${control} mt-2 w-full`}><option value="all">{t("allTeams")}</option>{props.teams.map((team) => <option key={team} value={team}>{team}</option>)}</select></div><button type="button" onClick={props.onClear} disabled={!props.hasFilters} className="min-h-11 rounded-lg px-4 text-sm font-semibold text-[#9CA3AF] transition hover:bg-white/5 hover:text-[#E5E7EB] focus-visible:outline-2 focus-visible:outline-[#22C55E] disabled:cursor-not-allowed disabled:opacity-40">{t("clearFilters")}</button></div>;
}
