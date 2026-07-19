import type { DailySummary } from "@/lib/types/time";

function formatMinutes(minutes: number) { return `${Math.floor(minutes / 60)}h ${minutes % 60}m`; }
export default function TodaySummary({ summary }: { summary: DailySummary }) {
  return <section aria-labelledby="today-title" className="rounded-2xl border border-white/10 bg-[#161A34] p-5 sm:p-6"><h3 id="today-title" className="text-lg font-semibold text-[#E5E7EB]">Today</h3><dl className="mt-5 grid grid-cols-3 gap-3"><div><dt className="text-xs text-[#9CA3AF]">Worked</dt><dd className="mt-2 text-lg font-bold text-[#E5E7EB] sm:text-xl">{formatMinutes(summary.workedMinutes)}</dd></div><div><dt className="text-xs text-[#9CA3AF]">Break</dt><dd className="mt-2 text-lg font-bold text-[#E5E7EB] sm:text-xl">{formatMinutes(summary.breakMinutes)}</dd></div><div><dt className="text-xs text-[#9CA3AF]">Sessions</dt><dd className="mt-2 text-lg font-bold text-[#E5E7EB] sm:text-xl">{summary.sessions}</dd></div></dl></section>;
}
