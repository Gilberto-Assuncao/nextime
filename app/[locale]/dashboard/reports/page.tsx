import type { Metadata } from "next";
import PageHeader from "@/components/dashboard/PageHeader";
import HoursDivergenceReport from "@/components/reports/HoursDivergenceReport";
import { getHoursDivergenceReport } from "@/src/features/reports/data";

export const metadata: Metadata = { title: "Reports" };

export default async function ReportsPage() {
  const { teams, divergence, siteHours } = await getHoursDivergenceReport();
  return <section aria-labelledby="reports-heading">
    <PageHeader headingId="reports-heading" eyebrow="Insights" title="Reports" description="Team and site hours divergence for the current week." />
    <div className="mt-8"><HoursDivergenceReport teams={teams} divergence={divergence} siteHours={siteHours} /></div>
  </section>;
}
