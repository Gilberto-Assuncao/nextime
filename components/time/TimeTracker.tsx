"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import CurrentSessionCard from "@/components/time/CurrentSessionCard";
import ManualEntryForm from "@/components/time/ManualEntryForm";
import ProjectSelector from "@/components/time/ProjectSelector";
import RecentEntries from "@/components/time/RecentEntries";
import TaskSelector from "@/components/time/TaskSelector";
import TimerDisplay from "@/components/time/TimerDisplay";
import TodaySummary from "@/components/time/TodaySummary";
import TrackerControls from "@/components/time/TrackerControls";
import WeeklySummary from "@/components/time/WeeklySummary";
import type { DailySummary, Project, RunningSession, Task, TimeEntry, TimerState, WeeklySummary as WeeklySummaryType } from "@/lib/types/time";

type Props = { projects: Project[]; tasks: Task[]; entries: TimeEntry[]; todaySummary: DailySummary; weeklySummary: WeeklySummaryType };
export default function TimeTracker({ projects, tasks, entries, todaySummary, weeklySummary }: Props) {
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [projectId, setProjectId] = useState(projects[0]?.id ?? "");
  const [taskId, setTaskId] = useState(tasks[0]?.id ?? "");
  const [notes, setNotes] = useState("");
  const [startedAt, setStartedAt] = useState("");
  const [manualFeedback, setManualFeedback] = useState("");

  useEffect(() => {
    if (timerState !== "running") return;
    const intervalId = window.setInterval(() => setElapsedSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(intervalId);
  }, [timerState]);

  const selectedProject = projects.find((project) => project.id === projectId) ?? projects[0];
  const selectedTask = tasks.find((task) => task.id === taskId) ?? tasks[0];
  const session = useMemo<RunningSession | null>(() => selectedProject && selectedTask && timerState !== "idle" ? { project: selectedProject, task: selectedTask, startedAt, elapsedSeconds, notes } : null, [elapsedSeconds, notes, selectedProject, selectedTask, startedAt, timerState]);

  const start = () => { setElapsedSeconds(0); setStartedAt(new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit" }).format(new Date())); setTimerState("running"); };
  const stop = () => { setTimerState("idle"); setElapsedSeconds(0); setStartedAt(""); setNotes(""); /* TODO: Persist the completed session through the future Supabase integration. */ };
  const submitManualEntry = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setManualFeedback("Entry ready. Saving will be enabled with the backend integration."); /* TODO: Persist validated manual entries through Supabase. */ };

  return <div className="grid min-w-0 gap-4"><section aria-labelledby="timer-title" className="overflow-hidden rounded-2xl border border-white/10 bg-[#161A34] p-5 shadow-xl shadow-black/10 sm:p-8"><div className="mx-auto max-w-3xl"><div className="text-center"><p className="text-sm font-semibold text-[#22C55E]">Focus timer</p><h3 id="timer-title" className="mt-1 text-xl font-semibold text-[#E5E7EB]">What are you working on?</h3></div><div className="mt-8"><TimerDisplay seconds={elapsedSeconds} /></div><div className="mt-8 grid gap-4 sm:grid-cols-2"><ProjectSelector projects={projects} value={projectId} onChange={setProjectId} disabled={timerState !== "idle"} /><TaskSelector tasks={tasks} value={taskId} onChange={setTaskId} disabled={timerState !== "idle"} /></div><div className="mt-4"><label htmlFor="tracker-notes" className="mb-2 block text-sm font-medium text-[#D1D5DB]">Notes <span className="text-[#6B7280]">(optional)</span></label><textarea id="tracker-notes" value={notes} onChange={(event) => setNotes(event.target.value)} disabled={timerState !== "idle"} maxLength={300} rows={3} placeholder="Add context about your work" className="w-full rounded-xl border border-white/10 bg-[#111827] px-3 py-3 text-sm text-[#E5E7EB] outline-none transition placeholder:text-[#6B7280] focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 disabled:cursor-not-allowed disabled:opacity-60" /><p className="mt-1 text-right text-xs text-[#6B7280]">{notes.length}/300</p></div><div className="mt-6"><TrackerControls state={timerState} onStart={start} onPause={() => setTimerState("paused")} onResume={() => setTimerState("running")} onStop={stop} /></div></div></section>{session ? <CurrentSessionCard session={session} /> : null}<div className="grid gap-4 xl:grid-cols-2"><TodaySummary summary={todaySummary} /><WeeklySummary summary={weeklySummary} /></div><ManualEntryForm projects={projects} tasks={tasks} feedback={manualFeedback} onSubmit={submitManualEntry} /><RecentEntries entries={entries} /></div>;
}
