import type { EntityId } from "./shared";
export type PermissionId = EntityId<"Permission">;
export enum PermissionEffect { Allow = "allow", Deny = "deny" }
export interface Permission { id: PermissionId; resource: string; action: string; scope?: string; effect: PermissionEffect }
