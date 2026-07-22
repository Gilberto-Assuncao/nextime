import type { Metadata } from "next";
import PageHeader from "@/components/dashboard/PageHeader";
import TimesheetPage from "@/components/timesheets/TimesheetPage";
import { getTimesheetWorkspace } from "@/src/features/timesheets/data";

export const metadata: Metadata = { title: "Timesheets" };

export default async function TimesheetsPage() {
  const { timesheet, employees, projects, weekRanges } = await getTimesheetWorkspace();
  return <section aria-labelledby="timesheets-heading"><PageHeader headingId="timesheets-heading" eyebrow="Workforce" title="Timesheets" description="Review and manage worked hours." /><div className="mt-8"><TimesheetPage timesheet={timesheet} employees={employees} projects={projects} weekRanges={weekRanges} /></div></section>;
}
