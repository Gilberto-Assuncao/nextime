import type { EntityId, Timestamp } from "./shared"; import type { UserId } from "./user";
export type CertificateId = EntityId<"Certificate">;
export interface Certificate { id: CertificateId; userId: UserId; name: string; issuer: string; issuedAt: Timestamp; expiresAt?: Timestamp; credentialId?: string; credentialUrl?: string; documentUrl?: string }
