import type { CompanyId } from "./company"; import type { PermissionId } from "./permission"; import type { RoleId } from "./role"; import type { DateRange, EntityId } from "./shared"; import type { UserId } from "./user";
export type CompanyMembershipId = EntityId<"CompanyMembership">;
export enum MembershipStatus { Invited = "invited", Active = "active", Suspended = "suspended", Ended = "ended" }
export interface CompanyMembership { id: CompanyMembershipId; userId: UserId; companyId: CompanyId; jobTitle: string; functionName: string; period: DateRange; status: MembershipStatus; roleIds: RoleId[]; permissionOverrides: PermissionId[] }
