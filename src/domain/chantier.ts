import type { CompanyId } from "./company"; import type { ProjectId } from "./project"; import type { Address, DateRange, EntityId } from "./shared"; import type { UserId } from "./user";
export type ChantierId = EntityId<"Chantier">;
export enum ChantierStatus { Planned = "planned", Open = "open", OnHold = "on_hold", Closed = "closed", Cancelled = "cancelled" }
export interface GeoCoordinates { latitude: number; longitude: number }
export interface Chantier { id: ChantierId; projectId?: ProjectId; name: string; clientCompanyId: CompanyId; operatingCompanyId: CompanyId; address: Address; coordinates?: GeoCoordinates; purchaseOrderNumber?: string; costCenter?: string; managerId: UserId; schedule: DateRange; status: ChantierStatus }
