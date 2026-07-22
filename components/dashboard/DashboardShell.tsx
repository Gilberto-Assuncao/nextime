import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { AppShell } from "@/src/components/app-shell/AppShell";
import { defaultAppNavigation } from "@/src/components/app-shell/config";
import { requireAuthenticatedSession } from "@/src/application/session/server";
import { SessionProvider } from "@/src/application/session/session-provider";
import { getNotifications } from "@/src/features/notifications/data";

export default async function DashboardShell({ children }: { children: ReactNode }) {
  const [session, notifications] = await Promise.all([requireAuthenticatedSession(), getNotifications()]);
  const t = await getTranslations("nav");
  const navigation = defaultAppNavigation.map((item) => ({ ...item, label: t(item.id as Parameters<typeof t>[0]) }));
  return (
    <SessionProvider value={session}>
      <AppShell navigation={navigation} breadcrumbs={[{ label: t("dashboard"), href: "/dashboard" }]} companies={session.companies.filter(({ status }) => status !== "archived").map(({ id, name }) => ({ id, name }))} currentCompany={session.activeCompany?.id} user={session.user} notifications={notifications}>
        <div className="mx-auto w-full max-w-[1600px]">{children}</div>
      </AppShell>
    </SessionProvider>
  );
}
