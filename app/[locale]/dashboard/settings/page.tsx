import type { Metadata } from "next";
import PageHeader from "@/components/dashboard/PageHeader";
import LocationConsentToggle from "@/components/settings/LocationConsentToggle";
import { getLocationConsent } from "@/src/features/account/data";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const locationConsent = await getLocationConsent();
  return <section aria-labelledby="settings-heading">
    <PageHeader headingId="settings-heading" eyebrow="Account" title="Settings" description="Manage your personal preferences." />
    <div className="mt-8 grid gap-5"><LocationConsentToggle initialConsent={locationConsent} /></div>
  </section>;
}
