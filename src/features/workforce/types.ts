import type { CompanyRole, EmploymentStatus, EmploymentType, TeamRole, WorkforceMembershipStatus } from "@/src/domain";
export interface WorkforceMemberView { id: string; name: string; email: string; company: string; role: CompanyRole; team: string; employmentType: EmploymentType; membershipStatus: WorkforceMembershipStatus; employmentStatus: EmploymentStatus; joinedAt: string; initials: string }
export interface WorkforceTeamView { id: string; name: string; description: string; leader: string; memberCount: number; status: "active" | "inactive" | "archived"; currentUserRole?: TeamRole }
