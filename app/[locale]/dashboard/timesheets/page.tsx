import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PageHeader from "@/components/dashboard/PageHeader";
import TimesheetPage from "@/components/timesheets/TimesheetPage";
import { getTimesheetWorkspace } from "@/src/features/timesheets/data";

export const metadata: Metadata = { title: "Timesheets" };

export default async function TimesheetsPage() {
  const [{ timesheet, employees, projects, weekRanges }, t] = await Promise.all([
    getTimesheetWorkspace(),
    getTranslations("timesheets"),
  ]);
  return <section aria-labelledby="timesheets-heading"><PageHeader headingId="timesheets-heading" eyebrow={t("eyebrow")} title={t("title")} description={t("description")} /><div className="mt-8"><TimesheetPage timesheet={timesheet} employees={employees} projects={projects} weekRanges={weekRanges} /></div></section>;
}
