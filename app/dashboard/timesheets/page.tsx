import type { Metadata } from "next";
import PageHeader from "@/components/dashboard/PageHeader";
import TimesheetPage from "@/components/timesheets/TimesheetPage";
import { employees, projects, timesheet, weekRanges } from "@/lib/mock/timesheets";

export const metadata: Metadata = { title: "Timesheets" };

export default function TimesheetsPage() {
  return <section aria-labelledby="timesheets-heading"><PageHeader headingId="timesheets-heading" eyebrow="Workforce" title="Timesheets" description="Review and manage worked hours." /><div className="mt-8"><TimesheetPage timesheet={timesheet} employees={employees} projects={projects} weekRanges={weekRanges} /></div></section>;
}
