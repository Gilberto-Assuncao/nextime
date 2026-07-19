import type { CompanyId } from "./company"; import type { Auditable, DateRange, EntityId } from "./shared"; import type { UserId } from "./user";
export type ProjectId = EntityId<"Project">;
export enum ProjectStatus { Planning = "planning", Active = "active", Paused = "paused", Completed = "completed", Cancelled = "cancelled" }
export interface Project extends Auditable { id: ProjectId; ownerCompanyId: CompanyId; clientCompanyId?: CompanyId; name: string; description?: string; status: ProjectStatus; schedule: DateRange; managerId?: UserId; estimatedHours?: number; costCenter?: string }
