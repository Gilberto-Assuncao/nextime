import type { DailySummary, Project, Task, TimeEntry, WeeklySummary } from "@/lib/types/time";

export const projects: Project[] = [
  { id: "construction-site-a", name: "Construction Site A" },
  { id: "residential-building", name: "Residential Building" },
  { id: "office-renovation", name: "Office Renovation" },
  { id: "warehouse-expansion", name: "Warehouse Expansion" },
];

export const tasks: Task[] = [
  { id: "electrical-installation", name: "Electrical Installation" },
  { id: "cable-routing", name: "Cable Routing" },
  { id: "inspection", name: "Inspection" },
  { id: "maintenance", name: "Maintenance" },
  { id: "testing", name: "Testing" },
];

export const recentEntries: TimeEntry[] = [
  { id: "entry-1", project: projects[0], task: tasks[0], durationMinutes: 165, date: "Jul 19, 2026", status: "Approved" },
  { id: "entry-2", project: projects[1], task: tasks[2], durationMinutes: 120, date: "Jul 19, 2026", status: "Pending" },
  { id: "entry-3", project: projects[2], task: tasks[1], durationMinutes: 240, date: "Jul 18, 2026", status: "Approved" },
];

export const todaySummary: DailySummary = { workedMinutes: 405, breakMinutes: 45, sessions: 4 };
export const weeklySummary: WeeklySummary = { workedMinutes: 2040, targetMinutes: 2400 };
