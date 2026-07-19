import type { CompanyId } from "./company"; import type { EntityId, Timestamp } from "./shared"; import type { UserId } from "./user";
export type AuditLogId = EntityId<"AuditLog">;
export interface AuditLog { id: AuditLogId; actorId?: UserId; companyId?: CompanyId; action: string; entityType: string; entityId?: string; occurredAt: Timestamp; metadata: Record<string, unknown>; ipAddress?: string }
