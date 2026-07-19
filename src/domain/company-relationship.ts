import type { CompanyId } from "./company"; import type { Auditable, EntityId } from "./shared";
export type CompanyRelationshipId = EntityId<"CompanyRelationship">;
export enum CompanyRelationshipType { Client = "client", Contractor = "contractor", Subcontractor = "subcontractor", Partner = "partner" }
export enum RelationshipStatus { Pending = "pending", Active = "active", Ended = "ended" }
export interface CompanyRelationship extends Auditable { id: CompanyRelationshipId; sourceCompanyId: CompanyId; targetCompanyId: CompanyId; type: CompanyRelationshipType; status: RelationshipStatus }
