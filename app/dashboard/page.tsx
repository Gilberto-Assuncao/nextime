import Link from "next/link";
import KpiGrid from "@/components/dashboard/KpiGrid";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentTimesheets from "@/components/dashboard/RecentTimesheets";
import TeamActivity from "@/components/dashboard/TeamActivity";
import WeeklyHoursChart from "@/components/dashboard/WeeklyHoursChart";
import { dashboardKpis, recentTimesheets, teamActivities, weeklyHours } from "@/lib/mock/dashboard";
import { currentUser } from "@/lib/mock/current-user";
import PageHeader from "@/components/dashboard/PageHeader";

export default function DashboardPage() {
  return (
    <section aria-labelledby="dashboard-heading">
      <PageHeader headingId="dashboard-heading" eyebrow="Overview" title={`Welcome back, ${currentUser.firstName}`} description="Here’s what is happening with your teams, projects, and worked hours today." actions={<><Link href="/dashboard/time" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#22C55E] px-4 text-sm font-semibold text-[#07110B] transition hover:bg-[#16A34A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22C55E]">Add time entry</Link><Link href="/dashboard/employees/new" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/15 px-4 text-sm font-semibold text-[#E5E7EB] transition hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-[#22C55E]">Invite employee</Link></>} />
      <div className="mt-8"><KpiGrid kpis={dashboardKpis} /></div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]"><WeeklyHoursChart data={weeklyHours} /><TeamActivity activities={teamActivities} /></div>
      <div className="mt-4 grid items-start gap-4 xl:grid-cols-[1.6fr_1fr]"><RecentTimesheets timesheets={recentTimesheets} /><QuickActions /></div>
    </section>
  );
}
