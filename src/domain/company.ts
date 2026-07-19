import type { Address, Auditable, EntityId, SocialLinks } from "./shared";
export type CompanyId = EntityId<"Company">;
export enum CompanyStatus { Pending = "pending", Active = "active", Suspended = "suspended", Archived = "archived" }
export interface Company extends Auditable { id: CompanyId; name: string; vat?: string; social: SocialLinks; defaultLanguage: string; currency: string; timezone: string; address: Address; status: CompanyStatus }
