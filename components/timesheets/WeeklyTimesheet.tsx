import DailyTimesheet from "@/components/timesheets/DailyTimesheet";
import TimesheetTable from "@/components/timesheets/TimesheetTable";
import type { TimesheetEntry } from "@/lib/types/timesheet";

export default function WeeklyTimesheet({ entries, onEdit }: { entries: TimesheetEntry[]; onEdit: (entry: TimesheetEntry) => void }) { return <section aria-labelledby="weekly-timesheet-title"><div className="mb-4"><h3 id="weekly-timesheet-title" className="text-lg font-semibold text-[#E5E7EB]">Weekly Timesheet</h3><p className="mt-1 text-xs text-[#9CA3AF]">{entries.length} {entries.length === 1 ? "entry" : "entries"} in this view</p></div><TimesheetTable entries={entries} onEdit={onEdit} /><DailyTimesheet entries={entries} onEdit={onEdit} /></section>; }
