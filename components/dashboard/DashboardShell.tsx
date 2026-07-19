import type { ReactNode } from "react";
import { AppShell } from "@/src/components/app-shell/AppShell";
import { defaultAppNavigation, demoAppUser, demoCompanies, demoNotifications } from "@/src/components/app-shell/config";

export default function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <AppShell navigation={defaultAppNavigation} breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }]} companies={demoCompanies} currentCompany="demo-belnex" user={demoAppUser} notifications={demoNotifications}>
      <div className="mx-auto w-full max-w-[1600px]">{children}</div>
    </AppShell>
  );
}
