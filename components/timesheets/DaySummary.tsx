import type { DaySummary as DaySummaryType } from "@/lib/types/timesheet";

export default function DaySummary({ summary }: { summary: DaySummaryType }) { return <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-[#9CA3AF]"><strong className="text-sm text-[#E5E7EB]">{summary.date}</strong><span>{Math.floor(summary.workedMinutes / 60)}h {summary.workedMinutes % 60}m worked</span><span>{summary.breakMinutes}m break</span><span>{summary.entries} {summary.entries === 1 ? "entry" : "entries"}</span></div>; }
