import type { CompanyId } from "./company";
export interface CompanySettings { companyId: CompanyId; localization: { defaultLanguage: string; timezone: string; currency: string }; timesheets: { approvalRequired: boolean; weekStartsOn: 0 | 1 | 6 }; notificationsEnabled: boolean; accountingProvider?: string }
