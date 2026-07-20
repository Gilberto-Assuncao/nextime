import type { CompanyId } from "./company";
import type { CompanyMembershipId } from "./company-membership";
import type { Auditable, EntityId, Timestamp } from "./shared";
import type { UserId } from "./user";

export type ProfileId = UserId;
export type EmployeeRecordId = EntityId<"EmployeeRecord">;
export type TeamId = EntityId<"Team">;
export type TeamMembershipId = EntityId<"TeamMembership">;

export type CompanyRole = "owner" | "admin" | "manager" | "supervisor" | "employee" | "contractor" | "viewer";
export type WorkforceMembershipStatus = "invited" | "active" | "suspended" | "inactive" | "left" | "rejected";
export type EmploymentType = "employee" | "worker" | "contractor" | "freelancer" | "temporary" | "intern" | "apprentice" | "company_owner";
export type EmploymentStatus = "active" | "inactive" | "leave" | "suspended" | "terminated" | "pending";
export type TeamStatus = "active" | "inactive" | "archived";
export type TeamRole = "leader" | "supervisor" | "member";
export type CostVisibility = "restricted" | "finance" | "management";

export interface Profile extends Auditable { id: ProfileId; firstName: string; lastName: string; displayName: string; avatarUrl?: string; phone?: string; preferredLanguage: string; timezone: string; countryCode?: string }
export interface WorkforceCompany { id: CompanyId; legalName: string; displayName: string; slug: string; countryCode?: string; timezone: string; defaultLanguage: string; status: "active" | "inactive" | "suspended" | "archived"; createdAt: Timestamp; updatedAt: Timestamp }
export interface WorkforceMembership extends Auditable { id: CompanyMembershipId; companyId: CompanyId; profileId: ProfileId; roles: CompanyRole[]; status: WorkforceMembershipStatus; joinedAt?: Timestamp; leftAt?: Timestamp; invitedAt?: Timestamp; invitedBy?: ProfileId }
export interface EmployeeRecord extends Auditable { id: EmployeeRecordId; companyMembershipId: CompanyMembershipId; employeeCode?: string; jobTitle: string; employmentType: EmploymentType; employmentStatus: EmploymentStatus; startDate?: string; endDate?: string; weeklyHours?: number; managerMembershipId?: CompanyMembershipId; costVisibility: CostVisibility }
export interface Team extends Auditable { id: TeamId; companyId: CompanyId; name: string; description?: string; status: TeamStatus; leaderMembershipId?: CompanyMembershipId }
export interface TeamMembership extends Auditable { id: TeamMembershipId; teamId: TeamId; companyMembershipId: CompanyMembershipId; role: TeamRole; joinedAt: Timestamp; leftAt?: Timestamp }
