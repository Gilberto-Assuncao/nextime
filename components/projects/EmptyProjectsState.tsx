"use client";

import { useTranslations } from "next-intl";
export default function EmptyProjectsState({ filtered }: { filtered: boolean }) { const t = useTranslations("projects"); return <div className="rounded-2xl border border-dashed border-white/15 bg-[#161A34] p-8 text-center"><h3 className="font-semibold text-[#E5E7EB]">{filtered ? t("noMatchingProjects") : t("noProjectsYet")}</h3><p className="mt-2 text-sm text-[#9CA3AF]">{filtered ? t("adjustFilters") : t("createFirstProject")}</p></div>; }
