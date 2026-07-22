"use client";

import { useTranslations } from "next-intl";

export default function EmptyEmployeesState({ filtered = false }: { filtered?: boolean }) {
  const t = useTranslations("employees");
  return <div className="rounded-2xl border border-dashed border-white/15 bg-[#161A34] px-5 py-14 text-center"><div aria-hidden="true" className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#22C55E]/10 text-xl text-[#22C55E]">♙</div><h3 className="mt-4 font-semibold text-[#E5E7EB]">{filtered ? t("noneFilteredTitle") : t("noneTitle")}</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#9CA3AF]">{filtered ? t("noneFilteredDescription") : t("noneDescription")}</p></div>;
}
