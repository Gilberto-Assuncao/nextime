export type EntryStatus = "Approved" | "Pending" | "Rejected";
export type TimerState = "idle" | "running" | "paused";

export type Project = { id: string; name: string };
export type Task = { id: string; name: string };
export type TimeEntry = { id: string; project: Project; task: Task; durationMinutes: number; date: string; status: EntryStatus };
export type RunningSession = { project: Project; task: Task; startedAt: string; elapsedSeconds: number; notes: string };
export type DailySummary = { workedMinutes: number; breakMinutes: number; sessions: number };
export type WeeklySummary = { workedMinutes: number; targetMinutes: number };
