import type { TimerState } from "@/lib/types/time";

type Props = { state: TimerState; onStart: () => void; onPause: () => void; onResume: () => void; onStop: () => void };
const primary = "min-h-11 flex-1 rounded-xl bg-[#22C55E] px-5 text-sm font-semibold text-[#07110B] transition hover:bg-[#16A34A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22C55E]";
const secondary = "min-h-11 flex-1 rounded-xl border border-white/15 bg-white/5 px-5 text-sm font-semibold text-[#E5E7EB] transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22C55E]";

export default function TrackerControls({ state, onStart, onPause, onResume, onStop }: Props) {
  return <div className="flex flex-col gap-3 min-[380px]:flex-row">{state === "idle" ? <button type="button" onClick={onStart} className={primary}>Start</button> : null}{state === "running" ? <button type="button" onClick={onPause} className={secondary}>Pause</button> : null}{state === "paused" ? <button type="button" onClick={onResume} className={primary}>Resume</button> : null}{state !== "idle" ? <button type="button" onClick={onStop} className={secondary}>Stop</button> : null}</div>;
}
