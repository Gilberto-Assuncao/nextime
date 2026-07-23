import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PageHeader from "@/components/dashboard/PageHeader";
import RosterTable from "@/components/roster/RosterTable";
import { getCompanyRoster } from "@/src/features/roster/data";

export const metadata: Metadata = { title: "Roster" };

export default async function RosterPage() {
  const [{ members, roleKeys }, t] = await Promise.all([getCompanyRoster(), getTranslations("roster")]);
  return (
    <section aria-labelledby="roster-heading">
      <PageHeader headingId="roster-heading" eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />
      <div className="mt-8">
        <RosterTable members={members} roleKeys={roleKeys} />
      </div>
    </section>
  );
}
