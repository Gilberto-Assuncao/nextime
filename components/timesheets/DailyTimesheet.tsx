import DaySummary from "@/components/timesheets/DaySummary";
import TimesheetCard from "@/components/timesheets/TimesheetCard";
import type { TimesheetEntry } from "@/lib/types/timesheet";

export default function DailyTimesheet({ entries, onEdit }: { entries: TimesheetEntry[]; onEdit: (entry: TimesheetEntry) => void }) { return <div className="grid gap-4 md:hidden">{entries.map((entry) => <div key={entry.id} className="grid gap-2"><DaySummary summary={{ date: entry.date, workedMinutes: entry.workedMinutes, breakMinutes: entry.breakMinutes, entries: 1 }} /><TimesheetCard entry={entry} onEdit={onEdit} /></div>)}</div>; }
