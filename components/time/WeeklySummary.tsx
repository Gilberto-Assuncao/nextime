import type { WeeklySummary as WeeklySummaryType } from "@/lib/types/time";

export default function WeeklySummary({ summary }: { summary: WeeklySummaryType }) {
  const progress = Math.min((summary.workedMinutes / summary.targetMinutes) * 100, 100);
  return <section aria-labelledby="week-title" className="rounded-2xl border border-white/10 bg-[#161A34] p-5 sm:p-6"><div className="flex items-start justify-between gap-4"><div><h3 id="week-title" className="text-lg font-semibold text-[#E5E7EB]">This Week</h3><p className="mt-1 text-sm text-[#9CA3AF]">Weekly goal progress</p></div><p className="text-right text-sm text-[#9CA3AF]"><strong className="block text-2xl text-[#E5E7EB]">{summary.workedMinutes / 60}h</strong>of {summary.targetMinutes / 60}h</p></div><div className="mt-6 h-2.5 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-label="Weekly hours goal" aria-valuemin={0} aria-valuemax={summary.targetMinutes} aria-valuenow={summary.workedMinutes}><div className="h-full rounded-full bg-gradient-to-r from-[#16A34A] to-[#22C55E]" style={{ width: `${progress}%` }} /></div><p className="mt-3 text-xs text-[#9CA3AF]">{Math.round(progress)}% complete</p></section>;
}
