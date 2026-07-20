import type { ReactNode } from "react";
import { AppShell } from "@/src/components/app-shell/AppShell";
import { defaultAppNavigation, demoNotifications } from "@/src/components/app-shell/config";
import { requireAuthenticatedSession } from "@/src/application/session/server";
import { SessionProvider } from "@/src/application/session/session-provider";

export default async function DashboardShell({ children }: { children: ReactNode }) {
  const session = await requireAuthenticatedSession();
  return (
    <SessionProvider value={session}>
      <AppShell navigation={defaultAppNavigation} breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }]} companies={session.companies.filter(({ status }) => status !== "archived").map(({ id, name }) => ({ id, name }))} currentCompany={session.activeCompany?.id} user={session.user} notifications={demoNotifications}>
        <div className="mx-auto w-full max-w-[1600px]">{children}</div>
      </AppShell>
    </SessionProvider>
  );
}
