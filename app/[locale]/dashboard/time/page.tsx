import type { Metadata } from "next";
import PageHeader from "@/components/dashboard/PageHeader";
import TimeTracker from "@/components/time/TimeTracker";
import { getTimeTrackingOverview } from "@/src/features/time-tracking/data";
import { getLocationConsent } from "@/src/features/account/data";

export const metadata: Metadata = { title: "Time Tracking" };

export default async function TimeTrackingPage() {
  const [{ projects, tasks, recentEntries, todaySummary, weeklySummary }, locationConsent] = await Promise.all([
    getTimeTrackingOverview(),
    getLocationConsent(),
  ]);
  return (
    <section aria-labelledby="time-tracking-heading">
      <PageHeader
        headingId="time-tracking-heading"
        eyebrow="Workspace"
        title="Time Tracking"
        description="Track your work hours accurately."
      />
      <div className="mt-8">
        <TimeTracker
          projects={projects}
          tasks={tasks}
          entries={recentEntries}
          todaySummary={todaySummary}
          weeklySummary={weeklySummary}
          locationConsent={locationConsent}
        />
      </div>
    </section>
  );
}
