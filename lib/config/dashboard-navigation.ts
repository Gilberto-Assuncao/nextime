import type { DashboardNavItem } from "@/lib/types/dashboard";

export const dashboardNavigation: DashboardNavItem[] = [
  { label: "Overview", href: "/dashboard", iconPath: "M3 12h7V3H3v9Zm11 9h7v-9h-7v9ZM3 21h7v-5H3v5Zm11-13h7V3h-7v5Z" },
  { label: "Time Tracking", href: "/dashboard/time", iconPath: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" },
  { label: "Timesheets", href: "/dashboard/timesheets", iconPath: "M7 3h10v3H7V3ZM5 5H4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-1M7 11h10M7 15h7" },
  { label: "Employees", href: "/dashboard/employees", iconPath: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" },
  { label: "Teams", href: "/dashboard/teams", iconPath: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm14 10v-2a4 4 0 0 0-3-3.87" },
  { label: "Projects", href: "/dashboard/projects", iconPath: "M3 7h18v13H3V7Zm0 4h18M8 7V4h8v3" },
  { label: "Reports", href: "/dashboard/reports", iconPath: "M4 19V9m6 10V5m6 14v-7m6 7H2" },
  { label: "Settings", href: "/dashboard/settings", iconPath: "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.86 2.86-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6l-.04.08h-4l-.04-.08a1.7 1.7 0 0 0-1-.6 1.7 1.7 0 0 0-1.88.34l-.06.06-2.86-2.86.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1l-.08-.04v-4L4 9.92a1.7 1.7 0 0 0 .6-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.86-2.86.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6l.04-.08h4l.04.08a1.7 1.7 0 0 0 1 .6 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.86 2.86-.06.06A1.7 1.7 0 0 0 19.4 9c.08.4.3.75.6 1l.08.04v4L20 14.08a1.7 1.7 0 0 0-.6.92Z" },
];
