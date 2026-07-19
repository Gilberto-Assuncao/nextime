import type { Company, CompanyId, CompanyMembership, UserId } from "@/src/domain";
export interface CompanyRepository { findById(id: CompanyId): Promise<Company | null>; listForUser(userId: UserId): Promise<Company[]>; getMembership(userId: UserId, companyId: CompanyId): Promise<CompanyMembership | null> }
