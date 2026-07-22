export type ApprovalStatus = "draft" | "submitted" | "approved" | "rejected";
export type EntryCategory = "regular" | "overtime" | "break";
export type WeekRange = { id: string; label: string; startDate: string; endDate: string };
export type TimesheetEntry = { id: string; timesheetId: string; employee: string; date: string; project: string; task: string; startTime: string; endTime: string; breakMinutes: number; workedMinutes: number; notes: string; category: EntryCategory; status: ApprovalStatus };
export type Timesheet = { id: string; employee: string; week: WeekRange; status: ApprovalStatus; entries: TimesheetEntry[] };
export type WeekSummary = { workedMinutes: number; breakMinutes: number; overtimeMinutes: number; remainingMinutes: number };
export type DaySummary = { date: string; workedMinutes: number; breakMinutes: number; entries: number };
