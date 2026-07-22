"use client";

import { useTranslations } from "next-intl";
import type { WeekSummary as WeekSummaryType } from "@/lib/types/timesheet";

function hours(minutes: number) { return `${Math.floor(minutes / 60)}h ${minutes % 60 ? `${minutes % 60}m` : ""}`.trim(); }
export default function WeekSummary({ summary }: { summary: WeekSummaryType }) {
  const t = useTranslations("timesheets");
  const cards = [{ label: t("hoursWorked"), value: hours(summary.workedMinutes), tone: "text-[#4ADE80]" }, { label: t("breakTime"), value: hours(summary.breakMinutes), tone: "text-[#E5E7EB]" }, { label: t("overtime"), value: hours(summary.overtimeMinutes), tone: "text-amber-300" }, { label: t("remainingHours"), value: hours(summary.remainingMinutes), tone: "text-[#E5E7EB]" }];
  return <section aria-label={t("weekSummaryAriaLabel")} className="grid grid-cols-2 gap-3 xl:grid-cols-4">{cards.map((card) => <div key={card.label} className="rounded-2xl border border-white/10 bg-[#161A34] p-4 sm:p-5"><p className="text-xs text-[#9CA3AF]">{card.label}</p><p className={`mt-2 text-xl font-bold sm:text-2xl ${card.tone}`}>{card.value}</p></div>)}</section>;
}
