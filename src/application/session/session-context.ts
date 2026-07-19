import type { Company, CompanyMembership, Permission, User } from "@/src/domain";
export interface SessionContext { currentUser: User; currentCompany: Company; currentMembership: CompanyMembership; currentPermissions: Permission[] }
export interface SessionContextProvider { getCurrent(): Promise<SessionContext | null>; switchCompany(companyId: string): Promise<SessionContext> }
