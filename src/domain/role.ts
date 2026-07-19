import type { EntityId } from "./shared"; import type { PermissionId } from "./permission";
export type RoleId = EntityId<"Role">;
export interface Role { id: RoleId; key: string; name: string; description?: string; permissionIds: PermissionId[]; system: boolean }
