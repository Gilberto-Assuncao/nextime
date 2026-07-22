import type { Metadata } from "next";
import PageHeader from "@/components/dashboard/PageHeader";
import LiveOperationsMap from "@/components/operations/LiveOperationsMap";
import { getLiveOperationsOverview } from "@/src/features/operations/data";

export const metadata: Metadata = { title: "Live Map" };

export default async function LiveMapPage() {
  const points = await getLiveOperationsOverview();
  return <section aria-labelledby="live-map-heading">
    <PageHeader headingId="live-map-heading" eyebrow="Live Operations" title="Live Map" description="Where team members started their most recent clocked-in session today — only for those who opted in." />
    <div className="mt-8"><LiveOperationsMap points={points} /></div>
  </section>;
}
