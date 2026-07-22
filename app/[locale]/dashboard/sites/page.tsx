import type { Metadata } from "next";
import PageHeader from "@/components/dashboard/PageHeader";
import SiteWeatherOverview from "@/components/weather/SiteWeatherOverview";
import { getSiteWeatherOverview } from "@/src/features/weather/data";

export const metadata: Metadata = { title: "Sites" };

export default async function SitesPage() {
  const sites = await getSiteWeatherOverview();
  return <section aria-labelledby="sites-heading">
    <PageHeader headingId="sites-heading" eyebrow="Weather Intelligence" title="Sites" description="7-day forecast and delay risk for each site with coordinates on file." />
    <div className="mt-8"><SiteWeatherOverview sites={sites} /></div>
  </section>;
}
