export type KpiState = "positive" | "neutral" | "attention";
export type KpiIcon = "clock" | "users" | "approval" | "projects";
export type TimesheetStatus = "Approved" | "Pending" | "Rejected";
export type ActivityType = "shift_started" | "timesheet_submitted" | "project_updated" | "timesheet_approved";

export type Kpi = {
  id: string;
  label: string;
  value: string;
  comparison: string;
  state: KpiState;
  icon: KpiIcon;
};

export type WeeklyHours = { day: string; fullDay: string; hours: number };
export type Activity = { id: string; person: string; action: string; context: string; time: string; type: ActivityType };
export type Timesheet = { id: string; employee: string; project: string; hours: number; date: string; status: TimesheetStatus };

export const dashboardKpis: Kpi[] = [
  { id: "hours", label: "Hours This Week", value: "326h", comparison: "+8.4% from last week", state: "positive", icon: "clock" },
  { id: "employees", label: "Active Employees", value: "24", comparison: "+2 this month", state: "positive", icon: "users" },
  { id: "approvals", label: "Pending Approvals", value: "7", comparison: "Needs your attention", state: "attention", icon: "approval" },
  { id: "projects", label: "Active Projects", value: "12", comparison: "Same as last month", state: "neutral", icon: "projects" },
];

export const weeklyHours: WeeklyHours[] = [
  { day: "Mon", fullDay: "Monday", hours: 58 }, { day: "Tue", fullDay: "Tuesday", hours: 64 },
  { day: "Wed", fullDay: "Wednesday", hours: 52 }, { day: "Thu", fullDay: "Thursday", hours: 68 },
  { day: "Fri", fullDay: "Friday", hours: 61 }, { day: "Sat", fullDay: "Saturday", hours: 18 },
  { day: "Sun", fullDay: "Sunday", hours: 5 },
];

export const teamActivities: Activity[] = [
  { id: "a1", person: "Maya Laurent", action: "started shift", context: "Brussels Office", time: "8 min ago", type: "shift_started" },
  { id: "a2", person: "Lucas Martin", action: "submitted a timesheet", context: "North Residence", time: "24 min ago", type: "timesheet_submitted" },
  { id: "a3", person: "Sofia Dubois", action: "updated project", context: "Green Tower", time: "42 min ago", type: "project_updated" },
  { id: "a4", person: "Gilberto Assunção", action: "approved a timesheet", context: "Antwerp Retail", time: "1 hr ago", type: "timesheet_approved" },
];

export const recentTimesheets: Timesheet[] = [
  { id: "t1", employee: "Maya Laurent", project: "Brussels Office", hours: 38.5, date: "Jul 18, 2026", status: "Approved" },
  { id: "t2", employee: "Lucas Martin", project: "North Residence", hours: 40, date: "Jul 18, 2026", status: "Pending" },
  { id: "t3", employee: "Sofia Dubois", project: "Green Tower", hours: 36.75, date: "Jul 17, 2026", status: "Approved" },
  { id: "t4", employee: "Noah Janssen", project: "Antwerp Retail", hours: 31, date: "Jul 17, 2026", status: "Rejected" },
];
