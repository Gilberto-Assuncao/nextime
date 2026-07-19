import Link from "next/link";
import KpiGrid from "@/components/dashboard/KpiGrid";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentTimesheets from "@/components/dashboard/RecentTimesheets";
import TeamActivity from "@/components/dashboard/TeamActivity";
import WeeklyHoursChart from "@/components/dashboard/WeeklyHoursChart";
import { dashboardKpis, recentTimesheets, teamActivities, weeklyHours } from "@/lib/mock/dashboard";

export default function DashboardPage() {
  return (
    <section aria-labelledby="dashboard-heading">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#22C55E]">Overview</p><h2 id="dashboard-heading" className="mt-2 text-2xl font-bold tracking-tight text-[#E5E7EB] sm:text-3xl">Welcome back, Gilberto</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#9CA3AF]">Here’s what is happening with your teams, projects, and worked hours today.</p></div>
        <div className="flex flex-col gap-3 sm:flex-row"><Link href="/dashboard/time" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#22C55E] px-4 text-sm font-semibold text-[#07110B] transition hover:bg-[#16A34A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22C55E]">Add time entry</Link><Link href="/dashboard/employees/new" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/15 px-4 text-sm font-semibold text-[#E5E7EB] transition hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-[#22C55E]">Invite employee</Link></div>
      </div>
      <div className="mt-8"><KpiGrid kpis={dashboardKpis} /></div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]"><WeeklyHoursChart data={weeklyHours} /><TeamActivity activities={teamActivities} /></div>
      <div className="mt-4 grid items-start gap-4 xl:grid-cols-[1.6fr_1fr]"><RecentTimesheets timesheets={recentTimesheets} /><QuickActions /></div>
    </section>
  );
}
