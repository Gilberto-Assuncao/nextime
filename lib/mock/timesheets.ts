import type { Timesheet, WeekRange } from "@/lib/types/timesheet";

export const employees = ["Gilberto Assunção", "Maya Laurent", "Lucas Martin", "Sofia Dubois"];
export const projects = ["Construction Site A", "Residential Building", "Office Renovation", "Warehouse Expansion"];
export const weekRanges: WeekRange[] = [
  { id: "2026-07-13", label: "Jul 13 – Jul 19, 2026", startDate: "2026-07-13", endDate: "2026-07-19" },
  { id: "2026-07-06", label: "Jul 6 – Jul 12, 2026", startDate: "2026-07-06", endDate: "2026-07-12" },
  { id: "2026-06-29", label: "Jun 29 – Jul 5, 2026", startDate: "2026-06-29", endDate: "2026-07-05" },
];

export const timesheet: Timesheet = {
  id: "ts-2026-07-13",
  employee: "Gilberto Assunção",
  week: weekRanges[0],
  status: "submitted",
  entries: [
    { id: "te-1", employee: "Gilberto Assunção", date: "Mon, Jul 13", project: projects[0], task: "Electrical Installation", startTime: "08:00", endTime: "16:30", breakMinutes: 30, workedMinutes: 480, notes: "Main distribution board wiring", category: "regular", status: "approved" },
    { id: "te-2", employee: "Maya Laurent", date: "Tue, Jul 14", project: projects[1], task: "Inspection", startTime: "07:30", endTime: "16:00", breakMinutes: 45, workedMinutes: 465, notes: "Floor three safety inspection", category: "regular", status: "submitted" },
    { id: "te-3", employee: "Lucas Martin", date: "Wed, Jul 15", project: projects[2], task: "Cable Routing", startTime: "08:15", endTime: "17:15", breakMinutes: 45, workedMinutes: 495, notes: "Meeting room cable routes", category: "overtime", status: "draft" },
    { id: "te-4", employee: "Sofia Dubois", date: "Thu, Jul 16", project: projects[3], task: "Testing", startTime: "08:00", endTime: "16:15", breakMinutes: 30, workedMinutes: 465, notes: "Emergency lighting tests", category: "regular", status: "rejected" },
    { id: "te-5", employee: "Gilberto Assunção", date: "Fri, Jul 17", project: projects[0], task: "Maintenance", startTime: "07:45", endTime: "16:30", breakMinutes: 45, workedMinutes: 480, notes: "Preventive maintenance", category: "regular", status: "submitted" },
  ],
};
