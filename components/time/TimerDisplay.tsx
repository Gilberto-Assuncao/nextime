export function formatTimer(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

export default function TimerDisplay({ seconds }: { seconds: number }) {
  const value = formatTimer(seconds);
  return (
    <div className="text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9CA3AF]">Elapsed time</p>
      <output aria-live="off" aria-label={`Elapsed time ${value}`} className="mt-3 block font-mono text-4xl font-bold tabular-nums tracking-tight text-[#E5E7EB] min-[360px]:text-5xl sm:text-6xl">
        {value}
      </output>
    </div>
  );
}
