"use client";

import { useTranslations } from "next-intl";
import type { ProjectStatus } from "@/lib/types/project";
const styles: Record<ProjectStatus, string> = { planning: "bg-blue-400/10 text-blue-300", active: "bg-[#22C55E]/10 text-[#4ADE80]", paused: "bg-amber-400/10 text-amber-300", completed: "bg-violet-400/10 text-violet-300", cancelled: "bg-red-400/10 text-red-300" };
const labelKeys: Record<ProjectStatus, string> = { planning: "statusPlanning", active: "statusActive", paused: "statusPaused", completed: "statusCompleted", cancelled: "statusCancelled" };
export default function ProjectStatusBadge({ status }: { status: ProjectStatus }) { const t = useTranslations("projects"); return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${styles[status]}`}><span aria-hidden="true">●</span>{t(labelKeys[status])}</span>; }
