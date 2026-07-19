import type { Auditable, EntityId } from "./shared";
export type UserId = EntityId<"User">;
export enum UserStatus { Pending = "pending", Active = "active", Suspended = "suspended", Archived = "archived" }
export interface User extends Auditable { id: UserId; name: string; email: string; avatar?: string; language: string; timezone: string; country: string; status: UserStatus }
