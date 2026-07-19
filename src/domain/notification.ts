import type { CompanyId } from "./company"; import type { EntityId, Timestamp } from "./shared"; import type { UserId } from "./user";
export type NotificationId = EntityId<"Notification">;
export enum NotificationType { Info = "INFO", Warning = "WARNING", ActionRequired = "ACTION_REQUIRED", Success = "SUCCESS" }
export interface Notification { id: NotificationId; userId: UserId; companyId?: CompanyId; type: NotificationType; title: string; message: string; actionUrl?: string; readAt?: Timestamp; createdAt: Timestamp }
export interface NotificationPreference { userId: UserId; type: NotificationType; inApp: boolean; email: boolean; push: boolean }
