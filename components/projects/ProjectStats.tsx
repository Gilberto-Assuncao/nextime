"use client";

import { useTranslations } from "next-intl";
import type { Project } from "@/lib/types/project";
export default function ProjectStats({ project }: { project: Project }) {
  const t = useTranslations("projects");
  const items = [[t("trackedHours"), `${project.statistics.trackedHours}h`], [t("billableHours"), `${project.statistics.billableHours}h`], [t("timeEntries"), project.statistics.entries], [t("members"), project.statistics.members]];
  return <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">{items.map(([label, value]) => <div key={label} className="rounded-xl border border-white/10 bg-[#161A34] p-4"><dt className="text-xs text-[#9CA3AF]">{label}</dt><dd className="mt-1 text-xl font-bold text-[#E5E7EB]">{value}</dd></div>)}</dl>;
}
