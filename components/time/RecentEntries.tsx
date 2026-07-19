import EmptyTimeState from "@/components/time/EmptyTimeState";
import type { EntryStatus, TimeEntry } from "@/lib/types/time";

const statusStyles: Record<EntryStatus, string> = { Approved: "bg-[#22C55E]/10 text-[#4ADE80]", Pending: "bg-amber-400/10 text-amber-300", Rejected: "bg-red-400/10 text-red-300" };
function formatDuration(minutes: number) { return `${Math.floor(minutes / 60)}h ${minutes % 60}m`; }
export default function RecentEntries({ entries }: { entries: TimeEntry[] }) {
  return <section aria-labelledby="recent-entries-title" className="rounded-2xl border border-white/10 bg-[#161A34] p-5 sm:p-6"><div><h3 id="recent-entries-title" className="text-lg font-semibold text-[#E5E7EB]">Recent Entries</h3><p className="mt-1 text-xs text-[#9CA3AF]">Your latest tracked sessions</p></div>{entries.length === 0 ? <div className="mt-5"><EmptyTimeState /></div> : <ul className="mt-5 divide-y divide-white/10">{entries.map((entry) => <li key={entry.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="truncate text-sm font-semibold text-[#E5E7EB]">{entry.project.name}</p><p className="mt-1 text-xs text-[#9CA3AF]">{entry.task.name} · {entry.date}</p></div><div className="flex items-center justify-between gap-3 sm:justify-end"><span className="text-sm font-semibold text-[#E5E7EB]">{formatDuration(entry.durationMinutes)}</span><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[entry.status]}`}>{entry.status}</span></div></li>)}</ul>}</section>;
}
