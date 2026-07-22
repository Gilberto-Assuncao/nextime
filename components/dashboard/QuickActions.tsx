import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { quickActions } from "@/lib/mock/dashboard";

const labelKeyByHref: Record<string, string> = {
  "/dashboard/time": "addTimeEntry",
  "/dashboard/employees/new": "quickAddEmployee",
  "/dashboard/projects": "quickCreateProject",
  "/dashboard/timesheets": "quickReviewTimesheets",
};

export default async function QuickActions() {
  const t = await getTranslations("dashboard");
  return (
    <section aria-labelledby="quick-actions-title" className="rounded-2xl border border-white/10 bg-[#161A34] p-5 sm:p-6">
      <h3 id="quick-actions-title" className="text-lg font-semibold text-[#E5E7EB]">{t("quickActionsTitle")}</h3>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href} className="flex min-h-11 items-center justify-between rounded-lg border border-white/10 bg-[#111827]/70 px-4 text-sm font-medium text-[#D1D5DB] transition hover:border-[#22C55E]/40 hover:text-[#22C55E] focus-visible:outline-2 focus-visible:outline-[#22C55E]">
            <span>{t(labelKeyByHref[action.href] ?? "addTimeEntry")}</span>
            <span aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
