export type EmployeeStatus = "active" | "invited" | "inactive";
export type EmploymentType = "employee" | "contractor" | "temporary";

export type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle: string;
  team: string;
  status: EmployeeStatus;
  employmentType: EmploymentType;
  hourlyRate?: number;
  startDate: string;
  avatarInitials: string;
  totalHoursThisWeek: number;
  createdAt: string;
};
